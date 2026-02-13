import { useState, useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  Lock,
  RotateCw,
  TrendingUp,
  Brain,
  Layers,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "./components/StatCard";
import { axiosInstance } from "@/lib/axios";

// Mock data for a target role - in a real app this would come from the backend or user selection
interface SkillAnalysis {
  name: string;
  level: number;
  userLevel: number;
  gap: number;
  status: string;
}

interface GapAnalysisState {
  overallMatch: number;
  targetRole: string;
  missingSkills: SkillAnalysis[];
  gapSkills: SkillAnalysis[];
  masteredSkills: SkillAnalysis[];
  analysis: SkillAnalysis[];
}

const SkillGap = () => {
  const { user } = useAuthStore();
  const [analyzing, setAnalyzing] = useState(true);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisState>({
    overallMatch: 0,
    targetRole: "",
    missingSkills: [],
    gapSkills: [],
    masteredSkills: [],
    analysis: [],
  });

  const { overallMatch, targetRole, missingSkills, gapSkills, masteredSkills } =
    gapAnalysis;

  // Simulate analysis loading state

  useEffect(() => {
    const fetchGapAnalysis = async () => {
      try {
        const response = await axiosInstance.get("/skillgap");
        setGapAnalysis(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching gap analysis:", error);
      } finally {
        setAnalyzing(false);
      }
    };
    fetchGapAnalysis();
  }, []);

  const stats = [
    {
      title: "Role Match",
      value: `${overallMatch}%`,
      description: "Overall match with target role",
      icon: <Target className="h-5 w-5" />,
      iconWrapperClassName: "bg-primary/10 text-primary",
      footer: <Progress value={overallMatch} className="mt-4 h-2" />,
    },
    {
      title: "Missing Skills",
      value: missingSkills.length,
      description: "Critical skills required for this role",
      valueClassName: "text-red-500",
      icon: <AlertTriangle className="h-5 w-5" />,
      iconWrapperClassName: "bg-red-500/10 text-red-500",
    },
    {
      title: "To Improve",
      value: gapSkills.length,
      description: "Skills needing proficiency boost",
      valueClassName: "text-amber-500",
      icon: <TrendingUp className="h-5 w-5" />,
      iconWrapperClassName: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern similar to Dashboard */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Gradient Blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-8 w-8 text-primary" />
              Skill Gap Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare your current skills against industry standards for your
              target role.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card/60 backdrop-blur-md border border-border/50 px-4 py-2 rounded-lg shadow-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Target Role:
            </span>
            <Badge variant="secondary" className="font-semibold text-primary">
              {targetRole || "Select a Role"}
            </Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              iconWrapperClassName={stat.iconWrapperClassName}
              valueClassName={stat.valueClassName}
              footer={stat.footer}
            />
          ))}
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Missing & Gaps */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <CardTitle>Action Required</CardTitle>
                </div>
                <CardDescription>
                  Focus on these areas to increase your role eligibility
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {analyzing ? (
                  <div className="flex items-center justify-center p-12">
                    <RotateCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {/* High Priority: Missing Skills */}
                    {missingSkills.length > 0 &&
                      missingSkills.map((skill, i) => (
                        <div
                          key={`missing-${i}`}
                          className="p-4 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                                <Lock className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                  {skill.name}
                                  <Badge
                                    variant="destructive"
                                    className="text-[10px] px-1.5 py-0 h-5"
                                  >
                                    Missing
                                  </Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Required Level:{" "}
                                  <span className="font-medium text-foreground">
                                    {skill.level}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 group-hover:border-primary/50 group-hover:text-primary transition-all"
                            >
                              Learn <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                    {/* Medium Priority: Skill Gaps */}
                    {gapSkills.map((skill, i) => (
                      <div
                        key={`gap-${i}`}
                        className="p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-1">
                              <TrendingUp className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                {skill.name}
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5 border-amber-500/50 text-amber-600 bg-amber-500/10"
                                >
                                  Improve
                                </Badge>
                              </h3>
                              <div className="flex items-center gap-2 mt-1 text-sm">
                                <span className="text-muted-foreground">
                                  Current: {skill.userLevel}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium text-foreground">
                                  Target: {skill.level}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 text-primary hover:text-primary/80"
                          >
                            Upskill
                          </Button>
                        </div>
                      </div>
                    ))}

                    {missingSkills.length === 0 && gapSkills.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium">
                          You're fully qualified!
                        </h3>
                        <p className="text-muted-foreground">
                          You meet or exceed all requirements for this role.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Path Recommendation */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                    <Brain className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Generate Learning Plan
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Create a personalized roadmap to bridge your text skill
                      gaps.
                    </p>
                  </div>
                </div>
                <Button className="whitespace-nowrap shadow-lg shadow-primary/20">
                  Generate Roadmap
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Mastered Skills */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle>Matched Skills</CardTitle>
                </div>
                <CardDescription>
                  Requirements you meet or exceed
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {analyzing ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {masteredSkills.map((skill, i) => (
                      <div
                        key={`mastered-${i}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10"
                      >
                        <span className="font-medium text-sm flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          {skill.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0"
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                    {masteredSkills.length === 0 && (
                      <div className="text-center p-8 text-muted-foreground">
                        <p>No skills matched yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
