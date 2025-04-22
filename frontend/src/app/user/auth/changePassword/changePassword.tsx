import { useUserStore } from '@/Store/userStore';
import { api_url } from '@/utils/apiCall';
import { useState } from 'react';

const ChangePassword = () => {
  const { user } = useUserStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔐 Submitting password change...');
    console.log('User:', user);
    console.log('Form Data:', { currentPassword, newPassword, confirmPassword });

    if (!currentPassword || !newPassword || !confirmPassword) {
      console.warn('⚠️ Missing input fields');
      setMessage('Please fill in all fields.');
      setIsSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      console.warn('❗ Passwords do not match');
      setMessage('New password and confirm password do not match.');
      setIsSuccess(false);
      return;
    }

    if (!user?.token) {
      console.error('🚫 No token found in user state.');
      setMessage('You are not logged in.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('📡 Sending request to:', `${api_url}user/change-password`);

      const res = await fetch(`${api_url}user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      console.log('📬 Received response:', res.status, res.statusText);

      const contentType = res.headers.get('content-type');
      console.log('📦 Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        console.log('✅ Parsed JSON:', data);

        setLoading(false);

        if (res.ok) {
          setIsSuccess(true);
          setMessage(data.message || 'Password changed successfully.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setIsSuccess(false);
          setMessage(data.message || 'Failed to change password.');
        }
      } else {
        const text = await res.text();
        console.error('❌ Unexpected response (not JSON):', text);
        setLoading(false);
        setIsSuccess(false);
        setMessage('Unexpected response format. Please try again.');
      }
    } catch (error) {
      console.error('💥 Request error:', error);
      setLoading(false);
      setIsSuccess(false);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
      {message && (
        <p className={`mb-3 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
