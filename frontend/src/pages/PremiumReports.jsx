import React from "react";

const reports = [
  {
    icon: "🤖",
    title: "Gemini AI Chat",
    price: "₹49 / Chat",
    color: "#3b82f6",
  },
  {
    icon: "🔮",
    title: "Complete Horoscope",
    price: "₹99",
    color: "#8b5cf6",
  },
  {
    icon: "📜",
    title: "Professional Kundli (PDF)",
    price: "₹99",
    color: "#f97316",
  },
  {
    icon: "🌌",
    title: "Birth Chart Analysis",
    price: "₹79",
    color: "#06b6d4",
  },
  {
    icon: "❤️",
    title: "Marriage Compatibility",
    price: "₹149",
    color: "#ec4899",
  },
  {
    icon: "🪐",
    title: "Panchang Report",
    price: "FREE",
    color: "#10b981",
  },
  {
    icon: "⏳",
    title: "Dasha Analysis",
    price: "₹99",
    color: "#6366f1",
  },
  {
    icon: "🌠",
    title: "Transit Prediction",
    price: "₹79",
    color: "#0ea5e9",
  },
  {
    icon: "🧿",
    title: "Numerology Report",
    price: "₹49",
    color: "#14b8a6",
  },
  {
    icon: "🖐",
    title: "AI Palm Reading",
    price: "₹99",
    color: "#f59e0b",
  },
  {
    icon: "😊",
    title: "AI Face Reading",
    price: "₹99",
    color: "#ef4444",
  },
  {
    icon: "📷",
    title: "Kundli Scanner",
    price: "₹49",
    color: "#22c55e",
  },
  {
    icon: "🎙",
    title: "Voice Astrology",
    price: "₹99",
    color: "#a855f7",
  },
  {
    icon: "🧾",
    title: "AI Premium Report",
    price: "₹199",
    color: "#dc2626",
  },
  {
    icon: "📅",
    title: "Muhurat Report",
    price: "₹49",
    color: "#f97316",
  },
];

export default function PremiumReports() {
  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        💰 Premium Reports
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "35px",
        }}
      >
        Unlock premium AI astrology services individually.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {reports.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 5px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                textAlign: "center",
              }}
            >
              {item.icon}
            </div>

            <h3
              style={{
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {item.title}
            </h3>

            <h2
              style={{
                textAlign: "center",
                color: item.color,
              }}
            >
              {item.price}
            </h2>

            <button
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background:
                  item.price === "FREE" ? "#16a34a" : "#2563eb",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "15px",
              }}
            >
              {item.price === "FREE"
                ? "Use Now"
                : "Pay & Unlock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
