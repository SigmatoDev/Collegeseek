'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api_url } from '@/utils/apiCall';
import { Editor } from '@tinymce/tinymce-react';
import { Loader } from 'lucide-react';

const CreateOrEditPrivacyPolicy = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
    const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);


  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (id && id !== 'new') {
      axios
        .get(`${api_url}/getid/privacy-policy/${id}`)
        .then((res) => {
          const { title, content } = res.data;
          setTitle(title);
          setContent(content);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching Privacy Policy:', err);
          setError('Error fetching Privacy Policy');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  
  // Fetch TinyMCE API key from backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${api_url}settings`);
        if (response.data?.tinymceApiKey) {
          setDynamicApiKey(response.data.tinymceApiKey);
        } else {
          console.error("API key not found in settings response");
          setDynamicApiKey(""); // fallback empty string or handle differently
        }
      } catch (err) {
        console.error("Failed to fetch TinyMCE API key", err);
        setDynamicApiKey("");
      }
    };

    fetchApiKey();
  }, []);

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && id !== 'new') {
        await axios.put(`${api_url}/privacy-policy/${id}`, { title, content });
      } else {
        await axios.post(`${api_url}/create/privacy-policy`, { title, content });
      }
      router.push('/admin/privacyPolicy');
    } catch (err) {
      setError(id !== 'new' ? 'Error updating Privacy Policy' : 'Error creating Privacy Policy');
    }
  };

  const handleCancel = () => {
    router.push('/admin/privacyPolicy');
  };
    // Show loader while TinyMCE API key is loading
  if (dynamicApiKey === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (loading) return null;

  return (
    <div className="max-w-[1580px] mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {id !== 'new' ? 'Edit' : 'Create'} Privacy Policy
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter title"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-md p-2 bg-white shadow-sm">
            <Editor
    apiKey={dynamicApiKey}
      value={content}
      onEditorChange={(newValue) => handleEditorChange(newValue)}
     init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
    />
          </div>
        </div>

        {/* Buttons */}
       <div className="flex flex-col sm:flex-row gap-4 mt-6">
  <button
    type="submit"
    className="w-full sm:w-1/6 bg-blue-600 text-white py-3 px-5 rounded-lg font-semibold text-base hover:bg-blue-700 transition"
  >
    {id !== 'new' ? 'Update' : 'Create'}
  </button>
  {id !== 'new' && (
    <button
      type="button"
      onClick={handleCancel}
      className="w-full sm:w-1/6 bg-gray-100 text-gray-800 py-3 px-5 rounded-lg font-semibold text-base hover:bg-gray-200 transition"
    >
      Cancel
    </button>
  )}
</div>


      </form>
    </div>
  );
};

export default CreateOrEditPrivacyPolicy;
