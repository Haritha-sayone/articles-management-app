import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ArticleList from './pages/ArticleList';
import ArticleDetails from './pages/ArticleDetails';
import SavedArticles from './pages/SavedArticles'; // Import SavedArticles page
import { ToastContainer } from 'react-toastify';
import store from './store';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/global.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetails />} />
          <Route path="/saved-articles" element={<SavedArticles />} /> {/* Add route for SavedArticles */}
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </Provider>
  );
};

export default App;