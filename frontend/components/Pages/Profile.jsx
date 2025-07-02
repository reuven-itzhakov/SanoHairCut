// Profile.jsx
// User profile page for viewing and updating name, email, and password.
// Integrates with Firebase Auth and backend API for profile management.
// Uses i18n for translations.

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../SideBar.jsx";
import { updateEmail, sendEmailVerification, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebase"; // Import auth from your firebase configuration
import axios from "axios";
import { useTranslation } from 'react-i18next';

function Profile() {
    const { t } = useTranslation();
    const [user] = useContext(UserContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(user ? user.email : "");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    // Load current first name from backend on mount
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/profile/${user.uid}`)
                .then(res => {
                    setName(res.data.name || "");
                })
                .catch(() => setError(t('profile.error.load')));
        }
    }, [user]);

    // Handle profile update (name/email)
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!name.trim()) {
            setError(t('profile.error.nameRequired'));
            return;
        }
        if (!email.trim()) {
            setError(t('profile.error.emailRequired'));
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError(t('profile.error.emailInvalid'));
            return;
        }
        try {
            // Update name in backend
            await axios.post(`http://localhost:5000/api/profile/${user.uid}`, { name });
            // Update email in Firebase Auth if changed
            if (user && email !== user.email) {
                if (!user.emailVerified) {
                    setError(t('profile.error.verifyCurrentEmail'));
                    return;
                }
                await updateEmail(user, email);
                await sendEmailVerification(user);
                setSuccess(t('profile.success.emailChanged'));
                setTimeout(() => {
                    signOut(auth);
                }, 5000); // Sign out after 5 seconds
                return;
            } else {
                setSuccess(t('profile.success.updated'));
            }
        } catch (err) {
            setError(t('profile.error.update') + (err.message ? ' ' + err.message : ''));
        }
    };

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!oldPassword || !newPassword || !repeatPassword) {
            setError(t('profile.error.passwordRequired'));
            return;
        }
        if (newPassword !== repeatPassword) {
            setError(t('profile.error.passwordsNoMatch'));
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess(t('profile.success.passwordChanged'));
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } catch (err) {
            setError(t('profile.error.passwordUpdate') + (err.message ? ' ' + err.message : ''));
        }
    };

    // Render profile and password update forms
    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="font-bold text-2xl text-center mb-2">{t('profile.title')}</h1>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <form onSubmit={handleProfileUpdate} className="mb-6">
                <div className="mb-2">
                    <label className="block">{t('profile.name')}</label>
                    <input required className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">{t('profile.email')}</label>
                    <input required type="email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">{t('profile.updateProfile')}</button>
            </form>
            <form onSubmit={handlePasswordUpdate} className="mb-6">
                <h2 className="font-semibold mb-2">{t('profile.changePassword')}</h2>
                <div className="mb-2">
                    <label className="block">{t('profile.oldPassword')}</label>
                    <input required type="password" className="w-full p-2 border rounded" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">{t('profile.newPassword')}</label>
                    <input required type="password" className="w-full p-2 border rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="mb-2">
                    <label className="block">{t('profile.repeatNewPassword')}</label>
                    <input required type="password" className="w-full p-2 border rounded" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">{t('profile.updatePassword')}</button>
            </form>
        </div>
    );
}

export default Profile;