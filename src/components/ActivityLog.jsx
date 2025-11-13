import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';

const ActivityLog = ({ boardId, isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, tasks, columns, members

  useEffect(() => {
    if (isOpen && boardId) {
      fetchActivities();
    }
  }, [isOpen, boardId, filter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call
      // const res = await authAxios.get(`/boards/${boardId}/activity?filter=${filter}`);
      // setActivities(res.data.activities);
      
      // Mock data for demonstration
      const mockActivities = [
        {
          id: 1,
          user: 'John Doe',
          action: 'created',
          target_type: 'task',
          target_name: 'Fix login bug',
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 2,
          user: 'Jane Smith',
          action: 'moved',
          target_type: 'task',
          target_name: 'Update documentation',
          from: 'To Do',
          to: 'In Progress',
          timestamp: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: 3,
          user: 'John Doe',
          action: 'added',
          target_type: 'column',
          target_name: 'Testing',
          timestamp: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: 4,
          user: 'Admin User',
          action: 'invited',
          target_type: 'member',
          target_name: 'newuser@example.com',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 5,
          user: 'Jane Smith',
          action: 'completed',
          target_type: 'task',
          target_name: 'Review pull request',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 6,
          user: 'John Doe',
          action: 'commented',
          target_type: 'task',
          target_name: 'Fix login bug',
          comment: 'This needs urgent attention',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setActivities(mockActivities);
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getActivityIcon = (targetType) => {
    const iconClass = "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold";
    switch (targetType) {
      case 'task':
        return <div className={`${iconClass} bg-blue-500`}>T</div>;
      case 'column':
        return <div className={`${iconClass} bg-green-500`}>C</div>;
      case 'member':
        return <div className={`${iconClass} bg-purple-500`}>M</div>;
      default:
        return <div className={`${iconClass} bg-gray-500`}>?</div>;
    }
  };

  const getActivityMessage = (activity) => {
    const { user, action, target_type, target_name, from, to, comment } = activity;
    
    switch (action) {
      case 'created':
        return (
          <span>
            <strong>{user}</strong> created {target_type} <strong>"{target_name}"</strong>
          </span>
        );
      case 'moved':
        return (
          <span>
            <strong>{user}</strong> moved <strong>"{target_name}"</strong> from <em>{from}</em> to <em>{to}</em>
          </span>
        );
      case 'added':
        return (
          <span>
            <strong>{user}</strong> added {target_type} <strong>"{target_name}"</strong>
          </span>
        );
      case 'deleted':
        return (
          <span>
            <strong>{user}</strong> deleted {target_type} <strong>"{target_name}"</strong>
          </span>
        );
      case 'completed':
        return (
          <span>
            <strong>{user}</strong> completed task <strong>"{target_name}"</strong>
          </span>
        );
      case 'invited':
        return (
          <span>
            <strong>{user}</strong> invited <strong>{target_name}</strong> to the board
          </span>
        );
      case 'commented':
        return (
          <span>
            <strong>{user}</strong> commented on <strong>"{target_name}"</strong>
            {comment && <div className="text-sm text-gray-600 italic mt-1">"{comment}"</div>}
          </span>
        );
      case 'renamed':
        return (
          <span>
            <strong>{user}</strong> renamed {target_type} to <strong>"{target_name}"</strong>
          </span>
        );
      default:
        return (
          <span>
            <strong>{user}</strong> {action} {target_type} <strong>"{target_name}"</strong>
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon />
          <h2 className="text-lg font-semibold">Activity Log</h2>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded p-1 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Filters */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex gap-2 flex-wrap">
          {['all', 'tasks', 'columns', 'members'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HistoryIcon className="mx-auto mb-2 text-gray-400" fontSize="large" />
            <p>No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.target_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800">
                    {getActivityMessage(activity)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-500">
        Activity is tracked in real-time
      </div>
    </div>
  );
};

export default ActivityLog;

