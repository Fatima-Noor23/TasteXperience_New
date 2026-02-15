// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Help from './Pages/Help';
import Feedback from './Pages/Feedback';
import Menu from './Pages/Menu';
import headerVideo from './assets/header.mp4';
import HamburgerMenu from './components/HamburgerMenu';
import Footer from './components/Footer';
import Contact from './Pages/contactUs';
import menuItems from './data/menuItems';


function Home() {
  return (
    <>
      {/* Main Hero Video with Tagline */}
      <div className="video-header">
        <video autoPlay loop muted className="background-video">
     <source src={headerVideo} type="video/mp4" />
        </video>

        <div className="video-overlay">
          <div className="tagline-box">
            <h1>Taste Your Food Virtually</h1>
            <p>Step into a new world where you can taste before you buy powered by innovation and flavor!</p>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const matches = menuItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(matches.length > 0 ? matches : [{ name: 'No results found' }]);
    } else {
      setFilteredItems([]);
    }
  };

  const handleResultClick = (item) => {
    if (item.name !== 'No results found') {
      navigate('/menu', { state: { highlightItem: item.name } });
      setQuery('');
      setFilteredItems([]);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-bar"
        placeholder="Search for items..."
        value={query}
        onChange={handleInputChange}
      />
      {filteredItems.length > 0 && (
        <ul className="search-suggestions">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              className={item.name === 'No results found' ? 'no-result' : ''}
              onClick={() => handleResultClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



function App() {
  return (
    <Router>
      <div className="fullscreen-background">
       <header className="navbar">
  <div className="menu-section">
    <HamburgerMenu />
  </div>
  <div className="logo-section">
    <div className="logo">TasteXperience</div>
  </div>
  <div className="search-section">
    <SearchBar />
  </div>
</header>



        <Routes>
    
        <Route path="/" element={<Home />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/menu" element={<Menu />} />
          

        </Routes>

        <Footer />
      </div>
    </Router>
  );
}





export default App;