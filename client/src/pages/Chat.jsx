// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const synth = window.speechSynthesis;
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// export default function Chat() {
//   const [mode, setMode] = useState("text");
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [threadId, setThreadId] = useState(null);
//   const [DocAssServerUrl, setDocAssServerUrl] = useState("");
//   const recognitionRef = useRef(null);
//   const bottomRef = useRef(null);
//   const navigate = useNavigate();


//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const DocAssStoredUrl = localStorage.getItem("DocAss_server_url");
//       if (DocAssStoredUrl) {
//         setDocAssServerUrl(DocAssStoredUrl);
//         //console.log("✅ DocAss_server_url retrieved:", DocAssStoredUrl);
//       }
//     }
//   }, []);
//   /* ================= THREAD ID INIT ================= */
//   useEffect(() => {
//     const savedId = localStorage.getItem("chat_thread_id");
//     if (savedId) {
//       setThreadId(savedId);
//     } else {
//       const newId = "user-" + Math.random().toString(36).substr(2, 9);
//       localStorage.setItem("chat_thread_id", newId);
//       setThreadId(newId);
//     }
//   }, []);

//   /* ================= AUTO SCROLL ================= */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, listening, typing]);

//   /* ================= TEXT TO SPEECH ================= */
//   const speak = (text) => {
//     if (!synth) return;

//     synth.cancel(); // stop any previous speech
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.lang = "en-US";
//     utter.rate = 1;
//     utter.pitch = 1;
//     synth.speak(utter);
//   };

//   /* ================= SEND MESSAGE ================= */
//   const sendMessage = async (msg) => {
//     if (!msg.trim()) return;

//     const time = new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     setChat((prev) => [...prev, { from: "user", text: msg, time }]);
//     setInput("");
//     setTyping(true);

//     try {
//       const response = await fetch(
//         `${DocAssServerUrl}/chat`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             message: msg,
//             threadId: threadId,
//           }),
//         }
//       );

//       const data = await response.json();

//       const aiTime = new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       setChat((prev) => [
//         ...prev,
//         { from: "ai", text: data.response, time: aiTime },
//       ]);

//       // 🔊 Speak response ONLY in voice mode
//       if (mode === "voice") {
//         speak(data.response);
//       }

//       // 🔁 Session ended → reset thread
//       if (
//         data.sessionStatus === "completed" ||
//         data.sessionStatus === "expired"
//       ) {
//         localStorage.removeItem("chat_thread_id");
//         const newId =
//           "user-" + Math.random().toString(36).substr(2, 9);
//         localStorage.setItem("chat_thread_id", newId);
//         setThreadId(newId);
//       }
//     } catch (error) {
//       setChat((prev) => [
//         ...prev,
//         {
//           from: "ai",
//           text: "Error: Could not connect to server.",
//           time,
//         },
//       ]);
//     } finally {
//       setTyping(false);
//     }
//   };

//   /* ================= VOICE INPUT ================= */
//   const startListening = () => {
//     if (!SpeechRecognition) return;

