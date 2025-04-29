
import { useEffect } from 'react';
import { FormSection } from '@/components';

interface MeetingBasicInfoProps {
  meetingDate: string;
  setMeetingDate: (date: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  chairperson: string;
  setChairperson: (person: string) => void;
  members: { id: string; name: string }[];
}

const MeetingBasicInfo = ({
  meetingDate,
  setMeetingDate,
  theme,
  setTheme,
  startTime,
  setStartTime,
  chairperson,
  setChairperson,
  members
}: MeetingBasicInfoProps) => {
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMeetingDate(formattedDate);
    
    // Set default time to current hour:minute PM
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Format to HH:MM 24-hour format for input type="time"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setStartTime(formattedTime);
  }, [setMeetingDate, setStartTime]);

  return (
    <FormSection title="Meeting Basic Information">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="form-group">
          <label htmlFor="meeting-date" className="form-label">Meeting Date</label>
          <input
            id="meeting-date"
            type="date"
            className="form-input"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="meeting-time" className="form-label">Meeting Start Time</label>
          <div className="flex items-center">
            <input
              id="meeting-time"
              type="time"
              className="form-input flex-grow"
              value={startTime}
              step="60" // Set step to 60 seconds to hide seconds input
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span className="ml-2 text-gray-700">PM</span>
          </div>
        </div>
        
        <div className="form-group sm:col-span-2">
          <label htmlFor="theme" className="form-label">Theme of the Week</label>
          <input
            id="theme"
            type="text"
            className="form-input"
            placeholder="E.g., 'NEVER SAY NEVER'"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        
        <div className="form-group sm:col-span-2">
          <label htmlFor="chairperson" className="form-label">Chairperson</label>
          <select
            id="chairperson"
            className="form-input"
            value={chairperson}
            onChange={(e) => setChairperson(e.target.value)}
          >
            <option value="">Select Chairperson</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FormSection>
  );
};

export default MeetingBasicInfo;
