
import { createContext, useReducer, useContext, useEffect } from "react";
import { authReducer, initialAuthState } from "./AuthReducer";
import { setAuthToken } from '../lib/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem("user");

    if (token && !state.token) {
      const user = storedUser ? JSON.parse(storedUser) : null;
      dispatch({ type: 'LOGIN', payload: { token, user } });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
    } else {
      setAuthToken(null);
    }

  }, [state.token]);



  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth state anywhere
export const useAuth = () => useContext(AuthContext);
