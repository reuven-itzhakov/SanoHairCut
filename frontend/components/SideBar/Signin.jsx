import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";
function Signin({setTab}){

    const [data, setData] = useState({
        email: '',
        password: '',
        error: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.email.trim() === '' || data.password.trim() === '') {
            setData({ ...data, error: 'Email and password are required' });
            return;
        }
        else if (!data.email.includes('@')) {
            setData({ ...data, error: 'Invalid email address' });
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
            console.log("User signed in:", userCredential);
            setData({ email: '', password: '', error: '' });
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setData({ ...data, error: 'Incorrect password' });
                    break;
                default:
                    console.log("Error signing in:", error.code, error.message);
                    setData({ ...data, error: error.message || 'Signin failed' });
            }
        }
    }

    return (
        <>
            <h1 className="font-bold text-center">Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label for="email">Email</label>
                <input
                    required
                    value={data.email || ''}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    className="w-full p-2 my-2 rounded"
                />
                <label for="password">Password</label>
                <input
                    required
                    value={data.password || ''}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="w-full p-2 my-2 rounded"
                />
                <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">Create an account</a>
                <br/>
                <a onClick={() => setTab('reset-password')} className="cursor-pointer text-blue-600 hover:underline">Forgot password?</a>
                <input
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
                    value="Sign In"
                />
                {data.error && <p className="text-red-600 mt-2">{data.error}</p>}
            </form>
        </>
    )
}            

export default Signin;
