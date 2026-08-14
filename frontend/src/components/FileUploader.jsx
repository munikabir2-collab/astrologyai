function FileUploader({

    image,
    setImage,

    audio,
    setAudio,

    documentFile,
    setDocumentFile

}) {

    return (

        <div
            style={{
                background: "#ffffff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
            }}
        >

            <h2>📂 Upload Files</h2>

            <br />

            <h3>🖼 Image</h3>

            <input

                type="file"

                accept="image/*"

                onChange={(e) =>

                    setImage(e.target.files[0])

                }

            />

            {

                image && (

                    <p>

                        ✅ {image.name}

                    </p>

                )

            }

            <hr />

            <h3>🎵 Audio</h3>

            <input

                type="file"

                accept="audio/*"

                onChange={(e) =>

                    setAudio(e.target.files[0])

                }

            />

            {

                audio && (

                    <p>

                        ✅ {audio.name}

                    </p>

                )

            }

            <hr />

            <h3>📄 PDF / DOCX / TXT</h3>

            <input

                type="file"

                accept=".pdf,.doc,.docx,.txt"

                onChange={(e) =>

                    setDocumentFile(e.target.files[0])

                }

            />

            {

                documentFile && (

                    <p>

                        ✅ {documentFile.name}

                    </p>

                )

            }

        </div>

    );

}

export default FileUploader;
