import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react";
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

interface Opportunity {
  id: number;
  company: string;
  role: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  posted: string;
}

const opportunitiesData: Opportunity[] = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    location: "Mountain View, CA (Remote)",
    salary: "$120k - $160k",
    type: "Full-time",
    logo: "https://logo.clearbit.com/google.com",
    posted: "2 days ago",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Software Engineer II",
    location: "Redmond, WA",
    salary: "$130k - $170k",
    type: "Full-time",
    logo: "https://logo.clearbit.com/microsoft.com",
    posted: "5 days ago",
  },
  {
    id: 3,
    company: "Netflix",
    role: "Senior UI Engineer",
    location: "Los Gatos, CA",
    salary: "$180k - $240k",
    type: "Full-time",
    logo: "https://logo.clearbit.com/netflix.com",
    posted: "1 day ago",
  },
  {
    id: 4,
    company: "Spotify",
    role: "Product Designer",
    location: "New York, NY",
    salary: "$110k - $150k",
    type: "Full-time",
    logo: "https://logo.clearbit.com/spotify.com",
    posted: "3 days ago",
  },
];

const Opportunities = () => {
  const [location, setLocation] = useState("global");
  const { fetchOppurtunnities, oppurnuties, loading } =
    useUserOppurtunnitiesStore();

  const handleClick = () => {
    fetchOppurtunnities(location);
  };
  console.log(oppurnuties, "oppurnuties");
  useEffect(() => {
    fetchOppurtunnities(location);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
          <Button onClick={handleClick}>Apply</Button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oppurnuties.map((job, i) => (
          <div
            key={i}
            className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-secondary/50 rounded-lg"></div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {job.matchScore}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mb-4">
              {job.company}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                {job.salaryMin || "N/A"}-{job.salaryMax || "N/A"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Posted{" "}
                {job.postedDate.slice(0, 10).split("-").reverse().join("-")}
              </div>
            </div>

            <Link to={job.applyLink} target="_blank">
              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Apply Now
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
