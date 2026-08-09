import { useState } from "react";
import PaymentButton from "../components/PaymentButton";

// ============================================================
// API BASE URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://astrologyai-s2y5.onrender.com";

// ============================================================
// Convert objects / arrays into readable React content
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

// ============================================================
// Safely read API response
// ============================================================

async function readApiResponse(response) {
  const text = await response.text();

  console.log("API STATUS:", response.status);
  console.log("API CONTENT TYPE:", response.headers.get("content-type"));
  console.log("API RESPONSE:", text);

  // Empty response
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
    console.error("RAW RESPONSE:", text);

    throw new Error(
      `Server returned invalid JSON (${response.status}).`
    );
  }

  // HTTP error
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
// Horoscope Component
// ============================================================

export default function Horoscope() {
  // ==========================================================
  // DAILY HOROSCOPE
  // ==========================================================

  const [sign, setSign] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // PDF REPORT
  // ==========================================================

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");

  // Payment status
  const [paid, setPaid] = useState(false);

  // ==========================================================
  // GET DAILY HOROSCOPE
  // ==========================================================

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
        `${API_URL}/astrology/prediction?sign=${encodeURIComponent(sign)}`;

      console.log("====================================");
      console.log("HOROSCOPE API");
      console.log("URL:", url);
      console.log("SIGN:", sign);
      console.log("====================================");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readApiResponse(response);

      console.log("HOROSCOPE DATA:", data);

      setResult(data);
    } catch (error) {
      console.error("HOROSCOPE ERROR:", error);

      setResult({
        error:
          error?.message ||
          "Unable to connect to AstroAI API.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // DOWNLOAD PDF
  // ==========================================================

  async function downloadPDF() {
    setPdfMessage("");
    setPdfError("");

    // Payment check
    if (!paid) {
      setPdfError(
        "❌ Please complete payment first."
      );

      return;
    }

    // Email check
    if (!email.trim()) {
      setPdfError(
        "❌ Please enter your email."
      );

      return;
    }

    // Birth details check
    if (
      !name.trim() ||
      !birthDate ||
      !birthTime ||
      !birthPlace.trim()
    ) {
      setPdfError(
        "❌ Please enter name, birth date, birth time and birth place."
      );

      return;
    }

    try {
      setPdfLoading(true);

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
          Accept: "application/pdf, application/json",
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

      // ======================================================
      // ERROR RESPONSE
      // ======================================================

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

      // ======================================================
      // CHECK PDF CONTENT TYPE
      // ======================================================

      if (
        !contentType.toLowerCase().includes(
          "application/pdf"
        )
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

      // ======================================================
      // GET PDF BLOB
      // ======================================================

      const blob =
        await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Server returned an empty PDF file."
        );
      }

      // ======================================================
      // CREATE DOWNLOAD
      // ======================================================

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
          className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg w-full"
        >
          {loading
            ? "Loading..."
            : "Get Horoscope"}
        </button>

        {/* ===================================================
            HOROSCOPE RESULT
        ==================================================== */}

        {result && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5">

            {/* ERROR */}

            {result.error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                ❌ {result.error}
              </div>
            ) : (
              <div className="space-y-5">

                {/* SIGN */}

                <h3 className="text-2xl font-bold">
                  {result.sign || sign}
                </h3>

                {/* RASHI */}

                {result.rashi && (
                  <div>
                    <h4 className="font-semibold text-lg">
                      🪐 Rashi
                    </h4>

                    <p>
                      {renderValue(
                        result.rashi
                      )}
                    </p>
                  </div>
                )}

                {/* NAKSHATRA */}

                {result.nakshatra && (
                  <div>
                    <h4 className="font-semibold text-lg">
                      ⭐ Nakshatra
                    </h4>

                    <p>
                      {renderValue(
                        result.nakshatra
                      )}
                    </p>
                  </div>
                )}

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

                {/* CAREER */}

                {result.career && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      💼 Career
                    </h4>

                    <div className="mt-1">
                      {renderValue(
                        result.career
                      )}
                    </div>
                  </div>
                )}

                {/* LOVE */}

                {result.love && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      ❤️ Love
                    </h4>

                    <div className="mt-1">
                      {renderValue(
                        result.love
                      )}
                    </div>
                  </div>
                )}

                {/* HEALTH */}

                {result.health && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      ❤️‍🩹 Health
                    </h4>

                    <div className="mt-1">
                      {renderValue(
                        result.health
                      )}
                    </div>
                  </div>
                )}

                {/* FINANCE */}

                {result.finance && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold">
                      💰 Finance
                    </h4>

                    <div className="mt-1">
                      {renderValue(
                        result.finance
                      )}
                    </div>
                  </div>
                )}

                {/* LUCKY NUMBER */}

                {result.lucky_number && (
                  <div>
                    <strong>
                      🔢 Lucky Number:
                    </strong>{" "}
                    {renderValue(
                      result.lucky_number
                    )}
                  </div>
                )}

                {/* LUCKY COLOR */}

                {result.lucky_color && (
                  <div>
                    <strong>
                      🎨 Lucky Color:
                    </strong>{" "}
                    {renderValue(
                      result.lucky_color
                    )}
                  </div>
                )}

                {/* LUCKY DAY */}

                {result.lucky_day && (
                  <div>
                    <strong>
                      📅 Lucky Day:
                    </strong>{" "}
                    {renderValue(
                      result.lucky_day
                    )}
                  </div>
                )}

                {/* MANTRA */}

                {result.lucky_mantra && (
                  <div>
                    <strong>
                      🕉️ Lucky Mantra:
                    </strong>{" "}
                    {renderValue(
                      result.lucky_mantra
                    )}
                  </div>
                )}

                {/* REMEDY */}

                {result.remedy && (
                  <div>
                    <strong>
                      🙏 Remedy:
                    </strong>{" "}
                    {renderValue(
                      result.remedy
                    )}
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
                        "rashi",
                        "nakshatra",
                        "prediction",
                        "career",
                        "love",
                        "health",
                        "finance",
                        "lucky_number",
                        "lucky_color",
                        "lucky_day",
                        "lucky_mantra",
                        "remedy",
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

        {/* NAME */}

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        {/* EMAIL */}

        <input
          type="email"
          className="border p-3 rounded w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* BIRTH DATE */}

        <input
          type="date"
          className="border p-3 rounded w-full mb-3"
          value={birthDate}
          onChange={(e) =>
            setBirthDate(e.target.value)
          }
        />

        {/* BIRTH TIME */}

        <input
          type="time"
          className="border p-3 rounded w-full mb-3"
          value={birthTime}
          onChange={(e) =>
            setBirthTime(e.target.value)
          }
        />

        {/* BIRTH PLACE */}

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Birth Place"
          value={birthPlace}
          onChange={(e) =>
            setBirthPlace(e.target.value)
          }
        />

        {/* =================================================
            PAYMENT
        ================================================== */}

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

        {/* =================================================
            PDF BUTTON
        ================================================== */}

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