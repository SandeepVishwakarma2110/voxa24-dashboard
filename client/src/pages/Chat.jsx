import { useState, useRef, useEffect } from "react";

const synth = window.speechSynthesis;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const SIZES = [
  { label: "S", width: "320px", height: "480px" },
  { label: "M", width: "380px", height: "560px" },
  { label: "L", width: "460px", height: "650px" },
  { label: "XL", width: "540px", height: "740px" },
];

export default function Chat({ isOpen, onClose }) {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [DocAssServerUrl, setDocAssServerUrl] = useState("");
  const [sizeIndex, setSizeIndex] = useState(0);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  const currentSize = SIZES[sizeIndex];

  useEffect(() => {
    // console.log("Full localStorage:", localStorage);
    if (typeof window !== "undefined") {
      const DocAssStoredUrl = localStorage.getItem("DocAss_server_url");
      if (DocAssStoredUrl) setDocAssServerUrl(DocAssStoredUrl);
      // console.log("DocAss Server URL in chatpage:", DocAssStoredUrl);

    }
  }, []);

  useEffect(() => {
    const savedId = localStorage.getItem("chat_thread_id");
    if (savedId) {
      setThreadId(savedId);
    } else {
      const newId = "user-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chat_thread_id", newId);
      setThreadId(newId);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, listening, typing]);

  const speak = (text) => {
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setChat((prev) => [...prev, { from: "user", text: msg, time }]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch(`${DocAssServerUrl}/api/web/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, threadId }),
      });
      const data = await response.json();
      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChat((prev) => [
        ...prev,
        { from: "ai", text: data.response, time: aiTime },
      ]);
      if (mode === "voice") speak(data.response);
      if (
        data.sessionStatus === "completed" ||
        data.sessionStatus === "expired"
      ) {
        localStorage.removeItem("chat_thread_id");
        const newId = "user-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("chat_thread_id", newId);
        setThreadId(newId);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        { from: "ai", text: "Error: Could not connect to server.", time },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) return;
    if (recognitionRef.current) recognitionRef.current.abort();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      sendMessage(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <>
      <style>{`
        @keyframes pulseBtn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes liquidFloat1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(8px, -12px) scale(1.05); }
          66% { transform: translate(-6px, 6px) scale(0.97); }
        }
        @keyframes liquidFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-10px, 8px) scale(1.04); }
          66% { transform: translate(7px, -5px) scale(0.98); }
        }
        @keyframes liquidFloat3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(5px, 10px) scale(1.06); }
        }
        input::placeholder {
          color: rgba(0,0,0,0.35) !important;
        }
      `}</style>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={onClose} />
      )}

      {/* ================= CHAT MODAL ================= */}
      <div
        className="fixed top-[70px] right-4 z-50 rounded-3xl overflow-hidden flex flex-col"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          background: "rgba(255, 235, 243, 0.75)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255, 182, 213, 0.4)",
          boxShadow:
            "0 8px 32px rgba(255, 100, 180, 0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
          transformOrigin: "top right",
          transition:
            "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1), width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(-20px) scale(0.95)",
          pointerEvents: isOpen ? "all" : "none",
        }}
      >
        {/* ── LIQUID BLOBS ── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(255,100,180,0.25) 0%, rgba(255,150,200,0.1) 60%, transparent 100%)",
            top: "-60px",
            left: "-60px",
            animation: "liquidFloat1 6s ease-in-out infinite",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "140px",
            height: "140px",
            background:
              "radial-gradient(circle, rgba(240,98,146,0.2) 0%, rgba(214,51,132,0.08) 60%, transparent 100%)",
            bottom: "60px",
            right: "-40px",
            animation: "liquidFloat2 8s ease-in-out infinite",
            filter: "blur(18px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(255,182,213,0.2) 0%, transparent 70%)",
            top: "45%",
            left: "30%",
            animation: "liquidFloat3 5s ease-in-out infinite",
            filter: "blur(14px)",
          }}
        />

        {/* ── TOP SHINE LINE ── */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), rgba(255,182,213,0.8), rgba(255,255,255,0.6), transparent)",
          }}
        />

        {/* ================= HEADER ================= */}
        <div
          className="px-3 py-2.5 flex items-center justify-between flex-shrink-0 relative z-10"
          style={{
            background: "rgba(255, 220, 236, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 182, 213, 0.3)",
            boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Left — Avatar + Name */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(240,98,146,0.9), rgba(214,51,132,0.9))",
                boxShadow:
                  "0 0 14px rgba(214,51,132,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              🧑
            </div>
            <div>
              <p
                className="text-xs font-semibold"
                // style={{
                //   background: "linear-gradient(90deg, #d63384, #f06292)",
                //   WebkitBackgroundClip: "text",
                //   WebkitTextFillColor: "transparent",
                // }}
              >
                AI Assistant
              </p>
              <p
                className="text-[9px]"
                style={{ color: "rgba(0,0,0,0.4)" }}
              >
                ● Online
              </p>
            </div>
          </div>

          {/* Right — Size Controls + Mode Toggle + Close */}
          <div className="flex items-center gap-1">

            {/* ── SIZE CONTROLS ── */}
            <div
              className="flex items-center rounded-full overflow-hidden "
              style={{
                background: "rgba(255,182,213,0.2)",
                border: "1px solid rgba(255,182,213,0.35)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <button
                onClick={() => setSizeIndex((i) => Math.max(0, i - 1))}
                disabled={sizeIndex === 0}
                className="w-5 h-7 flex items-center justify-center disabled:opacity-25 transition-all text-base font-bold"
                style={{ color: "rgba(0,0,0,0.6)" }}
                title="Shrink"
              >
                −
              </button>
              <span
                className="text-[10px] font-semibold     text-center"
                // style={{
                //   background: "linear-gradient(90deg, #d63384, #f06292)",
                //   WebkitBackgroundClip: "text",
                //   WebkitTextFillColor: "transparent",
                // }}
              >
                {currentSize.label}
              </span>
              <button
                onClick={() =>
                  setSizeIndex((i) => Math.min(SIZES.length - 1, i + 1))
                }
                disabled={sizeIndex === SIZES.length - 1}
                className="w-5 h-7 flex items-center justify-center disabled:opacity-25 transition-all text-base font-bold"
                style={{ color: "rgba(0,0,0,0.6)" }}
                title="Expand"
              >
                +
              </button>
            </div>

            {/* ── MODE TOGGLE ── */}
            <div
              className="flex rounded-full p-0.5"
              style={{
                background: "rgba(255,182,213,0.2)",
                border: "1px solid rgba(255,182,213,0.35)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <button
                onClick={() => setMode("text")}
                className="px-2.5 py-1 text-[10px] rounded-full font-medium transition-all"
                style={
                  mode === "text"
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(240,98,146,0.95), rgba(214,51,132,0.95))",
                        color: "white",
                        boxShadow:
                          "0 2px 8px rgba(214,51,132,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }
                    : { color: "rgba(0,0,0,0.5)" }
                }
              >
                Text
              </button>
              {/* <button
                onClick={() => setMode("voice")}
                className="px-2.5 py-1 text-[10px] rounded-full font-medium transition-all"
                style={
                  mode === "voice"
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(240,98,146,0.95), rgba(214,51,132,0.95))",
                        color: "white",
                        boxShadow:
                          "0 2px 8px rgba(214,51,132,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }
                    : { color: "rgba(0,0,0,0.5)" }
                }
              >
                Voice
              </button> */}
            </div>

            {/* ── CLOSE ── */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-xs"
              style={{
                background: "rgba(255,182,213,0.25)",
                border: "1px solid rgba(255,182,213,0.4)",
                color: "rgba(0,0,0,0.5)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ================= CHAT AREA ================= */}
        <div
          className="flex-1 px-3 py-4 overflow-y-auto space-y-3 relative z-10"
          style={{
            scrollbarWidth: "none",
            background: "transparent",
          }}
        >
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,100,180,0.2), rgba(214,51,132,0.08))",
                  border: "1px solid rgba(255,182,213,0.4)",
                  boxShadow:
                    "0 0 24px rgba(214,51,132,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                👋
              </div>
              <p
                className="text-xs text-center font-medium"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                Hi! How can I assist you today?.
              </p>
            </div>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className="px-3 py-2 rounded-2xl max-w-[80%] text-xs leading-relaxed"
                style={
                  msg.from === "user"
                    ? {
                        background: "rgba(214,51,132,0.12)",
                        border: "1px solid rgba(214,51,132,0.25)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderBottomRightRadius: "4px",
                        boxShadow:
                          "0 4px 12px rgba(214,51,132,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
                        color: "rgba(0,0,0,0.85)",
                      }
                    : {
                        background: "rgba(255,255,255,0.55)",
                        border: "1px solid rgba(255,182,213,0.3)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderBottomLeftRadius: "4px",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)",
                        color: "rgba(0,0,0,0.8)",
                      }
                }
              >
                <p>{msg.text}</p>
                <p
                  className="text-[8px] text-right mt-1"
                  style={{ color: "rgba(0,0,0,0.3)" }}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div
                className="px-3 py-2.5 rounded-2xl flex gap-1.5 items-center"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,182,213,0.3)",
                  backdropFilter: "blur(16px)",
                  borderBottomLeftRadius: "4px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: "#d63384" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]"
                  style={{ background: "#d63384" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]"
                  style={{ background: "#d63384" }}
                />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ================= TEXT INPUT ================= */}
        {mode === "text" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="px-3 py-3 flex gap-2 items-center flex-shrink-0 relative z-10"
            style={{
              background: "rgba(255, 220, 236, 0.4)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,182,213,0.3)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <input
              className="flex-1 rounded-full px-4 py-2.5 text-xs outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,182,213,0.3)",
                backdropFilter: "blur(12px)",
                color: "rgba(0,0,0,0.8)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(214,51,132,0.5)";
                e.target.style.background = "rgba(255,255,255,0.8)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(214,51,132,0.1), inset 0 1px 0 rgba(255,255,255,0.6)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,182,213,0.3)";
                e.target.style.background = "rgba(255,255,255,0.6)";
                e.target.style.boxShadow =
                  "inset 0 1px 0 rgba(255,255,255,0.5)";
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, rgba(240,98,146,0.95), rgba(214,51,132,0.95))",
                boxShadow:
                  "0 4px 16px rgba(214,51,132,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              ➤
            </button>
          </form>
        )}

        {/* ================= VOICE INPUT ================= */}
        {/* {mode === "voice" && (
          <div
            className="px-4 py-4 flex flex-col items-center gap-2 flex-shrink-0 relative z-10"
            style={{
              background: "rgba(255, 220, 236, 0.4)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,182,213,0.3)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <button
              onClick={startListening}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-105"
              style={
                listening
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(255,77,109,0.9), rgba(255,140,66,0.9))",
                      boxShadow:
                        "0 4px 20px rgba(255,77,109,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      animation: "pulseBtn 1.2s infinite",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, rgba(240,98,146,0.95), rgba(214,51,132,0.95))",
                      boxShadow:
                        "0 4px 18px rgba(214,51,132,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }
              }
            >
              🎙️
            </button>
            <p
              className="text-[10px] tracking-wide font-medium"
              style={{ color: "rgba(0,0,0,0.45)" }}
            >
              {listening
                ? "Listening… speak now"
                : "Tap to speak your health concern"}
            </p>
          </div>
        )} */}
      </div>
    </>
  );
}