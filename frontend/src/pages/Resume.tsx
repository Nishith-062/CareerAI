import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import useAuthStore from "@/store/useAuthStore";
import { AlertCircle, CheckCircle, FileText, Loader2, Upload } from "lucide-react";
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 gap-6">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-fit">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Upload Resume</h3>
            <p className="text-sm text-muted-foreground">
              Upload your resume (PDF) to get started with the analysis.
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-10 text-center cursor-pointer 
                transition-all duration-200 ease-in-out
                ${file 
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
                <div className={`p-3 rounded-full ${file ? "bg-primary/10" : "bg-muted"}`}>
                  {file ? (
                    <FileText className="h-6 w-6 text-primary" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file ? (
                      <span className="text-primary">Ready to upload</span>
                    ) : (
                      "PDF files only (max 5MB)"
                    )}
                  </p>
                </div>
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
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Current: {user?.resume ? "Resume on file" : "File selected"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Section */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-fit">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold leading-none tracking-tight">Resume Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights and ATS optimization tips
                </p>
              </div>
              {user?.ats?.score && (
                 <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  Number(user.ats.score) >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  Number(user.ats.score) >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  Score: {user.ats.score}/100
                </div>
              )}
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="flex flex-col gap-6">
              {!user?.ats && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <div className="p-3 rounded-full bg-muted">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No Analysis Yet</p>
                    <p className="text-xs text-muted-foreground w-64">
                      Upload your resume and click analyze to see your ATS score and feedback.
                    </p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleAnalyze} 
                className="w-full"
                disabled={isAnalyzing || !user?.resume && !file} // Require resume uploaded or selected? Usually need uploaded.
                variant={user?.ats ? "outline" : "default"}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  user?.ats ? "Re-analyze Resume" : "Analyze Resume"
                )}
              </Button>

              {user?.ats && (
                <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5">
                  {/* Score Visualization */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-lg border p-4 bg-muted/30 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">ATS Score</span>
                        <span className="text-3xl font-bold">{user.ats.score}</span>
                     </div>
                     <div className="rounded-lg border p-4 bg-muted/30 flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Status</span>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          Number(user.ats.score) >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          Number(user.ats.score) >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {Number(user.ats.score) >= 70 ? "Good" : Number(user.ats.score) >= 50 ? "Average" : "Needs Work"}
                        </span>
                     </div>
                  </div>

                  {user?.ats?.feedback && (
                    <div className="space-y-2">
                       <h4 className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Feedback
                       </h4>
                      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-start leading-relaxed animate-in zoom-in-95 duration-300">
                        {user.ats.feedback}
                      </div>
                    </div>
                  )}

                  {user?.skills && user.skills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Detected Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, i) => (
                          <div
                            key={`${skill.name}-${i}`}
                            className="inline-flex items-center rounded-md border bg-secondary/50 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary"
                          >
                            {skill.name}
                            {skill.level && (
                              <span className="ml-1 opacity-50 font-normal border-l pl-1 border-foreground/20">
                                {skill.level}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
