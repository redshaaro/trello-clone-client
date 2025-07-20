import { setAuthToken } from "../lib/axios";


export const initialAuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

export function authReducer(state, action) {
  switch (action.type) {
    
    case 'LOGIN':
      setAuthToken(state.token)
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      setAuthToken(null)

      return { user: null, token: null };
    default:
      return state;
  }
}
