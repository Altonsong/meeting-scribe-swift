
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AttendanceContextType {
  attendeesList: string[];
  updateAttendeesList: (members: string[], guests: string[]) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [attendeesList, setAttendeesList] = useState<string[]>([]);

  const updateAttendeesList = (members: string[], guests: string[]) => {
    const combinedList = [...members, ...guests];
    setAttendeesList(combinedList);
  };

  return (
    <AttendanceContext.Provider value={{ attendeesList, updateAttendeesList }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
