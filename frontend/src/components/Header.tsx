import React from 'react';
import { Link } from 'react-router-dom';
// import './Header.css'; // Assuming you will create a CSS file for styling

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Articles Management</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/articles">Articles</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;