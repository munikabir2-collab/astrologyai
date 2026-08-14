
import { useState } from "react";
import API from "../api/auth";

function Compatibility() {
  const [form, setForm] = useState({
    email: "",
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // PAYMENT
  // =========================================================

  async function payCompatibility() {
    try {
      if (!form.email) {
        alert("Please enter your email first.");
        return;
      }

      setPaymentLoading(true);

      // Create Razorpay order
      const res = await API.post("/payment/create-order", {
        report_type: "compatibility",
      });

      console.log("Create order response:", res.data);

      const data = res.data;

      if (data.free) {
        alert("This report is free.");
        return;
      }

      if (!data.key || !data.order || !data.order.id) {
        console.error("Invalid payment response:", data);

        throw new Error(
          "Invalid payment order received from backend."
        );
      }

      const options = {
        key: data.key,

        amount: data.order.amount,

        currency: data.order.currency || "INR",

        name: "AstroAI",

        description: "Marriage Compatibility Report",

        order_id: data.order.id,

        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response
            );

            // Verify payment
            const verify = await API.post(
              "/payment/verify",
              {
                email: form.email,

                report_type: "compatibility",

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            console.log(
              "Payment verification:",
              verify.data
            );

            if (verify.data.success) {
              alert("✅ Payment Successful");

              // After successful payment,
              // automatically check compatibility
              await checkCompatibility();
            } else {
              alert(
                verify.data.detail ||
                "Payment Verification Failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error
            );

            alert(
              error.response?.data?.detail ||
              "❌ Payment Verification Failed"
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },

        theme: {
          color: "#7C3AED",
        },
      };

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      const rzp = new window.Razorpay(options);

      rzp.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response.error
          );

          alert(
            response.error?.description ||
            "❌ Payment Failed"
          );

          setPaymentLoading(false);
        }
      );

      rzp.open();
    } catch (err) {
      console.error(
        "Payment order error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.detail ||
        err.message ||
        "❌ Payment Order Failed"
      );

      setPaymentLoading(false);
    }
  }

  // =========================================================
  // COMPATIBILITY API
  // =========================================================

  async function checkCompatibility() {
    setLoading(true);
    setResult(null);

    try {
      const res = await API.post(
        "/astrology/compatibility",
        form
      );

      console.log(
        "Compatibility response:",
        res.data
      );

      setResult(res.data);
    } catch (err) {
      console.error(
        "Compatibility error:",
        err.response?.data || err
      );

      setResult({
        error:
          err.response?.data?.detail ||
          err.message ||
          "Unable to connect to AstroAI API",
      });
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center mb-8">
        ❤️ Marriage Compatibility
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ================================================= */}
        {/* GROOM */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            👨 Groom Details
          </h2>

          <input
            className="border p-3 rounded w-full mb-3"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full mb-3"
            placeholder="Groom Name"
            name="boy_name"
            value={form.boy_name}
            onChange={handleChange}
          />

          <input
            type="date"
            className="border p-3 rounded w-full mb-3"
            name="boy_birth_date"
            value={form.boy_birth_date}
            onChange={handleChange}
          />

          <input
            type="time"
            className="border p-3 rounded w-full mb-3"
            name="boy_birth_time"
            value={form.boy_birth_time}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="Birth Place"
            name="boy_birth_place"
            value={form.boy_birth_place}
            onChange={handleChange}
          />

        </div>

        {/* ================================================= */}
        {/* BRIDE */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            👩 Bride Details
          </h2>

          <input
            className="border p-3 rounded w-full mb-3"
            placeholder="Bride Name"
            name="girl_name"
            value={form.girl_name}
            onChange={handleChange}
          />

          <input
            type="date"
            className="border p-3 rounded w-full mb-3"
            name="girl_birth_date"
            value={form.girl_birth_date}
            onChange={handleChange}
          />

          <input
            type="time"
            className="border p-3 rounded w-full mb-3"
            name="girl_birth_time"
            value={form.girl_birth_time}
            onChange={handleChange}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="Birth Place"
            name="girl_birth_place"
            value={form.girl_birth_place}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* BUTTONS */}
      {/* ================================================= */}

      <div className="mt-8 flex flex-wrap gap-4">

        <button
          onClick={payCompatibility}
          disabled={paymentLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
        >
          {paymentLoading
            ? "⏳ Processing Payment..."
            : "💳 Pay ₹149"}
        </button>

        <button
          onClick={checkCompatibility}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
        >
          {loading
            ? "⏳ Checking..."
            : "❤️ Check Compatibility"}
        </button>

      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {result?.error && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
          ❌ {result.error}
        </div>
      )}

      {/* ================================================= */}
      {/* RESULT */}
      {/* ================================================= */}

      {result && !result.error && (
        <div className="mt-8 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            💕 Compatibility Result
          </h2>

          <div className="space-y-2">

            <p>
              <b>Boy:</b>{" "}
              {result.boy}
            </p>

            <p>
              <b>Girl:</b>{" "}
              {result.girl}
            </p>

            <p>
              <b>Match Percentage:</b>{" "}
              {result.match_percentage}%
            </p>

            <p>
              <b>Guna Milan:</b>{" "}
              {result.guna_milan}/36
            </p>

            <p>
              <b>Manglik:</b>{" "}
              {result.manglik}
            </p>

            <p>
              <b>Nadi Dosh:</b>{" "}
              {result.nadi_dosh}
            </p>

            <p>
              <b>Bhakoot:</b>{" "}
              {result.bhakoot}
            </p>

          </div>

          {/* Prediction */}

          <div className="mt-6">

            <h3 className="text-xl font-bold mb-2">
              💍 Marriage Prediction
            </h3>

            <div className="bg-gray-100 rounded-lg p-4">
              {result.prediction}
            </div>

          </div>

          {/* Strengths */}

          <div className="mt-6">

            <h3 className="text-xl font-bold mb-2">
              ❤️ Strengths
            </h3>

            <ul className="list-disc ml-6">

              {result.strengths?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>

          {/* Challenges */}

          <div className="mt-6">

            <h3 className="text-xl font-bold mb-2">
              ⚠ Challenges
            </h3>

            <ul className="list-disc ml-6">

              {result.challenges?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>

          {/* Remedies */}

          <div className="mt-6">

            <h3 className="text-xl font-bold mb-2">
              🕉 Remedies
            </h3>

            <ul className="list-disc ml-6">

              {result.remedies?.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>

        </div>
      )}

    </div>
  );
}

export default Compatibility;


