// 'use client';

// import { useEffect, useState } from 'react';
// import { api_url } from '@/utils/apiCall';
// import { useUserStore } from '@/Store/userStore';

// interface UserProfileData {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   profileImage?: string | File;
//   createdAt?: string;
// }

// const UserProfile: React.FC = () => {
//   const { user, token } = useUserStore(); // ✅ get user & token from store

//   const [userData, setUserData] = useState<UserProfileData | null>(null);
//   const [formData, setFormData] = useState<UserProfileData>({
//     _id: '',
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     profileImage: '',
//     createdAt: '',
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');
//   const [isEditing, setIsEditing] = useState(false);

//   // ✅ Fetch user profile when user and token available
//   useEffect(() => {
//     if (user?.id && token) {
//       fetchUserProfile(user.id, token);
//     } else {
//       setLoading(false);
//       setError('User not logged in.');
//     }
//   }, [user, token]);

//   const fetchUserProfile = async (userId: string, token: string) => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch(`${api_url}get/profiles/by/${userId}`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch profile');

//       const data = await res.json();
//       const profile = data?.user;
//       if (profile) {
//         setUserData(profile);
//         setFormData(profile);
//         setImagePreview(profile.profileImage || '');
//       } else {
//         setError('Profile data not found.');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Error fetching profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditToggle = () => setIsEditing((prev) => !prev);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//       setFormData((prev) => ({ ...prev, profileImage: file }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?.id || !token) return;

//     setLoading(true);
//     setError('');
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('email', formData.email);
//       formDataToSend.append('phone', formData.phone || '');
//       formDataToSend.append('address', formData.address || '');
//       if (formData.profileImage instanceof File) {
//         formDataToSend.append('profileImage', formData.profileImage);
//       }

//       const res = await fetch(`${api_url}update/profile/${user.id}`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       if (!res.ok) throw new Error('Failed to update profile');

//       const data = await res.json();
//       setUserData(data?.user || null);
//       setFormData(data?.user || formData);
//       setImagePreview(data?.user?.profileImage || '');
//       setIsEditing(false);
//     } catch (err: any) {
//       setError(err.message || 'Error updating profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8 transition-all duration-300">
//       <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
//         User Profile
//       </h2>

//       {loading && <div className="text-center text-gray-500">Loading...</div>}
//       {error && <p className="text-red-600 text-center">{error}</p>}

//       {!loading && userData && !isEditing && (
//         <div className="space-y-4 text-gray-700">
//           {imagePreview && (
//             <div className="flex justify-center">
//               <img
//                 src={imagePreview}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover border"
//               />
//             </div>
//           )}
//           <p><strong>Name:</strong> {userData.name}</p>
//           <p><strong>Email:</strong> {userData.email}</p>
//           {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
//           {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
//           <div className="flex justify-center">
//             <button
//               onClick={handleEditToggle}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       )}

//       {!loading && isEditing && (
//         <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
//           <div>
//             <label className="block">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email || ''}
//               disabled
//               className="w-full px-4 py-2 border rounded-md mt-1 bg-gray-100 cursor-not-allowed"
//             />
//           </div>

//           <div>
//             <label className="block">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border rounded-md mt-1 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block">Profile Image</label>
//             <input
//               type="file"
//               onChange={handleImageChange}
//               className="w-full mt-1"
//             />
//             {imagePreview && (
//               <div className="mt-3 flex justify-center">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-32 h-32 rounded-full object-cover border"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       )}

//       {!loading && !userData && !error && (
//         <p className="text-center text-gray-600">No profile data found.</p>
//       )}
//     </div>
//   );
// };

