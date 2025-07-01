import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from 'react-i18next';

function ResetPassword({setTab}){
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleReset = async () => {
        setSuccess("");
        setError("");
        if (!email.trim()) {
            setError(t('reset.error.required'));
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(t('reset.success'));
        } catch (err) {
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
