import { useState, useEffect } from 'react';
import { getPendingInvitations, handleInvitation } from '../services/BoardService';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';

const PendingInvitations = ({ isOpen, onClose, onInvitationHandled }) => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Error fetching invitations:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (invitation) => {
    setProcessingId(invitation.id);
    try {
      // Try different token field names from backend
      const token = invitation.token || invitation.invitation_token || invitation.Token;
      
      if (!token) {
        alert('Error: Invitation token is missing. Please try accepting via email link.');
        return;
      }
      
      await handleInvitation('accept', token);
      
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
      
      const boardName = invitation.board_name || invitation.boardName || invitation.board?.name || 'the board';
      alert(`Successfully joined ${boardName}!`);
      
      if (onInvitationHandled) onInvitationHandled();
    } catch (err) {
      console.error('Error accepting invitation:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitation) => {
    setProcessingId(invitation.id);
    try {
      // Try different token field names from backend
      const token = invitation.token || invitation.invitation_token || invitation.Token;
      
      if (!token) {
        alert('Error: Invitation token is missing. Please try accepting via email link.');
        return;
      }
      
      await handleInvitation('reject', token);
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
      alert('Invitation declined');
    } catch (err) {
      console.error('Error rejecting invitation:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to reject invitation. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MEMBER':
        return 'bg-blue-100 text-blue-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MailIcon fontSize="small" />
          <h2 className="text-base sm:text-lg font-semibold">Pending Invitations</h2>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded p-1 transition-colors"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Count Badge */}
      {invitations.length > 0 && (
        <div className="bg-purple-50 px-4 py-2 border-b">
          <p className="text-sm text-purple-800 font-medium">
            You have {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Invitations List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <div className="text-gray-600 text-sm sm:text-base">Loading invitations...</div>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MailIcon className="mx-auto mb-4 text-gray-400" fontSize="large" />
            <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">No pending invitations</p>
            <p className="text-gray-500 text-xs sm:text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-purple-300 transition-colors shadow-sm"
              >
                {/* Board Info */}
                <div className="mb-3">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 break-words">
                    {invitation.board_name || invitation.boardName || invitation.board?.name || 'Board Invitation'}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRoleBadgeColor(invitation.role)}`}>
                      {invitation.role || 'MEMBER'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Invited {getTimeAgo(invitation.created_at || invitation.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Inviter Info */}
                <div className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">{invitation.inviter_name || invitation.inviterName || invitation.inviter_email || invitation.inviterEmail || 'Someone'}</span>
                  <span> invited you to collaborate</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleAccept(invitation)}
                    disabled={processingId === invitation.id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    <CheckCircleIcon fontSize="small" />
                    {processingId === invitation.id ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleReject(invitation)}
                    disabled={processingId === invitation.id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    <CancelIcon fontSize="small" />
                    {processingId === invitation.id ? 'Declining...' : 'Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-500">
        Invitations expire after 7 days
      </div>
    </div>
  );
};

export default PendingInvitations;

