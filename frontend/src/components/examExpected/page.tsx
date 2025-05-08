// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";

// interface ExamExpectedDropdownProps {
//   code: string;
//   value: string[]; // Array for multiple selected values
//   onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//   label: string;
//   multiple?: boolean; // Default to true for multiple selection
// }

// const ExamExpectedDropdown: React.FC<ExamExpectedDropdownProps> = ({
//   code,
//   value,
//   onChange,
//   label,
//   multiple = true, // Default to true for multiple selection
// }) => {
//   const [examExpecteds, setExamExpecteds] = useState<{ _id: string; code: string }[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchExamExpecteds = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${api_url}get/Exams`); // Replace with your actual endpoint
//         setExamExpecteds(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching exam expected data:", err);
//         setError("Failed to load exam expected options.");
//         setLoading(false);
//       }
//     };

//     fetchExamExpecteds();
//   }, []);

//   return (
//     <div className="mb-4">
//       <label htmlFor={code} className="block text-sm font-semibold text-gray-700">
//         {label}
//       </label>
//       {loading && <p>Loading options...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {!loading && !error && (
//         <div>
//           <select
//             name={code}
//             value={value} // Array of selected values for multiple selection
//             onChange={onChange}
//             className="p-2 border rounded w-full mt-2"
//             multiple={multiple} // Allow multiple selection
//           >
//             <option value="">Select {label}</option>
//             {examExpecteds.map((option) => (
//               <option key={option._id} value={option._id}>
//                 {option.code}
//               </option>
//             ))}
//           </select>

//           {/* Display selected options */}
//           {value.length > 0 && (
//             <div className="mt-2">
//               <strong>Selected: </strong>
//               <ul className="list-disc pl-5">
//                 {[...new Set(value)].map((selectedValue) => {
//                   const selectedOption = examExpecteds.find(
//                     (option) => option._id === selectedValue
//                   );
//                   return selectedOption ? (
//                     <li key={selectedOption._id}>{selectedOption.code}</li>
//                   ) : null;
//                 })}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExamExpectedDropdown;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface ExamExpected {
  _id: string;
  code: string;
  date: string; // Example: expected date for the exam
}

interface Props {
  onSelectionChange: (selectedExams: ExamExpected[]) => void; // Callback function to pass selected exams
}

const  ExamExpectedDropdown: React.FC<Props> = ({ onSelectionChange }) => {
  const [exams, setExams] = useState<ExamExpected[]>([]);
  const [selectedExams, setSelectedExams] = useState<ExamExpected[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch exams from API

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(`${api_url}get/Exams`);
  
        // Check if the response is an array directly
        if (Array.isArray(data)) {
          setExams(data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
  
    fetchExams();
  }, []);
  

  // Handle selecting an exam
  const handleSelect = useCallback(
    (exam: ExamExpected) => {
      if (!selectedExams.some((e) => e._id === exam._id)) {
        const updatedExams = [...selectedExams, exam];
        setSelectedExams(updatedExams);
        onSelectionChange(updatedExams); // Ensure this function is called
      }
      setSearchQuery(""); // Reset input
    },
    [selectedExams, onSelectionChange]
  );

  // Handle removing an exam
  const handleRemove = (id: string) => {
    const updatedExams = selectedExams.filter((e) => e._id !== id);
    setSelectedExams(updatedExams);
    onSelectionChange(updatedExams); // Ensure this function is called
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto">
      <div className="border p-3 rounded-lg">
        {/* Selected Exams */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedExams.map((exam) => (
            <span
              key={exam._id}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
            >
              {exam.code}
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemove(exam._id)}
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
          placeholder="Search and add exams..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Exam Suggestions */}
        {searchQuery && (
          <div className="border mt-2 rounded-lg max-h-40 overflow-y-auto bg-white shadow-md">
            {exams
              .filter((e) =>
                e.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((exam) => (
                <div
                  key={exam._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(exam)}
                >
                  {exam.code} - {exam.date}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default  ExamExpectedDropdown;
