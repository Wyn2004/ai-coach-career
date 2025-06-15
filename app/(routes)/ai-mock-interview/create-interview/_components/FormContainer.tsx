"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { interviewTypes } from "@/constants/ai-tools-list";
import { ArrowRightIcon, File } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormDataInterView } from "../page";

const FormContainer = ({
  formData,
  onHandleChangeValue,
  onNextStep,
}: {
  formData: FormDataInterView;
  setFormData: (formData: any) => void;
  onHandleChangeValue: (field: string, value: any) => void;
  onNextStep: () => void;
}) => {
  const [interviewType, setInterviewType] = useState<string[]>([]);

  useEffect(() => {
    onHandleChangeValue("interviewType", interviewType);
  }, [interviewType]);

  const addInterviewType = (type: string) => {
    if (interviewType.includes(type)) {
      setInterviewType((prev) => prev.filter((item) => item !== type));
    } else {
      setInterviewType((prev) => [...prev, type]);
    }
  };

  return (
    <div className="p-5 mt-5 rounded-lg">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="Enter job position"
          className="w-full"
          onChange={(e) => onHandleChangeValue("jobPosition", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <label
          htmlFor="jdUpload"
          className="flex flex-col items-center border border-dashed justify-center gap-2 bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <File className="h-10 w-10" />
          {formData.jdFile ? (
            <h2 className="mt-3 text-blue-400">{formData.jdFile.name}</h2>
          ) : (
            <h2 className="mt-3">Click here to upload Job Description PDF</h2>
          )}
        </label>
        <input
          type="file"
          id="jdUpload"
          className="hidden"
          accept="application/pdf"
          onChange={(e) => onHandleChangeValue("jdFile", e?.target?.files?.[0])}
        />
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          onValueChange={(value) =>
            onHandleChangeValue("interviewDuration", value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="20">20 minutes</SelectItem>
            <SelectItem value="25">25 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex flex-wrap gap-5">
          {interviewTypes.map((type, index) => (
            <div
              key={index}
              className={`flex gap-2 p-2 bg-white border border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 items-center justify-center ${
                interviewType.includes(type.name) && "bg-blue-50 text-blue-500"
              }`}
              onClick={() => addInterviewType(type.name)}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Button className="mt-5 " onClick={onNextStep}>
        Generate Interview <ArrowRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FormContainer;
