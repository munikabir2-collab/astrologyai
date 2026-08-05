import axios from "axios";

export default function PaymentButton({
  email,
  reportType = "horoscope",
  amountText = "₹499",
  onSuccess,
}) {
  const buyReport = async () => {
    try {
      // Create Razorpay Order
      const res = await axios.post(
        "http://127.0.0.1:8000/payment/create-order",
        {
          report_type: reportType,
        }
      );

      const data = res.data;

      if (data.free) {
        if (onSuccess) onSuccess();
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "AstroAI",
        description: `${reportType} Report`,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            await axios.post(
              "http://127.0.0.1:8000/payment/verify",
              {
                email,
                report_type: reportType,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            alert("✅ Payment Successful");

            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            console.log(error.response?.data || error);
            alert("❌ Payment Verification Failed");
          }
        },

        theme: {
          color: "#7C3AED",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error.response?.data || error);
      alert("❌ Payment Order Failed");
    }
  };

  return (
    <button
      onClick={buyReport}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
    >
      Buy {reportType} {amountText}
    </button>
  );
}