import React, { useState } from 'react'; // Add useState
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import googleLogo from '../assets/images/google-logo.png';
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Add setDoc for first-time user check
import { db } from '../firebaseConfig'; // Import Firestore database
import { BeatLoader } from 'react-spinners'; // Replace ClipLoader with BeatLoader

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [googleLoading, setGoogleLoading] = useState<boolean>(false); // Add separate loading state for Google Sign-In

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

  const handleLogin = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData?.isFirstLogin) {
        // Redirect to Profile page for first login
        toast.success('Welcome! Please complete your profile.');
        await setDoc(userDocRef, { ...userData, isFirstLogin: false }, { merge: true }); // Update flag
        navigate('/profile');
      } else {
        // Redirect to Home page for subsequent logins
        toast.success(`Welcome back, ${userData.name || 'Anonymous'}!`);
        navigate('/');
      }

      // Dispatch login action with user details
      dispatch(
        login({
          name: userData.name || user.displayName || 'Anonymous',
          email: user.email || '',
          uid: user.uid,
          phone: userData.phone || '',
          bio: userData.bio || '',
          profileImage: userData.profileImage || null,
        })
      );
    } else {
      // Create a new user document for first-time login
      const newUser = {
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        uid: user.uid,
        phone: '',
        bio: '',
        profileImage: user.photoURL || null,
        isFirstLogin: true,
      };
      await setDoc(userDocRef, newUser); // Save new user data to Firestore
      toast.success('Welcome! Please complete your profile.');
      navigate('/profile');

      // Dispatch login action with new user details
      dispatch(
        login({
          name: newUser.name,
          email: newUser.email,
          uid: newUser.uid,
          phone: newUser.phone,
          bio: newUser.bio,
          profileImage: newUser.profileImage,
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true); // Set loading to true
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        await handleLogin(user); // Handle login logic
      } catch (error) {
        toast.error('Failed to log in. Please check your credentials.');
        console.error('Error logging in:', error);
      } finally {
        setLoading(false); // Set loading to false
      }
    },
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      setGoogleLoading(true); // Set Google loading to true
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await handleLogin(user); // Handle login logic
    } catch (error) {
      toast.error('Failed to log in with Google. Please try again.');
      console.error('Error with Google Sign-In:', error);
    } finally {
      setGoogleLoading(false); // Set Google loading to false
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
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <BeatLoader size={10} color="#ffffff" /> : 'Sign in'} {/* Use BeatLoader */}
        </button>
      </form>
      <p className="forgot-password">
        <Link to="/forgot-password" className="redirect-link">Forgot password?</Link>
      </p>
      <button onClick={handleGoogleSignIn} className="google-signin-button" disabled={googleLoading}>
        {googleLoading ? (
          <BeatLoader size={10} color="#ffffff" /> // Show loader during Google Sign-In
        ) : (
          <>
            <img src={googleLogo} alt="Google logo" className="google-logo" />
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
};

export default Login;