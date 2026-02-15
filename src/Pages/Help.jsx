// src/pages/Help.jsx
import React from 'react';
import './Help.css';

function Help() {
  return (
    <div className="help-container">
      <h1 className="help-title">How to Use TasteXperience</h1>
      <p className="help-intro">
        Follow these simple steps to taste your favorite food virtually before you order it!
      </p>

      <div className="help-steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Select an Item</h3>
          <p>
            Browse the menu or use the search bar to find the food item you'd like to try virtually.
          </p>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <h3>Place the Device</h3>
          <p>
            Once the item is selected, gently place the virtual tasting device at the center of your tongue.
          </p>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <h3>Press “Taste It”</h3>
          <p>
            Click the “Taste It” button on the screen to experience the flavor virtually.
          </p>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <h3>Decide and Order</h3>
          <p>
            If you like the taste, go ahead and place your order — no surprises!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Help;
