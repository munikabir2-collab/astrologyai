
import { useState } from "react";
import PaymentButton from "../components/PaymentButton";

// ============================================================
// API BASE URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://astrologyai-1.onrender.com";

// ============================================================
// SAFE API RESPONSE READER
// ============================================================

async function readApiResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  console.log("====================================");
  console.log("API STATUS:", response.status);
  console.log("API CONTENT TYPE:", contentType);
  console.log("API RESPONSE:", text);
  console.log("====================================");

  if (!text || !text.trim()) {
    throw new Error(
      `Server returned an empty response (${response.status}).`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error("JSON PARSE ERROR:", error);
    throw new Error(
      `Server returned invalid JSON (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `API request failed (${response.status})`
    );
  }

  return data;
}

// ============================================================
// RENDER OBJECT / ARRAY
// ============================================================

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
          <li key={index}>{renderValue(item)}</li>
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

// ============================================================
// HOROSCOPE PAGE
// ============================================================

export default function Horoscope() {
  // ==========================================================
  // DAILY HOROSCOPE
  // ==========================================================

  const [sign, setSign] = useState("");
  const [dailyResult, setDailyResult] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(false);

  // ==========================================================
  // AI ASTROLOGY REPORT
  // ==========================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ==========================================================
  // PAYMENT
  // ==========================================================

  const [paid, setPaid] = useState(false);

  // ==========================================================
  // PDF
  // ==========================================================

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");

  // ==========================================================
  // DAILY HOROSCOPE
  // GET /astrology/prediction
  // ==========================================================

  async function getDailyHoroscope() {
    if (!sign) {
      setDailyResult({
        error: "Please select your zodiac sign.",
      });
      return;
    }

    setDailyLoading(true);
    setDailyResult(null);

    try {
      const url =
        `${API_URL}/astrology/prediction?sign=${encodeURIComponent(
          sign
        )}`;

      console.log("DAILY HOROSCOPE URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readApiResponse(response);

      setDailyResult(data);
    } catch (error) {
      console.error("DAILY HOROSCOPE ERROR:", error);

      setDailyResult({
        error:
          error?.message ||
          "Unable to connect to AstroAI API.",
      });
    } finally {
      setDailyLoading(false);
    }
  }

  // ==========================================================
  // AI ASTROLOGY REPORT
  // POST /astrology/horoscope
  // ==========================================================

  async function generateAIReport() {
    setPdfError("");
    setPdfMessage("");
    setAiResult(null);

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!name.trim()) {
      setAiResult({
        error: "Please enter your name.",
      });
      return;
    }

    if (!email.trim()) {
      setAiResult({
        error: "Please enter your email.",
      });
      return;
    }

    if (!birthDate) {
      setAiResult({
        error: "Please select your birth date.",
      });
      return;
    }

    if (!birthTime) {
      setAiResult({
        error: "Please select your birth time.",
      });
      return;
    }

    if (!birthPlace.trim()) {
      setAiResult({
        error: "Please enter your birth place.",
      });
      return;
    }

    // --------------------------------------------------------
    // PAYMENT CHECK
    // --------------------------------------------------------

    if (!paid) {
      setAiResult({
        error:
          "Please complete Horoscope Report payment first.",
      });
      return;
    }

    setAiLoading(true);

    try {
      const url =
        `${API_URL}/astrology/horoscope`;

      console.log("====================================");
      console.log("AI ASTROLOGY REPORT");
      console.log("URL:", url);
      console.log("EMAIL:", email);
      console.log("====================================");

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace.trim(),
        }),
      });

      const data = await readApiResponse(response);

      console.log("AI ASTROLOGY DATA:", data);

      setAiResult(data);
    } catch (error) {
      console.error("AI ASTROLOGY ERROR:", error);

      setAiResult({
        error:
          error?.message ||
          "Unable to generate AI Astrology Report.",
      });
    } finally {
      setAiLoading(false);
    }
  }

  // ==========================================================
  // DOWNLOAD PDF
  // POST /astrology/download-pdf
  // ==========================================================

  async function downloadPDF() {
    setPdfMessage("");
    setPdfError("");

    // --------------------------------------------------------
    // PAYMENT
    // --------------------------------------------------------

    if (!paid) {
      setPdfError(
        "❌ Please complete payment first."
      );
      return;
    }

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!email.trim()) {
      setPdfError(
        "❌ Please enter your email."
      );
      return;
    }

    if (!name.trim()) {
      setPdfError(
        "❌ Please enter your name."
      );
      return;
    }

    if (!birthDate) {
      setPdfError(
        "❌ Please select your birth date."
      );
      return;
    }

    if (!birthTime) {
      setPdfError(
        "❌ Please select your birth time."
      );
      return;
    }

    if (!birthPlace.trim()) {
      setPdfError(
        "❌ Please enter your birth place."
      );
      return;
    }

    setPdfLoading(true);

    try {
      const url =
        `${API_URL}/astrology/download-pdf`;

      console.log("====================================");
      console.log("PDF API");
      console.log("URL:", url);
      console.log("====================================");

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/pdf, application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace.trim(),
        }),
      });

      console.log(
        "PDF STATUS:",
        response.status
      );

      const contentType =
        response.headers.get("content-type") || "";

      console.log(
        "PDF CONTENT TYPE:",
        contentType
      );

      // ------------------------------------------------------
      // ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        const text = await response.text();

        console.error(
          "PDF ERROR RESPONSE:",
          text
        );

        let message =
          `PDF generation failed (${response.status})`;

        if (text && text.trim()) {
          try {
            const data = JSON.parse(text);

            message =
              data?.detail ||
              data?.message ||
              message;
          } catch {
            message = text;
          }
        }

        throw new Error(message);
      }

      // ------------------------------------------------------
      // PDF CHECK
      // ------------------------------------------------------

      if (
        !contentType
          .toLowerCase()
          .includes("application/pdf")
      ) {
        const text = await response.text();

        console.error(
          "EXPECTED PDF BUT RECEIVED:",
          text
        );

        throw new Error(
          text ||
            "Server did not return a PDF file."
        );
      }

      // ------------------------------------------------------
      // BLOB
      // ------------------------------------------------------

      const blob =
        await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Server returned an empty PDF file."
        );
      }

      // ------------------------------------------------------
      // DOWNLOAD
      // ------------------------------------------------------

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        "AstroAI_Horoscope_Report.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(
        downloadUrl
      );

      setPdfMessage(
        "✅ PDF downloaded successfully."
      );
    } catch (error) {
      console.error(
        "PDF ERROR:",
        error
      );

      setPdfError(
        error?.message ||
          "PDF generation failed."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* ======================================================
          TITLE
      ======================================================= */}

      <h1 className="text-3xl font-bold text-center mb-8">
        🔮 AI Astrology Report
      </h1>

      {/* ======================================================
          DAILY HOROSCOPE
      ======================================================= */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          🌞 Daily Horoscope
        </h2>

        <select
          className="border p-3 rounded-lg w-full"
          value={sign}
          onChange={(e) => {
            setSign(e.target.value);
            setDailyResult(null);
          }}
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
          onClick={getDailyHoroscope}
          disabled={dailyLoading}
          className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg w-full"
        >
          {dailyLoading
            ? "Loading..."
            : "Get Horoscope"}
        </button>

        {/* DAILY RESULT */}

        {dailyResult && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5">

            {dailyResult.error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                ❌ {dailyResult.error}
              </div>
            ) : (
              <div className="space-y-4">

                <h3 className="text-2xl font-bold">
                  {dailyResult.sign || sign}
                </h3>

                {dailyResult.rashi && (
                  <div>
                    <strong>🪐 Rashi:</strong>{" "}
                    {renderValue(
                      dailyResult.rashi
                    )}
                  </div>
                )}

                {dailyResult.nakshatra && (
                  <div>
                    <strong>⭐ Nakshatra:</strong>{" "}
                    {renderValue(
                      dailyResult.nakshatra
                    )}
                  </div>
                )}

                {dailyResult.prediction && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      🔮 Prediction
                    </h4>

                    {renderValue(
                      dailyResult.prediction
                    )}
                  </div>
                )}

                {dailyResult.career && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      💼 Career
                    </h4>

                    <p className="mt-1">
                      {renderValue(
                        dailyResult.career
                      )}
                    </p>
                  </div>
                )}

                {dailyResult.love && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      ❤️ Love
                    </h4>

                    <p className="mt-1">
                      {renderValue(
                        dailyResult.love
                      )}
                    </p>
                  </div>
                )}

                {dailyResult.health && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      ❤️‍🩹 Health
                    </h4>

                    <p className="mt-1">
                      {renderValue(
                        dailyResult.health
                      )}
                    </p>
                  </div>
                )}

                {dailyResult.finance && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      💰 Finance
                    </h4>

                    <p className="mt-1">
                      {renderValue(
                        dailyResult.finance
                      )}
                    </p>
                  </div>
                )}

                {dailyResult.lucky_number && (
                  <div>
                    <strong>
                      🔢 Lucky Number:
                    </strong>{" "}
                    {renderValue(
                      dailyResult.lucky_number
                    )}
                  </div>
                )}

                {dailyResult.lucky_color && (
                  <div>
                    <strong>
                      🎨 Lucky Color:
                    </strong>{" "}
                    {renderValue(
                      dailyResult.lucky_color
                    )}
                  </div>
                )}

                {dailyResult.lucky_day && (
                  <div>
                    <strong>
                      📅 Lucky Day:
                    </strong>{" "}
                    {renderValue(
                      dailyResult.lucky_day
                    )}
                  </div>
                )}

                {dailyResult.lucky_mantra && (
                  <div>
                    <strong>
                      🕉️ Lucky Mantra:
                    </strong>{" "}
                    {renderValue(
                      dailyResult.lucky_mantra
                    )}
                  </div>
                )}

                {dailyResult.remedy && (
                  <div>
                    <strong>
                      🙏 Remedy:
                    </strong>{" "}
                    {renderValue(
                      dailyResult.remedy
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================
          AI ASTROLOGY REPORT
      ======================================================= */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-5">
          🤖 AI Astrology Report
        </h2>

        <div className="space-y-3">

          {/* NAME */}

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* EMAIL */}

          <input
            type="email"
            className="border p-3 rounded-lg w-full"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* DATE */}

          <input
            type="date"
            className="border p-3 rounded-lg w-full"
            value={birthDate}
            onChange={(e) =>
              setBirthDate(e.target.value)
            }
          />

          {/* TIME */}

          <input
            type="time"
            className="border p-3 rounded-lg w-full"
            value={birthTime}
            onChange={(e) =>
              setBirthTime(e.target.value)
            }
          />

          {/* PLACE */}

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Birth Place"
            value={birthPlace}
            onChange={(e) =>
              setBirthPlace(e.target.value)
            }
          />
        </div>

        {/* ====================================================
            PAYMENT
        ===================================================== */}

        <div className="mt-5">

          <PaymentButton
            email={email}
            reportType="horoscope"
            onSuccess={() => {
              setPaid(true);
              setPdfError("");
              setPdfMessage(
                "✅ Payment successful."
              );
            }}
          />

        </div>

        {/* PAYMENT STATUS */}

        {paid && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            ✅ Horoscope Report Payment Successful
          </div>
        )}

        {/* ====================================================
            GENERATE AI REPORT
        ===================================================== */}

        <button
          onClick={generateAIReport}
          disabled={aiLoading || !paid}
          className={`mt-5 px-6 py-3 rounded-lg w-full text-white ${
            paid
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {aiLoading
            ? "Generating AI Report..."
            : "Generate AI Astrology Report"}
        </button>

        {/* ====================================================
            AI RESULT
        ===================================================== */}

        {aiResult && (
          <div className="mt-6 bg-gray-50 rounded-xl p-5">

            {aiResult.error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                ❌ {aiResult.error}
              </div>
            ) : (
              <div className="space-y-5">

                <h3 className="text-2xl font-bold">
                  🌌 Astrology Report
                </h3>

                {aiResult.name && (
                  <p>
                    <strong>Name:</strong>{" "}
                    {aiResult.name}
                  </p>
                )}

                {aiResult.birth_details && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      👤 Birth Details
                    </h4>

                    {renderValue(
                      aiResult.birth_details
                    )}
                  </div>
                )}

                {aiResult.location && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      📍 Location
                    </h4>

                    {renderValue(
                      aiResult.location
                    )}
                  </div>
                )}

                {aiResult.chart && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      🌌 Birth Chart
                    </h4>

                    {renderValue(
                      aiResult.chart
                    )}
                  </div>
                )}

                {aiResult.panchang && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      🕉️ Panchang
                    </h4>

                    {renderValue(
                      aiResult.panchang
                    )}
                  </div>
                )}

                {aiResult.dasha && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold mb-2">
                      🔱 Dasha
                    </h4>

                    {renderValue(
                      aiResult.dasha
                    )}
                  </div>
                )}

                {aiResult.gemini_report && (
                  <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl">

                    <h4 className="text-xl font-bold mb-3">
                      🤖 Gemini AI Report
                    </h4>

                    <div className="leading-7">
                      {renderValue(
                        aiResult.gemini_report
                      )}
                    </div>
                  </div>
                )}

                {/* OTHER DATA */}

                {Object.entries(aiResult)
                  .filter(
                    ([key]) =>
                      ![
                        "success",
                        "name",
                        "birth_details",
                        "location",
                        "chart",
                        "panchang",
                        "dasha",
                        "gemini_report",
                        "error",
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white p-4 rounded-lg"
                    >
                      <strong className="capitalize block mb-2">
                        {key.replace(/_/g, " ")}
                      </strong>

                      {renderValue(value)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            PDF
        ===================================================== */}

        <button
          onClick={downloadPDF}
          disabled={pdfLoading || !paid}
          className={`mt-5 px-6 py-3 rounded-lg w-full text-white ${
            paid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {pdfLoading
            ? "Generating PDF..."
            : "📄 Download Astrology PDF"}
        </button>

        {/* PDF SUCCESS */}

        {pdfMessage && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {pdfMessage}
          </div>
        )}

        {/* PDF ERROR */}

        {pdfError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
            ❌ {pdfError}
          </div>
        )}
      </div>
    </div>
  );
}


