import { Link } from "react-router-dom";

export default function Dashboard() {

  const menus = [
    { title: "Gemini AI Chat", icon: "🤖", path: "/gemini" },
    { title: "Astrology", icon: "🔮", path: "/astrology" },
    { title: "Horoscope", icon: "⭐", path: "/horoscope" },
    { title: "Kundli", icon: "📜", path: "/kundli" },
    { title: "Birth Chart", icon: "🌌", path: "/birth-chart" },
    { title: "Compatibility", icon: "❤️", path: "/compatibility" },

    { title: "Panchang", icon: "🪐", path: "/panchang" },
    { title: "Dasha", icon: "⏳", path: "/dasha" },
    { title: "Transit", icon: "🌠", path: "/transit" },
    { title: "Numerology", icon: "🧿", path: "/numerology" },
    { title: "Palm Reading", icon: "🖐", path: "/palm-reading" },
    { title: "Face Reading", icon: "😊", path: "/face-reading" },
    { title: "Kundli Scanner", icon: "📷", path: "/kundli-scanner" },
    { title: "Voice Astrology", icon: "🎙", path: "/voice-astrology" },
    { title: "AI Report", icon: "🧾", path: "/ai-report" },
    { title: "Muhurat", icon: "📅", path: "/muhurat" },
    { title: "Subscription", icon: "💳", path: "/subscription" },
    { title: "Profile", icon: "👤", path: "/profile" },
    { title: "Settings", icon: "⚙", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        AI Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        {menus.map((item) => (

          <Link
            key={item.title}
            to={item.path}
            className="bg-white rounded-xl shadow p-6 hover:scale-105 transition"
          >
            <div className="text-4xl">
              {item.icon}
            </div>

            <h2 className="mt-3 font-semibold">
              {item.title}
            </h2>

          </Link>

        ))}

      </div>

    </div>
  );
}