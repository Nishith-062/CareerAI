import { InputOTPWithSeparator } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";

const Verified = () => {
  const [otp, setOtp] = useState("");
  const { verify, user } = useAuthStore();
  const handleVerify = () => {
    if (!user?.email) return;
    console.log(user.email,otp);
    try {
      
    } catch (error) {
      
    }
    verify(user.email, otp);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-6 dark:bg-zinc-950/50">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-sm ring-1 ring-primary/20">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Verify your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter the 6-digit code sent to your email.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center py-2">
            <InputOTPWithSeparator value={otp} onChange={setOtp} />
          </div>

          <Button
            className="w-full h-11 text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            size="lg"
            onClick={handleVerify}
          >
            Verify Account
          </Button>
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Didn't receive the code?{" "}
            <button className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded">
              Click to resend
            </button>
          </p>
          <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <Link
              to="/login"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>{" "}
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verified;
