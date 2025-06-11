import {
  BriefcaseBusinessIcon,
  Code2Icon,
  Puzzle,
  User2Icon,
  UserRoundCheckIcon,
} from "lucide-react";

const aiToolsList = [
  {
    name: "AI Career Q&A Chat",
    desc: "Ask career questions",
    icon: "/chatbot.png",
    button: "Ask now",
    path: "/ai-tools/ai-chat",
  },
  {
    name: "AI Resume Analyzer",
    desc: "Improve your resume",
    icon: "/resume.png",
    button: "Analyze now",
    path: "/ai-tools/ai-resume-analyzer",
  },
  {
    name: "Career Roadmap Generator",
    desc: "Build your roadmap",
    icon: "/roadmap.png",
    button: "Generate now",
    path: "/ai-tools/ai-roadmap",
  },
  {
    name: "Mock Interview Generator",
    desc: "Prepare for your interview",
    icon: "/resume.png",
    button: "Create now",
    path: "/ai-mock-interview",
  },
];

const interviewTypes = [
  {
    name: "Technical",
    icon: Code2Icon,
  },
  {
    name: "Behavioral",
    icon: User2Icon,
  },
  {
    name: "Experienced",
    icon: BriefcaseBusinessIcon,
  },
  {
    name: "Problem Solving",
    icon: Puzzle,
  },
  {
    name: "Leadership",
    icon: UserRoundCheckIcon,
  },
];

export { aiToolsList, interviewTypes };
