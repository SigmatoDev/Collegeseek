import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { api_url } from '@/utils/apiCall';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'; // 👈 Make sure both icons are imported

interface Stream {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  college_id?: { name: string };
  specialization?: { name: string };
  duration: string;
  fees?: { amount: number; currency?: string; year?: number };
}

interface StreamCourseFilterProps {
  onSelectStream: (streamId: string) => void;
}

const StreamCourseFilter: React.FC<StreamCourseFilterProps> = ({ onSelectStream }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null); // ✅ define scrollRef

  useEffect(() => {
    axios
      .get(`${api_url}get2/streams`)
      .then((res) => {
        const responseData = Array.isArray(res.data) ? res.data : res.data.data;
        if (Array.isArray(responseData)) {
          setStreams(responseData);
        } else {
          console.error("Unexpected data format for streams");
        }
      })
      .catch((err) => console.error('Error fetching streams:', err));
  }, []);

  const handleStreamClick = (streamId: string) => {
  console.log("Selected Stream ID:", streamId);
  setSelectedStreamId(streamId);
  onSelectStream(streamId);

  setLoading(true);
  console.log("Fetching courses for stream...");

  axios.get(`${api_url}courses/by-stream/${streamId}`)
    .then((res) => {
      console.log("Courses fetched successfully:", res.data);
      setCourses(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching courses:", err);
      setCourses([]);
      setLoading(false);
    });
};


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Courses by Stream</h2>

      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable Stream Buttons */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar flex gap-3 px-10"
        >
          {streams.map((stream) => (
            <button
              key={stream._id}
              onClick={() => handleStreamClick(stream._id)}
              className={`whitespace-nowrap px-5 py-2.5 my-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  selectedStreamId === stream._id
                    ? 'bg-[#CF5E44] text-white hover:bg-[#CF5E44] focus:ring-[#CF5E44]'
                    : 'bg-[#FFF7ED] text-gray-800 hover:bg-[#CF5E44] hover:text-white focus:ring-gray-400'
                }
              `}
            >
              {stream.name}
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default StreamCourseFilter;
