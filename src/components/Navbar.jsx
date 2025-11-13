import React, { useState, useRef, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './ui/Modal';
import CreateBoardForm from './CreateBoardForm';
import PendingInvitations from './PendingInvitations';
import { useApp } from '../context/AppContext';
import { getPendingInvitations } from '../services/BoardService';

const Navbar = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvitationsOpen, setIsInvitationsOpen] = useState(false);
  const [invitationsCount, setInvitationsCount] = useState(0);
  const { boards, setBoards } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogOut = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    navigate("/login");
  };

  // Fetch invitations count
  const fetchInvitationsCount = async () => {
    try {
      const invitations = await getPendingInvitations();
      setInvitationsCount(invitations.length);
    } catch (err) {
      console.error('Error fetching invitations count:', err);
    }
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchInvitationsCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchInvitationsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle when user accepts/rejects invitation
  const handleInvitationHandled = () => {
    fetchInvitationsCount();
    // Optionally refresh boards list
    window.location.href = '/'; // Reload to show new board
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="flex justify-between items-center border-b-[0.5px] bg-white border-[#E6E8EB] p-3 md:p-2 relative">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <span className="text-[#172B4D] text-lg md:text-xl font-bold">Trello</span>
          </Link>
        </div>

        {/* Desktop - Search + Create */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-4 mx-4">
          <input
            className="w-full max-w-md focus:outline-none border-[#99A3B2] border-[0.5px] p-2 rounded-sm"
            type="text"
            placeholder="Search for boards"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0C66E4] text-white px-4 py-2 rounded-sm cursor-pointer whitespace-nowrap hover:bg-[#0952b8] transition-colors"
          >
            Create
          </button>
        </div>

        {/* Mobile - Create Button Only */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="md:hidden bg-[#0C66E4] text-white px-3 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-[#0952b8] transition-colors"
        >
          + New
        </button>

        {/* Right section - Desktop */}
        <div className="hidden md:flex items-center gap-3 relative">
          {/* Invitations Button */}
          <button
            onClick={() => setIsInvitationsOpen(true)}
            className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
            title="Pending Invitations"
          >
            <MailIcon className="text-[#99A3B2]" />
            {invitationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {invitationsCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center"
            >
              <AccountCircleIcon className="text-[#99A3B2] text-3xl" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogOut}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile - Right Icons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Invitations */}
          <button
            onClick={() => setIsInvitationsOpen(true)}
            className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
            title="Pending Invitations"
          >
            <MailIcon className="text-[#99A3B2] text-xl" />
            {invitationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                {invitationsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="text-[#99A3B2]" />
            ) : (
              <MenuIcon className="text-[#99A3B2]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="p-4 space-y-3">
            {/* Search */}
            <input
              className="w-full focus:outline-none border-[#99A3B2] border p-2 rounded-sm"
              type="text"
              placeholder="Search for boards"
            />
            
            {/* Menu Links */}
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogOut}
              className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Create New Board</h2>
        <CreateBoardForm
          setBoards={setBoards}
          setIsModalOpen={setIsModalOpen}
          boards={boards}
        />
      </Modal>

      {/* Pending Invitations Sidebar */}
      <PendingInvitations
        isOpen={isInvitationsOpen}
        onClose={() => setIsInvitationsOpen(false)}
        onInvitationHandled={handleInvitationHandled}
      />
    </>
  );
};

export default Navbar;
