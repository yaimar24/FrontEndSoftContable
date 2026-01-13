import React, { createContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string, expiration: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null; 

    const storedToken = localStorage.getItem('token');
    const expiration = localStorage.getItem('token_expiration');

    if (storedToken && expiration && new Date(expiration) > new Date()) {
      return storedToken;
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
    }
    return null;
  });

  const login = (newToken: string, expiration: string): void => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('token_expiration', expiration);
  };

  const logout = (): void => {
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

export default AuthContext
