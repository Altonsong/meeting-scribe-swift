import { useState } from "react";
import {
  FormSection,
  MeetingBasicInfo,
  AttendanceSection,
  RolesSection,
  SpeechesSection,
  BusinessSessionSection,
  AwardsSection,
  GenerateMinutesSection,
  MemberManagement,
} from "@/components";
import type { Speech } from "@/components/SpeechesSection";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { MemberDataProvider, useMemberData } from "@/context/MemberDataContext";

const IndexContent = () => {
  const { members, roles, awards, dataVersion } = useMemberData();

  // Meeting Basic Info
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [chairperson, setChairperson] = useState<string>("");

  // Attendance
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [guests, setGuests] = useState<string[]>([]);

  // Roles
  const [roleAssignments, setRoleAssignments] = useState<
    Record<string, string>
  >({});
  const [wordOfWeek, setWordOfWeek] = useState<string>("");
  const [jokePresenter, setJokePresenter] = useState<string>("");
  const [wordUsageCount, setWordUsageCount] = useState<number>(0);
  const [fillerWordsCount, setFillerWordsCount] = useState<number>(0);

  // Speeches
  const [speeches, setSpeeches] = useState<Speech[]>([]);

  // Business Session
  const [businessSession, setBusinessSession] = useState<string>("");

  // Awards
  const [awardRecipients, setAwardRecipients] = useState<
    Record<string, string[]>
  >({});

  // Add "Group Evaluation" to members list for speech evaluators
  const membersWithGroupEval = [
    ...members,
    { id: "group-eval", name: "Group Evaluation", role: "Group", joined: "" },
  ];

  // Filter out deleted members from selectedMembers
  const filteredSelectedMembers = selectedMembers.filter(memberId =>
    members.some(member => member.id === memberId)
  );

  return (
      <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-6 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
              MTM Meeting Record
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Generate meeting minutes for Markham Toastmasters Club
            </p>
          </header>

          <MeetingBasicInfo
            meetingDate={meetingDate}
            setMeetingDate={setMeetingDate}
            theme={theme}
            setTheme={setTheme}
            startTime={startTime}
            setStartTime={setStartTime}
            chairperson={chairperson}
            setChairperson={setChairperson}
            members={members}
          />

          <AttendanceSection
            selectedMembers={filteredSelectedMembers}
            setSelectedMembers={setSelectedMembers}
            guests={guests}
            setGuests={setGuests}
          />

          <RolesSection
            members={members}
            roles={roles}
            roleAssignments={roleAssignments}
            setRoleAssignments={setRoleAssignments}
            wordOfWeek={wordOfWeek}
            setWordOfWeek={setWordOfWeek}
            jokePresenter={jokePresenter}
            setJokePresenter={setJokePresenter}
            wordUsageCount={wordUsageCount}
            setWordUsageCount={setWordUsageCount}
            fillerWordsCount={fillerWordsCount}
            setFillerWordsCount={setFillerWordsCount}
          />

          <SpeechesSection
            speeches={speeches}
            setSpeeches={setSpeeches}
            members={membersWithGroupEval}
          />

          <BusinessSessionSection
            businessSession={businessSession}
            setBusinessSession={setBusinessSession}
          />

          <AwardsSection
            awards={awards}
            members={members}
            guests={guests}
            awardRecipients={awardRecipients}
            setAwardRecipients={setAwardRecipients}
          />

          <GenerateMinutesSection
            meetingDate={meetingDate}
            theme={theme}
            startTime={startTime}
            chairperson={chairperson}
            selectedMembers={filteredSelectedMembers}
            guests={guests}
            roleAssignments={roleAssignments}
            wordOfWeek={wordOfWeek}
            jokePresenter={jokePresenter}
            wordUsageCount={wordUsageCount}
            fillerWordsCount={fillerWordsCount}
            speeches={speeches}
            businessSession={businessSession}
            awardRecipients={awardRecipients}
          />

          <footer className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Markham Toastmaster Club Meeting
              Record
            </p>
          </footer>
        </div>
        <MemberManagement />
      </div>
  );
};

const Index = () => {
  return (
    <AttendanceProvider>
      <MemberDataProvider>
        <IndexContent />
      </MemberDataProvider>
    </AttendanceProvider>
  );
};

export default Index;