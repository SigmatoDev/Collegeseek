import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api_url } from '@/utils/apiCall'; // Ensure this is correctly configured
import { Loader } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

const CreateOrEditTerm = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);


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
        await axios.put(`${api_url}/terms/${id}`, { title, content });
      } else {
        await axios.post(`${api_url}/create/terms`, { title, content });
      }

      router.push('/admin/termsandconditions');
    } catch (err) {
      setError(id !== 'new' ? 'Error updating term' : 'Error creating term');
    }
  };

    const handleCancel = () => {
    router.push('/admin/termsandconditions');
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
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <div className="w-full max-w-8xl p-8">
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
    </div>
  );
};

export default CreateOrEditTerm;
