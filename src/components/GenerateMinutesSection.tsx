
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
  wordPresenter: string;
  jokePresenter: string;
  wordUsageCount: number;
  fillerWordsCount: number;
  speeches: Speech[];
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
  wordPresenter,
  jokePresenter,
  wordUsageCount,
  fillerWordsCount,
  speeches,
  awardRecipients
}: GenerateMinutesSectionProps) => {
  const [minutesText, setMinutesText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  // Format time from 24h to 12h with am/pm
  const formatTime = (time24h: string) => {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'p.m.' : 'a.m.';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format date from YYYY-MM-DD to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString;
  };

  const generateMinutes = () => {
    const formattedDate = formatDate(meetingDate);
    const formattedTime = formatTime(startTime);
    
    let minutesContent = `Minutes of Markham Toastmasters Regular Meeting-${formattedDate}\n\n`;
    
    // Theme
    minutesContent += `Theme of the Week: "${theme}"\n`;
    minutesContent += `The theme was ${theme}—a powerful reminder to stay open-minded and embrace new experiences, even if they feel uncomfortable at first\n\n`;
    
    // Basic info
    minutesContent += `Chairperson: ${chairperson}\n`;
    minutesContent += `Meeting Start Time: ${formattedTime}\n\n`;
    
    // Attendees
    minutesContent += `Attendees:\n`;
    minutesContent += `Toastmaster Members: ${selectedMembers.length}\n`;
    minutesContent += `Honorable Guests: ${guests.length}\n\n`;
    
    // Roles
    minutesContent += `Roles & Responsibilities:\n`;
    Object.entries(roleAssignments).forEach(([role, person]) => {
      minutesContent += `${role}: ${person}\n`;
    });
    
    // Word of the week
    minutesContent += `Word of the Week: ${wordOfWeek}\n`;
    minutesContent += `Presented by: ${wordPresenter}\n`;
    
    // Joke
    minutesContent += `Joke of the Week:\n`;
    minutesContent += `Presented by: ${jokePresenter}\n\n`;
    
    // Grammarian's Report
    minutesContent += `Grammarian's Report:\n`;
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
          className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Generate Meeting Minutes
        </button>
      </div>
      
      {minutesText && (
        <>
          <div className="flex gap-2 mb-3">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center justify-center gap-1"
            >
              {copied ? <Check size={18} /> : null}
              Copy to Clipboard
            </button>
            
            <button 
              onClick={downloadMinutes}
              className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center justify-center gap-1"
            >
              <Download size={18} />
              Download as TXT
            </button>
          </div>
          
          <div className="border rounded-md p-3 bg-gray-50 overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm font-mono">{minutesText}</pre>
          </div>
        </>
      )}
    </FormSection>
  );
};

export default GenerateMinutesSection;
