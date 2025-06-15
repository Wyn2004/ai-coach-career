"use client";
import React, { useEffect, useState } from "react";
import { FormDataInterView } from "../page";
import {
  Loader2Icon,
  Clock,
  Lightbulb,
  Tag,
  User,
  Brain,
  Target,
  Users,
  Wrench,
  SendIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
interface InterviewQuestion {
  estimated_time_minutes: number;
  question: string;
  tip: string;
  type: string;
}

interface QuestionsResponse {
  interviewQuestions: InterviewQuestion[];
  interview_type: string;
  question_count: number;
  role: string;
  total_estimated_duration: number;
  job_descriptions: string;
}

const QuestionList = ({ formData }: { formData: FormDataInterView }) => {
  const [loading, setloading] = useState<boolean>(false);
  const [questionsData, setQuestionsData] = useState<QuestionsResponse | null>(
    null
  );
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const router = useRouter();

  // Function to get icon based on question type
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "technical":
        return <Wrench className="w-4 h-4" />;
      case "behavioral":
        return <User className="w-4 h-4" />;
      case "leadership":
        return <Users className="w-4 h-4" />;
      case "problem-solving":
        return <Brain className="w-4 h-4" />;
      case "experienced":
        return <Target className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  // Function to get color scheme based on question type
  const getTypeColorScheme = (type: string) => {
    switch (type.toLowerCase()) {
      case "technical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "behavioral":
        return "bg-green-100 text-green-800 border-green-200";
      case "leadership":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "problem-solving":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "experienced":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    let isCalled = false;

    setloading(true);
    const getQuestions = async () => {
      if (isCalled) return;
      isCalled = true;
      try {
        const form = new FormData();
        form.append("jobPosition", formData.jobPosition);
        form.append("interviewDuration", formData.interviewDuration);
        form.append("interviewType", JSON.stringify(formData.interviewType));

        if (formData.jdFile) {
          form.append("jdFile", formData.jdFile);
        }

        const response = await fetch("/api/ai-question-interview", {
          method: "POST",
          body: form,
        });

        const data = await response.json();
        setQuestionsData(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setloading(false);
      }
    };
    if (formData) getQuestions();
  }, [formData]);

  const onFinish = async () => {
    setSaveLoading(true);
    const id = uuidv4();
    const data = {
      questionList: questionsData?.interviewQuestions,
      job_description: questionsData?.job_descriptions,
      question_count: questionsData?.question_count,
      total_estimated_duration: questionsData?.total_estimated_duration,
      interview_type: questionsData?.interview_type,
      role: questionsData?.role,
      id,
    };
    const response = await fetch(
      "/api/ai-question-interview?action=saveQuestionInterview",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    await response.json();
    setSaveLoading(false);
    router.push(`/ai-mock-interview/${id}`);
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-600" />
          <div>
            <h2 className="font-semibold text-blue-900">
              Generating questions...
            </h2>
            <p className="text-sm text-blue-600">This may take a few seconds</p>
          </div>
        </div>
      )}

      {questionsData && (
        <div className="space-y-6">
          {/* Interview Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Interview Questions
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {questionsData.total_estimated_duration} minutes total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 font-medium capitalize">
                  {questionsData.role}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-gray-500">Questions:</span>
                <span className="ml-2 font-medium">
                  {questionsData.question_count}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-gray-500">Types:</span>
                <span className="ml-2 font-medium">
                  {questionsData.interview_type}
                </span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questionsData.interviewQuestions.map((question, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getTypeColorScheme(
                        question.type
                      )}`}
                    >
                      {getTypeIcon(question.type)}
                      {question.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{question.estimated_time_minutes} min</span>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg leading-relaxed">
                    {question.question}
                  </h3>
                </div>

                {/* Tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Tip:</h4>
                      <p className="text-amber-800 text-sm leading-relaxed">
                        {question.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={onFinish} disabled={saveLoading}>
            {saveLoading ? "Creating Interview..." : "Create Interview"}
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