//     if (recognitionRef.current) recognitionRef.current.abort();

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognition.onresult = (e) => {
//       sendMessage(e.results[0][0].transcript);
//       setListening(false);
//     };

//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);

//     recognitionRef.current = recognition;
//     setListening(true);
//     recognition.start();
//   };

//   // return (
//   //   <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col">
//   //     {/* ================= HEADER ================= */}
//   //     <div className="px-4 py-3 border-b border-white/10">
//   //       <div className="flex items-center justify-between">
//   //         <div className="flex items-center gap-3">
//   //           <button
//   //             onClick={() => navigate("/")}
//   //             className="text-2xl text-white/70 hover:text-white"
//   //           >
//   //             ←
//   //           </button>
//   //           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
//   //             🩺
//   //           </div>
//   //           <p className="font-medium text-emerald-400">
//   //             Doctor AI Assistant
//   //           </p>
//   //         </div>

//   //         <div className="flex bg-white/10 rounded-full p-1">
//   //           <button
//   //             onClick={() => setMode("text")}
//   //             className={`px-3 py-1 text-xs rounded-full ${
//   //               mode === "text"
//   //                 ? "bg-emerald-400 text-black"
//   //                 : "text-white/70"
//   //             }`}
//   //           >
//   //             Text
//   //           </button>
//   //           <button
//   //             onClick={() => setMode("voice")}
//   //             className={`px-3 py-1 text-xs rounded-full ${
//   //               mode === "voice"
//   //                 ? "bg-emerald-400 text-black"
//   //                 : "text-white/70"
//   //             }`}
//   //           >
//   //             Voice
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>

//   //     {/* ================= CHAT ================= */}
//   //     <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
//   //       {chat.map((msg, i) => (
//   //         <div
//   //           key={i}
//   //           className={`flex ${
//   //             msg.from === "user" ? "justify-end" : "justify-start"
//   //           }`}
//   //         >
//   //           <div
//   //             className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
//   //               msg.from === "user"
//   //                 ? "bg-[#2A2F35]"
//   //                 : "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
//   //             }`}
//   //           >
//   //             <p>{msg.text}</p>
//   //             <p className="text-[10px] text-gray-400 text-right mt-1">
//   //               {msg.time}
//   //             </p>
//   //           </div>
//   //         </div>
//   //       ))}

//   //       {typing && (
//   //         <div className="flex justify-start">
//   //           <div className="px-4 py-2 rounded-2xl bg-[#121820] border border-white/10 flex gap-1">
//   //             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
//   //             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
//   //             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
//   //           </div>
//   //         </div>
//   //       )}

//   //       <div ref={bottomRef} />
//   //     </div>

//   //     {/* ================= INPUT ================= */}
//   //     {mode === "text" && (
//   //       <form
//   //         onSubmit={(e) => {
//   //           e.preventDefault();
//   //           sendMessage(input);
//   //         }}
//   //         className="px-6 py-4 border-t border-white/10 flex gap-3"
//   //       >
//   //         <input
//   //           className="flex-1 bg-[#121820] border border-white/10 rounded-full px-5 py-3"
//   //           value={input}
//   //           onChange={(e) => setInput(e.target.value)}
//   //           placeholder="Describe your symptoms..."
//   //         />
//   //         <button className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold">
//   //           ➤
//   //         </button>
//   //       </form>
//   //     )}

//   //     {mode === "voice" && (
//   //       <div className="px-6 py-6 border-t border-white/10 flex flex-col items-center">
//   //         <button
//   //           onClick={startListening}
//   //           className={`w-16 h-16 rounded-full ${
//   //             listening
//   //               ? "bg-red-500 animate-pulse"
//   //               : "bg-gradient-to-r from-emerald-400 to-green-500"
//   //           }`}
//   //         >
//   //           🎙️
//   //         </button>
//   //         <p className="text-sm text-gray-400 mt-3">
//   //           Speak your health concern
//   //         </p>
//   //       </div>
//   //     )}
//   //   </div>
//   // );
// return (
//     <div className="min-h-screen text-white flex flex-col relative overflow-hidden"
//       style={{ background: "linear-gradient(135deg, #1a1200 0%, #2a1f00 25%, #1f1700 50%, #150f00 75%, #0d0800 100%)" }}
//     >
//       {/* ================= AMBIENT ORBS ================= */}
//       <div className="fixed w-96 h-96 rounded-full pointer-events-none z-0 top-[-100px] left-[-100px]"
//         style={{ background: "rgba(255,230,114,0.22)", filter: "blur(90px)" }} />
//       <div className="fixed w-80 h-80 rounded-full pointer-events-none z-0 bottom-0 right-[-80px]"
//         style={{ background: "rgba(255,180,50,0.18)", filter: "blur(90px)" }} />
//       <div className="fixed w-64 h-64 rounded-full pointer-events-none z-0 top-[35%] left-[30%]"
//         style={{ background: "rgba(255,230,114,0.12)", filter: "blur(80px)" }} />
//       <div className="fixed w-48 h-48 rounded-full pointer-events-none z-0 top-[10%] right-[10%]"
//         style={{ background: "rgba(255,200,80,0.14)", filter: "blur(70px)" }} />

//       {/* ================= SLIDE-DOWN WRAPPER ================= */}
//       <div className="flex flex-col flex-1 z-10 animate-[slideDown_0.6s_cubic-bezier(0.22,1,0.36,1)_both]">

//         {/* ================= HEADER ================= */}
//         <div className="px-4 py-3 border-b flex items-center justify-between"
//           style={{
//             background: "rgba(255,230,114,0.07)",
//             backdropFilter: "blur(24px)",
//             WebkitBackdropFilter: "blur(24px)",
//             borderColor: "rgba(255,230,114,0.18)"
//           }}
//         >
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate("/")}
//               className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
//               style={{
//                 background: "rgba(255,230,114,0.1)",
//                 border: "1px solid rgba(255,230,114,0.2)"
//               }}
//             >
//               ←
//             </button>
//             <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 0 24px rgba(255,230,114,0.45)"
//               }}
//             >
//               👋
//             </div>
//             <div>
//               <p className="text-sm font-semibold"
//                 style={{
//                   background: "linear-gradient(90deg, #ffe672, #ffd040)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent"
//                 }}
//               >
//                  AI Assistant
//               </p>
//               <p className="text-[10px] text-white/40 mt-0.5">● Online · Always here for you</p>
//             </div>
//           </div>

