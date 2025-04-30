import { FormSection } from '@/components';
import { Member } from '@/data/memberData';
import { Plus, Trash } from 'lucide-react';
import { useAttendance } from '@/context/AttendanceContext';
import { useState, useEffect } from 'react';

export interface Speech {
  id: number;
  speaker: string;
  title: string;
  evaluator: string;
  timeTaken: string;
  evaluationTime: string;
}

interface SpeechesSectionProps {
  speeches: Speech[];
  setSpeeches: (speeches: Speech[]) => void;
  members: Member[];
}

const SpeechesSection = ({ speeches, setSpeeches, members }: SpeechesSectionProps) => {
  const { attendeesList } = useAttendance();
  
  const formatTimeInput = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as mm:ss
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 4) {
      const minutes = numericValue.slice(0, 2);
      const seconds = numericValue.slice(2);
      return `${minutes}:${seconds}`;
    } else {
      // If more than 4 digits, only keep the first 4
      const minutes = numericValue.slice(0, 2);
      const seconds = numericValue.slice(2, 4);
      return `${minutes}:${seconds}`;
    }
  };

  const addSpeech = () => {
    const newSpeech: Speech = {
      id: speeches.length ? Math.max(...speeches.map(s => s.id)) + 1 : 1,
      speaker: '',
      title: '',
      evaluator: '',
      timeTaken: '',
      evaluationTime: ''
    };
    setSpeeches([...speeches, newSpeech]);
  };

  const removeSpeech = (id: number) => {
    setSpeeches(speeches.filter(speech => speech.id !== id));
  };

  const updateSpeech = (id: number, field: keyof Speech, value: string) => {
    // If the field is time-related, format the input
    if (field === 'timeTaken' || field === 'evaluationTime') {
      value = formatTimeInput(value);
    }
    
    setSpeeches(
      speeches.map(speech => 
        speech.id === id ? { ...speech, [field]: value } : speech
      )
    );
  };

  // Get available attendees for speech roles
  const availableSpeakers = attendeesList.length > 0 
    ? [...attendeesList] 
    : members.map(member => member.name);
    
  // Include "Group Evaluation" option for evaluators
  const availableEvaluators = [
    ...availableSpeakers,
    ...(availableSpeakers.includes("Group Evaluation") ? [] : ["Group Evaluation"])
  ];

  return (
    <FormSection title="Prepared Speeches">
      {speeches.map((speech, index) => (
        <div key={speech.id} className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-sm sm:text-base">Speech {index + 1}</h4>
            <button 
              onClick={() => removeSpeech(speech.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove speech"
            >
              <Trash size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="form-group">
              <label className="form-label text-sm">Speaker</label>
              <select
                className="form-input text-sm"
                value={speech.speaker}
                onChange={(e) => updateSpeech(speech.id, 'speaker', e.target.value)}
              >
                <option value="">Select Speaker</option>
                {availableSpeakers.map((speaker, index) => (
                  <option key={index} value={speaker}>{speaker}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label text-sm">Speech Title</label>
              <input
                type="text"
                className="form-input text-sm"
                placeholder="Enter speech title"
                value={speech.title}
                onChange={(e) => updateSpeech(speech.id, 'title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label text-sm">Evaluator</label>
              <select
                className="form-input text-sm"
                value={speech.evaluator}
                onChange={(e) => updateSpeech(speech.id, 'evaluator', e.target.value)}
              >
                <option value="">Select Evaluator</option>
                {availableEvaluators.map((evaluator, index) => (
                  <option key={index} value={evaluator}>{evaluator}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="form-group">
                <label className="form-label text-sm">Time Taken</label>
                <input
                  type="text"
                  className="form-input text-sm"
                  placeholder="Input 4 digits (e.g. 0520)"
                  value={speech.timeTaken}
                  onChange={(e) => updateSpeech(speech.id, 'timeTaken', e.target.value)}
                  maxLength={5}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label text-sm">Evaluation Time</label>
                <input
                  type="text"
                  className="form-input text-sm"
                  placeholder="Input 4 digits (e.g. 0230)"
                  value={speech.evaluationTime}
                  onChange={(e) => updateSpeech(speech.id, 'evaluationTime', e.target.value)}
                  maxLength={5}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-center">
        <button 
          onClick={addSpeech} 
          className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-md text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Speech
        </button>
      </div>
    </FormSection>
  );
};

export default SpeechesSection;
