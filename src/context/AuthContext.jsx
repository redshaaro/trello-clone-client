 
import { createContext, useReducer, useContext, useEffect } from "react";
import { authReducer, initialAuthState } from "./AuthReducer";
  import { setAuthToken } from '../lib/axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !state.token) {
      
      dispatch({ type: 'LOGIN', payload: { token, user: null } });
    }
  }, []);

useEffect(() => {
  if (state.token) {
    setAuthToken(state.token);
  } else {
    setAuthToken(null);  
  }

}, [state.token]);
console.log("Auth token set to:", state.token);


  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth state anywhere
export const useAuth = () => useContext(AuthContext);
