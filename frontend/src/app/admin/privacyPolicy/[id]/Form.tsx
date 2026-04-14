// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { api_url } from '@/utils/apiCall';
// import { Editor } from '@tinymce/tinymce-react';
// import { Loader } from 'lucide-react';

// const CreateOrEditPrivacyPolicy = ({ params }: { params: { id: string } }) => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//     const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);


//   const router = useRouter();
//   const id = params?.id;

//   useEffect(() => {
//     if (id && id !== 'new') {
//       axios
//         .get(`${api_url}/getid/privacy-policy/${id}`)
//         .then((res) => {
//           const { title, content } = res.data;
//           setTitle(title);
//           setContent(content);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error('Error fetching Privacy Policy:', err);
//           setError('Error fetching Privacy Policy');
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, [id]);

  
//   // Fetch TinyMCE API key from backend
//   useEffect(() => {
//     const fetchApiKey = async () => {
//       try {
//         const response = await axios.get(`${api_url}settings`);
//         if (response.data?.tinymceApiKey) {
//           setDynamicApiKey(response.data.tinymceApiKey);
//         } else {
//           console.error("API key not found in settings response");
//           setDynamicApiKey(""); // fallback empty string or handle differently
//         }
//       } catch (err) {
//         console.error("Failed to fetch TinyMCE API key", err);
//         setDynamicApiKey("");
//       }
//     };

//     fetchApiKey();
//   }, []);

//   const handleEditorChange = (value: string) => {
//     setContent(value);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (id && id !== 'new') {
//         await axios.put(`${api_url}/privacy-policy/${id}`, { title, content });
//       } else {
//         await axios.post(`${api_url}/create/privacy-policy`, { title, content });
//       }
//       router.push('/admin/privacyPolicy');
//     } catch (err) {
//       setError(id !== 'new' ? 'Error updating Privacy Policy' : 'Error creating Privacy Policy');
//     }
//   };

//   const handleCancel = () => {
//     router.push('/admin/privacyPolicy');
//   };
//     // Show loader while TinyMCE API key is loading
//   if (dynamicApiKey === null) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader className="animate-spin h-10 w-10 text-blue-600" />
//       </div>
//     );
//   }

//   if (loading) return null;

//   return (
//     <div className="max-w-[1580px] mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
//         {id !== 'new' ? 'Edit' : 'Create'} Privacy Policy
//       </h1>

//       {error && (
//         <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 text-center font-medium">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title Field */}
//         <div>
//           <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
//             Title <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             placeholder="Enter title"
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>

//         {/* Content Editor */}
//         <div>
//           <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
//             Content <span className="text-red-500">*</span>
//           </label>
//           <div className="border border-gray-300 rounded-md p-2 bg-white shadow-sm">
//             <Editor
//     apiKey={dynamicApiKey}
//       value={content}
//       onEditorChange={(newValue) => handleEditorChange(newValue)}
//      init={{
//               plugins:
//                 "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
//               toolbar:
//                 "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
//             }}
//     />
//           </div>
//         </div>

//         {/* Buttons */}
//        <div className="flex flex-col sm:flex-row gap-4 mt-6">
//   <button
//     type="submit"
//     className="w-full sm:w-1/6 bg-blue-600 text-white py-3 px-5 rounded-lg font-semibold text-base hover:bg-blue-700 transition"
//   >
//     {id !== 'new' ? 'Update' : 'Create'}
//   </button>
//   {id !== 'new' && (
//     <button
//       type="button"
//       onClick={handleCancel}
//       className="w-full sm:w-1/6 bg-gray-100 text-gray-800 py-3 px-5 rounded-lg font-semibold text-base hover:bg-gray-200 transition"
//     >
//       Cancel
//     </button>
//   )}
// </div>


//       </form>
//     </div>
//   );
// };

// export default CreateOrEditPrivacyPolicy;
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { api_url } from '@/utils/apiCall';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2, FileText, ArrowLeft, Save, Plus, Shield } from 'lucide-react';

const CreateOrEditPrivacyPolicy = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);

  const router = useRouter();
  const id = params?.id;
  const isEdit = id && id !== 'new';

  useEffect(() => {
    if (isEdit) {
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
          setError('Failed to load the privacy policy. Please try again.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${api_url}settings`);
        setDynamicApiKey(response.data?.tinymceApiKey || '');
      } catch (err) {
        console.error('Failed to fetch TinyMCE API key', err);
        setDynamicApiKey('');
      }
    };
    fetchApiKey();
  }, []);

  const handleEditorChange = (value: string) => setContent(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await axios.put(`${api_url}/privacy-policy/${id}`, { title, content });
      } else {
        await axios.post(`${api_url}/create/privacy-policy`, { title, content });
      }
      router.push('/admin/privacyPolicy');
    } catch (err) {
      setError(isEdit ? 'Failed to update the privacy policy.' : 'Failed to create the privacy policy.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => router.push('/admin/privacyPolicy');

  if (dynamicApiKey === null || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <Loader2 className="animate-spin h-7 w-7 text-white" />
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            {dynamicApiKey === null ? 'Initializing editor…' : 'Loading policy…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Policies
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Privacy Policy Manager</span>
          </div>

          <div className="flex items-center gap-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                Discard
              </button>
            )}
            <button
              type="submit"
              form="policy-form"
              disabled={saving || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition-all shadow-sm disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEdit ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Policy'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              {isEdit ? 'Editing' : 'Creating'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Privacy Policy' : 'New Privacy Policy'}
          </h1>
          <p className="mt-1.5 text-gray-500 text-sm">
            {isEdit
              ? 'Update the content below and save your changes when ready.'
              : 'Fill in the title and content to create a new privacy policy document.'}
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
              <span className="text-red-700 text-xs font-bold">!</span>
            </div>
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form id="policy-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Title card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800">
                  Policy Title <span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-gray-400 mt-0.5">This will be the document heading shown to users</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Privacy Policy — Last Updated June 2025"
                className="w-full text-lg text-gray-900 placeholder-gray-300 bg-transparent border-0 outline-none focus:ring-0 p-0"
              />
            </div>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Policy Content <span className="text-red-400">*</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Write or paste the full text of your privacy policy</p>
              </div>
            </div>
            <div className="p-1">
              <Editor
                apiKey={dynamicApiKey}
                value={content}
                onEditorChange={handleEditorChange}
                init={{
                  min_height: 540,
                  menubar: true,
                  skin: 'oxide',
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar:
                    'undo redo | styles fontsize | bold italic underline strikethrough | forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | numlist bullist indent outdent | table | removeformat',
                  toolbar_mode: 'sliding',
                  content_style: `
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      font-size: 15px;
                      line-height: 1.7;
                      color: #1a202c;
                      padding: 20px 28px;
                      max-width: 100%;
                    }
                    p { margin: 0 0 1em; }
                    h1, h2, h3 { font-weight: 600; color: #111827; }
                  `,
                  placeholder: 'Start writing your privacy policy here…',
                  resize: true,
                  branding: false,
                  statusbar: true,
                }}
              />
            </div>
          </div>

          {/* Metadata strip */}
          {/* <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>
                This document will be published to your public-facing privacy policy page once saved.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isEdit && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white border border-gray-200 rounded-lg transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition-all shadow-sm disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEdit ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Policy'}
              </button>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditPrivacyPolicy;