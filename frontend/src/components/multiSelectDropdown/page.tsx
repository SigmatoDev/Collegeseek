import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface Course {
  _id: string;
  name: string;
  code: string;
}

interface Props {
  onSelectionChange: (selectedCourses: Course[]) => void; // Callback function to pass selected courses
}

const MultiSelectDropdown: React.FC<Props> = ({ onSelectionChange }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${api_url}course-list`);

        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle selecting a course
  const handleSelect = useCallback(
    (course: Course) => {
      if (!selectedCourses.some((c) => c._id === course._id)) {
        const updatedCourses = [...selectedCourses, course];
        setSelectedCourses(updatedCourses);
        onSelectionChange(updatedCourses); // Ensure this function is called
      }
      setSearchQuery(""); // Reset input
    },
    [selectedCourses, onSelectionChange]
  );

  // Handle removing a course
  const handleRemove = (id: string) => {
    const updatedCourses = selectedCourses.filter((c) => c._id !== id);
    setSelectedCourses(updatedCourses);
    onSelectionChange(updatedCourses); // Ensure this function is called
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="border p-3 rounded-lg">
        {/* Selected Courses */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCourses.map((course) => (
            <span
              key={course._id}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
            >
              {course.name}
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemove(course._id)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search and add courses..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Course Suggestions */}
        {searchQuery && (
          <div className="border mt-2 rounded-lg max-h-40 overflow-y-auto bg-white shadow-md">
            {courses
              .filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((course) => (
                <div
                  key={course._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(course)}
                >
                  {course.name}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
