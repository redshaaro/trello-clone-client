
import { useState } from "react";
import { inviteToBoard } from "../services/BoardService"; 

const InviteMemberForm = ({ boardId, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("VIEWER");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email) return alert("Please enter an email");

        try {
            setLoading(true);
            await inviteToBoard(boardId, email, role);
            alert("Invitation sent!");
            setEmail("");
            setRole("VIEWER");
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error sending invite:", err);
            alert(err.response?.data?.message || "Failed to send invite");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleInvite} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Invite by Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="user@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="VIEWER">Viewer</option>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Invite"}
            </button>
        </form>
    );
};

export default InviteMemberForm;
