// config.js - DEVELOPMENT VERSION
// IMPORTANT: Remove DEV_TOKEN before deploying to production

const isDevelopment = process.env.NODE_ENV === 'development';

// Development token - DELETE THIS LINE before production deployment
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huNEBleGFtcGxlLmNvbSIsImlzVGVsZWdyYW1QcmVtaXVtIjpmYWxzZSwiaWF0IjoxNzM4OTIzNzQ1LCJleHAiOjE3Mzg5MjczNDV9.4GZfCM95ZrDIPGP4sZw0n0lRgthqqH12ZQ4_AO6C1S8';

// Migration function to handle old token key
const migrateOldToken = () => {
  const oldToken = localStorage.getItem('authToken');
  if (oldToken) {
    localStorage.setItem('token', oldToken);
    localStorage.removeItem('authToken');
    console.log('Token migrated from authToken to token');
  }
};

// Run migration when config is imported
migrateOldToken();

export const getAuthToken = () => {
  if (isDevelopment) {
    return DEV_TOKEN;
  }
  
  // Try to get token with new key first
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }
  
  // If no token found with new key, check old key and migrate if found
  const oldToken = localStorage.getItem('authToken');
  if (oldToken) {
    localStorage.setItem('token', oldToken);
    localStorage.removeItem('authToken');
    return oldToken;
  }
  
  return null;
};

export const setAuthToken = (token) => {
  if (!isDevelopment) {
    localStorage.setItem('token', token);
    // Remove old token key if it exists
    localStorage.removeItem('authToken');
  }
};

export const removeAuthToken = () => {
  if (!isDevelopment) {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken'); // Also remove old token key
  }
};

// Optional: Function to completely reset all auth-related data
export const resetAllAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userData');
};