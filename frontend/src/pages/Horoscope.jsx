import { useState } from "react";
import PaymentButton from "../components/PaymentButton";

const API_URL =
import.meta.env.VITE_API_URL ||
"https://astrologyai-s2y5.onrender.com";

// =========================================================
// Render objects / arrays safely
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
return ( <ul className="list-disc ml-5 space-y-1">
{value.map((item, index) => ( <li key={index}>{renderValue(item)}</li>
))} </ul>
);
}

if (typeof value === "object") {
return ( <div className="ml-2 space-y-2">
{Object.entries(value).map(([key, val]) => ( <div
         key={key}
         className="border-l-2 border-purple-200 pl-3"
       > <strong className="capitalize">
{key.replace(/_/g, " ")}: </strong>{" "}
{renderValue(val)} </div>
))} </div>
);
}

return String(value);
}

export default function Horoscope() {
// =========================================================
// DAILY HOROSCOPE
// =========================================================
const [sign, setSign] = useState("");
const [dailyResult, setDailyResult] = useState(null);
const [dailyLoading, setDailyLoading] = useState(false);

// =========================================================
// AI ASTROLOGY REPORT
// =========================================================
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [birthDate, setBirthDate] = useState("");
const [birthTime, setBirthTime] = useState("");
const [birthPlace, setBirthPlace] = useState("");

const [aiReport, setAiReport] = useState(null);
const [aiLoading, setAiLoading] = useState(false);

// =========================================================
// PAYMENT
// =========================================================
const [paid, setPaid] = useState(false);

// =========================================================
// PDF
// =========================================================
const [pdfLoading, setPdfLoading] = useState(false);
const [pdfMessage, setPdfMessage] = useState("");
const [pdfError, setPdfError] = useState("");

// =========================================================
// DAILY HOROSCOPE
// GET /astrology/prediction
// =========================================================
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
    `${API_URL}/astrology/prediction?sign=${encodeURIComponent(sign)}`;

  console.log("DAILY HOROSCOPE API:", url);

  const response = await fetch(url);

  const text = await response.text();

  console.log("DAILY HOROSCOPE STATUS:", response.status);
  console.log("DAILY HOROSCOPE RESPONSE:", text);

  if (!text.trim()) {
    throw new Error(
      `Server returned empty response (${response.status})`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON:", text);

    throw new Error(
      `Server returned invalid JSON (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `Horoscope request failed (${response.status})`
    );
  }

  setDailyResult(data);
} catch (error) {
  console.error("Daily Horoscope Error:", error);

  setDailyResult({
    error:
      error.message ||
      "Unable to connect to AstroAI API.",
  });
} finally {
  setDailyLoading(false);
}


}

// =========================================================
// VALIDATE AI REPORT FORM
// =========================================================
function validateReportForm() {
if (!name.trim()) {
setAiReport({
error: "Please enter your name.",
});
return false;
}


if (!email.trim()) {
  setAiReport({
    error: "Please enter your email.",
  });
  return false;
}

if (!birthDate) {
  setAiReport({
    error: "Please enter your birth date.",
  });
  return false;
}

if (!birthTime) {
  setAiReport({
    error: "Please enter your birth time.",
  });
  return false;
}

if (!birthPlace.trim()) {
  setAiReport({
    error: "Please enter your birth place.",
  });
  return false;
}

return true;


}

// =========================================================
// GENERATE AI ASTROLOGY REPORT
// POST /astrology/horoscope
// PAYMENT REQUIRED
// =========================================================
async function generateAIReport() {
if (!paid) {
setAiReport({
error:
"Please complete payment first to generate the AI Astrology Report.",
});
return;
}


if (!validateReportForm()) {
  return;
}

setAiLoading(true);
setAiReport(null);

try {
  const url = `${API_URL}/astrology/horoscope`;

  console.log("AI REPORT API:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_place: birthPlace,
    }),
  });

  const text = await response.text();

  console.log("AI REPORT STATUS:", response.status);
  console.log("AI REPORT RESPONSE:", text);

  if (!text.trim()) {
    throw new Error(
      `Server returned empty response (${response.status})`
    );
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error("Invalid AI report JSON:", text);

    throw new Error(
      `Server returned invalid JSON (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `AI report generation failed (${response.status})`
    );
  }

  setAiReport(data);
} catch (error) {
  console.error("AI Astrology Report Error:", error);

  setAiReport({
    error:
      error.message ||
      "Unable to generate AI Astrology Report.",
  });
} finally {
  setAiLoading(false);
}


}

// =========================================================
// DOWNLOAD PDF
// POST /astrology/download-pdf
// PAYMENT REQUIRED
// =========================================================
async function downloadPDF() {
if (!paid) {
setPdfError(
"❌ Please complete payment first."
);
return;
}


if (!validateReportForm()) {
  setPdfError(
    "❌ Please complete all birth details first."
  );
  return;
}

try {
  setPdfLoading(true);
  setPdfMessage("");
  setPdfError("");

  const url = `${API_URL}/astrology/download-pdf`;

  console.log("PDF API:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_place: birthPlace,
    }),
  });

  console.log("PDF STATUS:", response.status);

  if (!response.ok) {
    const text = await response.text();

    let message =
      `PDF generation failed (${response.status})`;

    if (text.trim()) {
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

  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/pdf")) {
    const text = await response.text();

    throw new Error(
      text ||
        "Server did not return a PDF file."
    );
  }

  const blob = await response.blob();

  const objectUrl =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = objectUrl;
  link.download = "AstroAI_Horoscope_Report.pdf";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(objectUrl);

  setPdfMessage(
    "✅ Horoscope PDF downloaded successfully."
  );
} catch (error) {
  console.error("PDF Error:", error);

  setPdfError(
    error.message ||
      "PDF generation failed."
  );
} finally {
  setPdfLoading(false);
}


}

