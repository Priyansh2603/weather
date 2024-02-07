import React, { useState, useEffect, useContext, createContext } from 'react';
import { app } from './firebase.js'; // Import both app and auth from firebase.js
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Appstate } from './App.js';
const LogState = createContext();
function AuthComponent() {
    const { userdetails, setUserDetails, userId, setUserId,loggedIn } = useContext(Appstate);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Update the user state based on authentication state changes
        });
        return () => {
            unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
        };
    }, []);
    const getUserid=()=>{
        const currentUser = auth.currentUser;

        if (currentUser) {
            // Access the user's UID
            const uid = currentUser.uid;
            setUserId(uid);
            console.log('Current User UID:', uid);
        } else {
            // User not authenticated, handle accordingly
            console.error('User not authenticated');
        }
       
    }
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            loggedIn(true); // Correct usage of signInWithEmailAndPassword
        } catch (error) {
            setError(error.message);
        }
        getUserid();
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            loggedIn(true);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <LogState.Provider value={{}}>
            <div>
            <h2>Authentication</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}</p>
                    <button onClick={() => {auth.signOut()
                    loggedIn(false)}}>Sign Out</button>
                </div>
            ) :
                (<form>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSignIn}>Sign In</button>
                    <button onClick={handleSignUp}>Sign Up</button>
                </form>)}
            {error ? <p>{error}</p>:userId?<p>Authenticated</p>:<></>}
        </div>
        </LogState.Provider>
    );
}

export default AuthComponent;
