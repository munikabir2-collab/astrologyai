import { useState } from "react";
import API from "../api/auth";
export default function Panchang() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getPanchang() {
  if (!date || !time || !place) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  try {

    const res = await API.get(
      "/astrology/panchang",
      {
        params: {
          date,
          time,
          place,
        },
      }
    );

    setResult(res.data);

  } catch (err) {

    console.log(err);

    setResult({
      error: "Unable to connect to AstroAI API",
    });

  } finally {

    setLoading(false);

  }
}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          🪐 Panchang
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Birth Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="border rounded-lg p-3"
          />
        </div>

        <button
          onClick={getPanchang}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Loading..." : "Get Panchang"}
        </button>
      </div>

      {result && !result.error && (
        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            🪔 Panchang Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-indigo-700">📅 Date</h3>
              <p>{result.date}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-indigo-700">🕒 Time</h3>
              <p>{result.time}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-indigo-700">📍 Place</h3>
              <p>{result.place}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-bold text-indigo-700">📆 Weekday</h3>
              <p>{result.panchang.weekday}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-700">🌙 Tithi</h3>
              <p>{result.panchang.tithi}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-700">⭐ Nakshatra</h3>
              <p>{result.panchang.nakshatra}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700">🧘 Yoga</h3>
              <p>{result.panchang.yoga}</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-bold text-pink-700">🪔 Karana</h3>
              <p>{result.panchang.karana}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-700">☀ Sun Longitude</h3>
              <p>{result.panchang.sun_longitude}°</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-700">🌕 Moon Longitude</h3>
              <p>{result.panchang.moon_longitude}°</p>
            </div>

          </div>
        </div>
      )}

      {result?.error && (
        <div className="max-w-4xl mx-auto mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
          {result.error}
        </div>
      )}
    </div>
  );
}
