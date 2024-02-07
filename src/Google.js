import React from 'react';
import {app} from './firebase.js';
import { GoogleAuthProvider,getAuth,signInWithPopup } from 'firebase/auth'; // Correct import statement

export default function Google() {
  const signInWithGoogle = async() => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth,provider);
    alert(res);
  };

  return (
    <div>
      <h1>Welcome to my React Firebase App</h1>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
}
