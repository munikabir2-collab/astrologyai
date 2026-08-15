
import { useState } from "react";
import API from "../api/auth";

export default function BirthChart() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function generateChart() {
    if (
      !form.name ||
      !form.email ||
      !form.birth_date ||
      !form.birth_time ||
      !form.birth_place
    ) {
      setResult({
        error:
          "Please enter name, email, birth date, birth time and birth place.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log("Birth Chart API:", "/astrology/kundli");
      console.log("Birth Chart Data:", form);

      const response = await API.post(
        "/astrology/kundli",
        form
      );

      console.log(
        "Birth Chart Response:",
        response.data
      );

      setResult(response.data);
    } catch (err) {
      console.error(
        "Birth Chart Error:",
        err.response?.data || err
      );

      setResult({
        error:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to connect to AstroAI API",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🌌 Birth Chart
      </h1>

      {/* FORM */}
      <div className="bg-white shadow rounded-xl p-6">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="border p-3 rounded"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded"
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded"
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded"
            type="time"
            name="birth_time"
            value={form.birth_time}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded md:col-span-2"
            placeholder="Birth Place"
            name="birth_place"
            value={form.birth_place}
            onChange={handleChange}
          />

        </div>

        <button
          type="button"
          onClick={generateChart}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded"
        >
          {loading
            ? "⏳ Generating..."
            : "Generate Birth Chart"}
        </button>

      </div>

      {/* ERROR */}
      {result?.error && (
        <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg">
          ❌ {result.error}
        </div>
      )}

      {/* RESULT */}
      {result && !result.error && (
        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-2xl font-bold mb-4">
            🌌 Birth Chart Result
          </h2>

          {/* LAGNA */}
          <h3 className="font-bold text-lg mb-2">
            🌅 Lagna
          </h3>

          <p>
            <b>Rashi:</b>{" "}
            {result.lagna?.rashi || "-"}
          </p>

          <p>
            <b>Longitude:</b>{" "}
            {result.lagna?.longitude ?? "-"}
          </p>

          <hr className="my-5" />

          {/* PLANETS */}
          <h3 className="font-bold text-lg mb-3">
            🪐 Planet Summary
          </h3>

          {result.planet_summary &&
            Object.entries(
              result.planet_summary
            ).map(([planet, value]) => (
              <div
                key={planet}
                className="border rounded p-4 mb-3 bg-gray-50"
              >
                <h4 className="font-bold text-lg">
                  {planet}
                </h4>

                <p>
                  <b>Rashi:</b>{" "}
                  {value?.rashi || "-"}
                </p>

                <p>
                  <b>Longitude:</b>{" "}
                  {value?.longitude ?? "-"}
                </p>
              </div>
            ))}

          <hr className="my-5" />

          {/* HOUSES */}
          <h3 className="font-bold text-lg mb-3">
            🏠 Houses
          </h3>

          {result.houses?.map((house) => (
            <div
              key={house.house}
              className="border rounded p-4 mb-4"
            >
              <h4 className="font-bold text-lg">
                House {house.house}
              </h4>

              <p>
                <b>Cusp Rashi:</b>{" "}
                {house.cusp?.rashi || "-"}
              </p>

              <p>
                <b>Longitude:</b>{" "}
                {house.cusp?.longitude ?? "-"}
              </p>

              <h5 className="mt-3 font-semibold">
                Planets
              </h5>

              {!house.planets ||
              house.planets.length === 0 ? (
                <p className="text-gray-500">
                  No Planet
                </p>
              ) : (
                house.planets.map((planet, index) => (
                  <div
                    key={`${house.house}-${planet.planet}-${index}`}
                  >
                    • {planet.planet} ({planet.rashi})
                  </div>
                ))
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}



