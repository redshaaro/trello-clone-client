import { useState, useEffect } from "react";
import { getTaskById, editTask, deleteTask } from "../services/BoardService";
import { Avatar } from "@mui/material"; // for dummy assignees
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleModal from "./ui/SimpleModal";


const EditTaskForm = ({ taskId, setIsModalOpen, setColumns }) => {
    const [taskData, setTaskData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    // UI states
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    // Dummy data
    const dummyAssignees = [
        { id: 1, name: "Alice", initials: "A" },
        { id: 2, name: "Bob", initials: "B" },
    ];
    const dummyComments = [
        { id: 1, user: "Alice", text: "Don’t forget to update docs!", date: "2h ago" },
        { id: 2, user: "Bob", text: "I’ll review after lunch.", date: "1h ago" },
    ];

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await getTaskById(taskId);

                setTaskData(res.data.task);
            } catch (err) {
                console.error("Failed to fetch task:", err);
                setError("Failed to load task details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);
    console.log(taskData)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await editTask(taskId, {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
            });

            setColumns((prevCols) =>
                prevCols.map((col) => ({
                    ...col,
                    tasks: col.tasks.map((t) =>
                        t.id === res.data.editedtask.id ? res.data.editedtask : t
                    ),
                }))
            );

            setIsModalOpen(false);
        } catch (err) {
            console.error("Error editing task:", err);
            setError(err.response?.data?.message || "Failed to edit task");
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

    if (isLoading) return <div>Loading task...</div>;
    if (!taskData) return <div>No task found</div>;

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="flex justify-between items-center">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={taskData.title || ""}
                        onChange={(e) =>
                            setTaskData({ ...taskData, title: e.target.value })
                        }
                        onBlur={() => setIsEditingTitle(false)}
                        autoFocus
                        className="text-xl font-bold w-full border-b border-gray-300 focus:outline-none"
                    />
                ) : (
                    <h2
                        className="text-xl font-bold cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {taskData.title}
                    </h2>
                )}
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-600 hover:text-red-800"
                >
                    <DeleteIcon />
                </button>
            </div>

            {/* Description */}
            <div>
                <h3 className="font-semibold mb-2">Description</h3>
                {isEditingDescription ? (
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
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-gray-700"
                        onClick={() => setIsEditingDescription(true)}
                    >
                        {taskData.description || "Add a more detailed description..."}
                    </p>
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
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Assignees (dummy) */}
            <div>
                <h3 className="font-semibold mb-2">Assignees</h3>
                <div className="flex gap-2">
                    {dummyAssignees.map((a) => (
                        <div
                            key={a.id}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                        >
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                {a.initials}
                            </Avatar>
                            <span className="text-sm">{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments (dummy) */}
            <div>
                <h3 className="font-semibold mb-2">Comments</h3>
                <div className="space-y-3">
                    {dummyComments.map((c) => (
                        <div key={c.id} className="bg-gray-50 p-2 rounded">
                            <p className="text-sm">
                                <span className="font-semibold">{c.user}</span> – {c.text}
                            </p>
                            <p className="text-xs text-gray-500">{c.date}</p>
                        </div>
                    ))}
                </div>
                <textarea
                    placeholder="Write a comment..."
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    rows="2"
                />
                <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                    Add Comment
                </button>
            </div>

            {error && <div className="text-red-500">{error}</div>}
            

                <button
                    type="submit"
                    className="bg-[#0C66E4] text-white px-4 py-2 rounded cursor-pointer"
                >
                    Save Changes
                </button>
              

           


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
