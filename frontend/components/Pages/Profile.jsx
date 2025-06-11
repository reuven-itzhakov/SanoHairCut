import { useState, useContext, useEffect } from "react";
import { UserContext } from "../SideBar.jsx";
import axios from "axios";
import { updateEmail, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Import auth from your firebase configuration

function Profile() {
    const [user] = useContext(UserContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(user ? user.email : "");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Load current first name from Firestore on mount
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/profile/${user.uid}`)
                .then(res => {
                    setName(res.data.name || "");
                })
                .catch(() => setError("Failed to load profile"));
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }
        if (!email.trim()) {
            setError("Email cannot be empty.");
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError("Invalid email format.");
            return;
        }
        try {
            // Update name in backend
            await axios.post(`http://localhost:5000/api/profile/${user.uid}`, { name });
            // Update email in Firebase Auth if changed
            if (user && email !== user.email) {
                if (!user.emailVerified) {
                    setError("Please verify your current email before changing it.");
                    return;
                }
                await updateEmail(user, email);
                await sendEmailVerification(user);
                setSuccess("Profile updated! Please check your new email to verify it. You will be signed out.");
                setTimeout(() => {
                    signOut(auth);
                }, 5000); // Sign out after 3 seconds
                return;
            } else {
                setSuccess("Profile updated!");
            }
        } catch (err) {
            setError("Failed to update profile. " + (err.message || ""));
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="font-bold text-center mb-4">Profile</h1>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <form onSubmit={handleProfileUpdate} className="mb-6">
                <div className="mb-2">
                    <label className="block">Name</label>
                    <input required className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">Email</label>
                    <input required type="email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;