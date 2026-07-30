import { useState } from "react";


export default function Horoscope() {

  const [sign, setSign] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  // PDF states
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


    } catch (err) {

      setResult({
        error:"Unable to connect to AstroAI API",
      });

    }


    setLoading(false);

  }




  // PDF Download Function
// PDF Download Function

async function downloadPDF(){

  try{

    setPdfLoading(true);

    setPdfMessage("");
    setPdfError("");


    const response = await fetch(
      `http://127.0.0.1:8000/astrology/download-pdf?sign=${sign}`
    );


    if(!response.ok){

      throw new Error(
        "PDF generation failed"
      );

    }



    const blob = await response.blob();



    const url = window.URL.createObjectURL(blob);



    const link = document.createElement("a");


    link.href = url;


    link.download =
      "AstroAI_Horoscope_Report.pdf";



    document.body.appendChild(link);


    link.click();


    link.remove();



    window.URL.revokeObjectURL(url);



    setPdfMessage(
      "✅ PDF Download Successfully"
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


<div className="max-w-4xl mx-auto">


<div className="bg-white rounded-xl shadow p-6">


<h1 className="text-3xl font-bold mb-6">
⭐ Daily Horoscope
</h1>



<div className="flex gap-3">


<select

value={sign}

onChange={(e)=>setSign(e.target.value)}

className="border rounded-lg p-3 flex-1"

>

<option value="">
Select Zodiac Sign
</option>


<option value="aries">
Aries (मेष)
</option>

<option value="taurus">
Taurus (वृषभ)
</option>

<option value="gemini">
Gemini (मिथुन)
</option>

<option value="cancer">
Cancer (कर्क)
</option>

<option value="leo">
Leo (सिंह)
</option>

<option value="virgo">
Virgo (कन्या)
</option>

<option value="libra">
Libra (तुला)
</option>

<option value="scorpio">
Scorpio (वृश्चिक)
</option>

<option value="sagittarius">
Sagittarius (धनु)
</option>

<option value="capricorn">
Capricorn (मकर)
</option>

<option value="aquarius">
Aquarius (कुंभ)
</option>

<option value="pisces">
Pisces (मीन)
</option>


</select>




<button

onClick={getHoroscope}

className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700"

>

{
loading
?
"⏳ Loading..."
:
"Get Horoscope"
}


</button>


</div>


</div>





{result?.error && (

<div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg">

{result.error}

</div>

)}






{result && !result.error && (

<div className="mt-8 bg-white rounded-xl shadow p-6">


<div className="flex justify-between items-center mb-5">


<h2 className="text-2xl font-bold">

⭐ {result.sign}

</h2>



<button

onClick={downloadPDF}

disabled={pdfLoading}

className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"

>


{

pdfLoading

?

"⏳ Generating PDF..."

:

"📄 Download Professional PDF"

}


</button>


</div>





{
pdfMessage &&

<div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">

{pdfMessage}

</div>

}





{
pdfError &&

<div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">

{pdfError}

</div>

}





<div className="space-y-4">


<div>
<h3 className="font-bold">
Rashi
</h3>
<p>{result.rashi}</p>
</div>



<div>
<h3 className="font-bold">
Nakshatra
</h3>
<p>{result.nakshatra}</p>
</div>



<div>
<h3 className="font-bold">
Today's Prediction
</h3>
<p>{result.prediction}</p>
</div>



<div>
<h3 className="font-bold">
Career
</h3>
<p>{result.career}</p>
</div>



<div>
<h3 className="font-bold">
Love
</h3>
<p>{result.love}</p>
</div>



<div>
<h3 className="font-bold">
Health
</h3>
<p>{result.health}</p>
</div>



<div>
<h3 className="font-bold">
Finance
</h3>
<p>{result.finance}</p>
</div>



<div>
<h3 className="font-bold">
Lucky Number
</h3>
<p>{result.lucky_number}</p>
</div>



<div>
<h3 className="font-bold">
Lucky Color
</h3>
<p>{result.lucky_color}</p>
</div>



<div>
<h3 className="font-bold">
Lucky Day
</h3>
<p>{result.lucky_day}</p>
</div>



<div>
<h3 className="font-bold">
Lucky Mantra
</h3>
<p>{result.lucky_mantra}</p>
</div>



<div>
<h3 className="font-bold">
Remedy
</h3>
<p>{result.remedy}</p>
</div>



</div>


</div>

)}



</div>


</div>

);

}