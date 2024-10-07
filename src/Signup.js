import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom'; // Add Link for navigation
import { auth } from './firebase';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try{
            await signInWithEmailAndPassword(auth, email, password);
            alert('Signup Successful!')
        }
        catch(error){
            alert('Signup Failed!')
        }
    };

    return(
        <div>
            <h2>
                Signup
            </h2>
            <form onSubmit={handleSignup}>
                <input type="email" placeholder="Email" value={email} onchange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="Password" value={password} onchange={(e) => setPassword(e.target.value)}></input>

                <button type="submit">Signup</button>

            </form>

            <p>
                Already have an account? <Link to="/login">Login here</Link>.
            </p>
        </div>
    );
}

export default Signup;