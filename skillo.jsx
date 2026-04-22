// Skillo.jsx - brand hero mascot for Skillo Academy
//
// Requirements:
//   - React 18+, Tailwind CSS
//   - place skillo-body.webp and skillo-hand.webp next to this file
//   - Satoshi is loaded via <style> @import - remove if you self-host it
//
// Usage:
//   import Skillo from "./Skillo";
//   const ref = useRef(null);
//   <Skillo ref={ref} />
//   ref.current.wave();           // trigger wave animation
//   ref.current.notify("text");   // wave + red dot + open chat with message
//
// IMPORTANT: this component posts to /api/chat for AI replies.
// Implement that endpoint on your backend. It receives:
//   { messages: [{ role: "user"|"assistant", content: "..." }, ...] }
// It must return { reply: "..." }.
// Keep your Anthropic API key server-side, never in the frontend.

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import bodyImg from "./skillo-body.webp";
import handImg from "./skillo-hand.webp";

const BODY_IMG = bodyImg;
const HAND_IMG = handImg;

const BRAND = "#42079E";
const BORDER = "#E7D9FB";

// ============================================================
// <Skillo /> - brand hero mascot
//
// Props / refs API:
//   <Skillo ref={ref} />
//   ref.current.wave();           -> single wave animation
//   ref.current.notify("text");   -> wave + red dot + open chat with message
// ============================================================
const Skillo = forwardRef(function Skillo(props, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [waveKey, setWaveKey] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);

  const wave = useCallback(() => {
    setWaveKey((k) => k + 1);
  }, []);

  const notify = useCallback(
    (message) => {
      setHasNotification((prev) => {
        const next = !prev;
        if (next) {
          setPendingMessage(message || "Hej! Mam coś dla Ciebie.");
          wave();
        } else {
          setPendingMessage(null);
        }
        return next;
      });
    },
    [wave]
  );

  useImperativeHandle(ref, () => ({ wave, notify }), [wave, notify]);

  useEffect(() => {
    const t = setTimeout(() => wave(), 600);
    return () => clearTimeout(t);
  }, [wave]);

  const handleClick = () => {
    setIsOpen((o) => !o);
    setHasNotification(false);
  };

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');

        .skillo-root { font-family: 'Satoshi', system-ui, -apple-system, sans-serif; }

        @keyframes skillo-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes skillo-wave {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(-22deg); }
          30%  { transform: rotate(14deg); }
          45%  { transform: rotate(-18deg); }
          60%  { transform: rotate(12deg); }
          75%  { transform: rotate(-6deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes skillo-pop {
          0%   { transform: scale(0.5) translateY(20px); opacity: 0; }
          70%  { transform: scale(1.03) translateY(-3px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes skillo-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes skillo-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
          40%           { transform: scale(1);   opacity: 1; }
        }

        .skillo-float { animation: skillo-float 4s ease-in-out infinite; }

        .skillo-lift  { transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        .skillo-lift.hovering { transform: translateY(-10px) scale(1.05); }

        .skillo-hand {
          transform-origin: 38% 88%;
          animation: skillo-wave 1.3s ease-in-out 2;
        }

        .skillo-pop  { animation: skillo-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: bottom right; }
        .skillo-ping { animation: skillo-ping 1.4s ease-out infinite; }
        .skillo-typing-dot:nth-child(1) { animation: skillo-dot 1.2s infinite; }
        .skillo-typing-dot:nth-child(2) { animation: skillo-dot 1.2s infinite 0.15s; }
        .skillo-typing-dot:nth-child(3) { animation: skillo-dot 1.2s infinite 0.3s; }

        /* Custom scrollbar for messages area */
        .skillo-scroll::-webkit-scrollbar { width: 6px; }
        .skillo-scroll::-webkit-scrollbar-track { background: transparent; }
        .skillo-scroll::-webkit-scrollbar-thumb { background: #E7D9FB; border-radius: 3px; }
        .skillo-scroll::-webkit-scrollbar-thumb:hover { background: #C9B4F2; }
        .skillo-scroll { scrollbar-width: thin; scrollbar-color: #E7D9FB transparent; }
      `}</style>

      <div className="skillo-root">
        {/* Chat panel ABOVE the hero (panel handles its own positioning) */}
        {isOpen && (
          <ChatPanel
            onClose={() => setIsOpen(false)}
            initialMessage={pendingMessage}
            clearInitial={() => setPendingMessage(null)}
          />
        )}

        {/* The hero widget — fixed bottom-right */}
        <div className="fixed bottom-6 right-6 z-40" style={{ width: 108, height: 100 }}>
          <div className="skillo-float w-full h-full">
            <div
              className={"skillo-lift w-full h-full cursor-pointer relative " + (isHovering ? "hovering" : "")}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
              aria-label="Otwórz asystenta Skillo"
            >
              {/* Body (hero without hand) */}
              <img
                src={BODY_IMG}
                alt=""
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />

              {/* Hand — remounts on wave() to restart animation */}
              <img
                key={waveKey}
                src={HAND_IMG}
                alt=""
                draggable={false}
                className="skillo-hand absolute select-none pointer-events-none"
                style={{ width: "25%", top: "6%", right: "8%" }}
              />

              {/* Notification indicator */}
              {hasNotification && !isOpen && (
                <>
                  <span
                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white z-10"
                    style={{ background: BRAND }}
                  />
                  <span
                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full skillo-ping"
                    style={{ background: BRAND }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// ============================================================
// <ChatPanel /> - chat window positioned ABOVE the hero
// ============================================================
function ChatPanel({ onClose, initialMessage, clearInitial }) {
  const [messages, setMessages] = useState(() => {
    const greeting = initialMessage || "Cześć! Jestem Skillo, twój asystent nauki. W czym mogę pomóc?";
    return [{ role: "assistant", content: greeting }];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (initialMessage && clearInitial) clearInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.reply || "Przepraszam, coś poszło nie tak.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Hm, nie udało się połączyć. Spróbuj za chwilę." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Positioned ABOVE hero: hero is bottom-6 right-6 (84x100), panel sits above with gap
  // bottom-offset: 24 (hero bottom) + 100 (hero height) + 20 (gap) = 144px
  return (
    <div
      className="skillo-pop fixed right-6 z-50 rounded-[8px] flex flex-col bg-white"
      style={{
        bottom: "144px",
        width: "330px",
        maxWidth: "calc(100vw - 48px)",
        height: "480px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 17px 33px -2px rgba(151, 71, 255, 0.12)",
      }}
    >
      {/* Tail pointing DOWN to hero — speech-bubble style like the reference */}
      <svg
        className="absolute"
        style={{ bottom: "-14px", right: "36px" }}
        width="28"
        height="16"
        viewBox="0 0 28 16"
        fill="none"
        aria-hidden="true"
      >
        {/* Tail shape: starts at top edge (y=0), dips down to a point, back up */}
        <path
          d="M0 0 H28 L16 13 Q14 15 12 13 Z"
          fill="white"
          stroke={BORDER}
          strokeWidth="1"
        />
        {/* Mask the top stroke line so tail looks integrated with bubble */}
        <path d="M0 0 H28" stroke="white" strokeWidth="2" />
      </svg>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden relative"
              style={{ background: BRAND }}
            >
              <img
                src={BODY_IMG}
                alt=""
                className="object-contain pointer-events-none"
                style={{
                  width: "34px",
                  height: "34px",
                  position: "absolute",
                  left: "calc(50% + 3px)",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
            />
          </div>
          <div className="flex flex-col justify-center" style={{ height: "36px" }}>
            <div className="text-[15px] font-bold leading-tight" style={{ color: "#05052D" }}>Skillo</div>
            <div className="text-[13px] font-medium leading-tight mt-0.5" style={{ color: "#565672" }}>Asystent nauki</div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Zamknij"
          className="w-7 h-7 rounded-full text-neutral-400 hover:bg-[#F5F0FB] flex items-center justify-center transition-colors"
          onMouseEnter={(e) => e.currentTarget.style.color = BRAND}
          onMouseLeave={(e) => e.currentTarget.style.color = ""}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="skillo-scroll flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
        {isLoading && (
          <div className="flex gap-1.5 px-4 py-3 rounded-[8px] w-fit" style={{ background: "#F5F0FB" }}>
            <span className="skillo-typing-dot w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
            <span className="skillo-typing-dot w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
            <span className="skillo-typing-dot w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div
          className="flex items-center gap-2 rounded-[8px] px-3 transition-colors"
          style={{ background: "#FAF7FE", border: `1px solid ${BORDER}` }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Zadaj pytanie…"
            className="flex-1 bg-transparent text-sm py-2.5 outline-none placeholder:text-neutral-400 font-medium"
            style={{ color: "#202044" }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
            aria-label="Wyślij"
            className="w-8 h-8 rounded-[8px] flex items-center justify-center disabled:opacity-30 transition-all"
            style={{ background: BRAND }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#680AE8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = BRAND; }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-white">
              <path d="M3 10l14-7-4 17-3-7-7-3z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div
        className={
          "max-w-[85%] px-3.5 py-2.5 rounded-[8px] text-sm leading-relaxed font-medium " +
          (isUser ? "text-white" : "")
        }
        style={
          isUser
            ? { background: BRAND }
            : { background: "#F5F0FB", color: "#202044" }
        }
      >
        {content}
      </div>
    </div>
  );
}

export default Skillo;
