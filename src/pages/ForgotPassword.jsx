import React, { useState } from "react";
import { forgotPassword } from "../services/UserService"; // create this

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage("✅ If this email is registered, you'll receive a reset link.");
    } catch {
      setMessage("❌ Something went wrong, try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-lg bg-white">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center max-w-md">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
