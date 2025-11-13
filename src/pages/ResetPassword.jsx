import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/UserService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage("✅ Password has been reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMessage("❌ Invalid or expired link.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-lg bg-white">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition-colors font-semibold">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center max-w-md">{message}</p>}
    </div>
  );
};

export default ResetPassword;
