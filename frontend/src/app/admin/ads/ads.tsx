import React, { useState } from 'react';
import axios from 'axios';

const UploadPageAds = () => {
  const [page, setPage] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 2)); // Limit to 2
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!page || images.length !== 2) {
      return alert('Please select a page and exactly 2 images.');
    }

    const formData = new FormData();
    formData.append('page', page);
    images.forEach(image => formData.append('images', image));

    try {
      const res = await axios.post('/api/ads/upload', formData);
      alert('Ads uploaded successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <label className="block mb-2 font-semibold">Select Page</label>
      <select value={page} onChange={(e) => setPage(e.target.value)} className="w-full mb-4 border p-2">
        <option value="">-- Choose Page --</option>
        <option value="college-page">College Page</option>
        <option value="courses-page">Courses Page</option>
      </select>

      <label className="block mb-2 font-semibold">Upload 2 Images</label>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mb-4" />

      <div className="flex gap-4">
        {images.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} className="w-24 h-auto rounded" alt={`preview-${i}`} />
        ))}
      </div>

      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Upload Ads
      </button>
    </form>
  );
};

export default UploadPageAds;
