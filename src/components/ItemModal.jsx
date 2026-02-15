// src/components/ItemModal.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TasteModal from "./TasteModal";
import { API_BASE_URL } from "../config";
import "./ItemModal.css";

function ItemModal({ item, onClose }) {
  const [showTasteModal, setShowTasteModal] = useState(false);
  const [message, setMessage] = useState("");
  const [backendData, setBackendData] = useState(null);
  const [loadingTaste, setLoadingTaste] = useState(false);
  const [errorTaste, setErrorTaste] = useState("");

  const handleTaste = async () => {
    setShowTasteModal(true); // show TasteModal (it will show loading while we fetch)
    setMessage("");
    setBackendData(null);
    setErrorTaste("");
    setLoadingTaste(true);

    try {
      // Fetch taste data from your backend (GET keeps compatibility with your current server)
      const res = await fetch(`${API_BASE_URL}/api/finalllll/${item.id}`);
      if (!res.ok) throw new Error("Failed to fetch taste data");
      const data = await res.json();
      setBackendData(data);

      // NOTE: We'll add a POST endpoint on the server next to trigger ESP32.
      // Once I update server.cjs you can optionally call that endpoint here to notify ESP32.
      // For now, frontend shows the data correctly.
      console.log("Taste data fetched:", data);
    } catch (err) {
      console.error("Error fetching taste data:", err);
      setErrorTaste("Failed to load taste profile");
    } finally {
      setLoadingTaste(false);
    }

    // After 3 seconds → hide TasteModal and show feedback message
    setTimeout(() => {
      setShowTasteModal(false);
      setMessage(
        "😋 Mmm… that was tasty! Please sanitize before tasting again.",
      );
    }, 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-image-wrapper">
          <img
            src={
              item.imageFile
                ? `/images/${encodeURIComponent(item.imageFile)}`
                : item.image
            }
            alt={item.name}
            className="modal-image"
          />
        </div>

        <h2>{item.name}</h2>
        <p>{item.desc}</p>

        <button className="taste-btn" onClick={handleTaste}>
          Taste It
        </button>

        {message && (
          <div className="taste-message">
            <p>{message}</p>
            <Link to="/feedback" className="feedback-link">
              Leave Feedback
            </Link>
          </div>
        )}

        {showTasteModal && (
          <TasteModal
            item={item}
            onClose={() => setShowTasteModal(false)}
            backendData={backendData}
            loading={loadingTaste}
            error={errorTaste}
          />
        )}
      </div>
    </div>
  );
}

export default ItemModal;
