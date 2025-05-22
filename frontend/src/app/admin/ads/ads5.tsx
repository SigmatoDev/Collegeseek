'use client';

import { api_url, img_url } from '@/utils/apiCall';
import { useEffect, useState } from 'react';

interface Ad {
  _id: string;
  src?: string;
  link?: string; // Added link field here
}

interface UpdateAdFormProps {
  ad: Ad;
  onUpdated: () => void;
}

function UpdateAdForm({ ad, onUpdated }: UpdateAdFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState(ad.link || ''); // Added state for link
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // You can remove the check for file if updating link only is allowed
    if (!file && !link) {
      setMessage('Please select an image or enter a link to update.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('link', link); // Append link in form data

    try {
      const url = `${api_url}/update/ads5/${ad._id}`;
      const res = await fetch(url, {
        method: 'PUT',
        body: formData,
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (res.ok) {
        setMessage('Ad updated successfully!');
        onUpdated();
        setFile(null);
      } else {
        setMessage(result.message || 'Update failed');
      }
    } catch {
      setMessage('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = ad.src
    ? `${img_url.replace(/\/$/, '')}/${ad.src.replace(/^\//, '')}`
    : '';

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg shadow-md p-5 flex flex-col h-[400px] bg-white transition-shadow hover:shadow-lg"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Ad Image"
          style={{ width: 387, height: 120, objectFit: 'contain' }}
          className="rounded-md mb-3 border border-gray-300"
        />
      ) : (
        <div className="w-48 h-28 bg-gray-100 flex items-center justify-center rounded-md mb-3 text-gray-400 select-none">
          No Image
        </div>
      )}
      <p className="text-xs text-gray-500 mb-3">
        Required dimensions: <strong>387x120</strong> pixels.
      </p>

      <label
        htmlFor={`image-${ad._id}`}
        className="block mb-1 font-semibold text-gray-700"
      >
        Select New Image
      </label>
      <input
        id={`image-${ad._id}`}
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="w-full mb-4 border border-gray-300 rounded px-2 py-1 cursor-pointer focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        disabled={loading}
      />

      <label
        htmlFor={`link-${ad._id}`}
        className="block mb-1 font-semibold text-gray-700"
      >
        Update Link
      </label>
      <input
        id={`link-${ad._id}`}
        type="url"
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="https://example.com"
        className="w-full mb-4 border border-gray-300 rounded px-2 py-1 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-auto bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Updating...
          </span>
        ) : (
          'Update Ad'
        )}
      </button>

      {message && (
        <p
          className={`mt-3 text-center text-sm font-medium ${
            message.toLowerCase().includes('error') ||
            message.toLowerCase().includes('fail')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default function AdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchAds = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${api_url}get/ads5`);

      if (!res.ok) {
        throw new Error(`Error fetching ads: ${res.statusText}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid ads data received');
      }

      setAds(
        data.map((ad: any) => ({
          ...ad,
          image: ad.src,
          link: ad.link, // Make sure link is set here too
        }))
      );
    } catch (error: any) {
      setFetchError(error.message || 'Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading && (
        <p className="text-center text-gray-500 font-medium mb-6">Loading ads...</p>
      )}
      {fetchError && (
        <p className="text-center text-red-600 font-semibold mb-6">{fetchError}</p>
      )}
      {!loading && !fetchError && ads.length === 0 && (
        <p className="text-center text-gray-600 font-medium">No ads found.</p>
      )}

      <div
        className="
          grid
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3
          gap-8
          max-h-[calc(2*400px+theme(space.8))] overflow-auto
        "
      >
        {ads.slice(0, 6).map(ad => (
          <UpdateAdForm key={ad._id} ad={ad} onUpdated={fetchAds} />
        ))}
      </div>
    </div>
  );
}
