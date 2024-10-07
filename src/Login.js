import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom'; // Add Link for navigation
import { auth } from './firebase';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login Successful!')
        }
        catch(error){
            alert('Login Failed!')
        }
    };

    return(
        <div>
            <h2>
                Login
            </h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onchange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="Password" value={password} onchange={(e) => setPassword(e.target.value)}></input>

                <button type="submit">Login</button>

            </form>

            <p>
                Don't have an account? <Link to="/signup">Sign up here</Link>.
            </p>
        </div>
    );
}

export default Login;