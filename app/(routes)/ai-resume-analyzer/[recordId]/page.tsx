"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AiAgentType } from "@/configs/schema";
import ReportRoleDecriptionComponent from "./_components/ReportRoleDecriptionComponent";
import OverallScoreCard from "./_components/OverallScoreCard";
import AnalyzerRole from "./_components/AnalyzerRole";
import AnalyzerJD from "./_components/AnalyzerJD";
const AiResumeAnalyzerPage = () => {
  const { recordId } = useParams();
  const [analysisType, setAnalysisType] = useState<AiAgentType>(
    AiAgentType.AI_RESUME_ANALYSIS_ROLE
  );
  const [data, setData] = useState<any>(null);

  const getHistory = async () => {
    const response = await fetch(`/api/history?recordId=${recordId}`);
    const data = await response.json();
    console.log(data);
    setData(data?.[0]);
    setAnalysisType(data[0]?.aiAgentType);
  };

  useEffect(() => {
    recordId && getHistory();
  }, [recordId]);

  return (
    <div>
      {analysisType === AiAgentType.AI_RESUME_ANALYSIS_ROLE
        ? data && <AnalyzerRole data={data} />
        : data && <AnalyzerJD data={data} />}
    </div>
  );
};

export default AiResumeAnalyzerPage;
