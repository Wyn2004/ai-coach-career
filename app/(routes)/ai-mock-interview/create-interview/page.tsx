"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormContainer from "./_components/FormContainer";
import { Progress } from "@/components/ui/progress";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";

export type FormDataInterView = {
  jobPosition: string;
  jdFile: File | null;
  interviewDuration: string;
  interviewType: string[] | [];
};

const CreateInterviewPage = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataInterView>({
    jobPosition: "",
    jdFile: null,
    interviewDuration: "",
    interviewType: [],
  });

  const onHandleChangeValue = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const onNextStep = () => {
    console.log(formData);
    if (
      formData.jobPosition === "" ||
      formData.jdFile === null ||
      formData.interviewDuration === "" ||
      formData.interviewType.length === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    setStep(step + 1);
    toast.success("Interview created successfully");
  };

  const router = useRouter();
  return (
    <div>
      <div className="flex gap-5 items-center">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h2 className="text-2xl font-bold">Create new Interview</h2>
      </div>
      <Progress value={33 * step} className="mt-5" />

      {step === 1 ? (
        <FormContainer
          formData={formData}
          setFormData={setFormData}
          onHandleChangeValue={onHandleChangeValue}
          onNextStep={onNextStep}
        />
      ) : step === 2 ? (
        <QuestionList formData={formData} />
      ) : null}
    </div>
  );
};

export default CreateInterviewPage;
