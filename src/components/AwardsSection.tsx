
import { FormSection } from '@/components';
import { Member } from '@/data/memberData';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useAttendance } from '@/context/AttendanceContext';

interface AwardsSectionProps {
  awards: string[];
  members: Member[];
  guests: string[];
  awardRecipients: Record<string, string[]>;
  setAwardRecipients: (recipients: Record<string, string[]>) => void;
}

const AwardsSection = ({
  awards,
  members,
  guests,
  awardRecipients,
  setAwardRecipients
}: AwardsSectionProps) => {
  const { attendeesList } = useAttendance();
  
  const allPeople = attendeesList.length > 0
    ? attendeesList
    : [...members.map(member => member.name), ...guests];
  
  const toggleRecipient = (award: string, person: string) => {
    const currentRecipients = awardRecipients[award] || [];
    
    if (currentRecipients.includes(person)) {
      setAwardRecipients({
        ...awardRecipients,
        [award]: currentRecipients.filter(name => name !== person)
      });
    } else {
      setAwardRecipients({
        ...awardRecipients,
        [award]: [...currentRecipients, person]
      });
    }
  };

  return (
    <FormSection title="Awards & Recognitions">
      {awards.map(award => (
        <div key={award} className="mb-4 sm:mb-6">
          <h4 className="text-sm sm:text-lg font-medium mb-2">{award}</h4>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md bg-white hover:bg-gray-50 text-sm sm:text-base">
              <span>
                {awardRecipients[award]?.length 
                  ? `${awardRecipients[award].length} recipient(s) selected` 
                  : "Select recipients"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px] max-h-[300px] overflow-y-auto">
              {allPeople.map((person, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={(awardRecipients[award] || []).includes(person)}
                  onCheckedChange={() => toggleRecipient(award, person)}
                  className="text-sm"
                >
                  {person}{guests.includes(person) ? " (Guest)" : ""}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Display selected recipients */}
          {(awardRecipients[award]?.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
              {awardRecipients[award].map((person, idx) => (
                <div key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {person}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </FormSection>
  );
};

export default AwardsSection;
