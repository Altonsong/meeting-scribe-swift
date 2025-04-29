
import { FormSection } from '@/components';
import { Member } from '@/data/memberData';

interface RoleAssignment {
  role: string;
  assignee: string;
}

interface RolesSectionProps {
  members: Member[];
  roles: string[];
  roleAssignments: Record<string, string>;
  setRoleAssignments: (assignments: Record<string, string>) => void;
  wordOfWeek: string;
  setWordOfWeek: (word: string) => void;
  jokePresenter: string;
  setJokePresenter: (presenter: string) => void;
  wordUsageCount: number;
  setWordUsageCount: (count: number) => void;
  fillerWordsCount: number;
  setFillerWordsCount: (count: number) => void;
}

const RolesSection = ({
  members,
  roles,
  roleAssignments,
  setRoleAssignments,
  wordOfWeek,
  setWordOfWeek,
  jokePresenter,
  setJokePresenter,
  wordUsageCount,
  setWordUsageCount,
  fillerWordsCount,
  setFillerWordsCount
}: RolesSectionProps) => {
  
  const handleRoleChange = (role: string, assignee: string) => {
    setRoleAssignments({
      ...roleAssignments,
      [role]: assignee
    });
  };

  // Reorder roles in preferred order
  const orderedRoles = [
    "General Evaluator",
    "Table Topics Master",
    "Grammarian",
    "Timer",
    "Joke Master",
    "Quiz Master"
  ];

  // Filter roles to match the ordered roles
  const displayRoles = roles.filter(role => orderedRoles.includes(role));
  
  // Sort the display roles according to the ordered roles
  displayRoles.sort((a, b) => {
    return orderedRoles.indexOf(a) - orderedRoles.indexOf(b);
  });

  return (
    <FormSection title="Roles & Responsibilities">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayRoles.map((role) => (
          <div key={role} className="form-group">
            <label htmlFor={`role-${role}`} className="form-label">{role}</label>
            <select
              id={`role-${role}`}
              className="form-input"
              value={roleAssignments[role] || ''}
              onChange={(e) => handleRoleChange(role, e.target.value)}
            >
              <option value="">Select {role}</option>
              {members.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        
        <div className="form-group">
          <label htmlFor="word-of-week" className="form-label">Word of the Week</label>
          <input
            id="word-of-week"
            type="text"
            className="form-input"
            placeholder="Enter the word of the week"
            value={wordOfWeek}
            onChange={(e) => setWordOfWeek(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="word-usage" className="form-label">Word of the Week Usage Count</label>
          <input
            id="word-usage"
            type="number"
            className="form-input"
            placeholder="How many times was the word used?"
            value={wordUsageCount || ''}
            onChange={(e) => setWordUsageCount(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="filler-words" className="form-label">Filler Words Count</label>
          <input
            id="filler-words"
            type="number"
            className="form-input"
            placeholder="How many filler words were used?"
            value={fillerWordsCount || ''}
            onChange={(e) => setFillerWordsCount(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>
    </FormSection>
  );
};

export default RolesSection;
