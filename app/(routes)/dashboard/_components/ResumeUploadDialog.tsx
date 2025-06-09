"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { File, Loader2Icon, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
const ResumeUploadDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [analysisType, setAnalysisType] = useState<"role" | "jd">("role");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [describeRole, setDescribeRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const onCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const onJdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJdFile(file);
    }
  };

  const onUploadAndAnalyze = async () => {
    setLoading(true);
    if (!cvFile) return;
    if (analysisType === "jd" && !jdFile) return;

    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("analysisType", analysisType);
    formData.append("recordId", recordId);
    formData.append("cvFile", cvFile);
    if (analysisType === "jd" && jdFile) {
      formData.append("jdFile", jdFile);
    }
    if (analysisType === "role" && describeRole) {
      formData.append("describeRole", describeRole);
    }

    await fetch("/api/ai-resume-analysis", {
      method: "POST",
      body: formData,
    });
    router.push(`/ai-resume-analyzer/${recordId}`);
    setLoading(false);
  };

  const onCancel = () => {
    setCvFile(null);
    setJdFile(null);
    setAnalysisType("role");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload resume pdf file</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-5">
              {/* select type */}
              <div>
                <label className="block mb-1 font-semibold">
                  Analysis type
                </label>
                <Select
                  value={analysisType}
                  onValueChange={(value) => {
                    setAnalysisType(value as "role" | "jd");
                    setJdFile(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="role">Phân tích theo vai trò</SelectItem>
                    <SelectItem value="jd">So sánh với JD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {analysisType === "role" && (
                <div>
                  <label className="block mb-1 font-semibold">
                    Describe your role
                  </label>
                  <Textarea
                    placeholder="e.g. Software Engineer"
                    className="w-full"
                    value={describeRole}
                    onChange={(e) => setDescribeRole(e.target.value)}
                  />
                </div>
              )}

              {/* Upload CV */}
              <div>
                <label className="block mb-1 font-semibold">
                  Upload resume
                </label>
                <label
                  htmlFor="cvUpload"
                  className="flex flex-col items-center border border-dashed justify-center gap-2 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <File className="h-10 w-10" />
                  {cvFile ? (
                    <h2 className="mt-3 text-blue-400">{cvFile.name}</h2>
                  ) : (
                    <h2 className="mt-3">
                      Click here to upload your resume PDF
                    </h2>
                  )}
                </label>
                <input
                  type="file"
                  id="cvUpload"
                  className="hidden"
                  accept="application/pdf"
                  onChange={onCvFileChange}
                />
              </div>

              {/* upload jd */}
              {analysisType === "jd" && (
                <div>
                  <label className="block mb-1 font-semibold">
                    Upload Job Description
                  </label>
                  <label
                    htmlFor="jdUpload"
                    className="flex flex-col items-center border border-dashed justify-center gap-2 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <File className="h-10 w-10" />
                    {jdFile ? (
                      <h2 className="mt-3 text-blue-400">{jdFile.name}</h2>
                    ) : (
                      <h2 className="mt-3">
                        Click here to upload Job Description PDF
                      </h2>
                    )}
                  </label>
                  <input
                    type="file"
                    id="jdUpload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={onJdFileChange}
                  />
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={!cvFile || (analysisType === "jd" && !jdFile)}
            onClick={onUploadAndAnalyze}
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles />
            )}
            Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadDialog;
