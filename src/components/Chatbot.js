import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import './Chatbot.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function Chatbot() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const chatboxRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setMessages([{ text: "Hey there! How can I help you?", sender: "bot" }]);
        }, 2000);
    }, []);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleChat = async () => {
        if (!query.trim()) return;
        const userMessage = { text: query, sender: "user" };
        setIsLoading(true);
        try {
            const generatedContent = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_SECRET_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ "text": query }]
                        }
                    ]
                })
            });
            const transformedResponse = await generatedContent.json();
            const botReply = transformedResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
            console.log(botReply);
            const botMessage = { text: botReply, sender: "bot" };
            setMessages([...messages, userMessage, botMessage]);
            setQuery("");
            // console.log("messages=", messages);
        } catch (error) {
            toast.error(error)
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="chat-container">
            <h1>Chatbot</h1>
            <div className="chat-box">
                {
                    messages?.map((message, index) => {
                        return <div
                            key={index}
                            className={`message ${message.sender}`}
                            ref={index === messages.length - 1 ? chatboxRef : null}
                        >
                            {message.sender === "bot" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.text}
                                </ReactMarkdown>
                            ) : (
                                message.text
                            )}
                        </div>
                    })
                }
            </div>
            <div className="input-area">
                <input
                    type='text'
                    placeholder='Ask something...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                />
                <button onClick={handleChat} disabled={isLoading}>
                    <i className={`bi bi-arrow-up-circle-fill ${isLoading ? "loading" : ""}`}></i>
                </button>
            </div>
        </div>
    )
}

export default Chatbot;