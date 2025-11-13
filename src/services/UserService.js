import { authAxios } from "../lib/axios";

// 👉 Edit Username
export const editUsername = async (newusername) => {
  try {
    const res = await authAxios.put("/users/edit-username", { newusername:newusername });
    return res.data;
  } catch (err) {
    console.error("Error editing username:", err);
    throw err.response?.data || err.message;
  }
};

// 👉 Change Password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await authAxios.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Error changing password:", err);
    throw err.response?.data || err.message;
  }
};

// 👉 Delete Account
export const deleteAccount = async () => {
  try {
    const res = await authAxios.delete("/users/delete-account");
    return res.data;
  } catch (err) {
    console.error("Error deleting account:", err);
    throw err.response?.data || err.message;
  }
};

// 👉 Forgot Password (trigger email)
export const forgotPassword = async (email) => {
  try {
    const res = await authAxios.post("/users/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("Error sending forgot password email:", err);
    throw err.response?.data || err.message;
  }
};

// 👉 Reset Password (after clicking link in email)
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await authAxios.post("/users/reset-password", {
      token,
      newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err.response?.data || err.message;
  }
};
