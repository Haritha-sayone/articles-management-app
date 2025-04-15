import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ArticleDetails from './pages/ArticleDetails';
import SavedArticles from './pages/SavedArticles';
import NotFound from './pages/NotFound'; // Import the NotFound page
import { ToastContainer } from 'react-toastify';
import store from './store';
import { RootState } from './store';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/global.css';
import { JSX } from 'react';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-articles"
            element={
              <PrivateRoute>
                <SavedArticles />
              </PrivateRoute>
            }
          />
          <Route path="/articles/:id" element={<ArticleDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </Provider>
  );
};

export default App;