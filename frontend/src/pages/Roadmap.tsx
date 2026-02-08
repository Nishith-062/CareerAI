import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  date?: string;
}

const roadmapData: Milestone[] = [
  {
    id: 1,
    title: "Master React Basics",
    description: "Learn components, props, state, and hooks.",
    status: "completed",
    date: "Jan 2024",
  },
  {
    id: 2,
    title: "Build First Project",
    description: "Create a Todo App or Weather App to practice.",
    status: "completed",
    date: "Feb 2024",
  },
  {
    id: 3,
    title: "Learn Backend Integration",
    description: "Connect React frontend with Node.js/Express API.",
    status: "in-progress",
    date: "Current",
  },
  {
    id: 4,
    title: "Advanced Data Structures",
    description: "Master algorithms and optimization techniques.",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Job Applications",
    description: "Prepare resume and apply to junior developer roles.",
    status: "upcoming",
  },
];

const Roadmap = () => {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Your Career Roadmap
          </h1>
          <p className="text-muted-foreground">
            Track your progress and stay focused on your goals.
          </p>
        </div>

        <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-12 pb-12">
          {roadmapData.map((step) => (
            <div key={step.id} className="relative pl-8 md:pl-12">
              {/* Timeline Indicator */}
              <div className="absolute -left-[9px] top-1 bg-background">
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : step.status === "in-progress" ? (
                  <Circle className="w-5 h-5 text-blue-500 fill-blue-500/20 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Content Card */}
              <div
                className={`
                p-6 rounded-xl border border-border bg-card transition-all duration-300
                ${step.status === "in-progress" ? "ring-2 ring-primary/20 shadow-lg" : "hover:shadow-md"}
              `}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {step.title}
                    {step.status === "in-progress" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        In Progress
                      </span>
                    )}
                  </h3>
                  {step.date && (
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      {step.date}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">{step.description}</p>

                {step.status === "in-progress" && (
                  <Button variant="default" className="w-full md:w-auto mt-2">
                    Continue Learning <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
