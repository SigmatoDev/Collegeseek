// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";

// interface ApprovalDropdownProps {
//   code: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   label: string;
// }

// const ApprovalDropdown: React.FC<ApprovalDropdownProps> = ({ code, value, onChange, label }) => {
//   const [approvals, setApprovals] = useState<{ _id: string; code: string }[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchApprovals = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${api_url}get/approvals`); // Replace this URL with the actual endpoint for approvals
//         setApprovals(response.data); // Use setApprovals to update state with the fetched data
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching approvals:", err);
//         setError("Failed to load approvals.");
//         setLoading(false);
//       }
//     };

//     fetchApprovals();
//   }, []); // Optional: add `apiUrl` as a dependency if it might change

//   return (
//     <div className="mb-4">
//       <label htmlFor={code} className="block text-sm font-semibold text-gray-700">
//         {label}
//       </label>
//       {loading && <p>Loading options...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {!loading && !error && (
//         <select
//           name={code} // Use `name` attribute for the select element
//           value={value}
//           onChange={onChange}
//           className="p-2 border rounded w-full mt-2"
//         >
//           <option value="">Select {label}</option>
//           {approvals.map((option) => (
//             <option key={option._id} value={option._id}>
//               {option.code}
//             </option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// };

// export default ApprovalDropdown;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface Approval {
  _id: string;
  code: string;
  description: string;
}

interface Props {
  onSelectionChange: (selectedApprovals: Approval[]) => void;
}

const ApprovalDropdown: React.FC<Props> = ({ onSelectionChange }) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<Approval[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const { data } = await axios.get(`${api_url}get/Approvals`);
        if (Array.isArray(data)) {
          setApprovals(data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    fetchApprovals();
  }, []);

  const handleSelect = useCallback(
    (approval: Approval) => {
      if (!selectedApprovals.some((a) => a._id === approval._id)) {
        const updated = [...selectedApprovals, approval];
        setSelectedApprovals(updated);
        onSelectionChange(updated);
      }
      setSearchQuery("");
    },
    [selectedApprovals, onSelectionChange]
  );

  const handleRemove = (id: string) => {
    const updated = selectedApprovals.filter((a) => a._id !== id);
    setSelectedApprovals(updated);
    onSelectionChange(updated);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="border p-3 rounded-lg">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedApprovals.map((approval) => (
            <span
              key={approval._id}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
            >
              {approval.code}
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemove(approval._id)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search and add approvals..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {searchQuery && (
          <div className="border mt-2 rounded-lg max-h-40 overflow-y-auto bg-white shadow-md">
            {approvals
              .filter((a) =>
                a.code.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((approval) => (
                <div
                  key={approval._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(approval)}
                >
                  {approval.code} - {approval.description}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDropdown;
