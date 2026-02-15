# LiveKit Voice Agent Setup

This guide explains how to set up the LiveKit Voice Agent.

## Prerequisites

- Python 3.9 or higher installed.

## Setup

1.  Navigate to the `voice-agent` directory:

    ```bash
    cd voice-agent
    ```

2.  Create a virtual environment:

    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    - Windows: `venv\Scripts\activate`
    - macOS/Linux: `source venv/bin/activate`

4.  Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5.  Copy `.env.local` to `.env` (or just edit `.env.local` directly as the code loads it):
    ```bash
    cp .env.local .env
    ```

## API Keys

You need to obtain the following API keys and add them to your `.env.local` file:

### LiveKit

1.  Sign up at [LiveKit Cloud](https://cloud.livekit.io/).
2.  Create a new project.
3.  Go to **Settings** > **Keys** to find your `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET`.

### Google Gemini

1.  Obtain a Google AI Studio key: [Get API key](https://aistudio.google.com/app/apikey)
2.  Set as `GOOGLE_API_KEY`.

### Cartesia (TTS)

1.  Sign up at [Cartesia](https://cartesia.ai/).
2.  Obtain an API key.
3.  Set as `CARTESIA_API_KEY`.

### AssemblyAI (STT)

1.  Sign up at [AssemblyAI](https://www.assemblyai.com/).
2.  Get your API key from the dashboard.
3.  Set as `ASSEMBLYAI_API_KEY`.

## Running the Agent

Once configured, run the agent in development mode:

```bash
python agent.py dev
```

This will start the agent and connect it to your LiveKit project.