// export default UserProfile;
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
  const { user, token, setUser } = useUserStore(); // ✅ FIX ADDED

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

 useEffect(() => {
  if (user?._id && token) {
    fetchUserProfile(user._id, token);
  } else {
    setLoading(false);
    setError('User not logged in.');
  }
}, [user?._id, token]); // ✅ FIXED

  // ✅ FETCH PROFILE
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

        // ✅ FIX: correct image preview (S3/full URL)
        setImagePreview(profile.profileImage || null);

        // 🔥 IMPORTANT: sync Zustand (fix header image)
        setUser(profile);
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

  // ✅ IMAGE CHANGE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id || !token) return;

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

      const res = await fetch(
        `${api_url}update/profile/${user._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      const updatedUser = data?.user;

      // ✅ UPDATE UI
      setUserData(updatedUser || null);
      setFormData(updatedUser || formData);
      setImagePreview(updatedUser?.profileImage || null);
      setIsEditing(false);

      // 🔥 IMPORTANT: update Zustand (fix header instantly)
      setUser(updatedUser);

    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border rounded-md mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2 text-sm md:px-4 md:py-2 md:text-base';

return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md transition-all duration-300
      p-5 mt-4
      md:p-8 md:mt-8
    ">
      <h2 className="font-semibold text-center text-gray-800 mb-5
        text-xl md:text-3xl md:mb-6
      ">
        User Profile
      </h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-3">
            {[0.75, 0.5, 0.6].map((w, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="h-9 w-28 bg-blue-100 rounded-md" />
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-center text-sm">{error}</p>}

      {/* View mode */}
      {!loading && userData && !isEditing && (
        <div className="space-y-3 text-gray-700 md:space-y-4">
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Profile"
                className="rounded-full object-cover border
                  w-24 h-24 md:w-32 md:h-32
                "
              />
            </div>
          )}

          {/* Profile fields as clean card rows */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100 text-sm md:text-base">
            <div className="flex justify-between px-4 py-3">
              <span className="font-semibold text-gray-500">Name</span>
              <span className="text-gray-800 text-right">{userData.name}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="font-semibold text-gray-500">Email</span>
              <span className="text-gray-800 text-right truncate max-w-[60%]">{userData.email}</span>
            </div>
            {userData.phone && (
              <div className="flex justify-between px-4 py-3">
                <span className="font-semibold text-gray-500">Phone</span>
                <span className="text-gray-800 text-right">{userData.phone}</span>
              </div>
            )}
            {userData.address && (
              <div className="flex justify-between px-4 py-3">
                <span className="font-semibold text-gray-500">Address</span>
                <span className="text-gray-800 text-right max-w-[60%]">{userData.address}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-1">
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium
                px-5 py-2 text-sm md:px-6 md:py-2 md:text-base
              "
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Edit mode */}
      {!loading && isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 md:text-base">Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 md:text-base">Email</label>
            <input type="email" name="email" value={formData.email || ''} disabled
              className="w-full border rounded-md mt-1 bg-gray-100 cursor-not-allowed px-3 py-2 text-sm md:px-4 md:py-2 md:text-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 md:text-base">Phone</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 md:text-base">Address</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 md:text-base">Profile Image</label>
            <input type="file" onChange={handleImageChange} className="w-full mt-1 text-sm" />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img src={imagePreview} alt="Preview" className="rounded-full object-cover border w-24 h-24 md:w-32 md:h-32" />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={handleEditToggle}
              className="border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition font-medium px-5 py-2 text-sm md:px-6 md:text-base">
              Cancel
            </button>
            <button type="submit"
              className="bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium px-5 py-2 text-sm md:px-6 md:text-base">
              Save Changes
            </button>
          </div>
        </form>
      )}

      {!loading && !userData && !error && (
        <p className="text-center text-gray-600 text-sm md:text-base">No profile data found.</p>
      )}
    </div>
  );
};

export default UserProfile;
// 'use client';

// import { useEffect, useState } from 'react';
// import { api_url } from '@/utils/apiCall';
// import { useUserStore } from '@/Store/userStore';

// interface UserProfileData {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   profileImage?: string | File;
//   createdAt?: string;
// }

// const PRIMARY = '[#302975]';

// const UserProfile: React.FC = () => {
//   const { user, token } = useUserStore();
//   const [userData, setUserData] = useState<UserProfileData | null>(null);
//   const [formData, setFormData] = useState<UserProfileData>({
//     _id: '', name: '', email: '', phone: '', address: '', profileImage: '', createdAt: '',
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (user?._id && token) fetchUserProfile(user._id, token);
//     else { setLoading(false); setError('User not logged in.'); }
//   }, [user, token]);

//   const fetchUserProfile = async (userId: string, token: string) => {
//     setLoading(true); setError('');
//     try {
//       const res = await fetch(`${api_url}get/profiles/by/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to fetch profile');
//       const data = await res.json();
//       const profile = data?.user;
//       if (profile) { setUserData(profile); setFormData(profile); setImagePreview(profile.profileImage || ''); }
//       else setError('Profile data not found.');
//     } catch (err: any) { setError(err.message || 'Error fetching profile'); }
//     finally { setLoading(false); }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//       setFormData(prev => ({ ...prev, profileImage: file }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user?._id || !token) return;
//     setLoading(true); setError('');
//     try {
//       const fd = new FormData();
//       fd.append('name', formData.name);
//       fd.append('email', formData.email);
//       fd.append('phone', formData.phone || '');
//       fd.append('address', formData.address || '');
//       if (formData.profileImage instanceof File) fd.append('profileImage', formData.profileImage);
//       const res = await fetch(`${api_url}update/profile/${user._id}`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });
//       if (!res.ok) throw new Error('Failed to update profile');
//       const data = await res.json();
//       setUserData(data?.user || null);
//       setFormData(data?.user || formData);
//       setImagePreview(data?.user?.profileImage || '');
//       setIsEditing(false);
//     } catch (err: any) { setError(err.message || 'Error updating profile'); }
//     finally { setLoading(false); }
//   };

//   const initials = userData?.name
//     ? userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
//     : 'U';

//   const memberSince = userData?.createdAt
//     ? new Date(userData.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
//     : null;

//   const fieldInputClass =
//     'w-full border border-[#302975]/20 rounded-lg px-4 py-2.5 text-sm text-[#302975] bg-white outline-none focus:border-[#302975] focus:ring-2 focus:ring-[#302975]/10 transition';

//   const disabledInputClass =
//     'w-full border border-[#302975]/10 rounded-lg px-4 py-2.5 text-sm text-[#302975]/40 bg-[#fdf1ea] outline-none cursor-not-allowed';

//   return (
//     <div className="min-h-full bg-[#fdf1ea] p-6">
//       <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#302975]/10 overflow-hidden">

//         {/* ── Header ── */}
//         <div className="bg-[#302975] px-7 py-6 flex items-center gap-4">
//           {imagePreview ? (
//             <img
//               src={imagePreview}
//               alt="Profile"
//               className="w-16 h-16 rounded-full object-cover border-2 border-[#fdf1ea]/30 shrink-0"
//             />
//           ) : (
//             <div className="w-16 h-16 rounded-full bg-[#fdf1ea] flex items-center justify-center text-xl font-medium text-[#302975] shrink-0 border-2 border-[#fdf1ea]/30">
//               {initials}
//             </div>
//           )}
//           <div>
//             <p className="text-white text-base font-medium leading-snug">
//               {userData?.name || user?.name || 'User'}
//             </p>
//             <p className="text-[#fdf1ea]/60 text-xs mt-0.5 mb-2">
//               {userData?.email || user?.email}
//             </p>
//             <span className="inline-block bg-[#fdf1ea]/15 border border-[#fdf1ea]/25 text-[#fdf1ea] text-[10px] px-3 py-0.5 rounded-full">
//               Student
//             </span>
//           </div>
//         </div>

//         <div className="px-7 py-6">

//           {/* ── Loading skeleton ── */}
//           {loading && (
//             <div className="space-y-3 animate-pulse">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="h-11 bg-[#fdf1ea] rounded-xl" />
//               ))}
//             </div>
//           )}

//           {/* ── Error ── */}
//           {error && (
//             <p className="text-red-700 text-sm text-center mb-3">{error}</p>
//           )}

//           {/* ── View mode ── */}
//           {!loading && userData && !isEditing && (
//             <>
//               <div className="space-y-2">
//                 {[
//                   { label: 'Name', value: userData.name },
//                   { label: 'Email', value: userData.email },
//                   { label: 'Phone', value: userData.phone },
//                   { label: 'Address', value: userData.address },
//                 ].filter(f => f.value).map(field => (
//                   <div
//                     key={field.label}
//                     className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#fdf1ea]"
//                   >
//                     <span className="text-xs font-medium text-[#302975]/60">{field.label}</span>
//                     <span className="text-sm font-medium text-[#302975] text-right max-w-[60%] break-words">
//                       {field.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t border-[#302975]/8 my-5" />

//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-[#302975] text-[#fdf1ea] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#3d3490] transition"
//                 >
//                   Edit profile
//                 </button>
//               </div>

//               {memberSince && (
//                 <p className="text-center text-[10px] text-[#302975]/40 mt-4">
//                   Member since {memberSince}
//                 </p>
//               )}
//             </>
//           )}

//           {/* ── Edit mode ── */}
//           {!loading && isEditing && (
//             <form onSubmit={handleSubmit} className="space-y-4">

//               {/* Avatar upload */}
//               <div className="flex items-center gap-4 bg-[#fdf1ea] rounded-xl px-4 py-3">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-11 h-11 rounded-full object-cover shrink-0"
//                   />
//                 ) : (
//                   <div className="w-11 h-11 rounded-full bg-[#302975] flex items-center justify-center text-sm font-medium text-[#fdf1ea] shrink-0">
//                     {initials}
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-xs font-medium text-[#302975]">Profile photo</p>
//                   <p className="text-[11px] text-[#302975]/50">JPG or PNG, max 2MB</p>
//                   <label className="inline-block mt-1.5 border border-[#302975]/30 rounded-md px-3 py-1 text-[11px] text-[#302975] cursor-pointer hover:bg-[#302975]/5 transition">
//                     Choose file
//                     <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
//                   </label>
//                 </div>
//               </div>

//               {/* Fields */}
//               {[
//                 { label: 'Full name', name: 'name', type: 'text', value: formData.name, disabled: false },
//                 { label: 'Email address', name: 'email', type: 'email', value: formData.email, disabled: true },
//                 { label: 'Phone', name: 'phone', type: 'text', value: formData.phone || '', disabled: false },
//                 { label: 'Address', name: 'address', type: 'text', value: formData.address || '', disabled: false },
//               ].map(field => (
//                 <div key={field.name}>
//                   <label className="block text-[10px] font-medium text-[#302975]/60 uppercase tracking-wider mb-1.5">
//                     {field.label}
//                   </label>
//                   <input
//                     type={field.type}
//                     name={field.name}
//                     value={field.value}
//                     disabled={field.disabled}
//                     onChange={handleInputChange}
//                     className={field.disabled ? disabledInputClass : fieldInputClass}
//                   />
//                 </div>
//               ))}

//               <div className="border-t border-[#302975]/8 pt-4 flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="border border-[#302975]/30 text-[#302975] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#302975]/5 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#302975] text-[#fdf1ea] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#3d3490] transition"
//                 >
//                   Save changes
//                 </button>
//               </div>
//             </form>
//           )}

//           {!loading && !userData && !error && (
//             <p className="text-center text-[#302975]/50 text-sm">No profile data found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;