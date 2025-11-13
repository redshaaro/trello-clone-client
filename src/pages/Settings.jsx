import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { editUsername, changePassword, deleteAccount } from "../services/UserService";

const Settings = () => {
  const { dispatch, state } = useAuth();
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👉 Edit Username
  const handleEditUsername = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await editUsername(newUsername);
      
      // Update the AuthContext with new username
      dispatch({
        type: "UPDATE_USER",
        payload: {
          ...state.user,
          username: newUsername
        }
      });
      
      setMessage("✅ " + (res.message || "Username updated successfully!"));
      setNewUsername("");
    } catch (err) {
      console.error("Error updating username:", err);
      setMessage("❌ " + (err.error || err.message || "Failed to update username"));
    } finally {
      setIsLoading(false);
    }
  };

  // 👉 Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(oldPassword, newPassword);
      setMessage(res.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.error || err);
    }
  };

  // 👉 Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteAccount();
      dispatch({ type: "LOGOUT" });
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      setMessage(err.error || err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-6 md:mt-10 p-4 sm:p-6 bg-white shadow-md rounded-xl mx-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#172B4D]">User Settings ⚙️</h2>
      {message && <p className="mb-4 text-sm sm:text-base text-blue-600">{message}</p>}

      {/* Username Form */}
      <form onSubmit={handleEditUsername} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Username
        </label>
        <div className="text-xs text-gray-500 mb-1">
          Current: <span className="font-semibold">{state.user?.username}</span>
        </div>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg mb-2"
          placeholder="Enter new username"
          required
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-[#0C66E4] text-white px-4 py-2 rounded-lg hover:bg-[#0952b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Updating...
            </>
          ) : (
            "Update Username"
          )}
        </button>
      </form>

      {/* Password Form */}
      <form onSubmit={handleChangePassword} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Old Password
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg mb-2"
          required
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg mb-2"
          required
        />
        <button type="submit" className="bg-[#0C66E4] text-white px-4 py-2 rounded-lg">
          Change Password
        </button>
      </form>

      {/* Delete Account */}
      <button
        onClick={handleDeleteAccount}
        className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Delete Account ❌
      </button>
    </div>
  );
};

export default Settings;
