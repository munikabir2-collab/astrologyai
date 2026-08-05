import { useState } from "react";

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



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };





  async function generateKundli() {

    setLoading(true);

    setResult(null);


    try {

      const res = await fetch(
        "http://127.0.0.1:8000/astrology/kundli",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify(form),

        }
      );


      const data = await res.json();


      setResult(data);


    }

    catch(err){

      setResult({
        error:"Unable to connect to AstroAI API"
      });

    }


    finally{

      setLoading(false);

    }

  }

async function payAndDownloadPDF() {

  try {

    const orderRes = await fetch(
      "http://127.0.0.1:8000/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_type: "kundli",
        }),
      }
    );

    const orderData = await orderRes.json();

    if (!orderData.success) {
      alert("Unable to create order");
      return;
    }

    const options = {

      key: orderData.key,

      amount: orderData.order.amount,

      currency: orderData.order.currency,

      name: "AstroAI",

      description: "Professional Kundli PDF",

      order_id: orderData.order.id,

      handler: async function (response) {

        const verifyRes = await fetch(
          "http://127.0.0.1:8000/payment/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({

              email: form.email,

              report_type: "kundli",

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

            }),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.success) {

          alert("✅ Payment Successful");

          await downloadPDF();

        } else {

          alert("Payment Verification Failed");

        }

      },

      theme: {
        color: "#4F46E5",
      },

    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  }

  catch (err) {

    console.log(err);

    alert("Payment Failed");

  }

}



  // PDF Download

  async function downloadPDF(){

    try{


      setPdfLoading(true);

      setPdfMessage("");

      setPdfError("");



      const response = await fetch(

        "http://127.0.0.1:8000/astrology/download-pdf",

        {

          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },


          body:JSON.stringify({

            ...form,

            kundli:result

          })


        }

      );



      if(!response.ok){

        throw new Error(
          "PDF generation failed"
        );

      }



      const blob = await response.blob();



      const url = window.URL.createObjectURL(blob);



      const link=document.createElement("a");


      link.href=url;


      link.download =
      `${form.name}_Kundli_Report.pdf`;



      document.body.appendChild(link);


      link.click();


      link.remove();



      setPdfMessage(
        "✅ Professional Kundli PDF Downloaded Successfully"
      );



    }

    catch(error){

      console.log(error);


      setPdfError(
        "❌ PDF Download Failed"
      );

    }


    finally{

      setPdfLoading(false);

    }

  }






return (

<div className="min-h-screen bg-gray-100 p-8">


<div className="max-w-6xl mx-auto">



<div className="bg-white rounded-xl shadow p-6">


<h1 className="text-3xl font-bold mb-6">

📜 AI Kundli Generator

</h1>




<div className="grid md:grid-cols-2 gap-4">
<input
  className="border p-3 rounded"
  type="email"
  placeholder="Email"
  name="email"
  value={form.email}
  onChange={handleChange}
/>

<input

className="border rounded-lg p-3"

placeholder="Name"

name="name"

value={form.name}

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


</div>




<button

onClick={generateKundli}

className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"

>


{

loading

?

"⏳ Generating Kundli..."

:

"Generate Kundli"

}


</button>


</div>






{
result?.error &&

<div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">

{result.error}

</div>

}








{
result && !result.error &&


<div className="mt-8 bg-white rounded-xl shadow p-6">



<div className="flex justify-between items-center mb-6">

  <h2 className="text-2xl font-bold">
    🪐 Kundli Details
  </h2>

  <button
    onClick={generateKundli}
    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg"
>
    {loading ? "⏳ Generating..." : "Generate Kundli"}
</button>

<button
    onClick={payAndDownloadPDF}
    className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
>
    💳 Pay ₹499 & Download PDF
</button>
</div>






{
pdfMessage &&

<div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">

{pdfMessage}

</div>

}





{
pdfError &&

<div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">

{pdfError}

</div>

}







{/* Lagna */}

<div className="mb-6">


<h3 className="text-xl font-semibold">

🌅 Lagna

</h3>


<p>

<b>Rashi:</b> {result.lagna?.rashi}

</p>


<p>

<b>Longitude:</b> {result.lagna?.longitude}

</p>


</div>






{/* Planet Summary */}


<div className="mb-8">


<h3 className="text-xl font-semibold mb-4">

🪐 Planet Summary

</h3>



<div className="grid md:grid-cols-3 gap-4">


{
Object.entries(result.planet_summary || {})
.map(([planet,value])=>(


<div

key={planet}

className="border rounded-lg p-4 bg-gray-50"

>


<h4 className="font-bold">

{planet}

</h4>


<p>

Rashi: {value.rashi}

</p>


<p>

Longitude: {value.longitude}

</p>


</div>


))

}



</div>


</div>








{/* Houses */}

<div>


<h3 className="text-xl font-semibold mb-4">

🏠 Houses

</h3>



<div className="space-y-4">


{
(result.houses || []).map((house)=>(


<div

key={house.house}

className="border rounded-lg p-4"

>


<h4 className="font-bold">

House {house.house}

</h4>



<p>

<b>Rashi:</b>
{" "}
{house.cusp?.rashi}

</p>



<p>

<b>Longitude:</b>
{" "}
{house.cusp?.longitude}

</p>





<b>Planets:</b>


{

house.planets?.length===0

?

<p>None</p>


:

<ul className="list-disc ml-6">


{
house.planets.map((planet)=>(


<li key={planet.planet}>

{planet.planet} ({planet.rashi})

</li>


))

}


</ul>


}



</div>


))


}



</div>


</div>





</div>

}



</div>

</div>


);

}