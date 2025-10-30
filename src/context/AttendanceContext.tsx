import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMemberData } from './MemberDataContext';

interface AttendanceContextType {
  attendeesList: string[];
  updateAttendeesList: (members: string[], guests: string[]) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendeesList, setAttendeesList] = useState<string[]>([]);
  const { dataVersion } = useMemberData();

  const updateAttendeesList = (members: string[], guests: string[]) => {
    setAttendeesList([...members, ...guests]);
  };

  // Force re-render when member data changes
  useEffect(() => {
    // This ensures the context is aware of member data changes
  }, [dataVersion]);

  return (
    <AttendanceContext.Provider value={{ attendeesList, updateAttendeesList }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};