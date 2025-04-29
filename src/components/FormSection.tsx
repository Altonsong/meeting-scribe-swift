
import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <h3 className="section-title text-gray-800">{title}</h3>
      {children}
    </div>
  );
};

export default FormSection;
