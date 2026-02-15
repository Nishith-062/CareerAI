import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useVoiceAssistant,
  BarVisualizer,
  DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Status Indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${
            state === "listening"
              ? "bg-green-500 animate-pulse"
              : state === "thinking"
                ? "bg-yellow-500 animate-pulse"
                : state === "speaking"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-500"
          }`}
        />
        <span className="text-sm font-medium text-muted-foreground capitalize">
          {state === "listening"
            ? "Listening..."
            : state === "thinking"
              ? "Thinking..."
              : state === "speaking"
                ? "Speaking..."
                : state === "connecting"
                  ? "Connecting..."
                  : "Idle"}
        </span>
      </div>

      {/* Audio Visualizer */}
      <div className="w-full max-w-md h-40 flex items-center justify-center rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm overflow-hidden p-4">
        {audioTrack ? (
          <BarVisualizer
            state={state}
            trackRef={audioTrack}
            barCount={24}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mic className="h-5 w-5" />
            <span className="text-sm">Waiting for audio...</span>
          </div>
        )}
      </div>

      {/* Mic Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {state === "listening" ? (
            <>
              <Mic className="h-4 w-4 text-green-500" />
              <span>Your microphone is active</span>
            </>
          ) : (
            <>
              <MicOff className="h-4 w-4" />
              <span>Start speaking when the agent is listening</span>
            </>
          )}
        </div>
      </div>

      {/* Disconnect Button */}
      <DisconnectButton className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer font-medium">
        <PhoneOff className="h-4 w-4" />
        End Session
      </DisconnectButton>
    </div>
  );
}

export default function VoiceAgent() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const res = await axiosInstance.post("/livekit/token");
      setToken(res.data.token);
      setUrl(res.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setToken(null);
    setUrl(null);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 p-6 md:p-8 max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Phone className="h-4 w-4" />
            AI Voice Assistant
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Career Guidance Assistant
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a real-time voice conversation with your AI career advisor.
            Discuss your skills, career goals, and get personalized guidance.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8">
          {token && url ? (
            <LiveKitRoom
              token={token}
              serverUrl={url}
              connect={true}
              audio={true}
              video={false}
              onDisconnected={handleDisconnect}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <RoomAudioRenderer />
              <VoiceAssistantUI />
            </LiveKitRoom>
          ) : (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Mic className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Ready to Talk?
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Click below to start a voice session with your AI career
                  guidance assistant. Make sure your microphone is enabled.
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/25"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    Start Voice Session
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Speak Clearly",
              desc: "Talk naturally as you would to a mentor",
            },
            {
              title: "Ask Anything",
              desc: "Skills, roadmaps, interviews, resume tips",
            },
            {
              title: "Get Actionable Plans",
              desc: "Receive step-by-step career guidance",
            },
          ].map((tip, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 text-center"
            >
              <h4 className="font-medium text-foreground text-sm">
                {tip.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
