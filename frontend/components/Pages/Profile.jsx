import { useState, useContext, useEffect } from "react";
import { UserContext } from "../SideBar.jsx";
import { updateEmail, sendEmailVerification, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebase"; // Import auth from your firebase configuration
import axios from "axios";

function Profile() {
    const [user] = useContext(UserContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(user ? user.email : "");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

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
                }, 5000); // Sign out after 5 seconds
                return;
            } else {
                setSuccess("Profile updated!");
            }
        } catch (err) {
            setError("Failed to update profile. " + (err.message || ""));
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!oldPassword || !newPassword || !repeatPassword) {
            setError("All password fields are required.");
            return;
        }
        if (newPassword !== repeatPassword) {
            setError("New passwords do not match.");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess("Password updated!");
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } catch (err) {
            setError("Failed to update password. " + (err.message || ""));
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="font-bold text-2xl text-center mb-2">Profile</h1>
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
            <form onSubmit={handlePasswordUpdate} className="mb-6">
                <h2 className="font-semibold mb-2">Change Password</h2>
                <div className="mb-2">
                    <label className="block">Old Password</label>
                    <input required type="password" className="w-full p-2 border rounded" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">New Password</label>
                    <input required type="password" className="w-full p-2 border rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">Repeat New Password</label>
                    <input required type="password" className="w-full p-2 border rounded" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Update Password</button>
            </form>
        </div>
    );
}

export default Profile;