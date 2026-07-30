import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Gemini from "./pages/Gemini";
import Astrology from "./pages/Astrology";
import Horoscope from "./pages/Horoscope";
import Kundli from "./pages/Kundli";
import BirthChart from "./pages/BirthChart";
import Compatibility from "./pages/Compatibility";

import Panchang from "./pages/Panchang";
import Dasha from "./pages/Dasha";
import Transit from "./pages/Transit";
import Numerology from "./pages/Numerology";
import PalmReading from "./pages/PalmReading";
import FaceReading from "./pages/FaceReading";
import KundliScanner from "./pages/KundliScanner";
import VoiceAstrology from "./pages/VoiceAstrology";
import AIReport from "./pages/AIReport";
import Muhurat from "./pages/Muhurat";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* AI */}
        <Route path="/gemini" element={<Gemini />} />

        {/* Astrology */}
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/horoscope" element={<Horoscope />} />
        <Route path="/kundli" element={<Kundli />} />
        <Route path="/birth-chart" element={<BirthChart />} />
        <Route path="/compatibility" element={<Compatibility />} />

        {/* Advanced Astrology */}
        <Route path="/panchang" element={<Panchang />} />
        <Route path="/dasha" element={<Dasha />} />
        <Route path="/transit" element={<Transit />} />
        <Route path="/numerology" element={<Numerology />} />
        <Route path="/palm-reading" element={<PalmReading />} />
        <Route path="/face-reading" element={<FaceReading />} />
        <Route path="/kundli-scanner" element={<KundliScanner />} />
        <Route path="/voice-astrology" element={<VoiceAstrology />} />
        <Route path="/ai-report" element={<AIReport />} />
        <Route path="/muhurat" element={<Muhurat />} />

        {/* User */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route  path="/subscription" element={<Subscription />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;