//           <div className="flex rounded-full p-1"
//             style={{
//               background: "rgba(255,230,114,0.08)",
//               border: "1px solid rgba(255,230,114,0.2)"
//             }}
//           >
//             <button
//               onClick={() => setMode("text")}
//               className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
//                 mode === "text" ? "text-black" : "text-white/50"
//               }`}
//               style={mode === "text" ? {
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 2px 12px rgba(255,230,114,0.4)"
//               } : {}}
//             >
//               Text
//             </button>
//             <button
//               onClick={() => setMode("voice")}
//               className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
//                 mode === "voice" ? "text-black" : "text-white/50"
//               }`}
//               style={mode === "voice" ? {
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 2px 12px rgba(255,230,114,0.4)"
//               } : {}}
//             >
//               Voice
//             </button>
//           </div>
//         </div>

//         {/* ================= CHAT ================= */}
//         <div className="flex-1 px-4 py-5 overflow-y-auto space-y-3 scrollbar-none">
//           {chat.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className="px-4 py-2.5 rounded-[18px] max-w-[72%] text-sm leading-relaxed"
//                 style={
//                   msg.from === "user"
//                     ? {
//                         background: "rgba(255,230,114,0.15)",
//                         border: "1px solid rgba(255,230,114,0.3)",
//                         backdropFilter: "blur(12px)",
//                         WebkitBackdropFilter: "blur(12px)",
//                         borderBottomRightRadius: "4px",
//                       }
//                     : {
//                         background: "rgba(255,255,255,0.06)",
//                         border: "1px solid rgba(255,230,114,0.12)",
//                         backdropFilter: "blur(16px)",
//                         WebkitBackdropFilter: "blur(16px)",
//                         borderBottomLeftRadius: "4px",
//                       }
//                 }
//               >
//                 <p className="text-white/90">{msg.text}</p>
//                 <p className="text-[9px] text-white/30 text-right mt-1">{msg.time}</p>
//               </div>
//             </div>
//           ))}

//           {typing && (
//             <div className="flex justify-start">
//               <div
//                 className="px-4 py-3 rounded-[18px] flex gap-1.5 items-center"
//                 style={{
//                   background: "rgba(255,255,255,0.06)",
//                   border: "1px solid rgba(255,230,114,0.12)",
//                   backdropFilter: "blur(16px)",
//                   WebkitBackdropFilter: "blur(16px)",
//                   borderBottomLeftRadius: "4px",
//                 }}
//               >
//                 <span className="w-2 h-2 rounded-full animate-bounce"
//                   style={{ background: "#ffe672" }} />
//                 <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]"
//                   style={{ background: "#ffe672" }} />
//                 <span className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]"
//                   style={{ background: "#ffe672" }} />
//               </div>
//             </div>
//           )}

//           <div ref={bottomRef} />
//         </div>

//         {/* ================= TEXT INPUT ================= */}
//         {mode === "text" && (
//           <form
//             onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
//             className="px-4 py-3 flex gap-3 items-center border-t"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderColor: "rgba(255,230,114,0.15)"
//             }}
//           >
//             <input
//               className="flex-1 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
//               style={{
//                 background: "rgba(255,230,114,0.07)",
//                 border: "1px solid rgba(255,230,114,0.18)",
//               }}
//               onFocus={e => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.55)";
//                 e.target.style.background = "rgba(255,230,114,0.12)";
//               }}
//               onBlur={e => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.18)";
//                 e.target.style.background = "rgba(255,230,114,0.07)";
//               }}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Describe your symptoms..."
//             />
//             <button
//               type="submit"
//               className="w-11 h-11 rounded-full flex items-center justify-center text-black text-base flex-shrink-0 font-bold transition-transform hover:scale-105 active:scale-95"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 4px 20px rgba(255,230,114,0.35)"
//               }}
//             >
//               ➤
//             </button>
//           </form>
//         )}

//         {/* ================= VOICE INPUT ================= */}
//         {mode === "voice" && (
//           <div
//             className="px-6 py-6 flex flex-col items-center gap-3 border-t"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderColor: "rgba(255,230,114,0.15)"
//             }}
//           >
//             <button
//               onClick={startListening}
//               className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-105"
//               style={
//                 listening
//                   ? {
//                       background: "linear-gradient(135deg, #ff4d6d, #ff8c42)",
//                       boxShadow: "0 4px 28px rgba(255,77,109,0.55)",
//                       animation: "pulse 1.2s infinite",
//                     }
//                   : {
//                       background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                       boxShadow: "0 4px 24px rgba(255,230,114,0.4)",
//                     }
//               }
//             >
//               🎙️
//             </button>
//             <p className="text-xs text-white/40 tracking-wide">
//               {listening ? "Listening… speak now" : "Tap to speak your health concern"}
//             </p>
//           </div>
//         )}

