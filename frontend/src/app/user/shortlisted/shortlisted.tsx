"use client";

import { useEffect, useState } from "react";
import { api_url } from "@/utils/apiCall";

// Interface Definitions
interface CollegeData {
  name: string;
  location: string;
}

interface ShortlistedCollege {
  _id: string;
  collegeId: CollegeData;
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

const ShortListColleges: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [shortlistedColleges, setShortlistedColleges] = useState<ShortlistedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch user from session storage on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_store");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userFromSession = parsed?.state?.user;

        if (userFromSession?.token) {
          setUser(userFromSession);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error parsing user_store from sessionStorage:", err);
        setError("Invalid user session.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch shortlisted colleges when user is available
  useEffect(() => {
    if (user?.token) {
      fetchShortlistedColleges(user.id, user.token);
    }
  }, [user]);

  // Function to fetch shortlisted colleges
  const fetchShortlistedColleges = async (userId: string, token: string) => {
    setLoading(true);

    try {
      const endpoint = `${api_url}get/user/shortlistedClg/by/${userId}`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // Only throw error if it's not the expected empty list message
      if (!res.ok && data?.message !== "No shortlisted colleges found.") {
        throw new Error("Failed to fetch shortlisted colleges. " + (data?.message || ""));
      }

      setShortlistedColleges(data?.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Remove college from shortlist
  const removeCollege = async (shortlistId: string) => {
    if (!user?.token) return;

    // Validate that the userId and shortlistId are valid MongoDB ObjectId formats (24 hex characters)
    const isValidId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidId(user.id) || !isValidId(shortlistId)) {
      setError("Invalid ObjectId format for userId or collegeId.");
      return;
    }

    try {
      const endpoint = `${api_url}delete/user/shortlistedClg/${user.id}/${shortlistId}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Failed to remove college. " + errorText);
      }

      // Remove from local state
      setShortlistedColleges((prev) =>
        prev.filter((college) => college._id !== shortlistId)
      );
    } catch (err: any) {
      setError(err.message || "Error removing the college.");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Dashboard</h1>

      {loading && <p className="text-gray-500">Loading shortlisted colleges...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && shortlistedColleges.length > 0 ? (
        <div className="space-y-4">
          {shortlistedColleges.map((college) => (
            <div
              key={college._id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-medium text-gray-800">
                  {college.collegeId?.name || "Unnamed College"}
                </h2>
                <p className="text-gray-600">
                  {college.collegeId?.location || "Unknown Location"}
                </p>
              </div>
              <button
                onClick={() => removeCollege(college._id)}
                className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500">You haven't shortlisted any colleges yet.</p>
      )}
    </div>
  );
};

export default ShortListColleges;
