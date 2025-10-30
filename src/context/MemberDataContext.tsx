
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { members as defaultMembers, roles as defaultRoles, awards as defaultAwards } from '@/data/memberData';
import type { Member } from '@/data/memberData';

interface MemberDataContextType {
  members: Member[];
  roles: string[];
  awards: string[];
  setMembers: (members: Member[]) => void;
  setRoles: (roles: string[]) => void;
  setAwards: (awards: string[]) => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const MemberDataContext = createContext<MemberDataContextType | undefined>(undefined);

interface StoredData {
  members: Member[];
  roles: string[];
  awards: string[];
  version: string;
  lastUpdated: string;
}

export const MemberDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedData, setStoredData] = useLocalStorage<StoredData>('mtm-member-data', {
    members: defaultMembers,
    roles: defaultRoles,
    awards: defaultAwards,
    version: '1.0',
    lastUpdated: new Date().toISOString(),
  });

  const setMembers = (members: Member[]) => {
    setStoredData({
      ...storedData,
      members,
      lastUpdated: new Date().toISOString(),
    });
  };

  const setRoles = (roles: string[]) => {
    setStoredData({
      ...storedData,
      roles,
      lastUpdated: new Date().toISOString(),
    });
  };

  const setAwards = (awards: string[]) => {
    setStoredData({
      ...storedData,
      awards,
      lastUpdated: new Date().toISOString(),
    });
  };

  const resetToDefaults = () => {
    setStoredData({
      members: defaultMembers,
      roles: defaultRoles,
      awards: defaultAwards,
      version: '1.0',
      lastUpdated: new Date().toISOString(),
    });
  };

  const exportData = () => {
    return JSON.stringify(storedData, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.members && data.roles && data.awards) {
        setStoredData({
          ...data,
          lastUpdated: new Date().toISOString(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return (
    <MemberDataContext.Provider
      value={{
        members: storedData.members,
        roles: storedData.roles,
        awards: storedData.awards,
        setMembers,
        setRoles,
        setAwards,
        resetToDefaults,
        exportData,
        importData,
      }}
    >
      {children}
    </MemberDataContext.Provider>
  );
};

export const useMemberData = () => {
  const context = useContext(MemberDataContext);
  if (context === undefined) {
    throw new Error('useMemberData must be used within a MemberDataProvider');
  }
  return context;
};
