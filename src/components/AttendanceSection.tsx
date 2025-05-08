import { useState, useEffect, useCallback } from 'react';
import { FormSection } from '@/components';
import { Member } from '@/data/memberData';
import { X, Plus } from 'lucide-react';
import { useAttendance } from '@/context/AttendanceContext';

interface AttendanceSectionProps {
  members: Member[];
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  guests: string[];
  setGuests: (guests: string[]) => void;
}

const AttendanceSection = ({
  members,
  selectedMembers,
  setSelectedMembers,
  guests,
  setGuests
}: AttendanceSectionProps) => {
  const [newGuest, setNewGuest] = useState('');
  const { updateAttendeesList } = useAttendance();

  useEffect(() => {
    // Update the attendees list whenever selected members or guests change
    updateAttendeesList(selectedMembers, guests);
  }, [selectedMembers, guests, updateAttendeesList]); //Fixed: updateAttendeesList added to dependencies

  const handleMemberToggle = (memberName: string) => {
    if (selectedMembers.includes(memberName)) {
      setSelectedMembers(selectedMembers.filter(name => name !== memberName));
    } else {
      setSelectedMembers([...selectedMembers, memberName]);
    }
  };

  const handleAddGuest = () => {
    if (newGuest.trim() && !guests.includes(newGuest.trim())) {
      setGuests([...guests, newGuest.trim()]);
      setNewGuest('');
    }
  };

  const handleRemoveGuest = (guestToRemove: string) => {
    setGuests(guests.filter(guest => guest !== guestToRemove));
  };

  return (
    <FormSection title="Attendance">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h4 className="text-base sm:text-lg font-medium mb-2">Members ({selectedMembers.length})</h4>
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.name)}
                  onChange={() => handleMemberToggle(member.name)}
                  className="mr-2"
                />
                <label htmlFor={`member-${member.id}`} className="cursor-pointer text-sm sm:text-base">
                  {member.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-medium mb-2">Guests ({guests.length})</h4>
          <div className="flex mb-2">
            <input
              type="text"
              value={newGuest}
              onChange={(e) => setNewGuest(e.target.value)}
              className="form-input flex-grow"
              placeholder="Enter guest name"
            />
            <button
              onClick={handleAddGuest}
              className="ml-2 px-2 sm:px-3 py-2 bg-primary text-white rounded-md"
              disabled={!newGuest.trim()}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {guests.map((guest, index) => (
              <div key={index} className="flex justify-between items-center mb-2 p-1.5 sm:p-2 bg-gray-50 rounded">
                <span className="text-sm sm:text-base">{guest}</span>
                <button 
                  onClick={() => handleRemoveGuest(guest)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {guests.length === 0 && (
              <p className="text-gray-500 text-xs sm:text-sm italic p-2">No guests added yet</p>
            )}
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default AttendanceSection;