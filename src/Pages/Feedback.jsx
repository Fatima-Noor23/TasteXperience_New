import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import "./Feedback.css";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    comments: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Feedback submitted successfully!");
        setFormData({ name: "", email: "", rating: "", comments: "" }); // clear form
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">We Value Your Feedback</h1>
      <p className="feedback-subtitle">
        Share your TasteXperience — What felt realistic? What can we improve?
      </p>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="email">Your Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="rating">How Realistic Was the Taste?</label>
        <select
          id="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="">Choose a rating</option>
          <option>Very Realistic</option>
          <option>Somewhat Realistic</option>
          <option>Neutral</option>
          <option>Needs Improvement</option>
          <option>Didn’t Work</option>
        </select>

        <label htmlFor="comments">Your Feedback</label>
        <textarea
          id="comments"
          rows="5"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          required
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}

export default Feedback;
