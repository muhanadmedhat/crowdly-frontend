import { createContext } from 'react';
import type { UserProfileResponse } from '../services/users';

export interface AuthContextType {
  user: UserProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, user: UserProfileResponse) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
