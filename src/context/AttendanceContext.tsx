import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AttendanceContextType {
  attendeesList: string[];
  updateAttendeesList: (members: string[], guests: string[]) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendeesList, setAttendeesList] = useState<string[]>([]);

  const updateAttendeesList = (members: string[], guests: string[]) => {
    setAttendeesList([...members, ...guests]);
  };

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