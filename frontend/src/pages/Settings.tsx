import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/useAuthStore";
import { User, Bell, Lock, Mail, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, updateUser,isLoading } = useAuthStore();
  const targetRoles = [
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
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [name, setName] = useState(user?.fullname || "");
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || "");
  const [password, setPassword] = useState("");
  const handleUpdate = async () => {
    await updateUser(targetRole, name, password,githubUsername);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Profile Section */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal details.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 ">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Full name</Label>
                <Input
                  id="firstName"
                  placeholder="Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                disabled
                value={user?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="githubusername">Github Username</Label>
              <Input
                id="githubusername"
                type="text"
                placeholder="Enter your github username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>

<Button
  className="ml-auto cursor-pointer bg-primary text-primary-foreground"
  disabled={isLoading}
  onClick={handleUpdate}
>
  <span className="flex items-center gap-2">
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    <span>Save Changes</span>
  </span>
</Button>
          </section>

          {/* target role */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Target Role</h2>
                <p className="text-sm text-muted-foreground">
                  Update your target role.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 ">
              <div className="grid gap-2">
                <Label htmlFor="targetRole">Target Role</Label>
                <Select
                  value={targetRole}
                  onValueChange={(value) => setTargetRole(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {targetRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your password and security settings.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-destructive hover:text-destructive"
              >
                Delete Account
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
