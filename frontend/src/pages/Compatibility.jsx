import { useState } from "react";
async function payCompatibility() {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_type: "compatibility",
        }),
      }
    );

    const data = await res.json();

    if (data.free) {
      alert("This report is free.");
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      name: "AstroAI",
      description: "Marriage Compatibility Report",
      order_id: data.order.id,

      handler: async function (response) {
        const verify = await fetch(
          "http://127.0.0.1:8000/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: form.email,
              report_type: "compatibility",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }
        );

        const result = await verify.json();

        if (verify.ok) {
          alert("✅ Payment Successful");
        } else {
          alert(result.detail);
        }
      },

      theme: {
        color: "#7C3AED",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.log(err);
    alert("Payment Failed");
  }
}
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
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function checkCompatibility() {
    setLoading(true);
    setResult(null);

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

      if (!res.ok) {
        throw new Error(data.detail || "Compatibility check failed");
      }

      setResult(data);
    } catch (err) {
      setResult({
        error: err.message || "Unable to connect to AstroAI API",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8">
          ❤️ Marriage Compatibility
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Groom */}

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

          {/* Bride */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
              👩 Bride Details
            </h2>

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Name"
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

        <div className="mt-8 flex gap-4">

         <button
        onClick={payCompatibility}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
        💳 Pay ₹149
         </button>

         <button
        onClick={checkCompatibility}
        disabled={loading}
       className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg"
         >
        {loading ? "Checking..." : "❤️ Check Compatibility"}
         </button>

  </div>

        {result?.error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">
            ❌ {result.error}
          </div>
        )}

        {result && !result.error && (

          <div className="mt-8 bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              💕 Compatibility Result
            </h2>

            <div className="space-y-2">

              <p><b>Boy:</b> {result.boy}</p>

              <p><b>Girl:</b> {result.girl}</p>

              <p>
                <b>Match Percentage:</b> {result.match_percentage}%
              </p>

              <p>
                <b>Guna Milan:</b> {result.guna_milan}/36
              </p>

              <p>
                <b>Manglik:</b> {result.manglik}
              </p>

              <p>
                <b>Nadi Dosh:</b> {result.nadi_dosh}
              </p>

              <p>
                <b>Bhakoot:</b> {result.bhakoot}
              </p>

            </div>

            <div className="mt-6">

              <h3 className="text-xl font-bold mb-2">
                💍 Marriage Prediction
              </h3>

              <div className="bg-gray-100 rounded-lg p-4">
                {result.prediction}
              </div>

            </div>

            <div className="mt-6">

              <h3 className="text-xl font-bold mb-2">
                ❤️ Strengths
              </h3>

              <ul className="list-disc ml-6">
                {result.strengths?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

            </div>

            <div className="mt-6">

              <h3 className="text-xl font-bold mb-2">
                ⚠ Challenges
              </h3>

              <ul className="list-disc ml-6">
                {result.challenges?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

            </div>

            <div className="mt-6">

              <h3 className="text-xl font-bold mb-2">
                🕉 Remedies
              </h3>

              <ul className="list-disc ml-6">
                {result.remedies?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default Compatibility;