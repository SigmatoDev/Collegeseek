'use client';

import { useEffect, useState } from 'react';
import { api_url } from '@/utils/apiCall';

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string | File;  // Updated to accept both string and File
  createdAt?: string;
}

interface User {
  id: string;
  token: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({
    _id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    createdAt: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user_store');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userFromSession = parsed?.state?.user;

        if (userFromSession?.token && userFromSession?.id) {
          setUser({
            id: userFromSession.id,
            token: userFromSession.token,
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError('Invalid user session.');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id && user?.token) {
      fetchUserProfile(user.id, user.token);
    }
  }, [user]);

  const fetchUserProfile = async (userId: string, token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${api_url}get/profiles/by/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to fetch profile. ' + errorText);
      }

      const data = await res.json();
      setUserData(data?.user || null);
      setFormData(data?.user || {
        _id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        profileImage: '',
        createdAt: '',
      });
      setImagePreview(data?.user?.profileImage || '');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: file, // Storing the file object
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('address', formData.address || '');
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const res = await fetch(`${api_url}update/profile/${user?.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to update profile. ' + errorText);
      }

      const data = await res.json();
      setUserData(data?.user || null);
      setFormData(data?.user || formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8 transition-all duration-300 ease-in-out">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Profile</h2>

      {loading && <div className="flex justify-center"><div className="loader"></div></div>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && userData && !isEditing && (
        <div className="space-y-4">
          {userData.profileImage && (
            <div className="flex justify-center">
              <img
                src={userData.profileImage instanceof File ? URL.createObjectURL(userData.profileImage) : userData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          <div><strong>Name:</strong> {userData.name}</div>
          <div><strong>Email:</strong> {userData.email}</div>
          {userData.phone && <div><strong>Phone:</strong> {userData.phone}</div>}
          {userData.address && <div><strong>Address:</strong> {userData.address}</div>}
          <div className="flex justify-center">
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white px-6 py-2 rounded-md transition duration-200 hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {!loading && isEditing && formData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full mt-2"
            />
            {imagePreview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md transition duration-200 hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {!loading && !userData && !error && (
        <p className="text-center">No profile data found. Please try again later.</p>
      )}
    </div>
  );
};

export default UserProfile;
