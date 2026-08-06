import { useState } from "react";
import PaymentButton from "../components/PaymentButton";
import API from "../api/auth";
const API_URL = "https://astrologyai-s2y5.onrender.com";

export default function PalmReading() {

  const [form, setForm] = useState({
    email: "",
    name: "",
  });

  const [image, setImage] = useState(null);

  const [paid, setPaid] = useState(false);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  async function analyzePalm() {

    if (!paid) {
      alert("Please purchase Palm Reading first.");
      return;
    }

    if (!image) {
      alert("Please upload palm image.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const data = new FormData();

      data.append("email", form.email);
      data.append("name", form.name);
      data.append("image", image);

      const response = await fetch(
        `${API_URL}/astrology/palm-reading`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json.detail || "Palm Reading Failed"
        );
      }

      setResult(json);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-8">

          ✋ AI Palm Reading

        </h1>

        <div className="grid gap-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-3"
          />

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="border rounded p-3"
          />

        </div>

        <div className="mt-6 flex gap-4">

          <PaymentButton
            email={form.email}
            reportType="palm"
            amountText="₹99"
            onSuccess={() => {
              setPaid(true);
              alert("✅ Payment Successful");
            }}
          />

          <button
            onClick={analyzePalm}
            disabled={!paid || loading}
            className={`px-6 py-3 rounded text-white ${
              paid
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >

            {loading
              ? "Analyzing..."
              : paid
              ? "✋ Analyze Palm"
              : "💳 Pay First"}

          </button>

        </div>

        

        {result && (
          <div className="mt-8 space-y-6">

            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                🖐 Palm Analysis
              </h2>

              <p><b>Palm Type:</b> {result.palm_type}</p>
              <p><b>Dominant Element:</b> {result.element}</p>

              <div className="bg-gray-100 rounded p-4 mt-4">
                {result.personality}
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                ✋ Palm Lines
              </h2>

              <p><b>❤️ Heart Line:</b> {result.heart_line}</p>
              <p><b>🧠 Head Line:</b> {result.head_line}</p>
              <p><b>🌱 Life Line:</b> {result.life_line}</p>
              <p><b>⭐ Fate Line:</b> {result.fate_line}</p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                🔮 Predictions
              </h2>

              <p><b>Career:</b> {result.career}</p>
              <p><b>Love:</b> {result.love}</p>
              <p><b>Health:</b> {result.health}</p>
              <p><b>Wealth:</b> {result.wealth}</p>
            </div>

            {result.strengths && (
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="font-bold mb-3">💪 Strengths</h2>

                <ul className="list-disc ml-6">
                  {result.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.weaknesses && (
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="font-bold mb-3">⚠ Weaknesses</h2>

                <ul className="list-disc ml-6">
                  {result.weaknesses.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.remedies && (
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="font-bold mb-3">🕉 Remedies</h2>

                <ul className="list-disc ml-6">
                  {result.remedies.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.ai_report && (
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">
                  🤖 AI Palm Reading Report
                </h2>

                <div className="whitespace-pre-wrap leading-8">
                  {result.ai_report}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}