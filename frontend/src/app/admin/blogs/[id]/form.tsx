"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { api_url, img_url } from "@/utils/apiCall";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "@/components/customToast/page";

const BlogForm = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <ActualBlogForm />;
};

const ActualBlogForm = () => {
  const router = useRouter();
  const { id: blogId } = useParams();

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    publishedDate: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState("/default-placeholder.png");

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogId || blogId === "new") return;
      try {
        const response = await axios.get(`${api_url}blog/${blogId}`);
        const data = response.data;
        setBlogData({
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          category: data.category || "",
          tags: data.tags || "",
          publishedDate: data.publishedDate
            ? new Date(data.publishedDate).toISOString().split("T")[0]
            : "",
          image: null,
        });
        setImageSrc(
          data.image
            ? `${img_url}${data.image.replace(/^\/uploads\//, "uploads/")}`
            : "/default-placeholder.png"
        );
      } catch (err: any) {
        setError("Failed to fetch blog data. Please try again.");
      }
    };
    fetchBlogData();
  }, [blogId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBlogData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleEditorChange = (content: string) => {
    setBlogData((prev) => ({ ...prev, content }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, image: file }));
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    router.push("/admin/blogs");
  };

  // Sanitization function: replace multiple spaces with single space and trim
  const sanitizeText = (text: string) => {
    return text.replace(/\s+/g, " ").trim();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!blogData.title || !blogData.content || !blogData.author) {
      const errorMsg = "Title, content, and author are required.";
      setError(errorMsg);
      toast.custom((t) => (
        <CustomToast message={errorMsg} onClose={() => toast.dismiss(t.id)} />
      ));
      setLoading(false);
      return;
    }

    const formData = new FormData();

    Object.entries(blogData).forEach(([key, value]) => {
      if (value) {
        // Sanitize text fields before sending
        if (
          typeof value === "string" &&
          ["title", "author", "category", "tags", "publishedDate"].includes(key)
        ) {
          formData.append(key, sanitizeText(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    try {
      const url =
        blogId && blogId !== "new"
          ? `${api_url}blog/${blogId}`
          : `${api_url}blog`;
      const method = blogId && blogId !== "new" ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ([200, 201].includes(response.status)) {
        toast.custom((t) => (
          <CustomToast
            message="Blog saved successfully!"
            type="success"
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        router.push("/admin/blogs");
      }
    } catch (err) {
      toast.custom((t) => (
        <CustomToast
          message="Failed to save blog. Please try again."
          onClose={() => toast.dismiss(t.id)}
        />
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {blogId && blogId !== "new" ? "Edit Blog" : "Create New Blog"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Enter Blog Title"
            value={blogData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={blogData.author}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <input
          type="date"
          name="publishedDate"
          value={blogData.publishedDate}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Content
          </label>
          <Editor
            apiKey="ngdm20net2gismgz9p9i8j90k9a013sosx2wng37c7895rhm"
            value={blogData.content}
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            onEditorChange={handleEditorChange}
          />
        </div>

        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="p-2 border rounded-lg"
        />
        {imageSrc && imageSrc !== "/default-placeholder.png" && (
          <img
            src={imageSrc}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg shadow"
          />
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : blogId && blogId !== "new" ? (
              "Update Blog"
            ) : (
              "Publish Blog"
            )}
          </button>
          {blogId && blogId !== "new" && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
