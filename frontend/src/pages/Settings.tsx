import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Lock, Mail, Globe } from "lucide-react";

const Settings = () => {
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Max" defaultValue="Nishi" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Robinson" defaultValue="" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue="nishi@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us a little about yourself" />
            </div>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive alerts.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily digests of new opportunities.
                    </p>
                  </div>
                </div>
                {/* Simplified toggle visual since Switch might not be available yet, using a button or checkbox styled input would be better but keeping simple for now */}
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Browser Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time notifications on your desktop.
                    </p>
                  </div>
                </div>
                <input type="checkbox" className="h-5 w-5 accent-primary" />
              </div>
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
                className="w-full justify-start text-left font-normal"
              >
                Change Password
              </Button>
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
