# Debate Me, AI

The project has been hosted at : https://debate-me-seven.vercel.app/

Github repo link : https://github.com/theunknownadorable/DebateME/tree/master
Further updations to be done on other branches...

An interactive web application that lets users engage in dynamic, personality-driven debates with an AI opponent powered by Google Gemini.  
Sharpen your critical thinking, practice argumentation skills, and enjoy lively discussions anytime, anywhere.

---

## Features

- Choose any debate topic and take a stance (For or Against).  
- Select the AI’s personality (e.g., Serious Scholar, Snarky Comedian, Chill Philosopher).  
- Enter your opening argument and get instant, persuasive counterarguments from the AI.  
- Chat-style interface showing the conversation history.  
- Responsive, modern UI built with Next.js and Tailwind CSS.  

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Next.js API Routes (Node.js)  
- **AI Integration:** Google Gemini API (`@google/generative-ai` npm package)  
- **Environment:** `.env.local` for API keys  
- **Deployment:** Recommended on Vercel  

---

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)  
- Google Cloud account with access to Gemini API and API key  

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/debate-me-ai.git
   cd debate-me-ai

2. Install dependencies:
   ```bash
   npm install

3. Create .env.local in the project root and add your Gemini API key:
    GEMINI_API_KEY=your_api_key_here

4. Run the development server:
    ```bash
    npm run dev

5. Open http://localhost:3000 in your browser to use the app.


## Usage:

1. Enter a debate topic.

2. Select your stance (For/Against).

3. Choose the AI personality.

4. Type your opening argument.

5. Click “Start Debate” and watch the AI generate counterarguments in real-time.

## Troubleshooting:

1. If you get 503 Service Unavailable errors, Gemini’s API might be overloaded. Try again later or implement retry logic.

2. Check your .env.local file if you get authentication errors.

3. Make sure you have an active internet connection and valid API key.

