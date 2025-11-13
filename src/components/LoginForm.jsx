import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/RegisterationService";
import { handleInvitation } from "../services/BoardService";

const LoginForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(username, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch({
        type: "LOGIN",
        payload: { user: res.data.user, token: res.data.token },
      });

      // Check for pending invitation
      const pendingInvitation = localStorage.getItem("pendingInvitation");
      if (pendingInvitation) {
        try {
          await handleInvitation("accept", pendingInvitation);
          localStorage.removeItem("pendingInvitation");
          alert("Login successful and invitation accepted! Welcome to the board!");
        } catch (invErr) {
          console.error("Failed to accept invitation:", invErr);
        }
      }

      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[400px] mx-4 p-6 sm:p-8 rounded-2xl shadow-xl 
                 bg-white/90 backdrop-blur-md border border-gray-200 transition duration-200"
    >
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#172B4D]">
        Welcome Back
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm text-center -mt-2">
        Login to continue managing your boards
      </p>

      <div className="w-full flex flex-col gap-4">
        <input
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition"
          type="text"
          placeholder="Username"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      {error && (
        <div className="w-full bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-semibold transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C66E4] hover:bg-[#0957c3]"}`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="flex flex-col gap-2 text-sm text-gray-600 text-center">
        <div>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#0C66E4] hover:underline">
            Register
          </Link>
        </div>
        <div>
          <Link to="/forget-password" className="font-semibold text-[#0C66E4] hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
