import { useState } from "react";
import API from "../api/auth";
import PaymentButton from "../components/PaymentButton";
export default function Dasha() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [email, setEmail] = useState("");
  const [paid, setPaid] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getDasha() {
    if (!date || !time || !place) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/astrology/dasha?date=${date}&time=${time}&place=${encodeURIComponent(
          place
        )}`
      );

      const data = await res.json();

      if (!res.ok) {
        setResult({
          success: false,
          error: data.detail || "Request failed",
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult({
        success: false,
        error: "API Connection Failed",
      });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Form */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6">
          🔱 Vimshottari Dasha
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="date"
            className="border p-3 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="border p-3 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <input
            type="text"
            className="border p-3 rounded"
            placeholder="Birth Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
          <input
            type="email"
            className="border p-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <PaymentButton
           email={email}
           reportType="dasha"
           amountText="₹99"
           onSuccess={() => {
           setPaid(true);
           alert("✅ Payment Successful");
           }}
/>   
        <button
           onClick={getDasha}
           disabled={!paid || loading}
           className={`mt-5 ml-3 px-6 py-3 rounded text-white ${
         paid
             ? "bg-purple-600 hover:bg-purple-700"
             : "bg-gray-400 cursor-not-allowed"
            }`}
>
           {loading
              ? "Calculating..."
              : paid
              ? "🔱 Get Dasha"
              : "💳 Pay First"}
        </button>
      </div>

      {/* Error */}
      {result?.success === false && (
        <div className="max-w-5xl mx-auto mt-5 bg-red-100 text-red-700 p-4 rounded">
          ❌ {result.error}
        </div>
      )}

      {/* Result */}
      {result?.success && (
        <div className="max-w-5xl mx-auto mt-8 bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            🔮 Dasha Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-100 p-4 rounded">
              <p>🌙 Moon Longitude</p>
              <h3 className="font-bold text-xl">
                {result.dasha.moon_longitude}°
              </h3>
            </div>

            <div className="bg-blue-100 p-4 rounded">
              <p>⭐ Nakshatra Number</p>
              <h3 className="font-bold text-xl">
                {result.dasha.nakshatra_number}
              </h3>
            </div>
          </div>

          <div className="mt-6 bg-yellow-100 p-5 rounded">
            <h2 className="text-xl font-bold mb-3">
              🔱 Current Mahadasha
            </h2>

            <p>
              <b>Planet:</b>{" "}
              {result.dasha.current_mahadasha.planet}
            </p>

            <p>
              <b>Duration:</b>{" "}
              {result.dasha.current_mahadasha.years} Years
            </p>

            <p>
              <b>Start:</b>{" "}
              {result.dasha.current_mahadasha.start}
            </p>

            <p>
              <b>End:</b>{" "}
              {result.dasha.current_mahadasha.end}
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            📜 Vimshottari Timeline
          </h2>

          <div className="space-y-4">
            {result.dasha.vimshottari_dasha.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 bg-gray-50"
              >
                <h3 className="text-xl font-bold">
                  {index + 1}. {item.planet}
                </h3>

                <p>
                  ⏳ Years: <b>{item.years}</b>
                </p>

                <p>
                  📅 {item.start} → {item.end}
                </p>

                {item.antardasha && (
                  <div className="mt-4">
                    <h4 className="font-bold text-purple-700 mb-2">
                      🔹 Antardasha
                    </h4>

                    {item.antardasha.map((ad, i) => (
                      <div
                        key={i}
                        className="border rounded p-3 mb-2 bg-white"
                      >
                        <p>
                          <b>{ad.planet}</b>
                        </p>

                        <p>{ad.years} Years</p>

                        <p>
                          {ad.start} → {ad.end}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border rounded-xl p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              🤖 AI Astrology Report
            </h2>

            {result.ai_report ? (
              <div className="whitespace-pre-wrap leading-8">
                {result.ai_report}
              </div>
            ) : (
              <p className="text-gray-500">
                AI report not available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}