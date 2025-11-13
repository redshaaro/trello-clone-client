import { setAuthToken } from "../lib/axios";
export const initialAuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token") || null,
};
export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const { user, token } = action.payload;

      // Save new values
      setAuthToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { ...state, user, token };
    }

    case 'UPDATE_USER': {
      const updatedUser = action.payload;
      
      // Save updated user to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return { ...state, user: updatedUser };
    }

    case 'LOGOUT':
      setAuthToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { user: null, token: null };

    default:
      return state;
  }
}