//       </div>

//       {/* ================= KEYFRAMES ================= */}
//       <style>{`
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-40px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//         }
//       `}</style>
//     </div>
//   );

// }

// import { useState, useRef, useEffect } from "react";

// const synth = window.speechSynthesis;
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// export default function Chat({ isOpen, onClose }) {
//   const [mode, setMode] = useState("text");
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [threadId, setThreadId] = useState(null);
//   const [DocAssServerUrl, setDocAssServerUrl] = useState("");
//   const recognitionRef = useRef(null);
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const DocAssStoredUrl = localStorage.getItem("DocAss_server_url");
//       if (DocAssStoredUrl) setDocAssServerUrl(DocAssStoredUrl);
//     }
//   }, []);

//   useEffect(() => {
//     const savedId = localStorage.getItem("chat_thread_id");
//     if (savedId) {
//       setThreadId(savedId);
//     } else {
//       const newId = "user-" + Math.random().toString(36).substr(2, 9);
//       localStorage.setItem("chat_thread_id", newId);
//       setThreadId(newId);
//     }
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, listening, typing]);

//   const speak = (text) => {
//     if (!synth) return;
//     synth.cancel();
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.lang = "en-US";
//     utter.rate = 1;
//     utter.pitch = 1;
//     synth.speak(utter);
//   };

//   const sendMessage = async (msg) => {
//     if (!msg.trim()) return;
//     const time = new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     setChat((prev) => [...prev, { from: "user", text: msg, time }]);
//     setInput("");
//     setTyping(true);

//     try {
//       const response = await fetch(`${DocAssServerUrl}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg, threadId }),
//       });
//       const data = await response.json();
//       const aiTime = new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//       setChat((prev) => [
//         ...prev,
//         { from: "ai", text: data.response, time: aiTime },
//       ]);
//       if (mode === "voice") speak(data.response);
//       if (
//         data.sessionStatus === "completed" ||
//         data.sessionStatus === "expired"
//       ) {
//         localStorage.removeItem("chat_thread_id");
//         const newId = "user-" + Math.random().toString(36).substr(2, 9);
//         localStorage.setItem("chat_thread_id", newId);
//         setThreadId(newId);
//       }
//     } catch {
//       setChat((prev) => [
//         ...prev,
//         { from: "ai", text: "Error: Could not connect to server.", time },
//       ]);
//     } finally {
//       setTyping(false);
//     }
//   };

