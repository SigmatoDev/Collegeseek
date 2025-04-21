import { useEffect, useState } from "react";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import { CurrencyRupeeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Modal from "@/components/counselling/model/page";
import CounsellingForm from "@/components/counselling/counsellingForm/page";

interface Props {
  collegeId: string;
}
interface CollegeData {
  image: string;
  name: string;
  slug: string;
  rating: number;
  location: string;
  city: string;
  state: string;
  rank: number;
  fees: string;
  accreditation: string;
  avgPackage: string;
  exams: string;
  description: string;
  shortlistedUsers: { image: string; name: string }[];
  shortlistedCount: number;
  coursesCount: number;
}

interface Props {
  collegeId: string;
}


export default function CollegeCard({ collegeId }: Props) {
  const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!collegeId) {
      setError("Invalid college ID.");
      setLoading(false);
      return;
    }

    const fetchCollegeById = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${api_url}/colleges/${collegeId}`);
        console.log("college" , response)
        if (response.data?.success) {
          setCollegeData(response.data.data);
          console.log("co", collegeData)
        } else {
          setError("College data not found.");
        }
      } catch (error: any) {
        setError("Failed to load college data.");
        console.error("Error fetching data:", error?.response?.data || error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeById();
  }, [collegeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here (e.g., API call)
    console.log("Form Data:", formData);
    setIsModalOpen(false);
    alert("Counseling request submitted!");
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!collegeData) return <div className="text-center p-4">No data available.</div>;

  const imageUrlFinal = collegeData.image
    ? `${img_url}uploads/${collegeData.image.replace(/^\/?uploads\//, "")}`
    : "/logo/logo1.png";


  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="flex gap-4">
        <img
          src={imageUrlFinal}
          alt={collegeData.name}
          width={192}
          height={128}
          className="w-48 h-32 rounded-lg object-cover cursor-pointer"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/logo/logo-removebg-preview.png")}
          onClick={() => setSelectedImage(imageUrlFinal)}
        />
        <div className="flex flex-col justify-between flex-1">
          <h2 className="text-xl font-semibold">{collegeData.name}</h2>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-1">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-5 h-5 text-blue-500" />
              {collegeData.city}{collegeData.state}
            </div>
            <div className="text-orange-500 font-semibold">#{collegeData.rank} NIRF</div>
            <div className="flex items-center gap-1">
              <CurrencyRupeeIcon className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold">Fees</div>
                <div>{collegeData.fees}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <CurrencyRupeeIcon className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-semibold">Avg Package</div>
                <div>{collegeData.avgPackage}</div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <p>
              {isExpanded ? collegeData.description : `${collegeData.description.slice(0, 150)}...`}
            </p>
            {collegeData.description.length > 150 && (
              <button
                className="text-blue-500 text-xs font-semibold focus:outline-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Modal for Enlarged Image */}
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative p-4 bg-white rounded-lg">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 text-white bg-gray-800 px-2 py-1 rounded"
                >
                  ✕
                </button>
                <img src={selectedImage} alt="Selected Image" width={600} height={400} className="rounded-lg" />
              </div>
            </div>
          )}

          {/* Shortlisted Users Section */}
          {Array.isArray(collegeData.shortlistedUsers) && collegeData.shortlistedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {collegeData.shortlistedUsers.map((user, index) => (
                  <img
                    key={index}
                    src={user.image ? `${img_url}${user.image.replace(/^\/+/, "")}` : "/logo/default-user.png"}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border"
                    alt={user.name}
                    onError={(e) => (e.currentTarget.src = "/logo/default-user.png")}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700">
                Shortlisted by {collegeData.shortlistedCount ?? 0}+ students
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t mt-4 pt-2 flex justify-between text-sm text-[#441A6B]">
        <div className="flex gap-2">
        <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#D35B42] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b84b35] transition duration-300"
      >
        Get Free Counselling
      </button>

      {/* Modal with Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CounsellingForm collegeId={collegeId} />
      </Modal>
          
          <button
  onClick={() => router.push(`/colleges/${collegeData.slug}`)}
  className="border px-4 py-2 rounded-lg hover:bg-gray-100"
>
  View Details
</button>
        </div>
      </div>
    </div>
  );
}
