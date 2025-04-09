import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db } from '../firebaseConfig'; // Import Firestore database
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { login } from '../store/authSlice'; // Import login action
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Profile: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const dispatch = useDispatch(); // Initialize dispatch
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Fetch logged-in user's data from Redux store
  const userData = useSelector((state: RootState) => {
    const user = state.auth.user;
    return user && typeof user === 'object' && 'name' in user && 'email' in user
      ? (user as { name: string; email: string; uid: string; phone?: string; bio?: string; profileImage?: string })
      : { name: '', email: '', uid: '', phone: '', bio: '', profileImage: '' }; // Default to empty values
  });

  // Function to generate a color based on a string (e.g., user's name or email)
  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`; // Generate HSL color
    return color;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: userData?.name || '', // Autofill name
      email: userData?.email || '', // Autofill email
      phone: userData?.phone || '', // Autofill phone
      bio: userData?.bio || '', // Autofill bio
      profileImage: userData?.profileImage || null, // Autofill profileImage
    },
    enableReinitialize: true, // Allow form to reinitialize when userData changes
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot exceed 50 characters'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
      bio: Yup.string().max(200, 'Bio cannot exceed 200 characters'),
    }),
    onSubmit: async (values) => {
      try {
        // Save updated user profile to Firestore
        await setDoc(doc(db, 'users', userData.uid), {
          name: values.name,
          email: values.email,
          phone: values.phone,
          bio: values.bio,
          profileImage: profileImage ? profileImage.name : null, // Save image name if uploaded
        });

        // Update Redux store with the new user details
        dispatch(
          login({
            name: values.name,
            email: values.email,
            uid: userData.uid,
            phone: values.phone,
            bio: values.bio,
            profileImage: profileImage ? profileImage.name : undefined,
          })
        );

        toast.success('Profile updated successfully!'); // Success toast message
        console.log('Profile updated successfully:', { ...values, profileImage });
        navigate('/'); // Redirect to Home Page after successful update
      } catch (error) {
        toast.error('Failed to update profile. Please try again.'); // Error toast message
        console.error('Error updating profile:', error);
      }
    },
  });

  return (
    <div className="login-container">
      <h2>User Profile</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group flex-centered">
          <div className="profile-pic-area">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="profile-image-preview"
              />
            ) : (
              <div
                className="profile-placeholder-circle"
                style={{
                  backgroundColor: stringToColor(userData.name || 'Anonymous'), // Use name for color generation
                }}
              >
                {formik.values.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="edit-profile-button"
              onClick={() => document.getElementById('profileImage')?.click()}
            >
              {profileImage ? 'Change Image' : 'Upload Image'}
            </button>
          </div>
        </div>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
          style={{ display: 'none' }}
        />
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
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
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${formik.touched.bio && formik.errors.bio ? 'is-invalid' : ''}`}
          />
          {formik.touched.bio && formik.errors.bio && (
            <div className="invalid-feedback">{formik.errors.bio}</div>
          )}
        </div>
        <button type="submit" className="login-button">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;