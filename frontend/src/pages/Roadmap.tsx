import { useEffect, useState } from "react";
import { useRoadmapStore } from "@/store/useRoadmap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "ML Engineer",
  "Data Scientist",
  "Data Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Mobile Developer",
  "Cybersecurity Engineer",
  "QA Engineer",
  "Product Manager",
  "UI/UX Designer",
];

const Roadmap = () => {
  const {
    roadmap,
    loading,
    fetchRoadmap,
    updateMilestoneStatus,
    generateRoadmap,
  } = useRoadmapStore();
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleGenerate = async () => {
    if (selectedRole) {
      await generateRoadmap(selectedRole);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">No Roadmap Found</h2>
        <div className="flex gap-2 items-center">
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Target Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={!selectedRole}>
            Generate Roadmap
          </Button>
        </div>
        <Button variant="outline" onClick={fetchRoadmap}>
          Retry Fetching
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Your Career Roadmap: {roadmap.targetRole}
            </h1>
            <div className="flex gap-2 text-muted-foreground items-center">
              <p className="text-sm">
                Generated on:{" "}
                {new Date(roadmap.generatedAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-muted-foreground mt-2">
              Follow this structured path to master your target role.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change Target Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleGenerate}
              disabled={!selectedRole}
              title="Regenerate Roadmap"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          {roadmap.phases.map((phase) => (
            <div key={phase._id} className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-primary">
                  Phase {phase.phaseNumber}: {phase.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {phase.estimatedWeeks} Weeks
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2">
                  {phase.description}
                </p>
              </div>

              <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-8 pb-4">
                {phase.milestones.map((milestone) => (
                  <div key={milestone._id} className="relative pl-8 md:pl-12">
                    {/* Timeline Indicator */}
                    <div className="absolute -left-[9px] top-1 bg-background z-10 w-5 h-5 flex items-center justify-center">
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100 dark:fill-green-900" />
                      ) : milestone.status === "upcoming" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground bg-background" />
                      ) : (
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                          <Circle className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                        </div>
                      )}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`
                        p-6 rounded-xl border bg-card transition-all duration-300
                        ${
                          milestone.status === "in-progress"
                            ? "border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-primary/20"
                            : "border-border hover:shadow-md"
                        }
                         ${
                           milestone.status === "completed"
                             ? "opacity-80 bg-muted/20"
                             : ""
                         }
                      `}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                          {milestone.title}
                          {milestone.status === "in-progress" && (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                              Current Focus
                            </Badge>
                          )}
                        </h3>
                        <Badge variant="outline" className="w-fit">
                          {milestone.estimatedDays} Days
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {milestone.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {milestone.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="px-2 py-0.5 text-xs font-normal"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {milestone.resources.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                          <h4 className="font-medium text-foreground uppercase tracking-wider text-xs">
                            Recommended Resources
                          </h4>
                          <div className="space-y-2">
                            {milestone.resources.map((resource) => (
                              <a
                                key={resource._id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline group w-fit"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{resource.title}</span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-5 px-1.5 py-0 uppercase opacity-60 group-hover:opacity-100"
                                >
                                  {resource.type}
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {milestone.status !== "completed" && (
                        <div className="mt-6 flex justify-end gap-2">
                          {milestone.status === "upcoming" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                updateMilestoneStatus(
                                  milestone.id,
                                  "in-progress",
                                )
                              }
                            >
                              Start
                            </Button>
                          )}
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              updateMilestoneStatus(milestone.id, "completed")
                            }
                          >
                            Mark as Completed <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
