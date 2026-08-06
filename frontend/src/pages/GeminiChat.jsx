import { useState } from "react";
import API from "../api/auth";
export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("https://astrologyai-s2y5.onrender.com/gemini/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();
      setAnswer(data.response);
    } catch (e) {
      setAnswer(e.toString());
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "800px", margin: "30px auto" }}>
      <h2>Gemini AI Chat</h2>

      <textarea
        rows="6"
        style={{ width: "100%" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br />
      <br />

      <button onClick={sendPrompt}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <hr />

      <h3>Response</h3>

      <div
        style={{
          border: "1px solid gray",
          padding: 20,
          whiteSpace: "pre-wrap",
        }}
      >
        {answer}
      </div>
    </div>
  );
}