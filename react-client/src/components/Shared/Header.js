import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/" className="nav-link">Sign Up</Link></li>
          <li className="nav-item"><Link to="/home" className="nav-link">Home</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;