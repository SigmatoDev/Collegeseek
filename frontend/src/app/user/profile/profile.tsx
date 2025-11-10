'use client';

import { useEffect, useState } from 'react';
import { api_url } from '@/utils/apiCall';
import { useUserStore } from '@/Store/userStore';

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string | File;
  createdAt?: string;
}

const UserProfile: React.FC = () => {
  const { user, token } = useUserStore(); // ✅ get user & token from store

  const [userData, setUserData] = useState<UserProfileData | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch user profile when user and token available
  useEffect(() => {
    if (user?.id && token) {
      fetchUserProfile(user.id, token);
    } else {
      setLoading(false);
      setError('User not logged in.');
    }
  }, [user, token]);

  const fetchUserProfile = async (userId: string, token: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${api_url}get/profiles/by/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      const profile = data?.user;
      if (profile) {
        setUserData(profile);
        setFormData(profile);
        setImagePreview(profile.profileImage || '');
      } else {
        setError('Profile data not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) return;

    setLoading(true);
    setError('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('address', formData.address || '');
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const res = await fetch(`${api_url}update/profile/${user.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      setUserData(data?.user || null);
      setFormData(data?.user || formData);
      setImagePreview(data?.user?.profileImage || '');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8 transition-all duration-300">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        User Profile
      </h2>

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && userData && !isEditing && (
        <div className="space-y-4 text-gray-700">
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            </div>
          )}
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
          {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
          <div className="flex justify-center">
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {!loading && isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          <div>
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              disabled
              className="w-full px-4 py-2 border rounded-md mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block">Profile Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {!loading && !userData && !error && (
        <p className="text-center text-gray-600">No profile data found.</p>
      )}
    </div>
  );
};

export default UserProfile;
