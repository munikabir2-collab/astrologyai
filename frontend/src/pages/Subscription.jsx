import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Subscription() {
  const [loading, setLoading] = useState(false);

  const buyPro = async () => {
    try {
      setLoading(true);

      // Create Order
      const res = await fetch(`${API}/payment/create-order`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Unable to create order");
      }

      const data = await res.json();

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        name: "AstroAI",
        description: "Pro Subscription",

        handler: async function (response) {
          const email = localStorage.getItem("email");

          const verify = await fetch(`${API}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verify.json();

          if (result.success) {
            alert("🎉 Subscription Activated Successfully");

            localStorage.setItem("subscription", "PRO");

            window.location.href = "/dashboard";
          } else {
            alert(result.detail || "Payment Verification Failed");
          }
        },

        prefill: {
          email: localStorage.getItem("email") || "",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Subscription Plans
      </h2>

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h3>Pro Plan</h3>

              <h2 className="text-primary">
                ₹499 / Month
              </h2>

              <ul>
                <li>Unlimited AI Chat</li>
                <li>Unlimited Horoscope</li>
                <li>Kundli PDF Download</li>
                <li>Muhurat</li>
                <li>Panchang</li>
                <li>Dasha Report</li>
                <li>Priority AI Support</li>
              </ul>

              <button
                className="btn btn-success w-100"
                onClick={buyPro}
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy Pro ₹499"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}