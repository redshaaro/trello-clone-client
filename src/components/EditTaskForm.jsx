import { useState, useEffect } from "react";
import { editTask, deleteTask } from "../services/BoardService";
import { 
  getTaskById, 
  getTaskComments, 
  addTaskComment, 
  deleteTaskComment,
  getTaskLabels,
  addTaskLabel,
  removeTaskLabel,
  getTaskAssignees
} from "../services/TaskService";
import { Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SimpleModal from "./ui/SimpleModal";
import { useAuth } from "../context/AuthContext";


const EditTaskForm = ({ taskId, setIsModalOpen, setColumns, canEdit = true }) => {
    const { state } = useAuth();
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     

    // UI states
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    
    // Real data
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    console.log(newComment)
    const [labels, setLabels] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState("#3B82F6");
    const [showLabelForm, setShowLabelForm] = useState(false);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const [taskRes, commentsData, labelsData, assigneesData] = await Promise.all([
                    getTaskById(taskId),
                    getTaskComments(taskId),
                    getTaskLabels(taskId),
                    getTaskAssignees(taskId)
                ]);

                const task = taskRes.data?.task || taskRes.task || taskRes.data || taskRes;
                
                setTaskData(task);
                setComments(commentsData);
                setLabels(labelsData);
                setAssignees(assigneesData);
            } catch (err) {
                console.error("Failed to fetch task:", err.response?.data || err.message);
                setError(`Failed to load task details: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (taskId) {
            fetchTaskData();
        } else {
            setError("No task ID provided");
            setIsLoading(false);
        }
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await editTask(taskId, {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                due_date: taskData.due_date,
            });

            setColumns((prevCols) =>
                prevCols.map((col) => ({
                    ...col,
                    tasks: col.tasks.map((t) =>
                        t.id === (res.data?.editedtask?.id || res.editedtask?.id || taskId) 
                          ? { ...t, ...taskData } 
                          : t
                    ),
                }))
            );

            setIsModalOpen(false);
        } catch (err) {
            console.error("Error editing task:", err);
            setError(err.response?.data?.message || "Failed to edit task");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const comment = await addTaskComment(taskId, newComment);
            
            // Add the new comment to state with proper user data
            setComments([...comments, { 
                ...comment, 
                user: comment.user || state.user, // Use returned user object or current user
                created_at: comment.created_at || new Date().toISOString()
            }]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteTaskComment(taskId, commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError("Failed to delete comment");
        }
    };

    const handleAddLabel = async () => {
        if (!newLabelName.trim()) return;

        try {
            const label = await addTaskLabel(taskId, { name: newLabelName, color: newLabelColor });
            setLabels([...labels, label]);
            setNewLabelName("");
            setNewLabelColor("#3B82F6");
            setShowLabelForm(false);
        } catch (err) {
            console.error("Error adding label:", err);
            setError("Failed to add label");
        }
    };

    const handleRemoveLabel = async (labelId) => {
        try {
            await removeTaskLabel(taskId, labelId);
            setLabels(labels.filter(l => l.id !== labelId));
        } catch (err) {
            console.error("Error removing label:", err);
            setError("Failed to remove label");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);

            // update state to remove task
            setColumns((prevCols) =>
                prevCols.map((col) => ({
                    ...col,
                    tasks: col.tasks.filter((t) => String(t.id) !== String(id)),
                }))
            );

            setIsDeleteModalOpen(false);
            setIsModalOpen(false); // close edit modal as task no longer exists
        } catch (err) {
            console.error("Error deleting task:", err);
            setError(err.response?.data?.message || "Failed to delete task");
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading task...</div>;
    if (!taskData) return <div className="text-center py-8">No task found</div>;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return "";
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Title */}
            <div className="flex justify-between items-center">
                {isEditingTitle && canEdit ? (
                    <input
                        type="text"
                        value={taskData.title || ""}
                        onChange={(e) =>
                            setTaskData({ ...taskData, title: e.target.value })
                        }
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                        autoFocus
                        className="text-xl font-bold w-full border-b border-gray-300 focus:outline-none"
                    />
                ) : (
                    <h2
                        className={`text-xl font-bold p-1 rounded ${canEdit ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        onClick={() => canEdit && setIsEditingTitle(true)}
                    >
                        {taskData.title}
                    </h2>
                )}
                {canEdit && (
                    <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <DeleteIcon />
                    </button>
                )}
            </div>

            {/* Labels */}
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <LabelIcon fontSize="small" />
                    Labels
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {labels.map((label) => (
                        <div
                            key={label.id}
                            className="px-3 py-1 rounded-full text-white text-sm flex items-center gap-2"
                            style={{ backgroundColor: label.color }}
                        >
                            <span>{label.name}</span>
                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLabel(label.id)}
                                    className="hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {canEdit && showLabelForm ? (
                    <div className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                        <input
                            type="text"
                            placeholder="Label name"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <input
                            type="color"
                            value={newLabelColor}
                            onChange={(e) => setNewLabelColor(e.target.value)}
                            className="w-10 h-8 cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={handleAddLabel}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowLabelForm(false)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                ) : canEdit ? (
                    <button
                        type="button"
                        onClick={() => setShowLabelForm(true)}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        + Add Label
                    </button>
                ) : null}
            </div>

            {/* Description */}
            <div>
                <h3 className="font-semibold mb-2">Description</h3>
                {isEditingDescription && canEdit ? (
                    <textarea
                        value={taskData.description || ""}
                        onChange={(e) =>
                            setTaskData({ ...taskData, description: e.target.value })
                        }
                        onBlur={() => setIsEditingDescription(false)}
                        autoFocus
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                    />
                ) : (
                    <p
                        className={`p-2 rounded text-gray-700 ${canEdit ? 'cursor-pointer hover:bg-gray-100' : 'bg-gray-50'}`}
                        onClick={() => canEdit && setIsEditingDescription(true)}
                    >
                        {taskData.description || (canEdit ? "Add a more detailed description..." : "No description")}
                    </p>
                )}
            </div>

            {/* Due Date */}
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" />
                    Due Date
                </h3>
                <input
                    type="date"
                    value={formatDate(taskData.due_date)}
                    onChange={(e) =>
                        setTaskData({ ...taskData, due_date: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={!canEdit}
                />
                {taskData.due_date && (
                    <div className="text-xs text-gray-500 mt-1">
                        Due {new Date(taskData.due_date).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Status */}
            <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <select
                    value={taskData.status}
                    onChange={(e) =>
                        setTaskData({ ...taskData, status: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={!canEdit}
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Assignees */}
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <PersonAddIcon fontSize="small" />
                    Assignees
                </h3>
                <div className="flex flex-wrap gap-2">
                    {assignees.length > 0 ? (
                        assignees.map((assignee) => (
                            <div
                                key={assignee.id}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                            >
                                <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                    {assignee.username?.[0]?.toUpperCase() || assignee.email?.[0]?.toUpperCase()}
                                </Avatar>
                                <span className="text-sm">{assignee.username || assignee.email}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500">No assignees yet</div>
                    )}
                </div>
            </div>

            {/* Comments */}
            <div>
                <h3 className="font-semibold mb-3">Activity & Comments ({comments.length})</h3>
                
                {/* Add comment input - Only for editors */}
                {canEdit && (
                    <div className="mb-4">
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="2"
                        />
                        <button
                            type="button"
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Comment
                        </button>
                    </div>
                )}

                {/* Display comments */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {comments.length > 0 ? (
                        comments.map((comment) => {
                            // Handle both string and object formats for comment.user
                            const userName = typeof comment.user === 'object' 
                                ? (comment.user?.username || comment.user?.email || 'User')
                                : (comment.user || 'User');
                            
                            const userInitial = userName?.[0]?.toUpperCase() || 'U';
                            
                            // For delete permission check
                            const isOwnComment = typeof comment.user === 'object'
                                ? (comment.user?.id === state.user?.id)
                                : (comment.user === (state.user?.username || state.user?.email));
                            
                            return (
                                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                                                {userInitial}
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-sm">{userName}</div>
                                                <div className="text-xs text-gray-500">{getTimeAgo(comment.created_at)}</div>
                                            </div>
                                        </div>
                                        {isOwnComment && canEdit && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-600 hover:text-red-800 text-xs"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm mt-2 ml-10">{comment.content || comment.text}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-4">No comments yet</div>
                    )}
                </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}
            
            {/* Save button - Only for editors */}
            {canEdit && (
                <button
                    type="submit"
                    className="bg-[#0C66E4] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0957c3] transition"
                >
                    Save Changes
                </button>
            )}
              

           


        </form>
        <SimpleModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
  <h2 className="text-xl font-bold mb-4">
    Are you sure you want to delete this task?
  </h2>
  <div className="flex items-center justify-around">
    <button
      onClick={() => handleDelete(taskId)}
      className="hover:bg-[#091e420f] w-full text-left p-2 rounded text-red-600"
    >
      Yes
    </button>
    <button
      onClick={() => setIsDeleteModalOpen(false)}
      className="hover:bg-[#091e420f] w-full text-left p-2 rounded text-[#172b4d]"
    >
      No
    </button>
  </div>
</SimpleModal>
</>
    );
};

export default EditTaskForm;
