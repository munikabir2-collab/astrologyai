import { useState } from "react";
import axios from "axios";

export default function DownloadPDFButton({ data }) {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const downloadPDF = async () => {

        try {

            setLoading(true);
            setMessage("");
            setError("");

            const response = await axios.post(
                "http://127.0.0.1:8000/astrology/download-pdf",
                data,
                {
                    responseType: "blob"
                }
            );


            const file = new Blob(
                [response.data],
                {
                    type:"application/pdf"
                }
            );


            const url = window.URL.createObjectURL(file);


            const link = document.createElement("a");

            link.href = url;
            link.download = "AstroAI_Kundli_Report.pdf";

            document.body.appendChild(link);

            link.click();


            link.remove();


            setMessage(
                "✅ PDF Download Successfully"
            );


        }
        catch(error){

            console.log(error);

            setError(
                "❌ PDF Download Failed"
            );

        }
        finally{

            setLoading(false);

        }

    };


    return (

        <div>


            <button
            onClick={downloadPDF}
            disabled={loading}
            className="pdf-btn"
            >

            {
                loading
                ?
                "⏳ Generating PDF..."
                :
                "📄 Download Professional PDF"
            }

            </button>



            {
                message &&
                <p className="success">
                    {message}
                </p>
            }



            {
                error &&
                <p className="error">
                    {error}
                </p>
            }


        </div>

    );

}