//   const startListening = () => {
//     if (!SpeechRecognition) return;
//     if (recognitionRef.current) recognitionRef.current.abort();
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.onresult = (e) => {
//       sendMessage(e.results[0][0].transcript);
//       setListening(false);
//     };
//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);
//     recognitionRef.current = recognition;
//     setListening(true);
//     recognition.start();
//   };

//   return (
//     <>
//       {/* ================= KEYFRAMES ================= */}
//       <style>{`
//         @keyframes slideDownModal {
//           from { opacity: 0; transform: translateY(-30px) scale(0.96); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes pulseBtn {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//         }
//       `}</style>

//       {/* Backdrop - closes modal on outside click */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40"
//           onClick={onClose}
//         />
//       )}

//       {/* ================= CHAT MODAL ================= */}
//       <div
//         className="fixed top-[70px] right-4 z-50 w-[360px] rounded-2xl overflow-hidden flex flex-col"
//         style={{
//           height: "560px",
//           background: "linear-gradient(135deg, #1a1200 0%, #2a1f00 25%, #1f1700 50%, #150f00 75%, #0d0800 100%)",
//           boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,230,114,0.15)",
//           // Slide down when open, slide up when closed
//           transformOrigin: "top right",
//           transition: "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
//           opacity: isOpen ? 1 : 0,
//           transform: isOpen ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)",
//           pointerEvents: isOpen ? "all" : "none",
//         }}
//       >
//         {/* Ambient Orbs */}
//         <div className="absolute w-48 h-48 rounded-full pointer-events-none"
//           style={{ background: "rgba(255,230,114,0.18)", filter: "blur(60px)", top: "-40px", left: "-40px" }} />
//         <div className="absolute w-40 h-40 rounded-full pointer-events-none"
//           style={{ background: "rgba(255,180,50,0.14)", filter: "blur(60px)", bottom: "0px", right: "-30px" }} />

//         {/* ================= HEADER ================= */}
//         <div
//           className="px-4 py-3 flex items-center justify-between flex-shrink-0 relative z-10"
//           style={{
//             background: "rgba(255,230,114,0.07)",
//             backdropFilter: "blur(24px)",
//             WebkitBackdropFilter: "blur(24px)",
//             borderBottom: "1px solid rgba(255,230,114,0.18)",
//           }}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 0 18px rgba(255,230,114,0.45)",
//               }}
//             >
//               👋
//             </div>
//             <div>
//               <p
//                 className="text-xs font-semibold"
//                 style={{
//                   background: "linear-gradient(90deg, #ffe672, #ffd040)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 AI Assistant
//               </p>
//               <p className="text-[9px] text-white/40">● Online · Always here for you</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Mode Toggle */}
//             <div
//               className="flex rounded-full p-0.5"
//               style={{
//                 background: "rgba(255,230,114,0.08)",
//                 border: "1px solid rgba(255,230,114,0.2)",
//               }}
//             >
//               <button
//                 onClick={() => setMode("text")}
//                 className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-all ${
//                   mode === "text" ? "text-black" : "text-white/50"
//                 }`}
//                 style={
//                   mode === "text"
//                     ? {
//                         background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                         boxShadow: "0 2px 8px rgba(255,230,114,0.4)",
//                       }
//                     : {}
//                 }
//               >
//                 Text
//               </button>
//               <button
//                 onClick={() => setMode("voice")}
//                 className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-all ${
//                   mode === "voice" ? "text-black" : "text-white/50"
//                 }`}
//                 style={
//                   mode === "voice"
//                     ? {
//                         background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                         boxShadow: "0 2px 8px rgba(255,230,114,0.4)",
//                       }
//                     : {}
//                 }
//               >
//                 Voice
//               </button>
//             </div>

//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors text-sm"
//               style={{
//                 background: "rgba(255,255,255,0.08)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         {/* ================= CHAT AREA ================= */}
//         <div
//           className="flex-1 px-3 py-4 overflow-y-auto space-y-3 relative z-10"
//           style={{ scrollbarWidth: "none" }}
//         >
//           {chat.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
//               <div
//                 className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
//                 style={{ background: "linear-gradient(135deg, #ffe672, #ffb347)" }}
//               >
//                 🩺
//               </div>
//               <p className="text-white/50 text-xs text-center">
//                 Hi! Describe your symptoms<br />and I'll help you out.
//               </p>
//             </div>
//           )}

//           {chat.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className="px-3 py-2 rounded-[16px] max-w-[80%] text-xs leading-relaxed"
//                 style={
//                   msg.from === "user"
//                     ? {
//                         background: "rgba(255,230,114,0.15)",
//                         border: "1px solid rgba(255,230,114,0.3)",
//                         backdropFilter: "blur(12px)",
//                         borderBottomRightRadius: "4px",
//                       }
//                     : {
//                         background: "rgba(255,255,255,0.06)",
//                         border: "1px solid rgba(255,230,114,0.12)",
//                         backdropFilter: "blur(16px)",
//                         borderBottomLeftRadius: "4px",
//                       }
//                 }
//               >
//                 <p className="text-white/90">{msg.text}</p>
//                 <p className="text-[8px] text-white/30 text-right mt-1">{msg.time}</p>
//               </div>
//             </div>
//           ))}

//           {typing && (
//             <div className="flex justify-start">
//               <div
//                 className="px-3 py-2.5 rounded-[16px] flex gap-1.5 items-center"
//                 style={{
//                   background: "rgba(255,255,255,0.06)",
//                   border: "1px solid rgba(255,230,114,0.12)",
//                   backdropFilter: "blur(16px)",
//                   borderBottomLeftRadius: "4px",
//                 }}
//               >
//                 <span className="w-1.5 h-1.5 rounded-full animate-bounce"
//                   style={{ background: "#ffe672" }} />
//                 <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]"
//                   style={{ background: "#ffe672" }} />
//                 <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]"
//                   style={{ background: "#ffe672" }} />
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* ================= TEXT INPUT ================= */}
//         {mode === "text" && (
//           <form
//             onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
//             className="px-3 py-3 flex gap-2 items-center flex-shrink-0 relative z-10"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderTop: "1px solid rgba(255,230,114,0.15)",
//             }}
//           >
//             <input
//               className="flex-1 rounded-full px-4 py-2.5 text-xs text-white outline-none transition-all"
//               style={{
//                 background: "rgba(255,230,114,0.07)",
//                 border: "1px solid rgba(255,230,114,0.18)",
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.55)";
//                 e.target.style.background = "rgba(255,230,114,0.12)";
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.18)";
//                 e.target.style.background = "rgba(255,230,114,0.07)";
//               }}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Describe your symptoms..."
//             />
//             <button
//               type="submit"
//               className="w-9 h-9 rounded-full flex items-center justify-center text-black text-sm flex-shrink-0 font-bold transition-transform hover:scale-105 active:scale-95"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 4px 16px rgba(255,230,114,0.35)",
//               }}
//             >
//               ➤
//             </button>
//           </form>
//         )}

