import { useState } from "react";
import API from "../api/auth";
import PromptBox from "../components/PromptBox";
import FileUploader from "../components/FileUploader";
import CameraCapture from "../components/CameraCapture";
import VoiceRecorder from "../components/VoiceRecorder";


function Gemini() {


const API = "https://astrologyai-s2y5.onrender.com";


const [prompt,setPrompt] = useState("");
const [reply,setReply] = useState("");

const [image,setImage] = useState(null);
const [audio,setAudio] = useState(null);
const [documentFile,setDocumentFile] = useState(null);

const [speech,setSpeech] = useState(null);

const [loading,setLoading] = useState(false);





// ==========================
// NORMAL AI REQUEST
// ==========================

async function askAI(){

setLoading(true);


try{


// IMAGE

if(image){


const form = new FormData();

form.append(
"file",
image
);


form.append(
"prompt",
prompt || "Describe this image"
);



const res = await fetch(
`${API}/gemini/image`,
{
method:"POST",
body:form
}
);


const data = await res.json();


setReply(data.result);

}



// AUDIO

else if(audio){


const form = new FormData();

form.append(
"file",
audio
);


form.append(
"prompt",
prompt
);



const res = await fetch(
`${API}/gemini/audio`,
{
method:"POST",
body:form
}
);



const data = await res.json();


setReply(data.result);


}



// DOCUMENT

else if(documentFile){


const form = new FormData();


form.append(
"file",
documentFile
);


form.append(
"prompt",
prompt
);



const res = await fetch(
`${API}/gemini/document`,
{
method:"POST",
body:form
}
);



const data = await res.json();


setReply(data.result);


}



// CHAT

else{


const res = await fetch(
`${API}/gemini/chat`,
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


setReply(
data.response
);


}



}

catch(error){

console.log(error);

setReply(
"❌ Server Error"
);


}


setLoading(false);


}






// ==========================
// VOICE GEMINI CHAT
// ==========================


async function talkGemini(){


if(!speech){

alert(
"Please record voice first"
);

return;

}



try{


setLoading(true);



const form = new FormData();


form.append(
"file",
speech
);



const res = await fetch(
`${API}/gemini/speech-chat`,
{

method:"POST",

body:form

}
);



const data = await res.json();



setReply(
data.text
);



if(data.audio_url){


const audio = new Audio(

`${API}${data.audio_url.replace("\\","/")}`

);


audio.play();


}




}

catch(error){


console.log(error);


setReply(
"❌ Voice Gemini Error"
);


}



setLoading(false);


}







return (

<div

style={{

maxWidth:1000,

margin:"auto",

padding:30

}}

>


<h1>
🤖 Gemini AI Assistant
</h1>



<PromptBox

prompt={prompt}

setPrompt={setPrompt}

loading={loading}

onSend={askAI}

/>




<hr/>


<FileUploader


image={image}

setImage={setImage}


audio={audio}

setAudio={setAudio}


documentFile={documentFile}

setDocumentFile={setDocumentFile}


/>



<hr/>



<h2>
📷 Camera Capture
</h2>



<CameraCapture

setImage={setImage}

/>



<hr/>




<h2>
🎤 Voice Assistant
</h2>



<VoiceRecorder


onRecorded={(file)=>{


setSpeech(file);


console.log(
"Recorded:",
file
);


}}


/>



<br/>




<button


onClick={talkGemini}


disabled={!speech || loading}


style={{

padding:"10px 20px",

marginTop:20

}}

>

🤖 Talk With Gemini

</button>





<hr/>




<h2>
🤖 AI Response
</h2>




<pre


style={{

padding:20,

background:"#f5f5f5",

borderRadius:10,

whiteSpace:"pre-wrap"

}}


>

{reply}


</pre>



</div>

);


}



export default Gemini;