# 📝 Blog Writer - AI-Powered Content Generation

## App Type Selected
**✍️ AI Writer** — Generate blog content from any topic using a local LLM (no external APIs required)

## Model Used
**DeepSeek R1 Distill Qwen 7B** - A reasoning model served locally via **LM Studio**

## Features
- 🎯 **Blog Topic Input** - Enter any topic you want to write about
- 📝 **Multiple Blog Types** - Introduction, Full Article, Listicle, Tutorial
- 🎨 **Writing Styles** - Professional, Casual, Technical, Creative
- 🌡️ **Temperature Control** - Adjust creativity level (0.0 to 1.0)
- ⏳ **Loading UI** - Real-time generation progress
- 💾 **Output Logging** - All generations saved to local SQLite database
- 📚 **Generation History** - View and manage past blog posts
- 🔍 **Search History** - Find previous generations by topic

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Backend**: FastAPI + Python
- **Database**: SQLite (local storage)
- **LLM**: DeepSeek R1 via LM Studio local server
- **Styling**: Modern CSS with responsive design

## How to Run Locally

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **LM Studio** with DeepSeek R1 model downloaded

### Step 1: Setup LM Studio
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Download the **DeepSeek R1 Distill Qwen 7B** model
3. Start LM Studio and load the model
4. Go to **"Local Server"** tab and click **"Start Server"**
5. Ensure it's running on `http://localhost:1234`

### Step 2: Clone and Setup Backend
```bash
# Clone the repository
git clone <https://github.com/Harsha-Reddy21/Blog-Writer-Local-LLM-.git>
cd Blog-Writer-Local-LLM

# Setup backend
cd backend
python -m venv venv


.\venv\Scripts\Activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Step 3: Setup Frontend
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Usage Instructions

1. **Enter Topic**: Type your blog topic in the text area
2. **Select Type**: Choose from Introduction, Full Article, Listicle, or Tutorial
3. **Pick Style**: Select Professional, Casual, Technical, or Creative
4. **Adjust Settings**: Optionally modify temperature and token limits
5. **Generate**: Click "Generate Blog" and wait (1-2 minutes for reasoning models)
6. **View Results**: Generated content appears with word/character counts
7. **History**: Access previous generations from the history section

## Performance Notes
- **Generation Time**: 1-2 minutes per blog post (normal for reasoning models)
- **First Request**: May take longer as the model initializes
- **Quality**: DeepSeek R1 provides high-quality, well-reasoned content
- **Local Processing**: Everything runs on your machine - no data sent to external APIs





