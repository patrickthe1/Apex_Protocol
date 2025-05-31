"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api";

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
  const router = useRouter();  const checkAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    // Check if token exists
    const token = getAuthToken();
    if (!token) {
      console.log('No token found, user not authenticated');
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/api/auth/status');
      if (response.ok) {
        const data = await response.json();
        console.log('Auth status response:', data); 
        if (data.isAuthenticated && data.user) {
          const backendUser = data.user;
          const frontendUser: User = {
            id: backendUser.id,
            email: backendUser.email,
            firstName: backendUser.firstName,
            lastName: backendUser.lastName,
            membershipStatus: !!backendUser.membershipStatus,
            isAdmin: !!backendUser.isAdmin,
            createdAt: backendUser.createdAt,
          };
          console.log('Setting mapped user from checkAuthStatus:', frontendUser);
          setUser(frontendUser);
        } else {
          console.log('User not authenticated, removing token');
          removeAuthToken();
          setUser(null);
        }
      } else {
        console.log('Auth status request failed with status:', response.status);
        if (response.status === 401) {
          // Token is invalid, remove it
          removeAuthToken();
        }
        setUser(null);
      }
    } catch (err) {
      console.error("Auth status check failed:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Login failed');
      }

      // Store JWT token
      if (data.token) {
        setAuthToken(data.token);
      }

      // Map backend response to frontend User interface
      const backendUser = data.user;
      const frontendUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        membershipStatus: backendUser.membershipStatus,
        isAdmin: backendUser.isAdmin,
        createdAt: backendUser.createdAt,
      };
      console.log('Setting mapped user from login:', frontendUser);
      setUser(frontendUser);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Remove token from localStorage
      removeAuthToken();
      
      // Optional: notify backend about logout (for token blacklisting if implemented)
      await apiRequest('/api/auth/logout', { method: 'POST' });
      
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password,
          confirmPassword: password
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Signup failed');
      }

      // Store JWT token if provided (auto-login after signup)
      if (data.token) {
        setAuthToken(data.token);
        
        // Map backend response to frontend User interface
        const backendUser = data.user;
        const frontendUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          membershipStatus: backendUser.membershipStatus,
          isAdmin: backendUser.isAdmin,
          createdAt: backendUser.createdAt,
        };
        setUser(frontendUser);
      }

      console.log('Signup successful:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };  const joinClub = async (passcode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to join the club');
      }

      const response = await apiRequest('/api/auth/join-club', {
        method: 'POST',
        body: JSON.stringify({ membershipPasscode: passcode }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to join club');
      }

      // Update token if provided
      if (data.token) {
        setAuthToken(data.token);
      }

      // Update user state with new membership status
      if (data.user) {
        const backendUser = data.user;
        const updatedUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          membershipStatus: backendUser.membershipStatus,
          isAdmin: backendUser.isAdmin,
          createdAt: backendUser.createdAt,
        };
        setUser(updatedUser);
      }

      console.log('Club membership activated:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while joining the club.');
      throw err;
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

      const response = await apiRequest('/api/auth/grant-admin', {
        method: 'POST',
        body: JSON.stringify({ 
          userId: user.id, 
          adminPasscode 
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to grant admin privileges');
      }

      // Update token if provided
      if (data.token) {
        setAuthToken(data.token);
      }

      // Update user state with admin privileges
      if (data.user) {
        const backendUser = data.user;
        const updatedUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          membershipStatus: backendUser.membershipStatus,
          isAdmin: backendUser.isAdmin,
          createdAt: backendUser.createdAt,
        };
        console.log('Updating user state with admin role:', updatedUser);
        setUser(updatedUser);
      }
      
      console.log('Admin privileges granted:', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while granting admin privileges.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Message-related functions
    const refreshMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await apiRequest('/api/messages');
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
    setError(null);    try {
      const response = await apiRequest('/api/messages', {
        method: 'POST',
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
    setError(null);    try {
      const response = await apiRequest(`/api/messages/${messageId}`, {
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