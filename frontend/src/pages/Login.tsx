import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import googleLogo from '../assets/images/google-logo.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        dispatch(login(user.email || '')); // Dispatch login action with the user's email
        toast.success('Logged in successfully!');
        navigate('/profile');
      } catch (error) {
        toast.error('Failed to log in. Please check your credentials.');
        console.error('Error logging in:', error);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      dispatch(login(user.email || '')); // Dispatch login action with the user's email
      toast.success('Logged in with Google successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to log in with Google. Please try again.');
      console.error('Error with Google Sign-In:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign in</h2>
      <p>
        or <Link to="/register" className="redirect-link">create an account</Link>
      </p>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">{formik.errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="rememberMe" /> Remember me
          </label>
        </div>
        <button type="submit" className="login-button">
          Sign in
        </button>
      </form>
      <p className="forgot-password">
        <Link to="/forgot-password" className="redirect-link">Forgot password?</Link>
      </p>
      <button onClick={handleGoogleSignIn} className="google-signin-button">
        <img src={googleLogo} alt="Google logo" className="google-logo" />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;