import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { axiosInstance } from "@/lib/axios";
import useAuthStore from "@/store/useAuthStore";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Resume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await axiosInstance.post("/resume/analyze");
      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.error("Analyze failed", error);
      toast.error("Analyze failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70)
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        ring: "ring-green-500/30",
      };
    if (score >= 50)
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        ring: "ring-yellow-500/30",
      };
    return {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      ring: "ring-red-500/30",
    };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto px-6 py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Resume Intelligence
          </h1>
          <p className="text-muted-foreground">
            Upload, analyze, and optimize your resume with AI-powered insights.
          </p>
        </div>

        {/* Upload & Analyze Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Card */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base leading-none">
                    Upload Resume
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF format, max 5MB
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${
                    file
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`p-3 rounded-full ${file ? "bg-primary/10" : "bg-muted"}`}
                  >
                    {file ? (
                      <FileText className="h-5 w-5 text-primary" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file ? (
                      <span className="text-primary font-medium">
                        Ready to upload
                      </span>
                    ) : (
                      "PDF files only"
                    )}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleFileUpload}
                disabled={!file || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Resume"
                )}
              </Button>

              {(user?.resume || file) && (
                <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground bg-muted/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span>
                    {user?.resume ? "Resume on file" : "File selected"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Analyze Card */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base leading-none">
                      ATS Analysis
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Score & optimization tips
                    </p>
                  </div>
                </div>
                {user?.ats?.score != null && user.ats.score > 0 && (
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(user.ats.score).bg} ${getScoreColor(user.ats.score).text}`}
                  >
                    {user.ats.score}/100
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 space-y-5">
              {!user?.ats || user.ats.score === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                  <div className="p-3 rounded-full bg-muted">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No Analysis Yet</p>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    Upload your resume first, then click analyze to see your ATS
                    score.
                  </p>
                </div>
              ) : (
                <>
                  {/* Score & Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-4 bg-muted/30 text-center space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                        ATS Score
                      </span>
                      <p className="text-3xl font-bold">{user.ats.score}</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-muted/30 flex flex-col items-center justify-center text-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                        Status
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getScoreColor(user.ats.score).bg} ${getScoreColor(user.ats.score).text}`}
                      >
                        {getScoreLabel(user.ats.score)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Compatibility</span>
                      <span className="font-medium">{user.ats.score}%</span>
                    </div>
                    <Progress value={user.ats.score} className="h-2" />
                  </div>
                </>
              )}

              <Button
                onClick={handleAnalyze}
                className="w-full"
                disabled={isAnalyzing || !user?.resume}
                variant={
                  user?.ats && user.ats.score > 0 ? "outline" : "default"
                }
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : user?.ats && user.ats.score > 0 ? (
                  "Re-analyze Resume"
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback Section — Full Width Below */}
        {user?.feedback && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strengths */}
            {user.feedback.strengths && user.feedback.strengths.length > 0 && (
              <div className="rounded-xl border bg-card shadow-sm p-5 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Star className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {user.feedback.strengths.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {user.feedback.weaknesses &&
              user.feedback.weaknesses.length > 0 && (
                <div className="rounded-xl border bg-card shadow-sm p-5 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-2">
                    {user.feedback.weaknesses.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Improvements */}
            {user.feedback.improvements &&
              user.feedback.improvements.length > 0 && (
                <div className="rounded-xl border bg-card shadow-sm p-5 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Lightbulb className="h-4 w-4" />
                    Improvements
                  </h4>
                  <ul className="space-y-2">
                    {user.feedback.improvements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <TrendingUp className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Detected Skills Section */}
        {user?.skills && user.skills.length > 0 && (
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base leading-none">
                    Detected Skills
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.skills.length} skills found ·{" "}
                    {user.skills.filter((s) => s.verified).length} verified
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <div
                    key={`${skill.name}-${i}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors
                      ${
                        skill.verified
                          ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                          : "bg-muted/50 border-border text-foreground"
                      }`}
                    title={
                      skill.verificationScore
                        ? `Confidence: ${Math.round(skill.verificationScore * 100)}% · Source: ${skill.verificationSource}`
                        : undefined
                    }
                  >
                    {skill.verified && (
                      <CheckCircle className="w-3 h-3 shrink-0" />
                    )}
                    <span>{skill.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 ml-0.5 font-normal capitalize"
                    >
                      {skill.level}
                    </Badge>
                    {skill.verificationScore > 0 && (
                      <span className="text-[10px] opacity-50 ml-0.5">
                        {Math.round(skill.verificationScore * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