//         {/* ================= VOICE INPUT ================= */}
//         {mode === "voice" && (
//           <div
//             className="px-4 py-4 flex flex-col items-center gap-2 flex-shrink-0 relative z-10"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderTop: "1px solid rgba(255,230,114,0.15)",
//             }}
//           >
//             <button
//               onClick={startListening}
//               className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-105"
//               style={
//                 listening
//                   ? {
//                       background: "linear-gradient(135deg, #ff4d6d, #ff8c42)",
//                       boxShadow: "0 4px 20px rgba(255,77,109,0.55)",
//                       animation: "pulseBtn 1.2s infinite",
//                     }
//                   : {
//                       background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                       boxShadow: "0 4px 18px rgba(255,230,114,0.4)",
//                     }
//               }
//             >
//               🎙️
//             </button>
//             <p className="text-[10px] text-white/40 tracking-wide">
//               {listening ? "Listening… speak now" : "Tap to speak your health concern"}
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// import { useState, useRef, useEffect } from "react";

// const synth = window.speechSynthesis;
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// const SIZES = [
//   { label: "S", width: "320px", height: "480px" },
//   { label: "M", width: "380px", height: "560px" },
//   { label: "L", width: "460px", height: "650px" },
//   { label: "XL", width: "540px", height: "740px" },
// ];

// export default function Chat({ isOpen, onClose }) {
//   const [mode, setMode] = useState("text");
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [threadId, setThreadId] = useState(null);
//   const [DocAssServerUrl, setDocAssServerUrl] = useState("");
//   const [sizeIndex, setSizeIndex] = useState(0); // default M
//   const recognitionRef = useRef(null);
//   const bottomRef = useRef(null);

//   const currentSize = SIZES[sizeIndex];

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const DocAssStoredUrl = localStorage.getItem("DocAss_server_url");
//       if (DocAssStoredUrl) setDocAssServerUrl(DocAssStoredUrl);
//     }
//   }, []);

//   useEffect(() => {
//     const savedId = localStorage.getItem("chat_thread_id");
//     if (savedId) {
//       setThreadId(savedId);
//     } else {
//       const newId = "user-" + Math.random().toString(36).substr(2, 9);
//       localStorage.setItem("chat_thread_id", newId);
//       setThreadId(newId);
//     }
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, listening, typing]);

//   const speak = (text) => {
//     if (!synth) return;
//     synth.cancel();
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.lang = "en-US";
//     utter.rate = 1;
//     utter.pitch = 1;
//     synth.speak(utter);
//   };

//   const sendMessage = async (msg) => {
//     if (!msg.trim()) return;
//     const time = new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     setChat((prev) => [...prev, { from: "user", text: msg, time }]);
//     setInput("");
//     setTyping(true);

//     try {
//       const response = await fetch(`${DocAssServerUrl}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: msg, threadId }),
//       });
//       const data = await response.json();
//       const aiTime = new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//       setChat((prev) => [
//         ...prev,
//         { from: "ai", text: data.response, time: aiTime },
//       ]);
//       if (mode === "voice") speak(data.response);
//       if (
//         data.sessionStatus === "completed" ||
//         data.sessionStatus === "expired"
//       ) {
//         localStorage.removeItem("chat_thread_id");
//         const newId = "user-" + Math.random().toString(36).substr(2, 9);
//         localStorage.setItem("chat_thread_id", newId);
//         setThreadId(newId);
//       }
//     } catch {
//       setChat((prev) => [
//         ...prev,
//         { from: "ai", text: "Error: Could not connect to server.", time },
//       ]);
//     } finally {
//       setTyping(false);
//     }
//   };

