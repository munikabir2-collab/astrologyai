import React from "react";

function TopBar({ title = "🤖 Gemini AI Dashboard" }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "#1e293b",
        color: "#fff",
        borderBottom: "1px solid #334155",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28 }}>🤖</span>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            {title}
          </h2>

          <small
            style={{
              color: "#cbd5e1",
            }}
          >
            AI Chat • Vision • Voice • Documents • Translation
          </small>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          🌙 Dark
        </button>

        <button
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "#fff",
          }}
        >
          👤 Profile
        </button>
      </div>
    </header>
  );
}

export default TopBar;

