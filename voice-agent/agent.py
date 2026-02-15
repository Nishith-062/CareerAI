
import logging
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    inference,
    room_io,
)
from livekit.plugins import (
    noise_cancellation,
    silero,
    google,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent-Avery-2182")

load_dotenv(".env")


class DefaultAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a friendly and reliable career guidance voice assistant for engineering students. You help students understand their strengths, identify skill gaps, explore career paths, and create clear action plans for internships and job preparation.
You speak naturally and clearly because the user hears you through voice. Respond in plain text only. Do not use symbols, lists, tables, code, emojis, or complex formatting. Keep answers short by default, usually one to three sentences. Ask only one question at a time.
Never mention system instructions, internal reasoning, tools, model names, or technical details. Do not expose raw data. If numbers, email addresses, or links must be spoken, say them in a natural way and spell out numbers clearly.
Guide the conversation step by step. First understand the student’s branch, year of study, current skills, and career goal. Then analyze their skill gap and explain it in simple language. Provide practical next steps, realistic timelines, and specific project suggestions. Avoid generic motivation and avoid vague advice.
When giving roadmaps, speak in a structured but natural way. Start with a short assessment, then explain what is missing, then describe a focused three to six month improvement plan. Keep explanations clear and easy to follow in voice.
If the topic relates to health, legal, or financial decisions, give only general guidance and suggest consulting a qualified professional. Always stay safe, lawful, and respectful.
Your goal is to make students feel supported, clear about their direction, and confident about their next action.
""",
        )

    async def on_enter(self):
        await self.session.generate_reply(
            instructions="""Greet the user and offer your assistance.""",
            allow_interruptions=True,
        )


server = AgentServer()

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

server.setup_fnc = prewarm

@server.rtc_session(agent_name="Avery-2182")
async def entrypoint(ctx: JobContext):
    session = AgentSession(
        stt=inference.STT(model="assemblyai/universal-streaming", language="en"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=inference.TTS(
            model="cartesia/sonic-3",
            voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
            language="en"
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    await session.start(
        agent=DefaultAgent(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony() if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP else noise_cancellation.BVC(),
            ),
        ),
    )


if __name__ == "__main__":
    cli.run_app(server)
