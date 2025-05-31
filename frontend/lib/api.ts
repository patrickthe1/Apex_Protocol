// API utilities for handling development vs production URLs
export const getApiUrl = (path: string): string => {
  // In development, use relative URLs (Next.js rewrites work)
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  
  // In production, use absolute backend URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
  }
  
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${backendUrl}/${cleanPath}`;
};

// Token management utilities
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('apex_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apex_token', token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('apex_token');
};

// Helper for API requests with JWT authentication
export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const url = getApiUrl(path);
  const token = getAuthToken();
  
  // Prepare headers with JWT token
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any existing headers from options
  const headers = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  };
  
  const defaultOptions: RequestInit = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};
