import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api_url } from '@/utils/apiCall'; // Ensure this is correctly configured
import Editor, { ContentEditableEvent } from 'react-simple-wysiwyg'; 

const CreateOrEditPrivacyPolicy = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (id && id !== 'new') {
      console.log('Edit Mode - Fetching Privacy Policy with ID:', id);

      axios
        .get(`${api_url}/getid/privacy-policy/${id}`) // Ensure the correct URL for privacy policy endpoint
        .then((res) => {
          console.log('Privacy Policy fetched:', res.data); // Check what is returned from the API
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
    router.push('/admin/privacyPolicy'); // Redirect to the Privacy Policy list page
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-8xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {id !== 'new' ? 'Edit' : 'Create'} Privacy Policy
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <Editor
              value={content}
              onChange={(e: ContentEditableEvent) => handleEditorChange(e.target.value)} // Handle content change
              placeholder="Enter content"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {id !== 'new' ? 'Update Privacy Policy' : 'Create Privacy Policy'}
            </button>

            {id !== 'new' && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 bg-gray-300 text-black p-3 rounded-lg font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditPrivacyPolicy;
