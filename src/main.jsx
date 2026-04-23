import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useRef } from "react";
import { Check, X } from "lucide-react";
import Skillo from "../skillo.jsx";
import "./styles.css";

function App() {
  const heroRef = useRef(null);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const handleNotificationsToggle = () => {
    heroRef.current?.notify("Nowa wiadomosc!");
    setNotificationsOn((prev) => !prev);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f3ff" }}>
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 9999,
          background: "#ffffff",
          border: "1px solid #d9d4e7",
          borderRadius: 10,
          padding: 10,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#5d5c73",
            marginBottom: 8,
            letterSpacing: 0.2,
          }}
        >
          TEST API
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => heroRef.current?.wave()}
            style={{
              background: "#ec4899",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Pomachaj
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              background: "#f5f1ff",
              color: "#2c2b3a",
              border: "1px solid #d9d4e7",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 700,
            }}
          >
            <span>Powiadomienia</span>
            <button
              type="button"
              onClick={handleNotificationsToggle}
              aria-pressed={notificationsOn}
              aria-label="Przelacz powiadomienia"
              style={{
                width: 70,
                height: 36,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: notificationsOn ? "#4a0fb4" : "#d1d1d1",
                position: "relative",
                transition: "background-color 180ms ease",
                padding: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: notificationsOn ? 37 : 3,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: notificationsOn ? "#4a0fb4" : "#b3b3b3",
                  transition: "left 180ms cubic-bezier(0.22, 1, 0.36, 1), color 180ms ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {notificationsOn ? <Check size={17} strokeWidth={2.6} /> : <X size={17} strokeWidth={2.6} />}
              </span>
            </button>
          </div>
        </div>
      </div>
      <Skillo ref={heroRef} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
