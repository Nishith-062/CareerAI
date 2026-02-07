import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                CareerAI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-black hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-[100%] blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-medium text-blue-300">
              New AI Features Available
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
            Shape Your Future with <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-sky-300 to-cyan-200">
              Intelligent Guidance
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
            Navigate your career path with confidence using our advanced
            AI-driven analysis. Get personalized recommendations, resume
            insights, and industry trends in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Precise Matching",
              description:
                "Our AI matches your skills with the perfect role opportunities across the globe.",
            },
            {
              icon: Zap,
              title: "Instant Feedback",
              description:
                "Get real-time analysis on your resume and interview performance.",
            },
            {
              icon: Sparkles,
              title: "Smart Growth",
              description:
                "Personalized learning paths to help you reach your career goals faster.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
