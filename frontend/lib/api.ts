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

// Helper for API requests with proper error handling
export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const url = getApiUrl(path);
  
  // Ensure credentials are included for session management
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};
