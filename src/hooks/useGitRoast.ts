import { useState, FormEvent } from 'react';
import { RoastData } from '../types/roast';

export const useGitRoast = () => {
  const [username, setUsername] = useState('');
  const [roast, setRoast] = useState<RoastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeProfile = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze`;
      
      const response = await fetch(`${apiUrl}?username=${encodeURIComponent(username.trim())}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      });

      const responseData = await response.text();
      
      if (!response.ok) {
        try {
          // Try to parse the error response as JSON
          const errorData = JSON.parse(responseData);
          throw new Error(errorData.error || 'Failed to roast profile');
        } catch (jsonError) {
          // If JSON parsing fails, use the raw response text
          throw new Error(responseData || 'Failed to roast profile');
        }
      }

      try {
        const data = JSON.parse(responseData);
        setRoast(data);
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Roast failed:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : "We tried to roast this profile, but something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');
  
  const clearResults = () => {
    setRoast(null);
    setUsername('');
    setError('');
  };

  return {
    username,
    setUsername,
    roast,
    loading,
    error,
    analyzeProfile,
    clearError,
    clearResults
  };
};