// src/hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import api from '../api/client'; // axios instance (baseURL: http://localhost:4000/api)

/**
 * useUserProfile hook
 * - Loads profile from localStorage on mount
 * - Saves profile by posting to /api/users
 * - Returns { profile, updateProfile, saving, error }
 */
export default function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load profile from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('carepathUserProfile');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  const updateProfile = async (updates) => {
    setSaving(true);
    setError('');

    try {
      // Call REAL backend route: POST /api/users
      const res = await api.post('/users', updates);
      const user = res.data;

      // Save user locally (so reminders know userId)
      localStorage.setItem(
        'carepathUserProfile',
        JSON.stringify({
          userId: user.id,
          phoneNumber: user.phoneNumber,
          channel: user.channel,
          language: user.language
        })
      );

      setProfile({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        channel: user.channel,
        language: user.language
      });

      return user;
    } catch (err) {
      console.error(err);
      setError('Unable to save profile. Please try again.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { profile, updateProfile, saving, error };
}
