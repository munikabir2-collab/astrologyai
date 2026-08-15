
import { useState } from "react";
import API from "../api/auth";

export default function Kundli() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    birth_date: "",
    birth_time: "",
    birth_place: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // PDF states
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // GENERATE KUNDLI
  // =========================================================
  async function generateKundli() {
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
    setPdfMessage("");
    setPdfError("");

    try {
      const res = await API.post(
        "/astrology/kundli",
        form
      );

      console.log("Kundli Response:", res.data);

      setResult(res.data);
    } catch (err) {
      console.error(
        "Kundli Error:",
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

  // =========================================================
  // PAYMENT + PDF
  // =========================================================
  async function payAndDownloadPDF() {
    if (!result || result.error) {
      alert("Please generate your Kundli first.");
      return;
    }

    if (!form.email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setPdfError("");
      setPdfMessage("");

      // =====================================================
      // CREATE RAZORPAY ORDER
      // =====================================================
      const orderRes = await API.post(
        "/payment/create-order",
        {
          report_type: "kundli",
        }
      );

      const orderData = orderRes.data;

      console.log(
        "Payment Order Response:",
        orderData
      );

      // =====================================================
      // FREE REPORT
      // =====================================================
      if (orderData.free) {
        setPaymentSuccess(true);

        await downloadPDF();

        return;
      }

      // =====================================================
      // CHECK ORDER RESPONSE
      // =====================================================
      if (!orderData.success) {
        throw new Error(
          orderData.detail ||
            orderData.message ||
            "Unable to create payment order"
        );
      }

      if (!orderData.key || !orderData.order) {
        throw new Error(
          "Invalid Razorpay order response"
        );
      }

      // =====================================================
      // RAZORPAY CHECKOUT
      // =====================================================
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      const options = {
        key: orderData.key,

        amount: orderData.order.amount,

        currency:
          orderData.order.currency || "INR",

        name: "AstroAI",

        description:
          "Professional Kundli PDF",

        order_id: orderData.order.id,

        prefill: {
          name: form.name,
          email: form.email,
        },

        handler: async function (response) {
          try {
            console.log(
              "Razorpay Response:",
              response
            );

            // =============================================
            // VERIFY PAYMENT
            // =============================================
            const verifyRes = await API.post(
              "/payment/verify",
              {
                email: form.email,

                report_type: "kundli",

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            const verifyData = verifyRes.data;

            console.log(
              "Payment Verify Response:",
              verifyData
            );

            if (!verifyData.success) {
              throw new Error(
                verifyData.detail ||
                  verifyData.message ||
                  "Payment verification failed"
              );
            }

            // =============================================
            // PAYMENT SUCCESS
            // =============================================
            setPaymentSuccess(true);

            setPdfError("");

            setPdfMessage(
              "✅ Payment successful. Generating your Kundli PDF..."
            );

            alert("✅ Payment Successful");

            // =============================================
            // DOWNLOAD PDF
            // =============================================
            await downloadPDF();
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error.response?.data || error
            );

            setPdfError(
              error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Payment Verification Failed"
            );

            alert(
              error.response?.data?.detail ||
                "❌ Payment Verification Failed"
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed"
            );
          },
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response.error
          );

          setPdfError(
            response.error?.description ||
              "Payment failed."
          );

          alert(
            response.error?.description ||
              "❌ Payment Failed"
          );
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Payment Order Error:",
        err.response?.data || err
      );

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Payment Order Failed";

      setPdfError(`❌ ${message}`);

      alert(`❌ ${message}`);
    }
  }

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================
  async function downloadPDF() {
    if (!result || result.error) {
      setPdfError(
        "❌ Please generate Kundli first."
      );
      return;
    }

    try {
      setPdfLoading(true);
      setPdfMessage("");
      setPdfError("");

      const response = await API.post(
        "/astrology/download-pdf",
        {
          ...form,
          kundli: result,
        },
        {
          responseType: "blob",
        }
      );

      console.log(
        "PDF Response:",
        response
      );

      // =====================================================
      // CHECK CONTENT TYPE
      // =====================================================
      const contentType =
        response.headers["content-type"] || "";

      if (
        !contentType.includes(
          "application/pdf"
        )
      ) {
        throw new Error(
          "Server did not return a PDF file."
        );
      }

      // =====================================================
      // CREATE DOWNLOAD
      // =====================================================
      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const safeName =
        form.name
          .trim()
          .replace(/[^a-zA-Z0-9-_]/g, "_") ||
        "User";

      link.download =
        `${safeName}_Kundli_Report.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setPdfMessage(
        "✅ Professional Kundli PDF Downloaded Successfully"
      );
    } catch (error) {
      console.error(
        "PDF Error:",
        error.response?.data || error
      );

      setPdfError(
        "❌ PDF Download Failed. Please try again."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* =====================================================
          TITLE
      ====================================================== */}
      <h1 className="text-3xl font-bold text-center mb-6">
        📜 AI Kundli Generator
      </h1>

      {/* =====================================================
          FORM
      ====================================================== */}
      <div className="bg-white shadow rounded-xl p-6">

        <div className="grid gap-4">

          <input
            className="border rounded-lg p-3"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            className="border rounded-lg p-3"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="date"
            className="border rounded-lg p-3"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />

          <input
            type="time"
            className="border rounded-lg p-3"
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

          <button
            type="button"
            onClick={generateKundli}
            disabled={loading}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "⏳ Generating Kundli..."
              : "Generate Kundli"}
          </button>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}
        {result?.error && (
          <div className="mt-5 p-4 bg-red-50 text-red-600 rounded-lg">
            ❌ {result.error}
          </div>
        )}
      </div>

      {/* =====================================================
          KUNDLI RESULT
      ====================================================== */}
      {result && !result.error && (
        <div className="mt-6">

          {/* =================================================
              PAYMENT
          ================================================== */}
          <div className="bg-white shadow rounded-xl p-6 mb-6">

            <h2 className="text-xl font-semibold mb-4">
              📄 Professional Kundli PDF
            </h2>

            {!paymentSuccess && (
              <button
                type="button"
                onClick={payAndDownloadPDF}
                disabled={pdfLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {pdfLoading
                  ? "⏳ Processing..."
                  : "💳 Pay ₹499 & Download PDF"}
              </button>
            )}

            {paymentSuccess && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                ✅ Payment Successful
              </div>
            )}

            {pdfMessage && (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                {pdfMessage}
              </div>
            )}

            {pdfError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {pdfError}
              </div>
            )}

            {paymentSuccess && !pdfLoading && (
              <button
                type="button"
                onClick={downloadPDF}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
              >
                📥 Download Kundli PDF Again
              </button>
            )}
          </div>

          {/* =================================================
              LAGNA
          ================================================== */}
          <div className="bg-white shadow rounded-xl p-6 mb-6">

            <h2 className="text-xl font-bold mb-4">
              🌅 Lagna
            </h2>

            <p>
              <strong>Rashi:</strong>{" "}
              {result.lagna?.rashi || "-"}
            </p>

            <p>
              <strong>Longitude:</strong>{" "}
              {result.lagna?.longitude ?? "-"}
            </p>
          </div>

          {/* =================================================
              PLANET SUMMARY
          ================================================== */}
          <div className="bg-white shadow rounded-xl p-6 mb-6">

            <h2 className="text-xl font-bold mb-4">
              🪐 Planet Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {Object.entries(
                result.planet_summary || {}
              ).map(([planet, value]) => (
                <div
                  key={planet}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <h3 className="font-bold text-lg">
                    {planet}
                  </h3>

                  <p>
                    <strong>Rashi:</strong>{" "}
                    {value?.rashi || "-"}
                  </p>

                  <p>
                    <strong>Longitude:</strong>{" "}
                    {value?.longitude ?? "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              HOUSES
          ================================================== */}
          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">
              🏠 Houses
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {(result.houses || []).map(
                (house) => (
                  <div
                    key={house.house}
                    className="border rounded-lg p-4"
                  >
                    <h3 className="font-bold text-lg mb-2">
                      House {house.house}
                    </h3>

                    <p>
                      <strong>Rashi:</strong>{" "}
                      {house.cusp?.rashi ||
                        "-"}
                    </p>

                    <p>
                      <strong>Longitude:</strong>{" "}
                      {house.cusp?.longitude ??
                        "-"}
                    </p>

                    <div className="mt-3">
                      <strong>
                        Planets:
                      </strong>

                      {house.planets?.length ===
                      0 ? (
                        <p className="text-gray-500 mt-1">
                          No planets
                        </p>
                      ) : (
                        <ul className="list-disc ml-5 mt-1">
                          {house.planets.map(
                            (planet) => (
                              <li
                                key={`${house.house}-${planet.planet}`}
                              >
                                {planet.planet} (
                                {planet.rashi})
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