//   const startListening = () => {
//     if (!SpeechRecognition) return;
//     if (recognitionRef.current) recognitionRef.current.abort();
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.onresult = (e) => {
//       sendMessage(e.results[0][0].transcript);
//       setListening(false);
//     };
//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);
//     recognitionRef.current = recognition;
//     setListening(true);
//     recognition.start();
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes pulseBtn {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//         }
//       `}</style>

//       {/* Backdrop */}
//       {isOpen && (
//         <div className="fixed inset-0 z-40" onClick={onClose} />
//       )}

//       {/* ================= CHAT MODAL ================= */}
//       <div
//         className="fixed top-[70px] right-4 z-50 rounded-2xl overflow-hidden flex flex-col"
//         style={{
//           width: currentSize.width,
//           height: currentSize.height,
//           background:
//             "linear-gradient(135deg, #1a1200 0%, #2a1f00 25%, #1f1700 50%, #150f00 75%, #0d0800 100%)",
//           boxShadow:
//             "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,230,114,0.15)",
//           transformOrigin: "top right",
//           transition:
//             "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1), width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1)",
//           opacity: isOpen ? 1 : 0,
//           transform: isOpen
//             ? "translateY(0) scale(1)"
//             : "translateY(-20px) scale(0.95)",
//           pointerEvents: isOpen ? "all" : "none",
//         }}
//       >
//         {/* Ambient Orbs */}
//         <div
//           className="absolute w-48 h-48 rounded-full pointer-events-none"
//           style={{
//             background: "rgba(255,230,114,0.18)",
//             filter: "blur(60px)",
//             top: "-40px",
//             left: "-40px",
//           }}
//         />
//         <div
//           className="absolute w-40 h-40 rounded-full pointer-events-none"
//           style={{
//             background: "rgba(255,180,50,0.14)",
//             filter: "blur(60px)",
//             bottom: "0px",
//             right: "-30px",
//           }}
//         />

//         {/* ================= HEADER ================= */}
//         <div
//           className="px-3 py-2.5 flex items-center justify-between flex-shrink-0 relative z-10"
//           style={{
//             background: "rgba(255,230,114,0.07)",
//             backdropFilter: "blur(24px)",
//             WebkitBackdropFilter: "blur(24px)",
//             borderBottom: "1px solid rgba(255,230,114,0.18)",
//           }}
//         >
//           {/* Left — Avatar + Name */}
//           <div className="flex items-center gap-2">
//             <div
//               className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 0 14px rgba(255,230,114,0.45)",
//               }}
//             >
//               👋
//             </div>
//             <div>
//               <p
//                 className="text-xs font-semibold"
//                 style={{
//                   background: "linear-gradient(90deg, #ffe672, #ffd040)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 AI Assistant
//               </p>
//               <p className="text-[9px] text-white/40">● Online</p>
//             </div>
//           </div>

//           {/* Right — Size Controls + Mode Toggle + Close */}
//           <div className="flex items-center gap-1.5">

//             {/* ── SIZE CONTROLS ── */}
//             <div
//               className="flex items-center rounded-full overflow-hidden"
//               style={{
//                 background: "rgba(255,230,114,0.08)",
//                 border: "1px solid rgba(255,230,114,0.2)",
//               }}
//             >
//               {/* Shrink */}
//               <button
//                 onClick={() => setSizeIndex((i) => Math.max(0, i - 1))}
//                 disabled={sizeIndex === 0}
//                 className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-25 transition-all text-base font-bold"
//                 title="Shrink"
//               >
//                 −
//               </button>

//               {/* Size label pill */}
//               <span
//                 className="text-[10px] font-semibold px-1 min-w-[18px] text-center"
//                 style={{
//                   background: "linear-gradient(90deg, #ffe672, #ffb347)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 {currentSize.label}
//               </span>

//               {/* Expand */}
//               <button
//                 onClick={() => setSizeIndex((i) => Math.min(SIZES.length - 1, i + 1))}
//                 disabled={sizeIndex === SIZES.length - 1}
//                 className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-25 transition-all text-base font-bold"
//                 title="Expand"
//               >
//                 +
//               </button>
//             </div>

//             {/* ── MODE TOGGLE ── */}
//             <div
//               className="flex rounded-full p-0.5"
//               style={{
//                 background: "rgba(255,230,114,0.08)",
//                 border: "1px solid rgba(255,230,114,0.2)",
//               }}
//             >
//               <button
//                 onClick={() => setMode("text")}
//                 className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-all ${
//                   mode === "text" ? "text-black" : "text-white/50"
//                 }`}
//                 style={
//                   mode === "text"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #ffe672, #ffb347)",
//                         boxShadow: "0 2px 8px rgba(255,230,114,0.4)",
//                       }
//                     : {}
//                 }
//               >
//                 Text
//               </button>
//               <button
//                 onClick={() => setMode("voice")}
//                 className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-all ${
//                   mode === "voice" ? "text-black" : "text-white/50"
//                 }`}
//                 style={
//                   mode === "voice"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #ffe672, #ffb347)",
//                         boxShadow: "0 2px 8px rgba(255,230,114,0.4)",
//                       }
//                     : {}
//                 }
//               >
//                 Voice
//               </button>
//             </div>

//             {/* ── CLOSE ── */}
//             <button
//               onClick={onClose}
//               className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs"
//               style={{
//                 background: "rgba(255,255,255,0.08)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         {/* ================= CHAT AREA ================= */}
//         <div
//           className="flex-1 px-3 py-4 overflow-y-auto space-y-3 relative z-10 bg-[#ffebf3]"
//           style={{ scrollbarWidth: "none" }}
//         >
//           {chat.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
//               <div
//                 className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
//                 style={{
//                   background: "rgba(255,235,243,0.1)",
//                 }}
//               >
//                 🩺
//               </div>
//               <p className="text-white/50 text-xs text-center">
//                 Hi! Describe your symptoms
//                 <br />
//                 and I'll help you out.
//               </p>
//             </div>
//           )}

//           {chat.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 msg.from === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className="px-3 py-2 rounded-[16px] max-w-[80%] text-xs leading-relaxed"
//                 style={
//                   msg.from === "user"
//                     ? {
//                         background: "rgba(255,230,114,0.15)",
//                         border: "1px solid rgba(255,230,114,0.3)",
//                         backdropFilter: "blur(12px)",
//                         borderBottomRightRadius: "4px",
//                       }
//                     : {
//                         background: "rgba(255,255,255,0.06)",
//                         border: "1px solid rgba(255,230,114,0.12)",
//                         backdropFilter: "blur(16px)",
//                         borderBottomLeftRadius: "4px",
//                       }
//                 }
//               >
//                 <p className="text-white/90">{msg.text}</p>
//                 <p className="text-[8px] text-white/30 text-right mt-1">
//                   {msg.time}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {typing && (
//             <div className="flex justify-start">
//               <div
//                 className="px-3 py-2.5 rounded-[16px] flex gap-1.5 items-center"
//                 style={{
//                   background: "rgba(255,255,255,0.06)",
//                   border: "1px solid rgba(255,230,114,0.12)",
//                   backdropFilter: "blur(16px)",
//                   borderBottomLeftRadius: "4px",
//                 }}
//               >
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-bounce"
//                   style={{ background: "#ffe672" }}
//                 />
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]"
//                   style={{ background: "#ffe672" }}
//                 />
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]"
//                   style={{ background: "#ffe672" }}
//                 />
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* ================= TEXT INPUT ================= */}
//         {mode === "text" && (
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               sendMessage(input);
//             }}
//             className="px-3 py-3 flex gap-2 items-center flex-shrink-0 relative z-10"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderTop: "1px solid rgba(255,230,114,0.15)",
//             }}
//           >
//             <input
//               className="flex-1 rounded-full px-4 py-2.5 text-xs text-white outline-none transition-all"
//               style={{
//                 background: "rgba(255,230,114,0.07)",
//                 border: "1px solid rgba(255,230,114,0.18)",
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.55)";
//                 e.target.style.background = "rgba(255,230,114,0.12)";
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "rgba(255,230,114,0.18)";
//                 e.target.style.background = "rgba(255,230,114,0.07)";
//               }}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Describe your symptoms..."
//             />
//             <button
//               type="submit"
//               className="w-9 h-9 rounded-full flex items-center justify-center text-black text-sm flex-shrink-0 font-bold transition-transform hover:scale-105 active:scale-95"
//               style={{
//                 background: "linear-gradient(135deg, #ffe672, #ffb347)",
//                 boxShadow: "0 4px 16px rgba(255,230,114,0.35)",
//               }}
//             >
//               ➤
//             </button>
//           </form>
//         )}

//         {/* ================= VOICE INPUT ================= */}
//         {mode === "voice" && (
//           <div
//             className="px-4 py-4 flex flex-col items-center gap-2 flex-shrink-0 relative z-10"
//             style={{
//               background: "rgba(255,230,114,0.06)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               borderTop: "1px solid rgba(255,230,114,0.15)",
//             }}
//           >
//             <button
//               onClick={startListening}
//               className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-105"
//               style={
//                 listening
//                   ? {
//                       background:
//                         "linear-gradient(135deg, #ff4d6d, #ff8c42)",
//                       boxShadow: "0 4px 20px rgba(255,77,109,0.55)",
//                       animation: "pulseBtn 1.2s infinite",
//                     }
//                   : {
//                       background:
//                         "linear-gradient(135deg, #ffe672, #ffb347)",
//                       boxShadow: "0 4px 18px rgba(255,230,114,0.4)",
//                     }
//               }
//             >
//               🎙️
//             </button>
//             <p className="text-[10px] text-white/40 tracking-wide">
//               {listening
//                 ? "Listening… speak now"
//                 : "Tap to speak your health concern"}
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
 
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
              <button
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
              </button>
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
        {mode === "voice" && (
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
        )}
      </div>
    </>
  );
}