"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Interview } from "../../_components/InterviewCard";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";

const StartInterviewPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY || "");

  const getInterview = async () => {
    const response = await fetch(
      `/api/ai-question-interview/?id=${interviewId}`
    );
    const data = await response.json();
    setInterview(data[0]);
  };

  useEffect(() => {
    interview && startCall();
  }, [interview]);

  const startCall = async () => {
    let questionList = "";
    interview?.questionList.map((intem) => {
      questionList = intem.question + "," + questionList;
    });
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi" +
        interview?.userEmail +
        ", how are you? Ready for your interview on" +
        interview?.jobPosition +
        "?",

      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },

      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },

      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
            You are an AI voice assistant conducting interviews.
            Your job is to ask candidates provided interview questions, assess their responses.

            Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
            Example: "Hey there! Welcome to your ${interview?.jobPosition} interview. Let's get started with a few questions!"

            Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise.

            Below are the questions, ask one by one:
            Questions: ${questionList}

            If the candidate struggles, offer hints or rephrase the question without giving away the answer.
            Example: "Need a hint? Think about how React tracks component updates!"

            Provide brief, encouraging feedback after each answer.
            Examples:
            - "Nice! That's a solid answer."
            - "Hmm, not quite! Want to try again?"

            Keep the conversation natural and engaging—use casual phrases like:
            - "Alright, next up..."
            - "Let's tackle a tricky one!"

            After 5–7 questions, wrap up the interview smoothly by summarizing their performance.
            Example:
            "That was great! You handled some tough questions well. Keep sharpening your skills!"

            End on a positive note:
            "Thanks for chatting! Hope to see you crushing projects soon!"

            Key Guidelines:
            • Be friendly, engaging, and witty  
            • Keep responses short and natural, like a real conversation  
            • Adapt based on the candidate's confidence level  
            • Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
    };
    // vapi.start(assistantOptions);
  };

  useEffect(() => {
    if (interviewId) {
      getInterview();
    }
  }, [interviewId]);
  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="text-2xl font-bold flex justify-between">
        AI Interview Session
        <span className="flex items-center gap-2">
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="bg-white p-10 rounded-lg h-[300px] border flex items-center justify-center">
          <Image
            src={"/chatbot.png"}
            alt="chatbot"
            height={100}
            width={100}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
        </div>
        <div className="bg-white p-10 rounded-lg h-[300px] border flex items-center justify-center">
          <h2 className="text-sm font-bold">{interview?.userEmail}</h2>
        </div>
      </div>

      <div className="flex items-center justify-center mt-5 gap-5 text-white">
        <Mic className="w-10 h-10 bg-gray-300 rounded-full p-2 cursor-pointer" />
        <Phone
          className="w-10 h-10 bg-red-500 rounded-full p-2 cursor-pointer"
          onClick={() => vapi.stop()}
        />
      </div>
    </div>
  );
};

export default StartInterviewPage;