return ( <div className="max-w-4xl mx-auto p-6">


  {/* =====================================================
      TITLE
  ====================================================== */}

  <h1 className="text-3xl font-bold text-center mb-8">
    🔮 AI Astrology Report
  </h1>

  {/* =====================================================
      DAILY HOROSCOPE
  ====================================================== */}

  <div className="bg-white shadow rounded-xl p-6 mb-8">

    <h2 className="text-xl font-semibold mb-4">
      🆓 Daily Horoscope
    </h2>

    <p className="text-gray-600 mb-4">
      Select your zodiac sign to get today's horoscope.
    </p>

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

      <option value="Aries">Aries ♈</option>
      <option value="Taurus">Taurus ♉</option>
      <option value="Gemini">Gemini ♊</option>
      <option value="Cancer">Cancer ♋</option>
      <option value="Leo">Leo ♌</option>
      <option value="Virgo">Virgo ♍</option>
      <option value="Libra">Libra ♎</option>
      <option value="Scorpio">Scorpio ♏</option>
      <option value="Sagittarius">Sagittarius ♐</option>
      <option value="Capricorn">Capricorn ♑</option>
      <option value="Aquarius">Aquarius ♒</option>
      <option value="Pisces">Pisces ♓</option>
    </select>

    <button
      onClick={getDailyHoroscope}
      disabled={dailyLoading}
      className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg w-full"
    >
      {dailyLoading
        ? "Loading..."
        : "Get Daily Horoscope"}
    </button>

    {/* DAILY RESULT */}

    {dailyResult && (
      <div className="mt-6 bg-gray-50 rounded-lg p-5">

        {dailyResult.error ? (
          <p className="text-red-600 font-medium">
            ❌ {dailyResult.error}
          </p>
        ) : (
          <div className="space-y-5">

            <h3 className="text-2xl font-bold">
              {dailyResult.sign || sign}
            </h3>

            {dailyResult.rashi && (
              <p>
                <strong>Rashi:</strong>{" "}
                {dailyResult.rashi}
              </p>
            )}

            {dailyResult.nakshatra && (
              <p>
                <strong>Nakshatra:</strong>{" "}
                {dailyResult.nakshatra}
              </p>
            )}

            {dailyResult.prediction && (
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  🔮 Prediction
                </h4>

                <div className="leading-7">
                  {renderValue(
                    dailyResult.prediction
                  )}
                </div>
              </div>
            )}

            {dailyResult.career && (
              <div>
                <h4 className="font-semibold">
                  💼 Career
                </h4>

                <p>
                  {renderValue(
                    dailyResult.career
                  )}
                </p>
              </div>
            )}

            {dailyResult.love && (
              <div>
                <h4 className="font-semibold">
                  ❤️ Love
                </h4>

                <p>
                  {renderValue(
                    dailyResult.love
                  )}
                </p>
              </div>
            )}

            {dailyResult.health && (
              <div>
                <h4 className="font-semibold">
                  🧘 Health
                </h4>

                <p>
                  {renderValue(
                    dailyResult.health
                  )}
                </p>
              </div>
            )}

            {dailyResult.finance && (
              <div>
                <h4 className="font-semibold">
                  💰 Finance
                </h4>

                <p>
                  {renderValue(
                    dailyResult.finance
                  )}
                </p>
              </div>
            )}

            {dailyResult.lucky_number && (
              <p>
                <strong>Lucky Number:</strong>{" "}
                {dailyResult.lucky_number}
              </p>
            )}

            {dailyResult.lucky_color && (
              <p>
                <strong>Lucky Color:</strong>{" "}
                {dailyResult.lucky_color}
              </p>
            )}

            {dailyResult.lucky_day && (
              <p>
                <strong>Lucky Day:</strong>{" "}
                {dailyResult.lucky_day}
              </p>
            )}

            {dailyResult.lucky_mantra && (
              <p>
                <strong>Mantra:</strong>{" "}
                {dailyResult.lucky_mantra}
              </p>
            )}

            {dailyResult.remedy && (
              <p>
                <strong>Remedy:</strong>{" "}
                {dailyResult.remedy}
              </p>
            )}

          </div>
        )}

      </div>
    )}

  </div>

  {/* =====================================================
      AI ASTROLOGY REPORT
  ====================================================== */}

  <div className="bg-white shadow rounded-xl p-6 mb-8">

    <h2 className="text-xl font-semibold mb-2">
      🔮 AI Astrology Report
    </h2>

    <p className="text-gray-600 mb-5">
      Enter your birth details and purchase the report
      to generate your personalized AI Astrology Report.
    </p>

    {/* NAME */}

    <input
      className="border p-3 rounded-lg w-full mb-3"
      placeholder="Your Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    {/* EMAIL */}

    <input
      type="email"
      className="border p-3 rounded-lg w-full mb-3"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {/* BIRTH DATE */}

    <input
      type="date"
      className="border p-3 rounded-lg w-full mb-3"
      value={birthDate}
      onChange={(e) => setBirthDate(e.target.value)}
    />

    {/* BIRTH TIME */}

    <input
      type="time"
      className="border p-3 rounded-lg w-full mb-3"
      value={birthTime}
      onChange={(e) => setBirthTime(e.target.value)}
    />

    {/* BIRTH PLACE */}

    <input
      className="border p-3 rounded-lg w-full mb-5"
      placeholder="Birth Place"
      value={birthPlace}
      onChange={(e) => setBirthPlace(e.target.value)}
    />

    {/* =================================================
        PAYMENT
    ================================================== */}

    <PaymentButton
      email={email}
      reportType="horoscope"
      amountText="₹499"
      onSuccess={() => {
        setPaid(true);
        setPdfError("");

        setPdfMessage(
          "✅ Payment successful. AI Astrology Report and PDF are now unlocked."
        );
      }}
    />

    {/* PAYMENT STATUS */}

    {paid && (
      <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
        ✅ Horoscope Report Payment Successful
      </div>
    )}

    {/* =================================================
        GENERATE AI REPORT
    ================================================== */}

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
        ? "Generating AI Astrology Report..."
        : "🔮 Generate AI Astrology Report"}
    </button>

    {/* AI REPORT ERROR */}

    {aiReport?.error && (
      <div className="mt-5 p-4 bg-red-50 text-red-600 rounded-lg">
        ❌ {aiReport.error}
      </div>
    )}

    {/* AI REPORT RESULT */}

    {aiReport && !aiReport.error && (
      <div className="mt-6 bg-gray-50 rounded-xl p-5">

        <h3 className="text-2xl font-bold mb-5">
          🔮 Your AI Astrology Report
        </h3>

        {Object.entries(aiReport).map(
          ([key, value]) => (
            <div
              key={key}
              className="bg-white rounded-lg p-4 mb-4 shadow-sm"
            >
              <h4 className="font-bold capitalize mb-2">
                {key.replace(/_/g, " ")}
              </h4>

              <div className="text-gray-700 leading-7">
                {renderValue(value)}
              </div>
            </div>
          )
        )}

      </div>
    )}

  </div>

  {/* =====================================================
      PDF REPORT
  ====================================================== */}

  <div className="bg-white shadow rounded-xl p-6">

    <h2 className="text-xl font-semibold mb-2">
      📄 Horoscope PDF Report
    </h2>

    <p className="text-gray-600 mb-5">
      After successful payment, download your complete
      AstroAI Horoscope PDF report.
    </p>

    <button
      onClick={downloadPDF}
      disabled={pdfLoading || !paid}
      className={`px-6 py-3 rounded-lg w-full text-white ${
        paid
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {pdfLoading
        ? "Generating PDF..."
        : "📄 Download Horoscope PDF"}
    </button>

    {pdfMessage && (
      <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
        {pdfMessage}
      </div>
    )}

    {pdfError && (
      <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
        ❌ {pdfError}
      </div>
    )}

  </div>

</div>


);
}
