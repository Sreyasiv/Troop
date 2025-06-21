import { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
// import Autocomplete from "./autoComplete";
import getGemmaResponse from "./compadirections";

import send from "../../assets/send.jpeg";
import compapic from "../../assets/compapic.jpeg";
import fadedPlane from "../../assets/plane.png";

const Help = () => {
  const [input, setInput] = useState("");
  const [ghostText, setGhostText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi!! Compa here! Do you need any help?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setGhostText("");
    setLoading(true);

    const staticReply = getGemmaResponse(userMsg);
    if (staticReply !== null) {
      setMessages((prev) => [...prev, { role: "assistant", text: staticReply }]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/compaRoutes", {
        prompt: userMsg,
      });
      const reply = res.data.suggestion;
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err.response?.status === 429
              ? "Gemma says: You've reached the token limit for today."
              : "Sorry, Gemma failed to respond.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col items-center p-6 font-sans">
        <img
          src={fadedPlane}
          alt="plane sketch"
          className="absolute -top-[50px] left-[0.1px] z-30 w-[450px] md:w-[450px] lg:w-[850px] opacity-50 pointer-events-none"
        />

        <h1 className="text-4xl font-bold mb-6 mt-20 text-[#FFA541] font-mono">
          Hi! This is COMPA
        </h1>

        <div className="relative w-full max-w-3xl h-[600px] bg-[#383535] rounded-xl p-6 space-y-5 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFA541]/80 scrollbar-track-[#1A1A1A]/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {msg.role === "assistant" && (
                  <img
                    src={compapic}
                    alt="compa"
                    className="w-16 h-16 mb-2"
                  />
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-[#2E2E2E] text-white"
                      : "bg-[#FFA541] text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <img
                  src={compapic}
                  alt="compa"
                  className="w-6 h-6 mt-1 rounded-full"
                />
                <div className="bg-[#FFA541] text-black px-4 py-2 rounded-2xl text-sm">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* INPUT BAR */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 w-full max-w-xl">
  <div className="relative w-full">
    {/* Visual input with ghost */}
    <div className="w-full border border-black rounded-xl px-5 py-4 bg-[#2b2828] text-white font-normal whitespace-pre-wrap relative z-10">
      <span className="text-white">
        {input}
        <span className="text-gray-500">{ghostText.slice(input.length)}</span>
      </span>
    </div>

    {/* Invisible text input */}
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="absolute top-0 left-0 w-full h-full px-5 py-4 text-transparent bg-transparent border-none outline-none caret-white z-20"
      autoComplete="off"
    />

    {/* Autocomplete hook */}
    <Autocomplete inputValue={input} setGhostText={setGhostText} />
  </div>

  <button
    type="submit"
    className="bg-[#2b2828] text-black px-4 py-3 rounded-full hover:bg-[#2e2e2e] transition flex items-center justify-center"
  >
    <img src={send} alt="send" className="w-5 h-5" />
  </button>
</form>
      </div>
    </>
  );
};

export default Help;