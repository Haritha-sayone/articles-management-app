import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
      console.error('Error logging out:', error);
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#282c34' }}>
      <h1 style={{ color: 'white', margin: 0 }}>AMS</h1>
      <nav style={{ display: 'flex', gap: '1rem', flexGrow: 1, justifyContent: 'center' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
        <a href="/saved-articles" style={{ color: 'white', textDecoration: 'none' }}>Saved Articles</a>
        <Link to="/chat" className="ask-ai-button" style={{ color: 'white', textDecoration: 'none' }}>
          Ask AI
        </Link>
      </nav>
      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        {isAuthenticated ? (
          <>
            <a href="/profile" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>Profile</a>
            <button 
              onClick={handleLogout} 
              style={{ marginLeft: '0.5rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>Login</a>
        )}
      </nav>
    </header>
  );
};

export default Header;