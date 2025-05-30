"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  membershipStatus: boolean;
  isAdmin: boolean;
  createdAt?: string; // Made createdAt optional
}

interface Message {
  id: number;
  title: string;
  textContent: string;
  timestamp: string;
  authorFullName?: string; // Only visible to members
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  messages: Message[];
  isLoadingMessages: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  joinClub: (passcode: string) => Promise<void>;
  grantAdminRole: (adminPasscode: string) => Promise<void>;
  createMessage: (title: string, content: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const router = useRouter();const checkAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const data = await response.json();
        console.log('Auth status response:', data); 
        if (data.isAuthenticated && data.user) {
          const backendUser = data.user;
          const frontendUser: User = {
            id: backendUser.id,
            email: backendUser.username || backendUser.email, // Use username, fallback to email
            firstName: backendUser.first_name,
            lastName: backendUser.last_name,
            membershipStatus: backendUser.membership_status,
            isAdmin: backendUser.is_admin,
            createdAt: backendUser.created_at,
          };
          console.log('Setting mapped user from checkAuthStatus:', frontendUser);
          setUser(frontendUser);
        } else {
          console.log('User not authenticated, setting user to null');
          setUser(null);
        }
      } else {
        console.log('Auth status request failed with status:', response.status);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth status check failed:", err);
      setUser(null);
      // setError("Failed to check auth status. Please try again later."); // Optional: set an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Login failed');
      }
      // Map backend snake_case to frontend camelCase
      const backendUser = data.user;
      const frontendUser: User = {
        id: backendUser.id,
        email: backendUser.username || backendUser.email, // Use username, fallback to email
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        membershipStatus: backendUser.membership_status,
        isAdmin: backendUser.is_admin,
        createdAt: backendUser.created_at,
      };
      console.log('Setting mapped user from login:', frontendUser);
      setUser(frontendUser);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
      setUser(null); // Clear user on login failure
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetch('/api/auth/logout', { method: 'GET' }); // Proxied
      setUser(null);
      router.push('/login'); // Redirect to login page
    } catch (err: any) {
      setError(err.message || 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', { // Proxied to backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password,
          confirmPassword: password // Include confirmPassword with same value
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Signup failed');
      }
      // Signup successful, but user is not logged in yet.
      // The form will redirect to login.
      console.log('Signup successful:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
      throw err; // Re-throw to be caught in the form
    } finally {
      setIsLoading(false);
    }  };
  const joinClub = async (passcode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to join the club');
      }

      const response = await fetch('/api/auth/join-club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          passcode 
        }),
      });
      const data = await response.json();      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to join club');
      }
      
      // Refresh auth status to get updated user data from backend
      await checkAuthStatus();
      console.log('Club membership activated:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while joining the club.');
      throw err; // Re-throw to be caught in the form
    } finally {
      setIsLoading(false);
    }
  };

  const grantAdminRole = async (adminPasscode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to request admin privileges');
      }

      const response = await fetch('/api/auth/grant-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          adminPasscode 
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to grant admin privileges');
      }
      
      // Refresh auth status to get updated user data from backend
      await checkAuthStatus();
      console.log('Admin privileges granted:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while granting admin privileges.');
      throw err; // Re-throw to be caught in the form
    } finally {
      setIsLoading(false);
    }
  };

  // Message-related functions
  const refreshMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', response.status);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createMessage = async (title: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          textContent: content 
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to create message');
      }
      
      // Refresh messages after successful creation
      await refreshMessages();
      console.log('Message created successfully:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while creating the message.');
      throw err; // Re-throw to be caught in the form
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to delete message');
      }
      
      // Refresh messages after successful deletion
      await refreshMessages();
      console.log('Message deleted successfully:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while deleting the message.');
      throw err; // Re-throw to be caught in the component
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages when user authentication status changes
  useEffect(() => {
    if (user) {
      refreshMessages();
    } else {
      setMessages([]);
    }
  }, [user]);  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      messages, 
      isLoadingMessages, 
      login, 
      logout, 
      checkAuthStatus, 
      signup, 
      joinClub, 
      grantAdminRole,
      createMessage, 
      deleteMessage, 
      refreshMessages 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};