"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Định nghĩa kiểu dữ liệu người dùng
type User = {
  id: number;
  fullName: string;
  role: number;
} | null;

const AuthContext = createContext<{ user: User; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    
    if (token) {
      setUser({
        id: 1,
        fullName: "Người Dùng", 
        role: role ? parseInt(role) : 0
      });
    }
    setLoading(false);
  },[]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);