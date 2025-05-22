'use client';
import { api_url } from '@/utils/apiCall';
import { XCircle, ImagePlus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminCollegePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');  // <-- New state for link

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      if (img.width === 288 && img.height === 384) {
        setImage(file);
        setPreview(objectUrl);
      } else {
        toast.error('Image must be exactly 288 x 384 pixels.');
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      toast.error('Failed to load image. Try another file.');
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad?._id) return toast.error('Ad ID not found.');

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('link', link); // <-- Append link to formData

      const res = await fetch(`${api_url}update-ad-image/${ad._id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong!');

      setAd(data.ad);
      setImage(null);
      setPreview(null);
      toast.success('Ad updated successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update ad.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAd = async () => {
    try {
      const res = await fetch(`${api_url}ads`);
      const data = await res.json();
      if (res.ok && data.ads.length > 0) {
        setAd(data.ads[0]);
        setLink(data.ads[0]?.link || '');  // <-- Initialize link state on fetch
      }
    } catch (err) {
      console.error('Failed to fetch ad:', err);
    }
  };

  useEffect(() => {
    fetchAd();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-8 border p-6 rounded-xl bg-white"
      >
        {/* Image Preview Section */}
        <div className="relative w-48 h-64 border rounded-lg overflow-hidden shadow-sm">
          {preview ? (
            <>
              <img
                src={preview}
                alt="New Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-red-600" />
              </button>
            </>
          ) : ad?.image ? (
            <img
              src={`${api_url.replace(/api\/?$/, '')}${ad.image.replace(/\\/g, '/')}`}
              alt="Current Ad"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.currentTarget.src = 'https://via.placeholder.com/288x384?text=No+Image')
              }
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <ImagePlus className="w-6 h-6 mr-1" />
              No image available
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-1 space-y-4 pt-[110px]">
          <div>
            <label className="block font-medium text-gray-700">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required dimensions: <strong>288 x 384</strong> pixels.
            </p>
          </div>

          {/* New Link Input Field */}
          <div>
            <label className="block font-medium text-gray-700">Advertisement Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 block w-full text-sm text-gray-600 border rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !image}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Updating...' : 'Update Image'}
          </button>
        </div>
      </form>
    </div>
  );
}
