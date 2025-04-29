
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
  wordPresenter: string;
  setWordPresenter: (presenter: string) => void;
  jokePresenter: string;
  setJokePresenter: (presenter: string) => void;
}

const RolesSection = ({
  members,
  roles,
  roleAssignments,
  setRoleAssignments,
  wordOfWeek,
  setWordOfWeek,
  wordPresenter,
  setWordPresenter,
  jokePresenter,
  setJokePresenter
}: RolesSectionProps) => {
  
  const handleRoleChange = (role: string, assignee: string) => {
    setRoleAssignments({
      ...roleAssignments,
      [role]: assignee
    });
  };

  return (
    <FormSection title="Roles & Responsibilities">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
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
          <label htmlFor="word-presenter" className="form-label">Word Presenter</label>
          <select
            id="word-presenter"
            className="form-input"
            value={wordPresenter}
            onChange={(e) => setWordPresenter(e.target.value)}
          >
            <option value="">Select Word Presenter</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group md:col-span-2">
          <label htmlFor="joke-presenter" className="form-label">Joke Presenter</label>
          <select
            id="joke-presenter"
            className="form-input"
            value={jokePresenter}
            onChange={(e) => setJokePresenter(e.target.value)}
          >
            <option value="">Select Joke Presenter</option>
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

export default RolesSection;
