import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface AffiliatedByDropdownProps {
  code: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

interface Affiliation {
  _id: string;
  code: string;
  name: string;
}

const AffiliatedByDropdown: React.FC<AffiliatedByDropdownProps> = ({
  code,
  value,
  onChange,
  label,
}) => {
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_url}get/affiliated`);

        setAffiliations(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching affiliations:", err);
        setError("Failed to load affiliations.");
        setLoading(false);
      }
    };

    fetchAffiliations();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor={code} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {loading && <p>Loading options...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <select
          name={code}
          value={value}
          onChange={onChange}
          className="p-2 border rounded w-full mt-2"
        >
          <option value="">Select {label}</option>
          {affiliations.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name} ({option.code})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AffiliatedByDropdown;
