function PromptBox({

    prompt,

    setPrompt,

    loading,

    onSend

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

            <h2>💬 Ask Gemini</h2>

            <textarea

                rows="5"

                style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    resize: "vertical"
                }}

                placeholder="Ask anything..."

                value={prompt}

                onChange={(e) => setPrompt(e.target.value)}

            />

            <br />
            <br />

            <button

                onClick={onSend}

                style={{
                    padding: "12px 25px",
                    fontSize: 16,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: "#1976d2",
                    color: "white",
                    border: "none"
                }}

            >

                {

                    loading

                        ? "Thinking..."

                        : "🚀 Ask AI"

                }

            </button>

        </div>

    );

}

export default PromptBox;
