// ResetPassword.jsx
// Component for users to request a password reset email.
// Allows entering an email and sends a reset link via Firebase Auth.
// Uses i18n for translations.

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from 'react-i18next';

function ResetPassword({setTab}){
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Handle password reset request
    const handleReset = async () => {
        setSuccess("");
        setError("");
        // Validate email input
        if (!email.trim()) {
            setError(t('reset.error.required'));
            return;
        }
        try {
            // Send password reset email
            await sendPasswordResetEmail(auth, email);
            setSuccess(t('reset.success'));
        } catch (err) {
            // Handle error in sending email
            setError(t('reset.error.failed') + (err.message ? ' ' + err.message : ''));
        }
    };

    return (
        <>
        <h1 className="font-bold text-center">{t('reset.title')}</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <label htmlFor="email">{t('reset.email')}</label>
        <input type="email" id="email" placeholder={t('reset.emailPlaceholder')} className="w-full p-2 my-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">{t('reset.createAccount')}</a>
        <br/>
        <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">{t('reset.alreadyHaveAccount')}</a>
        <button type="button" onClick={handleReset} className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700">{t('reset.resetButton')}</button>
        </>
    )
}            

export default ResetPassword;
