import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import { deleteBoard, updateBoardName, updateBoardBackground, getBoardMembers, removeBoardMember, changeMemberRole, leaveBoard } from '../services/BoardService';
import { useNavigate } from 'react-router-dom';

import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableColumn from '../components/SortableColumn';
import BoardCard from '../components/BoardCard';
import { useBoard } from '../hooks/useBoard';
import { useDragHandlers } from '../hooks/useDragHandlers';
import { useEffect, useState } from 'react';
import { fetchboardname, fetchBoardColumnsWithTasks } from '../services/BoardService';
import SimpleModal from '../components/ui/SimpleModal';
import CreateColumnForm from '../components/CreateColumnForm';
import InviteMemberForm from '../components/InviteMemberForm';
import { useAuth } from '../context/AuthContext';


const Board = () => {
  const { columns, setColumns, boardId, isLoading: boardLoading, error: boardError } = useBoard();
  const { state } = useAuth();
  const [boardname, setBoardName] = useState("")
  const [boardBackground, setBoardBackground] = useState("https://images.unsplash.com/photo-1503264116251-35a269479413")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [tempBoardName, setTempBoardName] = useState("");
  
  // Member management
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardOwner, setBoardOwner] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredColumns, setFilteredColumns] = useState([]);

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(boardId);
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Error deleting board:", err);
      alert("Failed to delete board. Please try again.");
    }
  };

  const handleRenameboard = async () => {
    if (!tempBoardName.trim()) {
      setIsEditingBoardName(false);
      return;
    }

    try {
      await updateBoardName(boardId, tempBoardName);
      setBoardName(tempBoardName);
      setIsEditingBoardName(false);
    } catch (err) {
      console.error("Error renaming board:", err);
      alert("Failed to rename board.");
    }
  };

  const handleBackgroundChange = async (newBackground) => {
    try {
      await updateBoardBackground(boardId, newBackground);
      setBoardBackground(newBackground);
      setIsBackgroundModalOpen(false);
    } catch (err) {
      console.error("Error updating background:", err);
      alert("Failed to update background.");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeBoardMember(boardId, userId);
      setBoardMembers(prevMembers => prevMembers.filter(m => m.user?.id !== userId));
      alert("Member removed successfully");
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Failed to remove member: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await changeMemberRole(boardId, userId, newRole);
      setBoardMembers(prevMembers => 
        prevMembers.map(m => 
          m.user?.id === userId ? { ...m, role: newRole } : m
        )
      );
      alert(`Role updated to ${newRole}`);
    } catch (err) {
      console.error("Error changing role:", err);
      alert("Failed to change role: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLeaveBoard = async () => {
    if (!confirm("Are you sure you want to leave this board?")) return;
    
    try {
      await leaveBoard(boardId);
      alert("You have left the board");
      navigate("/");
    } catch (err) {
      console.error("Error leaving board:", err);
      alert("Failed to leave board.");
    }
  };

  const isOwner = state.user?.id === boardOwner;
  
  
  // Permission checks
  const canEdit = currentUserRole !== 'VIEWER'; // VIEWER can only view
  const canAddColumn = canEdit; // Members, Admins, and Owner can add columns






  // Fetch board details and members
  useEffect(() => {
    const getBoardDetails = async () => {
      try {
        const res = await fetchboardname(boardId);
        const board = res.data.board;
         
        setBoardName(board.name);
       
        setBoardOwner(board.user_id);
        
        // Set background if available
        if (board.background_url) {
          setBoardBackground(board.background_url);
        }
      } catch (err) {
        console.error("Error fetching board details:", err);
      }
    };

    const fetchMembers = async () => {
      try {
        const members = await getBoardMembers(boardId);
         
        setBoardMembers(members);
        
        // Find current user's role
        const currentUser = members.find(m => m.user?.id === state.user?.id);
        
        if (currentUser) {
          setCurrentUserRole(currentUser.role || 'MEMBER');
        } else if (state.user?.id === boardOwner) {
          setCurrentUserRole('OWNER');
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    getBoardDetails();
    fetchMembers();
  }, [boardId, state.user?.id, boardOwner]);

  // Real-time polling for board updates (every 5 seconds)
  useEffect(() => {
    // Don't poll if board is still loading or has an error
    if (boardLoading || boardError) return;

    const pollInterval = setInterval(async () => {
      try {
        const updatedColumns = await fetchBoardColumnsWithTasks(boardId);
        const sortedColumns = updatedColumns.sort((a, b) => a.position - b.position);
        
        // Only update if there are actual changes
        if (JSON.stringify(sortedColumns) !== JSON.stringify(columns)) {
          setColumns(sortedColumns);
        }
      } catch (err) {
        // If we get a 403 or 404, stop polling
        if (err.response?.status === 403 || err.response?.status === 404) {
          console.error("Access denied or board not found. Stopping polling.");
          clearInterval(pollInterval);
          return;
        }
        // Only log other errors, don't spam console
        if (err.response?.status !== 403 && err.response?.status !== 404) {
          console.error("Error polling board updates:", err);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [boardId, columns, setColumns, boardLoading, boardError]);

  // Search/filter functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredColumns(columns);
      return;
    }

    const filtered = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(column => column.tasks.length > 0);

    setFilteredColumns(filtered);
  }, [searchTerm, columns]);

  const {
    activeTask,
    activeColumn,
    handleDragStart,
    handleDragEnd
  } = useDragHandlers(columns, setColumns);

  const sensors = useSensors(useSensor(PointerSensor));


  const displayedColumns = searchTerm ? filteredColumns : columns;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("${boardBackground}")`,
      }}
    >
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/50 p-3 sm:p-4 gap-3'>
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {isEditingBoardName ? (
            <input
              type="text"
              value={tempBoardName}
              onChange={(e) => setTempBoardName(e.target.value)}
              onBlur={handleRenameboard}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameboard()}
              autoFocus
              className="text-lg sm:text-2xl font-bold px-2 py-1 rounded w-full"
            />
          ) : (
            <div 
              className={`text-white text-xl sm:text-2xl md:text-3xl px-2 py-1 rounded truncate ${isOwner ? 'cursor-pointer hover:bg-white/20' : 'cursor-default'}`}
              onClick={() => {
                if (isOwner) {
                  setTempBoardName(boardname);
                  setIsEditingBoardName(true);
                }
              }}
              title={isOwner ? 'Click to rename' : 'Only Owner can rename'}
            >
              {boardname}
            </div>
          )}
        </div>
        
        <div className='flex items-center gap-2 sm:gap-3 flex-wrap'>
          {/* Search - Hidden on small mobile, visible on larger screens */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 rounded text-sm w-32 md:w-48"
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
          </div>

          {/* Background Change */}
          <div 
            onClick={() => setIsBackgroundModalOpen(true)} 
            className='text-white cursor-pointer hover:bg-white/20 p-2 rounded' 
            title="Change Background"
          >
            <ImageIcon className='text-2xl' />
          </div>

          {/* Add Column - Only for non-viewers */}
          {canAddColumn && (
            <>
              <div onClick={() => setIsModalOpen(true)} className='text-white cursor-pointer hover:bg-white/20 p-2 rounded' title="Add Column">
                <AddCircleIcon className='text-2xl' />
              </div>
              
          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">Create New Column</h2>
                <CreateColumnForm boardId={boardId} setIsModalOpen={setIsModalOpen} setColumns={setColumns} columns={columns} />
              </SimpleModal>
            </>
          )}

          {/* Settings */}
          <div
            className="text-white cursor-pointer hover:bg-white/20 p-2 rounded"
  onClick={() => setIsSettingsModalOpen(true)}
            title="Board Settings"
>
            <SettingsIcon className="text-2xl" />
</div>






        </div>


      </div>

      <div className="p-3 sm:p-4 md:p-6 overflow-x-auto">
        {boardLoading ? (
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-white mx-auto mb-4"></div>
              <div className="text-white text-lg sm:text-xl">Loading board...</div>
            </div>
          </div>
        ) : boardError ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className={`border px-8 py-6 rounded-lg max-w-lg text-center shadow-lg ${
              boardError.includes('Access Denied') || boardError.includes('permission')
                ? 'bg-yellow-50 border-yellow-400 text-yellow-900'
                : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              <div className="text-5xl mb-4">
                {boardError.includes('Access Denied') ? '🔒' : '❌'}
              </div>
              <p className="font-bold text-xl mb-3">
                {boardError.includes('Access Denied') ? 'Access Denied' : 'Error Loading Board'}
              </p>
              <p className="mb-4">{boardError}</p>
              {boardError.includes('Access Denied') ? (
                <p className="text-sm mb-4">Redirecting to home page...</p>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        ) : searchTerm && filteredColumns.length === 0 ? (
          <div className="text-white text-center text-xl mt-10">
            No tasks found matching "{searchTerm}"
          </div>
        ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
            {displayedColumns && displayedColumns.length > 0 ? (
            <SortableContext
                items={displayedColumns.map(col => `column-${col.id}`)}
              strategy={horizontalListSortingStrategy}
            >
                <div className="flex gap-3 sm:gap-4 md:gap-6 w-max pb-4">
                  {displayedColumns.map(col => (
                    <SortableColumn
                      setColumns={setColumns}
                      key={`column-${col.id}`}
                      id={`column-${col.id}`}
                      title={col.name}
                      tasks={col.tasks}
                      canEdit={canEdit}
                    />
                  ))}
                </div>
            </SortableContext>
            ) : (
              <div className="text-white text-center text-base sm:text-lg md:text-xl mt-10 px-4">
                No columns yet. Click + to add one!
              </div>
            )}


          <DragOverlay>
            {activeTask ? (
              <BoardCard id={activeTask.id} title={activeTask.title} isDragging />
            ) : activeColumn ? (
              <div className="w-64 bg-gray-100 rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg">{activeColumn.name}</h3>
                <div className="mt-2 space-y-2">
                  {activeColumn.tasks?.map(task => (
                    <BoardCard key={task.id} id={task.id} title={task.title} />
                  ))}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        )}
      </div>
      <SimpleModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Delete Board</h2>
        <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteBoard}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </SimpleModal>
      <SimpleModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
  <h2 className="text-xl font-bold mb-4">Board Settings</h2>

        {/* Board Name */}
  <div className="mb-6">
    <label className="block text-sm font-medium mb-2">Board Name</label>
          <div className="text-gray-700 text-lg">{boardname}</div>
          <p className="text-xs text-gray-500 mt-1">Click the board title above to rename.</p>
  </div>

        {/* Manage Members */}
 <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Members ({boardMembers.length})</h3>
          
          {/* Display actual members */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {boardMembers.length > 0 ? (
              boardMembers.map((member) => (
                <div key={member.user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                      {member.username?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {member.username || member.email}
                         
                        {member.user.id === boardOwner && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Role selector for owner/admin */}
                        {isOwner && member.user.id !== boardOwner ? (
                          <select
                            value={member.role || 'MEMBER'}
                            onChange={(e) => handleChangeRole(member.user.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1 bg-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {member.role || 'Member'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isOwner && member.user.id !== boardOwner && (
                    <button
                      onClick={() => handleRemoveMember(member.user.id)}
                      className="ml-2 text-red-600 hover:bg-red-50 hover:text-red-800 text-sm px-3 py-1.5 rounded transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-4">No members yet</div>
            )}
  </div>

  {/* Invite form */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Invite New Member</h4>
            <InviteMemberForm 
              boardId={boardId} 
              onSuccess={() => {
                // Refresh members list after successful invite
                getBoardMembers(boardId).then(setBoardMembers);
              }}
            />
          </div>
</div>

        {/* Danger Zone */}
  <div className="border-t pt-4">
    <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          
          {isOwner ? (
            <>
    <p className="text-sm text-gray-600 mb-3">
                Once you delete a board, there is no going back. All data will be permanently lost.
    </p>
    <button
      onClick={handleDeleteBoard}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
    >
      Delete Board
    </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Leave this board. You can be re-invited later if needed.
              </p>
              <button
                onClick={handleLeaveBoard}
                className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                Leave Board
              </button>
            </>
          )}
        </div>
      </SimpleModal>

      {/* Background Selection Modal */}
      <SimpleModal isOpen={isBackgroundModalOpen} onClose={() => setIsBackgroundModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Choose Background</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "https://images.unsplash.com/photo-1503264116251-35a269479413",
            "https://images.unsplash.com/photo-1557683316-973673baf926",
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
            "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5"
          ].map((bg, idx) => (
            <div
              key={idx}
              onClick={() => handleBackgroundChange(bg)}
              className="h-24 bg-cover bg-center rounded cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
              style={{ backgroundImage: `url("${bg}")` }}
            />
          ))}
        </div>
        
        {/* Custom URL input */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Or enter custom URL:</label>
          <input
            type="text"
            placeholder="https://..."
            className="w-full border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                handleBackgroundChange(e.target.value);
              }
            }}
          />
  </div>
</SimpleModal>
    </div>
  );
};

export default Board;