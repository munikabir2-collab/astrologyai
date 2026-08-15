import { Link } from "react-router-dom";

export default function Dashboard() {

  const menus = [

    {
      title: "Gemini AI Chat",
      icon: "🤖",
      path: "/gemini",
      color: "from-blue-500 to-cyan-500",
    },

    {
      title: "AI Astrology",
      icon: "🔮",
      path: "/astrology",
      color: "from-purple-500 to-pink-500",
    },

    {
      title: "Daily Horoscope",
      icon: "⭐",
      path: "/horoscope",
      color: "from-yellow-400 to-orange-500",
    },

    {
      title: "Professional Kundli",
      icon: "📜",
      path: "/kundli",
      color: "from-green-500 to-emerald-600",
    },

    {
      title: "Birth Chart",
      icon: "🌌",
      path: "/birth-chart",
      color: "from-indigo-500 to-purple-600",
    },

    {
      title: "Panchang",
      icon: "📅",
      path: "/panchang",
      color: "from-orange-500 to-red-500",
    },

    {
      title: "Vimshottari Dasha",
      icon: "🪐",
      path: "/dasha",
      color: "from-sky-500 to-blue-700",
    },

    {
      title: "Kundli Matching",
      icon: "❤️",
      path: "/compatibility",
      color: "from-red-500 to-pink-600",
    },

    {
      title: "Numerology",
      icon: "🔢",
      path: "/numerology",
      color: "from-lime-500 to-green-600",
    },

    {
      title: "Tarot Reading",
      icon: "🃏",
      path: "/tarot",
      color: "from-fuchsia-500 to-violet-600",
    },

    {
      title: "Professional PDF",
      icon: "📄",
      path: "/reports",
      color: "from-emerald-500 to-teal-600",
    },

    {
      title: "Profile",
      icon: "👤",
      path: "/profile",
      color: "from-slate-500 to-gray-700",
    },

    {
      title: "Settings",
      icon: "⚙️",
      path: "/settings",
      color: "from-gray-700 to-black",
    },

  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-center text-indigo-700 mb-3">
          🌟 AstroAI Dashboard
        </h1>

        <p className="text-center text-gray-600 mb-10">
          AI Powered Vedic Astrology Platform
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {menus.map((item) => (

            <Link
              key={item.title}
              to={item.path}
              className={`rounded-3xl shadow-xl bg-gradient-to-r ${item.color}
              text-white p-7 hover:scale-105 hover:shadow-2xl transition duration-300`}
            >

              <div className="text-6xl text-center">
                {item.icon}
              </div>

              <h2 className="mt-5 text-xl font-bold text-center">
                {item.title}
              </h2>

              <p className="mt-2 text-center text-sm opacity-90">
                Open {item.title}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );

}

