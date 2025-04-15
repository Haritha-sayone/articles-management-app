import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { db } from '../firebaseConfig'; // Import Firestore database

const Register: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name cannot exceed 50 characters'),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: values.name, // Use name directly
          email: values.email,
          createdAt: new Date().toISOString(),
        });

        toast.success('Account created successfully!');
        navigate('/login'); // Redirect to login page
      } catch (error) {
        toast.error('Failed to create account. Please try again.');
        console.error('Error registering user:', error);
      }
    },
  });

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${
              formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''
            }`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" className="login-button">
          Create an Account
        </button>
      </form>
      <p className="redirect-text">
        Already have an account? <Link to="/login" className="redirect-link">Login</Link>
      </p>
    </div>
  );
};

export default Register;