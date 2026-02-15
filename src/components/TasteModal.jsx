// src/components/TasteModal.jsx
import React from 'react';
import './TasteModal.css';

export default function TasteModal({ item, onClose, backendData, loading, error }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {loading ? (
          <p className="loading-text">Loading stimulation profile...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : backendData ? (
          <div className="modal-body">
            <img src={item.image} alt={item.name} className="modal-img" />

            <h2 className="modal-title">
              {backendData.food_name || item.name}
            </h2>

            <div className="details-grid">
              <div>
                <strong>Voltage:</strong>{" "}
                {backendData.voltage !== undefined
                  ? backendData.voltage.toFixed(3)
                  : "—"}{" "}
                V
              </div>

              <div>
                <strong>Current (Salty):</strong>{" "}
                {backendData.current_salty !== undefined
                  ? backendData.current_salty.toFixed(3)
                  : "—"}{" "}
                mA
              </div>

              <div>
                <strong>Frequency:</strong>{" "}
                {backendData.frequency !== undefined
                  ? backendData.frequency.toFixed(3)
                  : "—"}{" "}
                Hz
              </div>

              <div>
                <strong>Duration:</strong>{" "}
                {backendData.duration !== undefined
                  ? backendData.duration.toFixed(1)
                  : "—"}{" "}
                ms
              </div>

              <div>
                <strong>Waveform:</strong> {backendData.waveform || "—"}
              </div>

              <div>
                <strong>Polarity:</strong> {backendData.polarity || "—"}
              </div>
            </div>
          </div>
        ) : (
          <p className="error-text">No data available.</p>
        )}
      </div>
    </div>
  );
}
