import API from "../api/auth";

export default function PaymentButton({
  email,
  reportType = "horoscope",
  amountText = "₹499",
  onSuccess,
}) {
  const buyReport = async () => {
    try {
      if (!email) {
        alert("❌ Please enter your email first.");
        return;
      }

      // Create Razorpay order
      const res = await API.post("/payment/create-order", {
        report_type: reportType,
      });

      const data = res.data;

      console.log("Create Order Response:", data);

      // Free report
      if (data.free === true) {
        onSuccess?.();
        return;
      }

      if (!data.success) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to create payment order"
        );
      }

      if (!data.key || !data.order?.id) {
        console.error("Invalid order response:", data);

        throw new Error(
          "Invalid Razorpay order response"
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      const options = {
        key: data.key,

        amount: data.order.amount,

        currency:
          data.order.currency || "INR",

        name: "AstroAI",

        description: `${reportType} Report`,

        order_id: data.order.id,

        prefill: {
          email: email,
        },

        handler: async function (response) {
          try {
            console.log(
              "Razorpay Payment Response:",
              response
            );

            const verifyRes = await API.post(
              "/payment/verify",
              {
                email: email,

                report_type: reportType,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            console.log(
              "Payment Verification:",
              verifyRes.data
            );

            const verifyData =
              verifyRes.data;

            if (!verifyData.success) {
              throw new Error(
                verifyData.detail ||
                  verifyData.message ||
                  "Payment verification failed"
              );
            }

            alert(
              "✅ Payment Successful"
            );

            onSuccess?.();

          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            const message =
              error.response?.data?.detail ||
              error.response?.data?.message ||
              error.message ||
              "Payment verification failed";

            alert(`❌ ${message}`);
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
          color: "#7C3AED",
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

          alert(
            response.error?.description ||
              "❌ Payment Failed"
          );
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment Order Error:",
        error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Payment Order Failed";

      alert(`❌ ${message}`);
    }
  };

  return (
    <button
      type="button"
      onClick={buyReport}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
    >
      💳 Buy {reportType} {amountText}
    </button>
  );
}
