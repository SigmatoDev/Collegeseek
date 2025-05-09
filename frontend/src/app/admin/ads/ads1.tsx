'use client';
import { api_url } from '@/utils/apiCall';
import { XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminCollegePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [ads, setAds] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
    setEditingAdId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      return alert('Please select an image.');
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setError(null);

    try {
      const endpoint = editingAdId
        ? `${api_url}update-ad-image/${editingAdId}`
        : `${api_url}upload-ad`;

      const method = editingAdId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingAdId ? 'Image updated successfully!' : 'Image uploaded successfully!');
        setImage(null);
        setPreview(null);
        setEditingAdId(null);
        fetchAds();
      } else {
        setError(data.error || 'Operation failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClickToEdit = (adId: string, currentImage: string) => {
    setEditingAdId(adId);
    setPreview(`${api_url.replace(/api\/?$/, '')}${currentImage.replace(/\\/g, '/')}`);
    setImage(null); // reset old selected file
  };

  const fetchAds = async () => {
    try {
      const res = await fetch(`${api_url}ads`);
      const data = await res.json();

      if (res.ok) {
        setAds(data.ads);
      } else {
        setFetchError(data.error || 'Failed to fetch ads');
      }
    } catch (err) {
      setFetchError('Something went wrong while fetching ads');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          {editingAdId ? 'Update Ad Image' : 'Upload New Ad'}
        </h1>

        <div>
          <label className="block font-medium">Choose Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {preview && (
            <div className="mt-4 relative w-40 h-40">
              <img src={preview} alt="Preview" className="object-cover rounded" />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : editingAdId ? 'Update Image' : 'Upload Image'}
        </button>
      </form>

      {ads.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Uploaded Ads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="border p-4 rounded shadow flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => handleImageClickToEdit(ad._id, ad.image)}
              >
                <img
                  src={`${api_url.replace(/api\/?$/, '')}${ad.image.replace(/\\/g, '/')}`}
                  alt="Ad"
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p className="text-sm text-gray-700 text-center">
                  {ad.description || 'No description'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Click to update</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {fetchError && <div className="text-red-500 mt-4">{fetchError}</div>}
    </div>
  );
}
