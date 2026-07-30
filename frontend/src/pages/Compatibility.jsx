import { useState } from "react";

function Compatibility() {
  const [form, setForm] = useState({
    boy_name: "",
    boy_birth_date: "",
    boy_birth_time: "",
    boy_birth_place: "",

    girl_name: "",
    girl_birth_date: "",
    girl_birth_time: "",
    girl_birth_place: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function checkCompatibility() {
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/astrology/compatibility",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        error: "Unable to connect to AstroAI API",
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        ❤️ Marriage Compatibility
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Boy */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            👨 Groom Details
          </h2>

          <input
            className="border p-2 rounded w-full mb-3"
            placeholder="Name"
            name="boy_name"
            value={form.boy_name}
            onChange={handleChange}
          />

          <input
            type="date"
            className="border p-2 rounded w-full mb-3"
            name="boy_birth_date"
            value={form.boy_birth_date}
            onChange={handleChange}
          />

          <input
            type="time"
            className="border p-2 rounded w-full mb-3"
            name="boy_birth_time"
            value={form.boy_birth_time}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Birth Place"
            name="boy_birth_place"
            value={form.boy_birth_place}
            onChange={handleChange}
          />

        </div>

        {/* Girl */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            👩 Bride Details
          </h2>

          <input
            className="border p-2 rounded w-full mb-3"
            placeholder="Name"
            name="girl_name"
            value={form.girl_name}
            onChange={handleChange}
          />

          <input
            type="date"
            className="border p-2 rounded w-full mb-3"
            name="girl_birth_date"
            value={form.girl_birth_date}
            onChange={handleChange}
          />

          <input
            type="time"
            className="border p-2 rounded w-full mb-3"
            name="girl_birth_time"
            value={form.girl_birth_time}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Birth Place"
            name="girl_birth_place"
            value={form.girl_birth_place}
            onChange={handleChange}
          />

        </div>

      </div>

      <button
        onClick={checkCompatibility}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg"
      >
        {loading ? "Checking..." : "❤️ Check Compatibility"}
      </button>

      {result?.error && (
        <div className="mt-6 text-red-600 font-semibold">
          {result.error}
        </div>
      )}

      {result && !result.error && (

        <div className="mt-8 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            💕 Compatibility Result
          </h2>

          <p><b>Boy:</b> {result.boy_name}</p>

          <p><b>Girl:</b> {result.girl_name}</p>

          <p><b>Match Percentage:</b> {result.match_percentage}%</p>

          <p><b>Guna Milan:</b> {result.guna_match}/36</p>

          <p><b>Manglik:</b> {result.manglik}</p>

          <p><b>Nadi Dosh:</b> {result.nadi_dosh}</p>

          <p><b>Bhakoot:</b> {result.bhakoot}</p>

          <p><b>Marriage Prediction:</b></p>

          <div className="bg-gray-100 rounded-lg p-4 mt-2 whitespace-pre-wrap">
            {result.prediction}
          </div>

          <h3 className="text-xl font-bold mt-6 mb-2">
            ❤️ Strengths
          </h3>

          <p>{result.strengths}</p>

          <h3 className="text-xl font-bold mt-6 mb-2">
            ⚠ Challenges
          </h3>

          <p>{result.challenges}</p>

          <h3 className="text-xl font-bold mt-6 mb-2">
            🕉 Remedies
          </h3>

          <p>{result.remedies}</p>

        </div>

      )}

    </div>
  );
}

export default Compatibility;