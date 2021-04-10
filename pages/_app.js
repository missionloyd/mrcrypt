import { firestore, auth } from '../firebase/firebase';
import Login from './login';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingScreen from '../components/shared/LoadingScreen';
import { useEffect } from 'react';
import firebase from 'firebase';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      firestore.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL
      },
      { merge: true })
    }
  }, [user])

  if (loading) return <LoadingScreen />
  if (!user) return <Login /> 

  return <Component {...pageProps} />
}

export default MyApp
