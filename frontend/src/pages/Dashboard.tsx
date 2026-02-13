import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useAuthStore from "@/store/useAuthStore";
import {
  User,
  FileText,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  BookOpen,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuthStore();

  // Convert skills to radar chart data
  const skillsData =
    user?.skills?.map((skill) => ({
      skill: skill.name,
      level:
        skill.level === "Beginner"
          ? 30
          : skill.level === "Intermediate"
            ? 60
            : skill.level === "Advanced"
              ? 85
              : skill.level === "Expert"
                ? 100
                : 50,
      fullMark: 100,
    })) || [];

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get skill level badge variant
  const getSkillBadgeVariant = (
    level: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case "Expert":
        return "default";
      case "Advanced":
        return "secondary";
      case "Intermediate":
        return "outline";
      default:
        return "outline";
    }
  };

  // Calculate overall skill score
  const overallScore = user?.skills?.length
    ? Math.round(
        user.skills.reduce((acc, skill) => {
          const value =
            skill.level === "Beginner"
              ? 30
              : skill.level === "Intermediate"
                ? 60
                : skill.level === "Advanced"
                  ? 85
                  : skill.level === "Expert"
                    ? 100
                    : 50;
          return acc + value;
        }, 0) / user.skills.length,
      )
    : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {user?.fullname ? (
                      getInitials(user.fullname)
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Welcome back, {user?.fullname?.split(" ")[0] || "User"}!
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <span>{user?.email}</span>
                    {user?.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </p>
                </div>
              </div>
              {user?.ats && (
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-6 py-3 border border-border/50">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">ATS Score</p>
                    <p className="text-2xl font-bold text-foreground">
                      {user.ats.score}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {user?.skills?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skill Level</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {overallScore}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resume Status</p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {user?.resume ? "Uploaded" : "Not Uploaded"}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    user?.resume ? "bg-green-500/10" : "bg-amber-500/10"
                  }`}
                >
                  <FileText
                    className={`h-6 w-6 ${user?.resume ? "text-green-500" : "text-amber-500"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Profile Status
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {user?.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    user?.isVerified ? "bg-green-500/10" : "bg-amber-500/10"
                  }`}
                >
                  {user?.isVerified ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Radar Chart */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Skills Overview</CardTitle>
                  <CardDescription>
                    Your proficiency across different skills
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {user?.skills && user.skills.length > 0 ? (
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsData}>
                      <PolarGrid stroke="#93c5fd" strokeDasharray="3 3" />

                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{
                          fill: "#1e3a8a",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      />

                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#1e40af", fontSize: 10 }}
                        tickCount={5}
                        axisLine={false}
                      />

                      <Radar
                        name="Skill Level"
                        dataKey="level"
                        stroke="#3b82f6" // blue-500
                        fill="#3b82f6"
                        fillOpacity={0.25}
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#2563eb" }} // blue-600
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#eff6ff", // blue-50
                          border: "1px solid #3b82f6",
                          borderRadius: "10px",
                          color: "#1e3a8a",
                          boxShadow: "0 10px 20px rgba(59,130,246,0.15)",
                        }}
                        labelStyle={{ color: "#1e40af", fontWeight: 600 }}
                        formatter={(value: number) => [
                          `${value}%`,
                          "Proficiency",
                        ]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] w-full flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Skills Data Yet
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Upload your resume to analyze your skills and see your
                    proficiency chart
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills List */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Award className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle>Your Skills</CardTitle>
                  <CardDescription>Detected from resume</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {user?.skills && user.skills.length > 0 ? (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {user.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">
                          {skill.name}
                        </span>
                      </div>
                      <Badge variant={getSkillBadgeVariant(skill.level)}>
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Skills will appear here after resume analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ATS Feedback Section */}
        {user?.ats && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>ATS Analysis</CardTitle>
                    <CardDescription>
                      Resume compatibility score and feedback
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-2xl font-bold text-foreground">
                      {user.ats.score}%
                    </p>
                  </div>
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center ${
                      user.ats.score >= 80
                        ? "bg-green-500/20 ring-2 ring-green-500/50"
                        : user.ats.score >= 60
                          ? "bg-amber-500/20 ring-2 ring-amber-500/50"
                          : "bg-red-500/20 ring-2 ring-red-500/50"
                    }`}
                  >
                    {user.ats.score >= 80 ? (
                      <CheckCircle2 className="h-7 w-7 text-green-500" />
                    ) : user.ats.score >= 60 ? (
                      <AlertCircle className="h-7 w-7 text-amber-500" />
                    ) : (
                      <AlertCircle className="h-7 w-7 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Compatibility
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {user.ats.score}%
                    </span>
                  </div>
                  <Progress value={user.ats.score} className="h-2" />
                </div>
                <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/30">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Feedback
                  </h4>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    {user.feedback?.improvements &&
                    user.feedback.improvements.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {user.feedback.improvements
                          .slice(0, 3)
                          .map((item, index) => (
                            <li key={index} className="text-muted-foreground">
                              {item}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      "No feedback available yet."
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Upload Resume CTA */}
        {!user?.resume && (
          <Card className="border-primary/30 bg-primary/5 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <FileText className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Upload Your Resume
                  </h3>
                  <p className="text-muted-foreground">
                    Get AI-powered insights and skill analysis
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="gap-2">
                <Link to="/resume">
                  <Upload className="h-5 w-5" />
                  Upload Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
