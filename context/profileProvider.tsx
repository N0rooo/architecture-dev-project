'use client';

import { Profile } from '@/types/types';
import { User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type ProfileContextType = {
  profile: Profile | null;
  setProfile: (value: Profile | null) => void;
  user: User | null;
  loading: boolean;
  removePointsOnClientSide: (points: number) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children, user }: { children: ReactNode; user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const removePointsOnClientSide = (points: number) => {
    setProfile((prevProfile) => {
      if (!prevProfile) return null;
      return { ...prevProfile, points: prevProfile.points - points };
    });
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, user, loading, removePointsOnClientSide }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
