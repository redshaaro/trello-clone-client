import { useState } from "react";
import { createTask } from "../services/BoardService";

const CreateTaskForm = ({ setIsModalOpen, columnId, setColumns }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await createTask({
                title,
                description,
                status,
                column_id: columnId
            });



            // Update state with the new task
            setColumns(prevColumns => {


                return prevColumns.map(column => {



                    if (String(column.id) === String(columnId)) {



                        const newTask = res.data?.createdtask || res.data || res;
                        console.log("New Task:", newTask);

                        return {
                            ...column,
                            tasks: [
                                ...column.tasks,
                                {
                                    id: newTask.id,
                                    title: newTask.title,
                                    description: newTask.description,
                                    status: newTask.status,
                                    position: newTask.position
                                }
                            ]
                        };
                    }
                    return column;
                });
            });

            setIsModalOpen(false);
        } catch (err) {
            console.error("Error creating task:", err);
            setError(err.response?.data?.message || "Failed to create task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
                disabled={isLoading}
            />
            <input
                type="text"
                placeholder="Enter Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={isLoading}
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={isLoading}
            >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
                type="submit"
                className="bg-[#0C66E4] text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={isLoading || !title.trim()}
            >
                {isLoading ? "Creating..." : "Create Task"}
            </button>
        </form>
    );
};

export default CreateTaskForm;