import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { handleInvitation } from "../services/BoardService";
import { useAuth } from "../context/AuthContext";

export default function InvitationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { state } = useAuth();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    const onHandleInvitation = async (action) => {
        try {
            const data = await handleInvitation(action, token);
            setStatus("success");
            setMessage(data.message);
            
            // If accepted, redirect to home after 2 seconds
            if (action === "accept") {
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No invitation token found.");
            return;
        }

        // Store the invitation token for after registration/login
        if (!state.token) {
            localStorage.setItem("pendingInvitation", token);
        }

        setStatus("idle");
    }, [token, state.token]);

    // Check if user is logged in
    const isLoggedIn = state.token;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-4">📬</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Board Invitation</h1>
                    <p className="text-gray-600">You've been invited to collaborate!</p>
                </div>

                {status === "loading" && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing invitation...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-700 font-semibold">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-700 font-semibold">{message}</p>
                        <p className="text-green-600 text-sm mt-2">Redirecting to your boards...</p>
                    </div>
                )}

                {status === "idle" && (
                    <>
                        {/* User is NOT logged in */}
                        {!isLoggedIn ? (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800 font-medium mb-2">
                                        ⚠️ You need an account to accept this invitation
                                    </p>
                                    <p className="text-yellow-700 text-sm">
                                        Please register or login to join the board.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        to="/register"
                                        className="block w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition"
                                    >
                                        Create Account
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold text-center hover:bg-gray-200 transition"
                                    >
                                        Login to Existing Account
                                    </Link>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    The invitation will be automatically accepted after you register or login
                                </p>
                            </div>
                        ) : (
                            /* User IS logged in */
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-800 font-medium">
                                        Ready to join the board!
                                    </p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Click below to accept or decline the invitation.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onHandleInvitation("accept")}
                                        className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        onClick={() => onHandleInvitation("decline")}
                                        className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                                    >
                                        ✗ Decline
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
