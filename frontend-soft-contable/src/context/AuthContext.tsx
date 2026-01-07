import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string, expiration: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const expiration = localStorage.getItem('token_expiration');

    if (storedToken && expiration && new Date(expiration) > new Date()) {
      setToken(storedToken);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
    }
  }, []);

  const login = (newToken: string, expiration: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('token_expiration', expiration);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
