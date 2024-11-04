import { atom, selector } from "recoil";
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  role: string;
  // Add other properties from your JWT token here
}

export const authTokenState = atom<string | null>({
  key: 'authTokenState',
  default: sessionStorage.getItem('authToken'),
});

export const isAuthenticatedState = selector<boolean>({
  key: 'isAuthenticatedState',
  get: ({get}) => {
    const token = get(authTokenState);
    return !!token;
  },
});

export const userRoleState = selector<string | null>({
  key: 'userRoleState',
  get: ({get}) => {
    const token = get(authTokenState);
    if (!token) return null;
    
    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      if (['admin', 'superadmin', 'employee'].includes(decodedToken.role)) {
        return decodedToken.role;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    return null;
  },
});