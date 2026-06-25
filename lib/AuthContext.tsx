'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'readonly';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (name: string, username: string, email: string, phone: string, pass: string, role?: 'admin' | 'readonly') => Promise<{ success: boolean; error?: string }>;
  signin: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('eg_logged_in_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          // Admin access mode can only be accessed with username rajsingh1581
          if (parsed.role === 'admin' && parsed.username !== 'rajsingh1581') {
            parsed.role = 'readonly';
            localStorage.setItem('eg_logged_in_user', JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse logged in user', e);
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const signup = async (name: string, username: string, email: string, phone: string, pass: string, role?: 'admin' | 'readonly') => {
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

      const isSystemAdmin = username.toLowerCase() === 'rajsingh1581';
      
      if (isSystemAdmin) {
        if (pass !== 'GopalJ!108') {
          return { success: false, error: 'Incorrect password for Admin account. Admin password must be GopalJ!108.' };
        }
      }

      const assignedRole: 'admin' | 'readonly' = isSystemAdmin ? 'admin' : 'readonly';
      const finalName = isSystemAdmin ? 'RAJ SINGH' : name;
      const finalEmail = isSystemAdmin ? 'rajsingh1581@gmail.com' : email;

      const newUser = { name: finalName, username, email: finalEmail, phone, pass, role: assignedRole };
      usersList.push(newUser);
      localStorage.setItem('eg_users', JSON.stringify(usersList));

      // Auto login
      const publicUser: User = { name: finalName, username, email: finalEmail, phone, role: assignedRole };
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
      const isSystemAdmin = 
        identifier.toLowerCase() === 'rajsingh1581' || 
        identifier.toLowerCase() === 'rajsingh1581@gmail.com';

      if (isSystemAdmin) {
        if (pass !== 'GopalJ!108') {
          return { success: false, error: 'Incorrect password for Admin access.' };
        }

        // Standardize the admin user object
        const adminUser: User = {
          name: 'RAJ SINGH',
          username: 'rajsingh1581',
          email: 'rajsingh1581@gmail.com',
          phone: '9876543210',
          role: 'admin',
        };

        // Seed/Upsert admin into eg_users list so it's always in the DB if needed
        const usersRaw = localStorage.getItem('eg_users') || '[]';
        const usersList = JSON.parse(usersRaw);
        const adminIdx = usersList.findIndex((u: any) => u.username.toLowerCase() === 'rajsingh1581');
        if (adminIdx > -1) {
          usersList[adminIdx] = { ...usersList[adminIdx], name: 'RAJ SINGH', pass: 'GopalJ!108', role: 'admin' };
        } else {
          usersList.push({
            name: 'RAJ SINGH',
            username: 'rajsingh1581',
            email: 'rajsingh1581@gmail.com',
            phone: '9876543210',
            pass: 'GopalJ!108',
            role: 'admin'
          });
        }
        localStorage.setItem('eg_users', JSON.stringify(usersList));

        // Set logged in user
        localStorage.setItem('eg_logged_in_user', JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true };
      }

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

      // Any other user is strictly demoted/restricted to readonly
      const publicUser: User = {
        name: matchedUser.name || matchedUser.username,
        username: matchedUser.username,
        email: matchedUser.email,
        phone: matchedUser.phone,
        role: 'readonly',
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
