import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface OwnershipDropdownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

const OwnershipDropdown: React.FC<OwnershipDropdownProps> = ({
  name,
  value,
  onChange,
  label,
}) => {
  const [ownerships, setOwnerships] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerships = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_url}get/Ownership`);
        setOwnerships(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ownerships:", err);
        setError("Failed to load ownerships.");
        setLoading(false);
      }
    };

    fetchOwnerships();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {loading && <p>Loading options...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="p-2 border rounded w-full mt-2"
        >
          <option value="">Select {label}</option>
          {ownerships.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default OwnershipDropdown;
