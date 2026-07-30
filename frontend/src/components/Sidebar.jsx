import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
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
        }}
      >
        <li style={{ marginBottom: 15 }}>
          <Link
            to="/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            🏠 Dashboard
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/gemini"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            🤖 Gemini Chat
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/astrology"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            🔮 Astrology
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/horoscope"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            ⭐ Horoscope
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/birth-chart"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            📜 Birth Chart
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/kundli"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            🪔 Kundli
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/compatibility"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            ❤️ Compatibility
          </Link>
        </li>

        <hr />

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/profile"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            👤 Profile
          </Link>
        </li>

        <li style={{ marginBottom: 15 }}>
          <Link
            to="/settings"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            ⚙️ Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;