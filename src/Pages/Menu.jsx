// src/pages/Menu.jsx
import React, { useState, useRef } from "react";
import "./Menu.css";
import ItemModal from "../components/ItemModal";

// Images served from public/images/ (run: node scripts/copy-menu-images.js)
const menuItems = [
  {
    id: 1,
    name: "Cheezy Sticks",
    imageFile: "Cheese Sticks.jpg",
    desc: "Fresh Oven baked wings served with Dip Sauce.",
  },
  {
    id: 2,
    name: "Oven Baked Wings",
    imageFile: "Oven-Baked Chicken Wings.jpg",
    desc: "4 pcs Stuffed Calzone Chunks served with Sauce & Fries.",
  },
  {
    id: 3,
    name: "Flaming Wings",
    imageFile: "Flaming Wings.png",
    desc: "Fresh oven baked wings tossed in hot Peri Peri Sauce and served with Dip Sauce.",
  },
  {
    id: 4,
    name: "Calzone Chunks",
    imageFile: "Calzone-Chunks.jpeg",
    desc: "Freshly baked bread filled with the yummiest Cheese blend to satisfy your cravings.",
  },
  {
    id: 5,
    name: "Arabic Rolls",
    imageFile: "Arabic Rolls.jpg",
    desc: "Arabic rolls stuffed with delicious mix served with sauce.",
  },
  {
    id: 6,
    name: "Behari Rolls",
    imageFile: "Bihari Rolls.png",
    desc: "Behari Rolls stuffed with the yummiest mix served with sauce.",
  },
  {
    id: 7,
    name: "Chicken Tikka",
    imageFile: "chicken-tikka.jpg",
    desc: "4 pcs Arabic Rolls stuffed with the yummiest mix served with sauce.",
  },
  {
    id: 8,
    name: "Chicken Fajita",
    imageFile: "FajitaFajita Chicken Pizza.jpg",
    desc: "4 pcs Behari Rolls stuffed with the yummiest mix served with sauce.",
  },
  {
    id: 10,
    name: "Chicken Tandoori",
    imageFile: "Chicken Tandoori.jpg",
    desc: "Tandoori style chicken pizza with spicy seasoning.",
  },
  {
    id: 12,
    name: "Vegetable Pizza",
    imageFile: "Vegetable Pizza.jpg",
    desc: "Fresh veggies on a crispy base.",
  },
  {
    id: 16,
    name: "Sausage Pizza",
    imageFile: "Sausage Pizza.jpg",
    desc: "Loaded with premium sausages.",
  },
  {
    id: 17,
    name: "Cheese Lover Pizza",
    imageFile: "Cheese Lover Pizza.jpg",
    desc: "Overloaded with multiple cheese blends.",
  },
  {
    id: 20,
    name: "Peri Peri Pizza",
    imageFile: "Peri Peri.jpg",
    desc: "A bold, tangy, and spicy delight infused with special sauce.",
  },
];

function Menu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="menu-container">
      <h1 className="menu-title">Explore the Menu</h1>
      <p className="menu-subtitle">Click an item to taste it virtually!</p>

      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={() => scroll("left")}>
          ❮
        </button>

        <div className="menu-slider no-scrollbar" ref={sliderRef}>
          {menuItems.map((item) => (
            <div key={item.id} className="menu-flip-card">
              <div className="menu-flip-inner">
                <div className="menu-flip-front">
                  <img
                    src={`/images/${encodeURIComponent(item.imageFile)}`}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                </div>
                <div className="menu-flip-back">
                  <p>{item.desc}</p>
                  <button onClick={() => setSelectedItem(item)}>
                    Taste It
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn right" onClick={() => scroll("right")}>
          ❯
        </button>
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default Menu;
