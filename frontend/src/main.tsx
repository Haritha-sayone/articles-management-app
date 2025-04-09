import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { login, logout } from './store/authSlice';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import './index.css';

const AppWithAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: 'Anonymous' };

        // Update Redux store with user details
        dispatch(
          login({
            name: userData.name || 'Anonymous',
            email: user.email || '',
            uid: user.uid,
            phone: userData.phone || '',
            bio: userData.bio || '',
            profileImage: userData.profileImage || null,
          })
        );
      } else {
        // User is logged out
        dispatch(logout());
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [dispatch]);

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWithAuth />
      </PersistGate>
    </Provider>
  </StrictMode>
);
