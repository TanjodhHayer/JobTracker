// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // TODO: decode token to get user info or fetch user data
      // For now, just assume user is logged in if token exists
      setUser({ id: '123', email: 'user@example.com', username: 'username' });
    } else {
      setUser(null);
    }
  }, [token]);

  function login(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return { user, token, login, logout };
}
