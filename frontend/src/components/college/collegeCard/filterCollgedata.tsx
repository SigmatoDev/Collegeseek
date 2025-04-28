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

export default function FilterCollegeCard({ collegeId }: Props) {
  const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        if (response.data?.success) {
          setCollegeData(response.data.data);
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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!collegeData) return <div className="text-center p-4">No data available.</div>;

  const imageUrlFinal = collegeData.image
    ? `${img_url}uploads/${collegeData.image.replace(/^\/?uploads\//, "")}`
    : "/logo/logo1.png";

  return (
    <div
      className="border rounded-lg shadow-md p-3 md:p-4 bg-white cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/colleges/${collegeData.slug}`)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={imageUrlFinal}
          alt={collegeData.name}
          width={192}
          height={128}
          className="w-full md:w-48 h-48 md:h-32 rounded-lg object-cover"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/logo/logo-removebg-preview.png")}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(imageUrlFinal);
          }}
        />
        <div className="flex flex-col justify-between flex-1">
          <h2 className="text-lg md:text-xl font-semibold mb-2">{collegeData.name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-2">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-[18px] h-[18px] text-blue-500" />
              {collegeData.city} ({collegeData.state})
            </div>
            <div className="text-orange-500 font-semibold pl-1">
              #{collegeData.rank} NIRF
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
                <CurrencyRupeeIcon className="w-[18px] h-[18px] text-green-500" />
                Fees
              </div>
              <div className="text-gray-600 pl-[22px]">
                Rs. {Number(collegeData.fees).toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
                <CurrencyRupeeIcon className="w-[18px] h-[18px] text-purple-500" />
                Avg Package
              </div>
              <div className="text-gray-600 pl-[22px]">
                {collegeData.avgPackage} LPA
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <p>
              {isExpanded
                ? collegeData.description
                : `${collegeData.description.slice(0, 150)}...`}
            </p>
            {collegeData.description.length > 150 && (
              <button
                className="text-blue-500 text-xs font-semibold focus:outline-none mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {Array.isArray(collegeData.shortlistedUsers) && collegeData.shortlistedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {collegeData.shortlistedUsers.map((user, index) => (
                  <img
                    key={index}
                    src={
                      user.image
                        ? `${img_url}${user.image.replace(/^\/+/, "")}`
                        : "/logo/default-user.png"
                    }
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

      <div className="border-t mt-4 pt-3 flex flex-col md:flex-row justify-between gap-3 text-sm text-[#441A6B]">
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto bg-[#D35B42] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-[#b84b35] transition duration-300"
          >
            Get Free Counselling
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/colleges/${collegeData.slug}`);
            }}
            className="w-full md:w-auto border px-4 py-2 md:py-3 rounded-lg hover:bg-gray-100"
          >
            View Details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div
            className="p-4 sm:p-6 max-w-full mx-auto bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()} // prevent Modal internal click from bubbling
          >
            <CounsellingForm collegeId={collegeId} />
          </div>
        </Modal>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 sm:p-0"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-lg w-full max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside image
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 px-2 py-1 rounded"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Selected Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
