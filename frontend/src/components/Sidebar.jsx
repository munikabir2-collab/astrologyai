import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "🤖", label: "Gemini AI Chat", path: "/gemini" },
    { icon: "🔮", label: "Horoscope", path: "/horoscope" },
    { icon: "📜", label: "Kundli", path: "/kundli" },
    { icon: "🌌", label: "Birth Chart", path: "/birth-chart" },
    { icon: "❤️", label: "Compatibility", path: "/compatibility" },
    { icon: "🪐", label: "Panchang", path: "/panchang" },
    { icon: "⏳", label: "Dasha", path: "/dasha" },
    { icon: "🌠", label: "Transit", path: "/transit" },
    { icon: "🧿", label: "Numerology", path: "/numerology" },
    { icon: "🖐", label: "Palm Reading", path: "/palm-reading" },
    { icon: "😊", label: "Face Reading", path: "/face-reading" },
    { icon: "📷", label: "Kundli Scanner", path: "/kundli-scanner" },
    { icon: "🎙", label: "Voice Astrology", path: "/voice-astrology" },
    { icon: "🧾", label: "AI Report", path: "/ai-report" },
    { icon: "📅", label: "Muhurat", path: "/muhurat" },
    { icon: "💰", label: "Premium Reports", path: "/premium" },
    { icon: "👤", label: "Profile", path: "/profile" },
    { icon: "⚙", label: "Settings", path: "/settings" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        🤖 AI Dashboard
      </h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: 12 }}>
            <Link
              to={item.path}
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: "8px",
                color: "#fff",
                textDecoration: "none",
                background:
                  location.pathname === item.path
                    ? "#3b82f6"
                    : "transparent",
                transition: "0.3s",
              }}
            >
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;