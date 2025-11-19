import { useState, useEffect } from 'react';

/**
 * useUserProfile hook
 * - Loads the current user's profile on mount
 * - Provides updateProfile(updates) which saves and returns the updated profile
 * - Exposes saving and error states
 */
export default function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setError('');
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load profile');
        }
        const data = await res.json();
        if (mounted) setProfile(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load profile');
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const updateProfile = async (updates) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to save profile');
      }

      const data = await res.json();
      // Merge returned data into local profile state
      setProfile(prev => ({ ...(prev || {}), ...data }));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to save profile');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { profile, updateProfile, saving, error };
}