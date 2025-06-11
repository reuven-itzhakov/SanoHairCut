import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

function ResetPassword({setTab}){
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleReset = async () => {
        setSuccess("");
        setError("");
        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Password reset email sent! Please check your inbox.");
        } catch (err) {
            setError("Failed to send reset email. " + (err.message || ""));
        }
    };

    return (
        <>
        <h1 className="font-bold text-center">Reset Password</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Email" className="w-full p-2 my-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">Create an account</a>
        <br/>
        <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">Already have an account?</a>
        <button type="button" onClick={handleReset} className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700">Reset Password</button>
        </>
    )
}            

export default ResetPassword;
