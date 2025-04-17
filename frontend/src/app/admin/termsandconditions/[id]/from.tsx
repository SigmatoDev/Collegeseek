import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api_url } from '@/utils/apiCall'; // Ensure this is correctly configured
import Editor, { ContentEditableEvent } from 'react-simple-wysiwyg'; 

const CreateOrEditTerm = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (id && id !== 'new') {
      console.log('Edit Mode - Fetching term with ID:', id);

      axios
        .get(`${api_url}/getid/terms/${id}`) // Ensure correct URL with the proper slash at the start of the endpoint
        .then((res) => {
          console.log('Term fetched:', res.data); // Check what is returned from the API
          const { title, content } = res.data;
          setTitle(title);
          setContent(content);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching term:', err);
          setError('Error fetching term');
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
        await axios.put(`${api_url}/terms/${id}`, { title, content });
      } else {
        await axios.post(`${api_url}/create/terms`, { title, content });
      }

      router.push('/admin/termsandconditions');
    } catch (err) {
      setError(id !== 'new' ? 'Error updating term' : 'Error creating term');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-8xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {id !== 'new' ? 'Edit' : 'Create'} Terms and Conditions
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {id !== 'new' ? 'Update Term' : 'Create Term'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditTerm;
