"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ResumeUploadDialog from "./ResumeUploadDialog";

interface AiToolCardProps {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
}

const AiToolCard = ({ tool }: { tool: AiToolCardProps }) => {
  const recordId = uuidv4();
  const router = useRouter();
  const [openResumeUpload, setopenResumeUpload] = useState<boolean>(false);

  const onClick = async () => {
    if (tool.name === "AI Resume Analyzer") {
      setopenResumeUpload(true);
      return;
    }
    if (tool.name === "Career Roadmap Generator") {
      router.push(`${tool.path}/${recordId}`);
      return;
    }
    await fetch("/api/history", {
      method: "POST",
      body: JSON.stringify({ recordId: recordId, content: [] }),
    });
    router.push(`${tool.path}/${recordId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
      <Image src={tool.icon} alt={tool.name} width={40} height={40} />
      <h2 className="font-medium mt-2">{tool.name}</h2>
      <p className="text-gray-400">{tool.desc}</p>
      <Button className="w-full mt-3" onClick={onClick}>
        {tool.button}
      </Button>

      <ResumeUploadDialog
        open={openResumeUpload}
        onClose={() => setopenResumeUpload(false)}
      />
    </div>
  );
};

export default AiToolCard;
