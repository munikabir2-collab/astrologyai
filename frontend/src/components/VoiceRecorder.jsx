import { useState, useRef } from "react";

export default function VoiceRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [recorded, setRecorded] = useState(false);

  const recorder = useRef(null);
  const chunks = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      recorder.current = new MediaRecorder(stream);
      chunks.current = [];

      recorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      recorder.current.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: "audio/webm",
        });

        const file = new File([blob], "voice.webm", {
          type: "audio/webm",
        });

        setAudioURL(URL.createObjectURL(blob));
        setRecorded(true);

        if (onRecorded) {
          onRecorded(file);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.current.start();
      setRecording(true);
      setRecorded(false);
    } catch (err) {
      console.error(err);
      alert("Microphone permission denied.");
    }
  }

  function stopRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }

    setRecording(false);
  }

  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        marginTop: 10,
      }}
    >
      <h3>🎤 Voice Recorder</h3>

      {!recording ? (
        <button
          onClick={startRecording}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          🎙 Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ⏹ Stop Recording
        </button>
      )}

      {recording && (
        <p style={{ color: "red", marginTop: 15 }}>
          🔴 Recording...
        </p>
      )}

      {recorded && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: "green" }}>
            ✅ Voice recorded successfully.
          </p>

          <audio
            controls
            src={audioURL}
            style={{ width: "100%" }}
          />

          <button
            style={{
              marginTop: 15,
              width: "100%",
              padding: 12,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🤖 Voice Ready
          </button>

          <p style={{ marginTop: 10 }}>
            Now click <strong>Talk With Gemini</strong> on the main page.
          </p>
        </div>
      )}
    </div>
  );
}

