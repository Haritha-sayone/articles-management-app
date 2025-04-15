import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Import the CSS file

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message">
        Sorry, the page you are trying to access does not exist or may have been moved.
      </p>
      <Link to="/" className="not-found-link">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
