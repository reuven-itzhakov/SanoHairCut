import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase.js";

function Signup({setTab}){

    const [data, setData] = useState(
        {
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.email.trim() === '' || data.password.trim() === '' || data.confirmPassword.trim() === '') {
            setData({ ...data, error: 'All fields are required' });
            return;
        }
        else if (!data.email.includes('@')) {
            setData({ ...data, error: 'Invalid email address' });
            return;
        }
        else if (data.password.length < 6) {
            setData({ ...data, error: 'Password must be at least 6 characters long' });
            return;
        }
        else if (data.password !== data.confirmPassword) {
            setData({ ...data, error: 'Passwords do not match' });
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            console.log("User signed up:", userCredential);
            setData({ email: '', password: '', confirmPassword: '', error: '' });
        }
        catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setData({ ...data, error: 'Email already in use' });
                    break;
                default:
                    console.log("Error signing in:", error.code, error.message);
                    setData({ ...data, error: error.message || 'Signin failed' });
            }
        }
    }

    return (
        <>
        <h1 className="font-bold text-center">Sign up</h1>
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
            <label for="confirm-password">Confirm Password</label>
            <input
                required
                value={data.confirmPassword || ''}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                className="w-full p-2 my-2 rounded"
            />
            <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">Already have an account?</a>
            <input
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
                value="Sign Up"
            />
            {data.error && <p className="text-red-600 mt-2">{data.error}</p>}
        </form>
        </>
    )
}            

export default Signup;
