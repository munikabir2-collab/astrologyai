import { useState } from "react";
import PaymentButton from "../components/PaymentButton";
export default function Horoscope() {

  const [sign, setSign] = useState("");
  const [result, setResult] = useState(null);

  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [loading, setLoading] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");


  async function getHoroscope() {

    if (!sign) return;


    setLoading(true);

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/astrology/prediction?sign=${sign}`
      );


      const data = await res.json();

      setResult(data);


    } catch(err){

      setResult({
        error:"Unable to connect AstroAI API"
      });


    } finally {

      setLoading(false);

    }

  }



  async function downloadPDF(){


    if(!email){

      setPdfError("❌ Please enter your email");

      return;

    }


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

            name,
            email,

            birth_date:birthDate,

            birth_time:birthTime,

            birth_place:birthPlace

          })

        }
      );



      if(!response.ok){

        const err = await response.json();

        throw new Error(
          err.detail || "PDF generation failed"
        );

      }



      const blob = await response.blob();


      const url = window.URL.createObjectURL(blob);


      const link=document.createElement("a");


      link.href=url;


      link.download="Horoscope_Report.pdf";


      document.body.appendChild(link);


      link.click();


      link.remove();


      window.URL.revokeObjectURL(url);



      setPdfMessage(
        "✅ PDF Download Successfully"
      );


    }
    catch(error){

      setPdfError(error.message);

    }
    finally{

      setPdfLoading(false);

    }

  }




return (

<div className="min-h-screen bg-gray-100 p-8">


<div className="max-w-4xl mx-auto">


<h1 className="text-3xl font-bold text-center mb-8">
🔮 AstroAI Horoscope
</h1>



<div className="bg-white rounded-xl shadow p-6 mb-6">


<h2 className="text-xl font-semibold mb-4">
Daily Horoscope
</h2>



<select

className="border p-3 rounded w-full"

value={sign}

onChange={(e)=>setSign(e.target.value)}

>

<option value="">
Select Zodiac Sign
</option>

<option value="aries">
Aries ♈
</option>

<option value="taurus">
Taurus ♉
</option>

<option value="gemini">
Gemini ♊
</option>

<option value="cancer">
Cancer ♋
</option>

<option value="leo">
Leo ♌
</option>

<option value="virgo">
Virgo ♍
</option>

<option value="libra">
Libra ♎
</option>

<option value="scorpio">
Scorpio ♏
</option>

<option value="sagittarius">
Sagittarius ♐
</option>

<option value="capricorn">
Capricorn ♑
</option>

<option value="aquarius">
Aquarius ♒
</option>

<option value="pisces">
Pisces ♓
</option>


</select>



<button

onClick={getHoroscope}

className="mt-4 bg-purple-600 text-white px-5 py-3 rounded-lg"

>

{
loading 
?
"Loading..."
:
"Get Horoscope"
}


</button>


</div>




{
result && (

<div className="bg-white shadow rounded-xl p-6 mb-6">


<h2 className="text-xl font-bold">
{result.sign}
</h2>


<p className="mt-3">
{result.prediction}
</p>


<p className="mt-3">
{result.insights}
</p>


</div>

)

}





<div className="bg-white shadow rounded-xl p-6">


<h2 className="text-xl font-semibold mb-4">
Download Kundli Horoscope PDF
</h2>



<input

className="border p-3 rounded w-full mb-3"

placeholder="Your Name"

value={name}

onChange={(e)=>setName(e.target.value)}

 />



<input

type="email"

className="border p-3 rounded w-full mb-3"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

 />



<input

type="date"

className="border p-3 rounded w-full mb-3"

value={birthDate}

onChange={(e)=>setBirthDate(e.target.value)}

 />



<input

type="time"

className="border p-3 rounded w-full mb-3"

value={birthTime}

onChange={(e)=>setBirthTime(e.target.value)}

 />



<input

className="border p-3 rounded w-full mb-3"

placeholder="Birth Place"

value={birthPlace}

onChange={(e)=>setBirthPlace(e.target.value)}

 />


<PaymentButton

email={email}

onSuccess={()=>setPaid(true)}

/>

<button

onClick={downloadPDF}

disabled={pdfLoading}

className="bg-green-600 text-white px-6 py-3 rounded-lg"

>


{
pdfLoading
?
"Generating PDF..."
:
"Download PDF"
}


</button>



{
pdfMessage &&

<p className="text-green-600 mt-3">
{pdfMessage}
</p>

}



{
pdfError &&

<p className="text-red-600 mt-3">
{pdfError}
</p>

}



</div>



</div>


</div>


);


}