import React, { useState, useContext, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '119018618906-bh3kje0dflkhnafgo3889mab8t9ed1oe.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const AuthContext = React.createContext({});

const { Provider } = AuthContext;

export const useAuthenticate = () => useContext(AuthContext);

export const AuthProvider = React.memo(({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(authUser) {
    setUser(authUser);

    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);

    return unsubscribe;
  }, []);

  function logout() {
    return auth().signOut();
  }

  async function continueWithGoogle() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <Provider value={{ initializing, user, continueWithGoogle, logout }}>
      {children}
    </Provider>
  );
});

export default AuthProvider;
