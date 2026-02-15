import express from "express";
import {
  AccessToken,
  RoomAgentDispatch,
  RoomConfiguration,
} from "livekit-server-sdk";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/token", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userName = req.user.fullname || "Student";

    const roomName = `career-guidance-${userId}-${Date.now()}`;

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userId,
        name: userName,
        ttl: "10m",
      },
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      roomCreate: true,
    });

    // Dispatch the voice agent to join when participant connects
    at.roomConfig = new RoomConfiguration({
      agents: [new RoomAgentDispatch({ agentName: "Avery-2182" })],
    });

    const token = await at.toJwt();

    res.json({
      token,
      url: process.env.LIVEKIT_URL,
      roomName,
    });
  } catch (error) {
    console.log("Error generating LiveKit token:", error.message);
    res.status(500).json({ message: "Failed to generate token" });
  }
});

export default router;
