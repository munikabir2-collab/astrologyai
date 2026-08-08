
import { useState } from "react";
import PaymentButton from "../components/PaymentButton";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://astrologyai-s2y5.onrender.com";

// =========================================================
// Convert objects / arrays into readable React content
// =========================================================
function renderValue(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc ml-5 space-y-1">
        {value.map((item, index) => (
          <li key={index}>
            {renderValue(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="ml-2 space-y-2">
        {Object.entries(value).map(([key, val]) => (
          <div
            key={key}
            className="border-l-2 border-purple-200 pl-3"
          >
            <strong className="capitalize">
              {key.replace(/_/g, " ")}:
            </strong>{" "}
            {renderValue(val)}
          </div>
        ))}
      </div>
    );
  }

  return String(value);
}

export default function Horoscope() {
  const [sign, setSign] = useState("");
  const [result, setResult] = useState(null);

  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [loading, setLoading] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");

  const [paid, setPaid] = useState(false);

  // =========================================================
  // GET DAILY HOROSCOPE
  // =========================================================
  async function getHoroscope() {
    if (!sign) {
      setResult({
        error: "Please select your zodiac sign.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const url =
        `${API_URL}/astrology/prediction?sign=` +
        encodeURIComponent(sign);

      console.log("HOROSCOPE API:", url);

      const res = await fetch(url);

      const text = await res.text();

      console.log("HOROSCOPE STATUS:", res.status);
      console.log("HOROSCOPE RESPONSE:", text);

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON (${res.status})`
          );
        }
      }

      if (!res.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            `Horoscope request failed (${res.status})`
        );
      }

      setResult(data);
    } catch (err) {
      console.error("Horoscope Error:", err);

      setResult({
        error:
          err.message ||
          "Unable to connect AstroAI API",
      });
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================
  async function downloadPDF() {
    if (!paid) {
      setPdfError(
        "❌ Please complete payment first."
      );
      return;
    }

    if (!email) {
      setPdfError(
        "❌ Please enter your email."
      );
      return;
    }

    if (
      !name ||
      !birthDate ||
      !birthTime ||
      !birthPlace
    ) {
      setPdfError(
        "❌ Please enter name, birth date, birth time and birth place."
      );
      return;
    }

    try {
      setPdfLoading(true);
      setPdfMessage("");
      setPdfError("");

      const response = await fetch(
        `${API_URL}/astrology/download-pdf`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            birth_date: birthDate,
            birth_time: birthTime,
            birth_place: birthPlace,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      console.log(
        "PDF STATUS:",
        response.status
      );

      if (!response.ok) {
        const text = await response.text();

        let message =
          `PDF generation failed (${response.status})`;

        if (text) {
          try {
            const data = JSON.parse(text);

            message =
              data.detail ||
              data.message ||
              message;
          } catch {
            message = text;
          }
        }

        throw new Error(message);
      }

      if (
        !contentType.includes(
          "application/pdf"
        )
      ) {
        const text = await response.text();

        throw new Error(
          text ||
            "Server did not return a PDF file."
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "Horoscope_Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setPdfMessage(
        "✅ PDF Download Successfully"
      );
    } catch (error) {
      console.error(
        "PDF Error:",
        error
      );

      setPdfError(
        error.message ||
          "PDF generation failed"
      );
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* =====================================================
          TITLE
      ====================================================== */}

      <h1 className="text-3xl font-bold text-center mb-6">
        🔮 AI Astrology Report
      </h1>

      {/* =====================================================
          DAILY HOROSCOPE
      ====================================================== */}

      <div className="bg-white shadow rounded-xl p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Daily Horoscope
        </h2>

        <select
          className="border p-3 rounded w-full"
          value={sign}
          onChange={(e) =>
            setSign(e.target.value)
          }
        >
          <option value="">
            Select Zodiac Sign
          </option>

          <option value="Aries">
            Aries ♈
          </option>

          <option value="Taurus">
            Taurus ♉
          </option>

          <option value="Gemini">
            Gemini ♊
          </option>

          <option value="Cancer">
            Cancer ♋
          </option>

          <option value="Leo">
            Leo ♌
          </option>

          <option value="Virgo">
            Virgo ♍
          </option>

          <option value="Libra">
            Libra ♎
          </option>

          <option value="Scorpio">
            Scorpio ♏
          </option>

          <option value="Sagittarius">
            Sagittarius ♐
          </option>

          <option value="Capricorn">
            Capricorn ♑
          </option>

          <option value="Aquarius">
            Aquarius ♒
          </option>

          <option value="Pisces">
            Pisces ♓
          </option>
        </select>

        <button
          onClick={getHoroscope}
          disabled={loading}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg w-full"
        >
          {loading
            ? "Loading..."
            : "Get Horoscope"}
        </button>

        {/* =====================================================
            HOROSCOPE RESULT
        ====================================================== */}

        {result && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5">

            {result.error ? (
              <p className="text-red-600 font-medium">
                ❌ {result.error}
              </p>
            ) : (
              <div className="space-y-5">

                {/* SIGN */}

                <h3 className="text-2xl font-bold">
                  {result.sign || sign}
                </h3>

                {/* PREDICTION */}

                {result.prediction && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      🔮 Prediction
                    </h4>

                    <div className="leading-7">
                      {renderValue(
                        result.prediction
                      )}
                    </div>
                  </div>
                )}

                {/* MESSAGE */}

                {result.message && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      💬 Message
                    </h4>

                    <div>
                      {renderValue(
                        result.message
                      )}
                    </div>
                  </div>
                )}

                {/* INSIGHTS */}

                {result.insights && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">
                      ✨ Insights
                    </h4>

                    <div className="space-y-3">
                      {Object.entries(
                        result.insights
                      ).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <strong className="capitalize block mb-1">
                              {key.replace(
                                /_/g,
                                " "
                              )}
                            </strong>

                            <div className="text-gray-700">
                              {renderValue(
                                value
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* OTHER API DATA */}

                {Object.entries(result)
                  .filter(
                    ([key]) =>
                      ![
                        "sign",
                        "prediction",
                        "message",
                        "insights",
                        "error",
                      ].includes(key)
                  )
                  .map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-white p-3 rounded-lg"
                      >
                        <strong className="capitalize block mb-1">
                          {key.replace(
                            /_/g,
                            " "
                          )}
                        </strong>

                        <div>
                          {renderValue(
                            value
                          )}
                        </div>
                      </div>
                    )
                  )}

              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          PDF REPORT
      ====================================================== */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          📄 Horoscope PDF Report
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          className="border p-3 rounded w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="date"
          className="border p-3 rounded w-full mb-3"
          value={birthDate}
          onChange={(e) =>
            setBirthDate(e.target.value)
          }
        />

        <input
          type="time"
          className="border p-3 rounded w-full mb-3"
          value={birthTime}
          onChange={(e) =>
            setBirthTime(e.target.value)
          }
        />

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Birth Place"
          value={birthPlace}
          onChange={(e) =>
            setBirthPlace(e.target.value)
          }
        />

        {/* PAYMENT */}

        <PaymentButton
          email={email}
          reportType="horoscope"
          onSuccess={() => {
            setPaid(true);
            setPdfError("");

            setPdfMessage(
              "✅ Payment successful. PDF is now unlocked."
            );
          }}
        />

        {/* PAYMENT STATUS */}

        {paid && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            ✅ Horoscope Report Paid
          </div>
        )}

        {/* PDF BUTTON */}

        <button
          onClick={downloadPDF}
          disabled={
            pdfLoading || !paid
          }
          className={`mt-4 px-6 py-3 rounded-lg w-full text-white ${
            paid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {pdfLoading
            ? "Generating PDF..."
            : "Download PDF"}
        </button>

        {/* SUCCESS */}

        {pdfMessage && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {pdfMessage}
          </div>
        )}

        {/* ERROR */}

        {pdfError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {pdfError}
          </div>
        )}

      </div>
    </div>
  );
}

