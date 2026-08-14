import { useState } from "react";
import API from "../api/auth";
function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-indigo-700 mb-3">
        {title}
      </h3>

      <div className="space-y-2">
        {children}
      </div>

      <hr className="mt-6" />
    </div>
  );
}

export default function Astrology() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
});

  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function generateHoroscope() {
    if (
      !form.name ||
      !form.birth_date ||
      !form.birth_time ||
      !form.birth_place
    ) {
      setError("Please fill all birth details.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);

    try {
      const response = await fetch(
        "/astrology/horoscope",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "API Error");
      }

      setResult(data);
      setSuccess("Horoscope Generated Successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    setError("");

    try {
      setPdfLoading(true);

      const response = await fetch(
        "/astrology/download-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Unable to generate PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${form.name}_Professional_Kundli_Report.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccess("Professional Kundli PDF downloaded successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-6xl mx-auto">

        <div className="bg-white shadow-xl rounded-xl p-8">

          <h1 className="text-4xl font-bold text-center mb-8">
            🔮 AI Astrology Report
          </h1>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="border rounded-lg p-3"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3"
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3"
              type="time"
              name="birth_time"
              value={form.birth_time}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Birth Place"
              name="birth_place"
              value={form.birth_place}
              onChange={handleChange}
            />

          </div>

          <button
            onClick={generateHoroscope}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg"
          >
            {loading ? "Generating..." : "Generate Horoscope"}
          </button>

        </div>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg">
            ✅ {success}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-white shadow-xl rounded-xl p-8">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-3xl font-bold">
                🌟 Professional Kundli Report
              </h2>

              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                {pdfLoading
                  ? "Generating PDF..."
                  : "📄 Download PDF"}
              </button>

            </div>

            <Section title="👤 Birth Details">
              <p><b>Name:</b> {result.name}</p>
              <p><b>Date:</b> {result.birth_details?.date}</p>
              <p><b>Time:</b> {result.birth_details?.time}</p>
              <p><b>Place:</b> {result.birth_details?.place}</p>
            </Section>

            <Section title="📍 Location">
              <p><b>Latitude:</b> {result.location?.latitude}</p>
              <p><b>Longitude:</b> {result.location?.longitude}</p>
            </Section>

            <Section title="🌅 Lagna">
              <p><b>Rashi:</b> {result.chart?.lagna?.rashi}</p>
              <p><b>Longitude:</b> {result.chart?.lagna?.longitude}</p>
            </Section>

            <Section title="🌙 Moon">
              <p><b>Rashi:</b> {result.chart?.moon?.rashi}</p>
              <p><b>Nakshatra:</b> {result.chart?.moon?.nakshatra}</p>
            </Section>

            <Section title="🪐 Planet Positions">
              {Object.entries(result.chart?.planets || {}).map(([planet, value]) => (
                <div
                  key={planet}
                  className="border rounded-lg p-4 mb-3 bg-gray-50"
                >
                  <h4 className="font-bold">{planet}</h4>
                  <p>Rashi : {value.rashi}</p>
                  <p>Nakshatra : {value.nakshatra}</p>
                  <p>Longitude : {value.longitude}</p>
                </div>
              ))}
            </Section>

            <Section title="📅 Panchang">
              <p>Weekday : {result.panchang?.weekday}</p>
              <p>Tithi : {result.panchang?.tithi}</p>
              <p>Nakshatra : {result.panchang?.nakshatra}</p>
              <p>Yoga : {result.panchang?.yoga}</p>
              <p>Karana : {result.panchang?.karana}</p>
            </Section>

            <Section title="⏳ Current Mahadasha">
  <p><b>Planet:</b> {result.dasha?.current_mahadasha?.planet}</p>
  <p><b>Years:</b> {result.dasha?.current_mahadasha?.years}</p>
  <p><b>Start:</b> {result.dasha?.current_mahadasha?.start}</p>
  <p><b>End:</b> {result.dasha?.current_mahadasha?.end}</p>
   </Section>

    <Section title="🪐 Current Antardasha">
      {result.dasha?.current_mahadasha?.antardasha?.map((item, index) => (
    <div
      key={index}
      className="border rounded-lg p-4 mb-3 bg-gray-50"
    >
      <p><b>Planet:</b> {item.planet}</p>
      <p><b>Years:</b> {item.years}</p>
      <p><b>Start:</b> {item.start}</p>
      <p><b>End:</b> {item.end}</p>
    </div>
  ))}
</Section>

            <Section title="🤖 AI Astrology Report">
              <div className="bg-gray-100 rounded-lg p-5 whitespace-pre-wrap">
                {result.gemini_report}
              </div>
            </Section>

          </div>
        )}

      </div>
    </div>
  );
}
