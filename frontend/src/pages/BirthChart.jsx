import { useState } from "react";

export default function BirthChart() {

  const [form, setForm] = useState({
    name: "",
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

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/astrology/kundli",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      setResult(data);

    } catch (err) {

      setResult({
        error: "Unable to connect API",
      });

    }

    setLoading(false);

  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🌌 Birth Chart
      </h1>

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
          className="border p-3 rounded"
          placeholder="Birth Place"
          name="birth_place"
          value={form.birth_place}
          onChange={handleChange}
        />

      </div>

      <button
        onClick={generateChart}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Generating..." : "Generate Birth Chart"}
      </button>

      <br />
      <br />

      {result?.error && (

        <div className="text-red-600">
          {result.error}
        </div>

      )}

      {result && !result.error && (

        <div className="bg-white shadow rounded-xl p-6 mt-6">

          <h2 className="text-2xl font-bold mb-4">
            Birth Chart Result
          </h2>

          <h3 className="font-bold text-lg mb-2">
            Lagna
          </h3>

          <p>
            <b>Rashi :</b> {result.lagna?.rashi}
          </p>

          <p>
            <b>Longitude :</b> {result.lagna?.longitude}
          </p>

          <hr className="my-5"/>

          <h3 className="font-bold text-lg mb-3">
            Planet Summary
          </h3>

          {result.planet_summary &&
            Object.entries(result.planet_summary).map(
              ([planet, value]) => (

                <div
                  key={planet}
                  className="border rounded p-3 mb-3"
                >

                  <h4 className="font-bold">
                    {planet}
                  </h4>

                  <p>
                    Rashi : {value.rashi}
                  </p>

                  <p>
                    Longitude : {value.longitude}
                  </p>

                </div>

              )
            )}

          <hr className="my-5"/>

          <h3 className="font-bold text-lg mb-3">
            Houses
          </h3>

          {result.houses?.map((house) => (

            <div
              key={house.house}
              className="border rounded p-4 mb-4"
            >

              <h4 className="font-bold">
                House {house.house}
              </h4>

              <p>
                Cusp : {house.cusp.rashi}
              </p>

              <p>
                Longitude : {house.cusp.longitude}
              </p>

              <h5 className="mt-3 font-semibold">
                Planets
              </h5>

              {house.planets.length === 0 ? (

                <p>No Planet</p>

              ) : (

                house.planets.map((planet) => (

                  <div key={planet.planet}>

                    • {planet.planet}
                    {" "}
                    ({planet.rashi})

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