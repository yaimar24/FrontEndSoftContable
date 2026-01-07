import { useState } from 'react';
import type { AuthResponse, LoginData } from '../models/Auth';
import { login as loginAPI } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  const login = async (data: LoginData) => {
    const res = await loginAPI(data);
    setUser(res);
    localStorage.setItem('token', res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, login, logout };
};
