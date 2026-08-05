
import { useState } from "react";
import PaymentButton from "../components/PaymentButton";
const API_URL = "http://127.0.0.1:8000";

function Muhurat() {
  const [form, setForm] = useState({
    email: "",
    target_date: "",
    place: "",
    latitude: "",
    longitude: "",
    purpose: "marriage",
    timezone: "Asia/Kolkata",
  });
  const [paid, setPaid] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getMuhurat = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/astrology/muhurat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_date: form.target_date,
          place: form.place,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          purpose: form.purpose,
          timezone: form.timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to calculate Muhurat"
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">शुभ मुहूर्त</h1>
        <p className="text-muted">
          अपने कार्य के लिए शुभ समय और मुहूर्त खोजें।
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={getMuhurat}>
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">
                  Target Date
                </label>

                <input
                  type="date"
                  name="target_date"
                  value={form.target_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Place
                </label>

                <input
                  type="text"
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Bhagalpur"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="25.2425"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="86.9842"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Purpose
                </label>

                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="marriage">Marriage</option>
                  <option value="house">
                    House / Griha Pravesh
                  </option>
                  <option value="vehicle">
                    Vehicle Purchase
                  </option>
                  <option value="business">
                    Business
                  </option>
                  <option value="travel">Travel</option>
                  <option value="education">
                    Education
                  </option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Email
                  Timezone
                </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="example@gmail.com"
                    required
                   />
                <input
                  type="text"
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12">
                 <PaymentButton
                  email={form.email}
                  reportType="muhurat"
                  amountText="₹49"
                  onSuccess={() => {
                  setPaid(true);
                  alert("✅ Payment Successful");
                }}
              />



                <button
                 type="submit"
                      disabled={!paid || loading}
                      className={`btn px-4 ms-2 ${
             paid
                     ? "btn-primary"
                     : "btn-secondary"
             }`}
              >
                     {loading
                     ? "Calculating..."
                     : paid
                     ? "🔱 Generate Muhurat"
                     : "💳 Pay First"}
                </button>
              </div>

            </div>
          </form>

          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-4">

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h3>{result.purpose_label}</h3>

              {result.purpose_label_hi && (
                <p className="text-muted">
                  {result.purpose_label_hi}
                </p>
              )}

              <p className="mb-1">
                <strong>Date:</strong>{" "}
                {result.date}
              </p>

              <p className="mb-1">
                <strong>Place:</strong>{" "}
                {result.place}
              </p>

              {result.recommendation && (
                <div className="alert alert-success mt-3 mb-0">
                  <strong>Recommendation:</strong>{" "}
                  {result.recommendation}
                </div>
              )}
            </div>
          </div>

          {result.assessment && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h4>Assessment</h4>

                <p>
                  <strong>Score:</strong>{" "}
                  {result.assessment.score}
                </p>

                <p>
                  <strong>Rating:</strong>{" "}
                  {result.assessment.rating}
                </p>

                {result.assessment.reasons?.length > 0 && (
                  <ul>
                    {result.assessment.reasons.map(
                      (reason, index) => (
                        <li key={index}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          {result.auspicious_windows?.length > 0 && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h4>शुभ समय</h4>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                      </tr>
                    </thead>

                    <tbody>
                      {result.auspicious_windows.map(
                        (window, index) => (
                          <tr key={index}>
                            <td>{window.start}</td>
                            <td>{window.end}</td>
                            <td>
                              {window.duration_minutes} minutes
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {result.inauspicious_periods && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h4>अशुभ समय</h4>

                <p>
                  <strong>Rahu Kaal:</strong>{" "}
                  {result.inauspicious_periods.rahu_kaal}
                </p>

                <p>
                  <strong>Yamaganda:</strong>{" "}
                  {result.inauspicious_periods.yamaganda}
                </p>

                <p>
                  <strong>Gulika:</strong>{" "}
                  {result.inauspicious_periods.gulika}
                </p>
              </div>
            </div>
          )}

          {result.panchang && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h4>Panchang</h4>

                <p>
                  <strong>Sunrise:</strong>{" "}
                  {result.panchang.sunrise}
                </p>

                <p>
                  <strong>Sunset:</strong>{" "}
                  {result.panchang.sunset}
                </p>
              </div>
            </div>
          )}

          {result.disclaimer && (
            <div className="alert alert-secondary">
              {result.disclaimer}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Muhurat;

