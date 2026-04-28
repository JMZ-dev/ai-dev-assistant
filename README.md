# AI Dev Assistant

A professional full-stack AI assistant project built with **React**, **Node.js**, **Express**, and the **OpenAI API**.  
It helps developers generate code, debug errors, explain programming concepts, and improve technical resume wording.

## Features

- Modern responsive React interface
- Node.js / Express backend API
- OpenAI Chat Completions integration
- Multiple assistant modes: Assistant, Debug, Code, Explain, Resume
- Secure API key handling through server-side `.env`
- Rate limiting and basic security with Helmet
- Copy response button
- Production-ready structure for GitHub and deployment

## Tech Stack

**Frontend:** React, Vite, CSS, Lucide Icons  
**Backend:** Node.js, Express.js  
**AI:** OpenAI API  
**Security:** Helmet, CORS, Rate Limiting  
**Tools:** Git, GitHub, npm

## Project Structure

```txt
ai-dev-assistant/
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── server/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Configure environment variables

Create a `.env` file inside the `server` folder:

```bash
cd server
cp .env.example .env
```

Then add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Run the project locally

From the root folder:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Build for Production

```bash
npm run build
npm start
```

## Deployment Suggestions

### Option 1: Render

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Set the root directory to the project root.
4. Build command:

```bash
npm install && npm run install:all && npm run build
```

5. Start command:

```bash
npm start
```

6. Add environment variables in Render:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
CLIENT_URL=https://your-render-url.onrender.com
```

### Option 2: Vercel + Render

- Deploy the React frontend on Vercel.
- Deploy the Express backend on Render.
- Add `VITE_API_URL=https://your-backend-url.com` in Vercel environment variables.

## Resume Description

**AI Dev Assistant – Personal Project**  
Developed a full-stack AI-powered developer assistant using React, Node.js, Express, and the OpenAI API. Implemented prompt-based workflows for code generation, debugging, technical explanations, and resume optimization. Built a secure backend API with environment-based key management, rate limiting, and a modern responsive user interface.

## Author

**Zouheir Jaida**  
Full Stack Developer based in Montreal  
GitHub: [JMZ-dev](https://github.com/JMZ-dev)
