import { useRef, useState } from "react";


export default function CameraCapture({setImage}){


    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [open,setOpen] = useState(false);



    async function openCamera(){


        console.log("Camera Button Clicked");


        try{


            const stream = await navigator.mediaDevices.getUserMedia({

                video:true

            });



            console.log("Camera Access OK");


            streamRef.current = stream;


            videoRef.current.srcObject = stream;


            setOpen(true);



        }

        catch(error){


            console.log(
                "Camera Error:",
                error
            );


            alert(
                "Camera permission denied"
            );


        }


    }





    function captureImage(){


        const video = videoRef.current;



        const canvas = document.createElement(
            "canvas"
        );


        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;



        const ctx = canvas.getContext(
            "2d"
        );


        ctx.drawImage(

            video,

            0,

            0,

            canvas.width,

            canvas.height

        );




        canvas.toBlob((blob)=>{


            const file = new File(

                [blob],

                "camera.jpg",

                {
                    type:"image/jpeg"
                }

            );



            console.log(
                "Captured:",
                file
            );


            setImage(file);



        });



    }





    function closeCamera(){


        if(streamRef.current){


            streamRef.current
            .getTracks()
            .forEach(
                track=>track.stop()
            );


        }


        setOpen(false);


    }





return(


<div>


<h2>
📷 Camera Capture
</h2>



{

!open &&

<button

onClick={openCamera}

>

📷 Open Camera

</button>


}




{

open &&

<>


<br/>


<video

ref={videoRef}

autoPlay

playsInline

width="400"

/>


<br/>


<button

onClick={captureImage}

>

📸 Capture Photo

</button>



<button

onClick={closeCamera}

>

❌ Close

</button>


</>


}



</div>


);


}
