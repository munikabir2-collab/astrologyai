import {useState} from "react";


export default function GeminiChat(){

const [prompt,setPrompt]=useState("");
const [response,setResponse]=useState("");


const talkGemini = async()=>{

    try{

    const res = await fetch(
       "https://astrologyai-1.onrender.com/gemini/chat",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                prompt:prompt
            })
        }
    );


    const data = await res.json();


    setResponse(
        data.response
    );


    }catch(error){

        console.log(error);

    }

}



return(
<div>


<h2>
🤖 Talk With Gemini
</h2>


<input
value={prompt}
onChange={
(e)=>setPrompt(e.target.value)
}
placeholder="Ask Gemini..."
/>


<button onClick={talkGemini}>
Send
</button>


<h3>
🤖 AI Response
</h3>


<p>
{response}
</p>


</div>
)

}
