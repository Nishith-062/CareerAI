import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, Briefcase, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserOppurtunnitiesStore } from "@/store/userOppurtunnitiesStore";
import { Link } from "react-router-dom";
import { JobCardSkeleton } from "@/components/skeletons/JobCardSkeleton";
import { Badge } from "@/components/ui/badge";

const Opportunities = () => {
  const [location, setLocation] = useState("global");
  const { fetchOppurtunnities, oppurnuties, loading } =
    useUserOppurtunnitiesStore();

  const handleClick = () => {
    fetchOppurtunnities(location);
  };

  useEffect(() => {
    fetchOppurtunnities(location);
  }, [fetchOppurtunnities]);

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Salary not disclosed";
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    try {
      // Handle various date formats if necessary
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen text-foreground space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Career Opportunities
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover roles tailored to your skills and career goals.
          </p>
        </div>
        <div className="relative w-full md:w-96 flex gap-2 items-end">
          <div className="w-full">
            <Label className="mb-2 block">Location</Label>
            <Select onValueChange={setLocation} defaultValue={location}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="japan">Japan</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleClick} disabled={loading}>
            {loading ? "Searching..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Render Skeletons
          Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
        ) : oppurnuties.length > 0 ? (
          oppurnuties.map((job, i) => (
            <div
              key={i}
              className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  {job.matchScore && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {Math.round(job.matchScore)}% Match
                    </Badge>
                  )}
                </div>

                <h3
                  className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1"
                  title={job.title}
                >
                  {job.title}
                </h3>
                <p
                  className="text-sm font-medium text-muted-foreground mb-4 line-clamp-1"
                  title={job.company}
                >
                  {job.company}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{job.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 shrink-0" />
                    <span>Posted {formatDate(job.postedDate)}</span>
                  </div>
                  {job.isRemote && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2 shrink-0" />
                      <span>Remote friendly</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  to={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No opportunities found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Try changing your location or checking back later for more roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
