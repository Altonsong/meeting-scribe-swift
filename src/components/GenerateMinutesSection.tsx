import { useState } from 'react';
import { FormSection } from '@/components';
import { Speech } from './SpeechesSection';
import { Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateMinutesSectionProps {
  meetingDate: string;
  theme: string;
  startTime: string;
  chairperson: string;
  selectedMembers: string[];
  guests: string[];
  roleAssignments: Record<string, string>;
  wordOfWeek: string;
  jokePresenter: string;
  wordUsageCount: number;
  fillerWordsCount: number;
  speeches: Speech[];
  businessSession: string;
  awardRecipients: Record<string, string[]>;
}

const GenerateMinutesSection = ({
  meetingDate,
  theme,
  startTime,
  chairperson,
  selectedMembers,
  guests,
  roleAssignments,
  wordOfWeek,
  jokePresenter,
  wordUsageCount,
  fillerWordsCount,
  speeches,
  businessSession,
  awardRecipients
}: GenerateMinutesSectionProps) => {
  const [minutesText, setMinutesText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  // Format time from 24h to 12h with pm - only hours and minutes
  const formatTime = (time24h: string) => {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    // Always use PM as per requirement
    const ampm = 'p.m.';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format date from YYYY-MM-DD to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString;
  };

  // Format name to first name + last name initial
  const formatName = (fullName: string) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return `${firstName} ${lastInitial}.`;
  };

  // Get last name initial for sorting
  const getLastNameInitial = (fullName: string): string => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return '';
    
    return nameParts[nameParts.length - 1][0].toUpperCase();
  };

  // Sort array by last name initial alphabetically
  const sortByLastName = (array: string[]): string[] => {
    return [...array].sort((a, b) => {
      const lastInitialA = getLastNameInitial(a);
      const lastInitialB = getLastNameInitial(b);
      return lastInitialA.localeCompare(lastInitialB);
    });
  };

  // Shuffle array randomly - Fisher-Yates algorithm
  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateMinutes = () => {
    const formattedDate = formatDate(meetingDate);
    const formattedTime = formatTime(startTime);
    
    let minutesContent = `Minutes of Markham Toastmasters Regular Meeting-${formattedDate}\n\n`;
    
    // Theme
    minutesContent += `Theme of the Week: "${theme}"\n\n`;
    
    // Basic info
    minutesContent += `Chairperson: ${chairperson}\n`;
    minutesContent += `Meeting Start Time: ${formattedTime}\n\n`;
    
    // Sort members by last name
    const sortedMembers = sortByLastName(selectedMembers);
    
    // Format member names
    const formattedMemberNames = sortedMembers.map(member => formatName(member));
    
    // Format guest names
    const formattedGuestNames = guests.map(guest => formatName(guest));
    
    // Attendees with member names
    minutesContent += `Attendees:\n`;
    // List all member names in parentheses sorted by last name
    minutesContent += `Toastmaster Members: ${selectedMembers.length} (${formattedMemberNames.join(', ')})\n`;
    
    // Display guest count and list guest names
    if (guests.length > 0) {
      minutesContent += `Honorable Guests: ${guests.length} (${formattedGuestNames.join(', ')})\n\n`;
    } else {
      minutesContent += `Honorable Guests: ${guests.length}\n\n`;
    }
    
    // Roles in the requested order
    minutesContent += `Roles & Responsibilities:\n`;
    
    // Display roles in specified order with Joke Master between Timer and Quiz Master
    const orderedRoles = [
      "General Evaluator",
      "Table Topics Master",
      "Grammarian",
      "Timer",
      "Joke Master",
      "Quiz Master"
    ];

    orderedRoles.forEach(role => {
      if (roleAssignments[role]) {
        minutesContent += `${role}: ${roleAssignments[role]}\n`;
      }
    });
    
    // Word of the week
    const grammarian = roleAssignments["Grammarian"] || "";
    
    // Grammarian's Report in the requested order
    minutesContent += `\nGrammarian's Report:\n`;
    minutesContent += `Word of the Week: ${wordOfWeek}\n`;
    minutesContent += `Word of the Week Usage: ${wordUsageCount} times\n`;
    minutesContent += `Filler Words Used: ${fillerWordsCount} times\n\n`;
    
    // Speeches
    minutesContent += `Prepared Speeches:\n`;
    speeches.forEach((speech, index) => {
      minutesContent += `Speech ${index + 1}\n`;
      minutesContent += `Speaker: ${speech.speaker}\n`;
      minutesContent += `Speech Title: "${speech.title}"\n`;
      minutesContent += `Evaluator: ${speech.evaluator}\n`;
      minutesContent += `Time Taken: ${speech.timeTaken}\n`;
      minutesContent += `Evaluation Time: ${speech.evaluationTime}\n\n`;
    });
    
    // Business Session
    if (businessSession.trim()) {
      minutesContent += `Business Session:\n${businessSession.trim()}\n\n`;
    }
    
    // Awards
    minutesContent += `Awards & Recognitions:\n`;
    Object.entries(awardRecipients).forEach(([award, recipients]) => {
      if (recipients.length > 0) {
        const emoji = award.includes('Spark') ? '🏆' : 
                      award.includes('Smile') ? '😊' : 
                      award.includes('Table Topics') ? '🎤' : '';
        
        minutesContent += `${emoji} ${award}: ${recipients.join(' & ')}\n`;
      }
    });
    
    minutesContent += `\nLooking forward to seeing everyone at the next meeting!`;
    
    setMinutesText(minutesContent);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minutesText).then(
      () => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Meeting minutes copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const downloadMinutes = () => {
    const blob = new Blob([minutesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MTM_Meeting_Minutes_${meetingDate || 'generated'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Meeting minutes downloaded as TXT file",
    });
  };

  return (
    <FormSection title="Generate Meeting Minutes">
      <div className="mb-4">
        <button 
          onClick={generateMinutes}
          className="w-full py-2 sm:py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          Generate Meeting Minutes
        </button>
      </div>
      
      {minutesText && (
        <>
          <div className="flex gap-2 mb-3">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-1.5 sm:py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              {copied ? <Check size={16} /> : null}
              Copy to Clipboard
            </button>
            
            <button 
              onClick={downloadMinutes}
              className="flex-1 py-1.5 sm:py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <Download size={16} />
              Download as TXT
            </button>
          </div>
          
          <div className="border rounded-md p-2 sm:p-3 bg-gray-50 overflow-auto max-h-60 sm:max-h-96">
            <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono">{minutesText}</pre>
          </div>
        </>
      )}
    </FormSection>
  );
};

export default GenerateMinutesSection;
