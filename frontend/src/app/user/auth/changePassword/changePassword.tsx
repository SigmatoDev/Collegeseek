import { useUserStore } from '@/Store/userStore';
import { api_url } from '@/utils/apiCall';
import { useState } from 'react';

const ChangePassword = () => {
  const { user } = useUserStore(); // token, id, etc.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
  
    if (!user?.token) {
      setMessage('You are not logged in.');
      console.log("No token provided in the user state.");
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const res = await fetch(`${api_url}user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Ensure the token is correct
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
  
      // Check if the response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        console.log("API response data:", data);
  
        setLoading(false); // Stop loading
  
        if (res.ok) {
          setMessage(data.message || 'Password changed successfully.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setMessage(data.message || 'Failed to change password.');
        }
      } else {
        // If the response isn't JSON, handle it as an error
        setLoading(false);
        setMessage('Something went wrong. Please try again later.');
        console.error('Expected JSON, but got HTML instead. Maybe API route is incorrect.');
      }
    } catch (err) {
      setLoading(false); // Stop loading
      console.error('Error:', err);
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
      {message && <p className="text-red-600 mb-3">{message}</p>}
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
