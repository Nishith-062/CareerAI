# 🚀 CareerAI

**CareerAI** is an intelligent, AI-powered career assistant designed to help candidates prepare for interviews through realistic, real-time voice conversations. It analyzes your resume, conducts mock interviews using advanced voice AI, and provides personalized feedback to help you land your dream job.


## ✨ Features

- **🎙️ Real-time Voice Agent**: Practice interviews with a lifelike AI voice agent powered by LiveKit, Cartesia (TTS), and AssemblyAI (STT).
- **📄 Smart Resume Parsing**: Upload your PDF resume, and the AI will tailor its interview questions specifically to your background and experience.
- **🧠 Generative AI Feedback**: Receive instant, actionable, and detailed feedback powered by Google GenAI.
- **🔒 Secure Authentication**: Keep your profile and interview history secure with JWT-based authentication.
- **📊 Interactive Dashboards**: Track your progress and performance through beautiful, responsive charts.
- **📧 Email Notifications**: Get automated updates and summaries via Resend/SendGrid integrations.

## 🛠️ Tech Stack

CareerAI is built with a modern, scalable, and robust technology stack:

### Frontend
- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Radix UI
- **State Management**: Zustand
- **Real-time Communication**: LiveKit React Components
- **Data Visualization**: Recharts

### Backend
- **Environment**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google GenAI (`@google/genai`), Natural NLP
- **Real-time Engine**: LiveKit Server SDK
- **File Handling**: Multer, pdf-parse, Cloudinary

### Voice Agent
- **Language**: Python 3.9+
- **Agent Framework**: LiveKit Agents
- **Speech-to-Text (STT)**: AssemblyAI
- **Text-to-Speech (TTS)**: Cartesia
- **LLM**: Google Gemini

## 📂 Folder Structure

```text
CareerAI/
├── frontend/          # React application (Vite + Tailwind + TypeScript)
├── backend/           # Node.js/Express REST API and WebRTC controllers
├── voice-agent/       # Python-based LiveKit worker for voice interaction
└── README.md          # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MongoDB instance (local or Atlas)
- Accounts for API keys: LiveKit, Google AI Studio, Cartesia, AssemblyAI

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CareerAI.git
cd CareerAI
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory with your MongoDB URI, JWT Secret, LiveKit keys, and Google GenAI keys.
- Run the server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
- Create a `.env` file in the `frontend` directory with your Backend API URL and LiveKit URL.
- Run the development server:
```bash
npm run dev
```

### 4. Setup the Voice Agent
```bash
cd ../voice-agent
python -m venv venv
```
- Activate the virtual environment:
  - **Windows**: `venv\Scripts\activate`
  - **macOS/Linux**: `source venv/bin/activate`
```bash
pip install -r requirements.txt
cp .env.local .env
```
- Populate the `.env` file with your LiveKit, Google Gemini, Cartesia, and AssemblyAI API keys.
- Run the agent:
```bash
python agent.py dev
```

## 💻 Usage

1. Ensure all three services (Frontend, Backend, Voice Agent worker) are running.
2. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).
3. Create an account or log in securely.
4. Upload your resume to provide context to the AI.
5. Click "Start Interview" to connect to the voice agent and begin your mock interview session.
6. Review your feedback dashboard once the session concludes.

## 🤝 Contributing Guidelines

Contributions are welcome! If you'd like to improve CareerAI, please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC). See the `package.json` files for more details.
---
*Built with ❤️ and AI.*
