"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InterviewCard, { Interview } from "./_components/InterviewCard";

const AiMockInterviewPage = () => {
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const router = useRouter();

  const getInterview = async () => {
    const response = await fetch(`/api/ai-question-interview`);
    const data = await response.json();
    setInterviewList(data);
  };
  getInterview();
  const onCreateInterview = () => {
    router.push("/ai-mock-interview/create-interview");
  };
  return (
    <div>
      <Button onClick={onCreateInterview}>Create Interview +</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {interviewList?.length > 0 &&
          interviewList.map((item, index) => (
            <InterviewCard key={index} data={item} />
          ))}
      </div>
    </div>
  );
};

export default AiMockInterviewPage;
