
import { FormSection } from '@/components';
import { Member } from '@/data/memberData';

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
  
  const allPeople = [
    ...members.map(member => member.name),
    ...guests
  ];
  
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
        <div key={award} className="mb-4">
          <h4 className="text-lg font-medium mb-2">{award}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allPeople.map((person, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${award}-${index}`}
                  checked={(awardRecipients[award] || []).includes(person)}
                  onChange={() => toggleRecipient(award, person)}
                  className="mr-2"
                />
                <label htmlFor={`${award}-${index}`} className="cursor-pointer">
                  {person}{guests.includes(person) ? " (Guest)" : ""}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </FormSection>
  );
};

export default AwardsSection;
