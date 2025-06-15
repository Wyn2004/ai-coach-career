import { Clock, ListChecks } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Briefcase, UserCheck } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface InterviewQuestion {
  estimated_time_minutes: number;
  question: string;
  tip: string;
  type: string;
}

export interface Interview {
  id: string;
  jobPosition: string;
  questionList: InterviewQuestion[];
  interview_type: string;
  question_count: number;
  role: string;
  total_estimated_duration: number;
  userEmail: string;
  createdAt: string;
}

const InterviewCard = ({ data }: { data: Interview }) => {
  const router = useRouter();
  const startInterview = () => {
    router.push(`/ai-mock-interview/start/${data.id}`);
  };
  return (
    <CardContent className="hover:shadow-lg transition-shadow duration-300 border rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-muted-foreground" />
          {data.jobPosition}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <UserCheck className="w-4 h-4" />
            Role
          </span>
          <Badge>{data.role}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <ListChecks className="w-4 h-4" />
            Question Count
          </span>
          <Badge>{data.question_count}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Estimated Time
          </span>
          <Badge>{data.total_estimated_duration} min</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Interview Type</span>
          <Badge className="capitalize">{data.interview_type}</Badge>
        </div>
      </CardContent>
      <Button className="w-full" onClick={startInterview}>
        Start Interview
      </Button>
    </CardContent>
  );
};

export default InterviewCard;
