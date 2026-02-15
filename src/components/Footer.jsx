import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-columns">

        {/* Column 1: About */}
        <div className="footer-column">
          <h4>About Us</h4>
          <p>
            TasteXperience is a new way to explore food. Try your meal virtually before placing an order. Comfort, confidence, and deliciousness guaranteed!
          </p>
        </div>

        {/* Column 2: Quick Links */}
<div className="footer-column">
  <h4>Quick Links</h4>
  <ul className="footer-links">
    <li><Link to="/menu">Menu</Link></li>
    <li><Link to="/contact">Contact Us</Link></li>
    <li><Link to="/feedback">Feedback</Link></li>
    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
    <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
  </ul>
</div>


        {/* Column 3: Newsletter */}
        <div className="footer-column">
          <h4>Stay Connected</h4>
          <p>Subscribe for updates, deals, and exclusive tastings!</p>
          <form className="footer-form">
            <input type="email" placeholder="Your Email" />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          <div className="footer-socials">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>

      </div>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} TasteXperience. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
