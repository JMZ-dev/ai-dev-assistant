import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot, Code2, Sparkles, Bug, FileText, Send, Copy, Check } from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const modes = [
  { id: "assistant", label: "Assistant", icon: Bot, hint: "General programming help" },
  { id: "debug", label: "Debug", icon: Bug, hint: "Fix errors and bugs" },
  { id: "code", label: "Code", icon: Code2, hint: "Generate clean code" },
  { id: "explain", label: "Explain", icon: Sparkles, hint: "Learn concepts clearly" },
  { id: "resume", label: "Resume", icon: FileText, hint: "Improve CV wording" },
];

const examples = [
  "Explain REST APIs with a simple Node.js example.",
  "Debug this React error and tell me the fix.",
  "Create an Express route for user authentication.",
  "Rewrite this project description for my developer resume.",
];

function App() {
  const [mode, setMode] = useState("assistant");
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function askAI() {
    setError("");
    setReply("");

    if (prompt.trim().length < 3) {
      setError("Please enter a clear prompt first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setReply(data.reply);
    } catch (err) {
      setError(err.message || "Unable to contact the server.");
    } finally {
      setLoading(false);
    }
  }

  async function copyReply() {
    if (!reply) return;
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-content">
          <span className="badge"><Sparkles size={16} /> AI-Powered Developer Workflow</span>
          <h1>AI Dev Assistant</h1>
          <p>
            A polished full-stack portfolio project that helps developers generate code,
            debug errors, explain concepts, and improve technical resume content.
          </p>
          <div className="hero-actions">
            <a href="#assistant" className="primary-link">Try the assistant</a>
            <a href="https://github.com/JMZ-dev" className="secondary-link" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div className="stats-panel">
          <div><strong>React</strong><span>Frontend</span></div>
          <div><strong>Node.js</strong><span>Backend</span></div>
          <div><strong>OpenAI API</strong><span>AI Integration</span></div>
        </div>
      </section>

      <section id="assistant" className="assistant-grid">
        <div className="control-panel">
          <h2>Choose a workflow</h2>
          <div className="mode-grid">
            {modes.map(({ id, label, icon: Icon, hint }) => (
              <button
                key={id}
                className={mode === id ? "mode active" : "mode"}
                onClick={() => setMode(id)}
                type="button"
              >
                <Icon size={20} />
                <span>{label}</span>
                <small>{hint}</small>
              </button>
            ))}
          </div>

          <h3>Example prompts</h3>
          <div className="examples">
            {examples.map((item) => (
              <button type="button" key={item} onClick={() => setPrompt(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-panel">
          <div className="panel-header">
            <div>
              <h2>Ask the assistant</h2>
              <p>Write a prompt, select a mode, and get a useful answer.</p>
            </div>
            <Bot className="header-icon" />
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste an error, ask for code, or request an explanation..."
          />

          <button className="send-button" onClick={askAI} disabled={loading} type="button">
            {loading ? "Generating..." : "Generate response"}
            <Send size={18} />
          </button>

          {error && <div className="error-box">{error}</div>}

          <div className="response-card">
            <div className="response-header">
              <strong>AI Response</strong>
              <button onClick={copyReply} disabled={!reply} type="button">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>{reply || "The answer will appear here."}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
