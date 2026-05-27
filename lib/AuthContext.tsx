'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (name: string, username: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signin: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('eg_logged_in_user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (e) {
        console.error('Failed to parse logged in user', e);
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const signup = async (name: string, username: string, email: string, phone: string, pass: string) => {
    try {
      // Validate unique username and email in mock DB stored in localstorage
      const usersRaw = localStorage.getItem('eg_users') || '[]';
      const usersList = JSON.parse(usersRaw);

      const emailExists = usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return { success: false, error: 'Email already registered.' };
      }

      const usernameExists = usersList.some((u: any) => u.username.toLowerCase() === username.toLowerCase());
      if (usernameExists) {
        return { success: false, error: 'Username already taken.' };
      }

      const newUser = { name, username, email, phone, pass };
      usersList.push(newUser);
      localStorage.setItem('eg_users', JSON.stringify(usersList));

      // Auto login
      const publicUser: User = { name, username, email, phone };
      localStorage.setItem('eg_logged_in_user', JSON.stringify(publicUser));
      setUser(publicUser);

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'An error occurred during registration.' };
    }
  };

  const signin = async (identifier: string, pass: string) => {
    try {
      const usersRaw = localStorage.getItem('eg_users') || '[]';
      const usersList = JSON.parse(usersRaw);

      // Find by username or email
      const matchedUser = usersList.find(
        (u: any) =>
          (u.email.toLowerCase() === identifier.toLowerCase() ||
           u.username.toLowerCase() === identifier.toLowerCase()) &&
          u.pass === pass
      );

      if (!matchedUser) {
        return { success: false, error: 'Invalid identifier or password.' };
      }

      const publicUser: User = {
        name: matchedUser.name || matchedUser.username, // fall back to username if name is not set
        username: matchedUser.username,
        email: matchedUser.email,
        phone: matchedUser.phone,
      };

      localStorage.setItem('eg_logged_in_user', JSON.stringify(publicUser));
      setUser(publicUser);

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'An error occurred during login.' };
    }
  };

  const signout = () => {
    localStorage.removeItem('eg_logged_in_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
