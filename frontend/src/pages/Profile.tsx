import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db } from '../firebaseConfig'; // Import Firestore database
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Fetch logged-in user's data from Redux store
  const userData = useSelector((state: RootState) => {
    const user = state.auth.user;
    return user && typeof user === 'object' && 'name' in user && 'email' in user
      ? (user as { name: string; email: string; uid: string }) // Assuming `uid` is available
      : { name: '', email: '', uid: '' };
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: userData?.name || '', // Use user's name from Redux store
      email: userData?.email || '', // Use user's email from Redux store
      phone: '',
      bio: '',
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
        console.log('Profile updated successfully:', { ...values, profileImage });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });

  return (
    <div className="login-container">
      <h2>User Profile</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="form-group">
          <div className="profile-pic-area">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="profile-image-preview"
              />
            ) : (
              <div className="profile-placeholder">
                {formik.values.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="edit-profile-button"
              onClick={() => document.getElementById('profileImage')?.click()}
            >
              Edit Profile
            </button>
          </div>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
            style={{ display: 'none' }}
          />
        </div>
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