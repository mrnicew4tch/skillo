import React from "react";
import { createRoot } from "react-dom/client";
import { useRef } from "react";
import Skillo from "../skillo.jsx";
import "./styles.css";

function App() {
  const heroRef = useRef(null);

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
              background: "#42079E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            wave()
          </button>
          <button
            onClick={() => heroRef.current?.notify("Nowa wiadomosc!")}
            style={{
              background: "#42079E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            notify()
          </button>
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
