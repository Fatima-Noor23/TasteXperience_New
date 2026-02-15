import React, { useState, useEffect, useRef } from 'react';
import './HamburgerMenu.css';
import { Link } from 'react-router-dom';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Hamburger Icon */}
      {!isOpen && (
        <div ref={hamburgerRef} className="hamburger-icon" onClick={toggleMenu}>
          ☰
        </div>
      )}

      {/* Sidebar Menu */}
      <div ref={sidebarRef} className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <button className="close-btn" onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" className="close-icon">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        <nav className="menu-links">
        <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/menu" onClick={toggleMenu}>Menu</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
          <Link to="/feedback" onClick={toggleMenu}>Feedback</Link>
          <Link to="/help" onClick={toggleMenu}>Help</Link>
        </nav>
      </div>
    </>
  );
}

export default HamburgerMenu;
