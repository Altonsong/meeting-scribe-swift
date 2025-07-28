
import { FormSection } from '@/components';

interface BusinessSessionSectionProps {
  businessSession: string;
  setBusinessSession: (session: string) => void;
}

const BusinessSessionSection = ({
  businessSession,
  setBusinessSession
}: BusinessSessionSectionProps) => {
  return (
    <FormSection title="Business Session">
      <div className="form-group">
        <label htmlFor="business-session" className="form-label">
          Business Session Notes
        </label>
        <textarea
          id="business-session"
          className="form-input min-h-24 resize-vertical"
          placeholder="Enter business session details..."
          value={businessSession}
          onChange={(e) => setBusinessSession(e.target.value)}
          rows={4}
        />
      </div>
    </FormSection>
  );
};

export default BusinessSessionSection;
