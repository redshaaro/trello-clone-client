import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    boardsOwned: 0,
    boardsMember: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    // Fetch user statistics from boards
    // This would typically come from an API call
    // For now, we can get it from the context or local storage
    const storedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    setUserStats({
      boardsOwned: storedBoards.ownedBoards?.length || 0,
      boardsMember: storedBoards.invitedBoards?.length || 0,
      totalTasks: 0, // This would require fetching all tasks
    });
  }, []);

  const getInitials = (username) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
          
          {/* Profile Info */}
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 sm:-mt-16 mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                {/* Avatar */}
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-4xl sm:text-5xl shadow-xl border-4 border-white">
                  {getInitials(state.user?.username)}
                </div>
                
                {/* User Details */}
                <div className="sm:mt-16">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {state.user?.username || "User"}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <EmailIcon fontSize="small" />
                    <span className="text-sm sm:text-base truncate max-w-[250px]">{state.user?.email || "No email"}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={() => navigate("/settings")}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <EditIcon fontSize="small" />
                Edit Profile
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                    Boards Owned
                  </span>
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <PersonIcon fontSize="small" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {userStats.boardsOwned}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
                    Member Of
                  </span>
                  <div className="bg-purple-600 text-white p-2 rounded-lg">
                    <PersonIcon fontSize="small" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {userStats.boardsMember}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
                    Total Boards
                  </span>
                  <div className="bg-green-600 text-white p-2 rounded-lg">
                    <PersonIcon fontSize="small" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {userStats.boardsOwned + userStats.boardsMember}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PersonIcon className="text-blue-600" />
            Account Information
          </h2>

          <div className="space-y-6">
            {/* Username */}
            <div className="border-b border-gray-200 pb-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Username
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {state.user?.username || "Not set"}
              </p>
            </div>

            {/* Email */}
            <div className="border-b border-gray-200 pb-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Email Address
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {state.user?.email || "Not set"}
              </p>
            </div>

            {/* User ID */}
            <div className="border-b border-gray-200 pb-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                User ID
              </label>
              <p className="text-lg text-gray-600 mt-1 font-mono">
                {state.user?.id || "N/A"}
              </p>
            </div>

            {/* Member Since */}
            <div className="pb-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <CalendarTodayIcon fontSize="small" />
                Member Since
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {formatDate(state.user?.created_at)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Update Settings
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Back to Boards
            </button>
          </div>
        </div>

        {/* Activity Summary Card (Future Enhancement) */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-12 text-gray-500">
            <HistoryIcon className="text-gray-400 text-6xl mb-4" />
            <p className="text-lg">Activity tracking coming soon!</p>
            <p className="text-sm mt-2">
              You'll be able to see your recent board activities here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

