// Signup.jsx
// Component for user registration form.
// Handles new user creation with Firebase Auth and displays errors.
// Uses i18n for translations and supports switching to sign-in/reset password forms.

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from "../../firebase.js";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../src/config.js';

function Signup({setTab}){
    const { t } = useTranslation();

    const [data, setData] = useState(
        {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: ''
        }
    );

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate input fields
        if (data.email.trim() === ''
        || data.password.trim() === ''
        || data.confirmPassword.trim() === ''
        || data.name.trim() === '') {
            setData({ ...data, error: t('signup.error.required') });
            return;
        }
        else if (!data.email.includes('@')) {
            setData({ ...data, error: t('signup.error.invalidEmail') });
            return;
        }
        else if (data.password.length < 6) {
            setData({ ...data, error: t('signup.error.passwordLength') });
            return;
        }
        else if (data.password !== data.confirmPassword) {
            setData({ ...data, error: t('signup.error.passwordsNoMatch') });
            return;
        }
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            // Create user document in Firestore via backend
            await axios.post(`${API_BASE_URL}/api/users`, {
                uid: userCredential.user.uid,
                name: data.name,
                email: data.email
            });
            // Send email verification
            await sendEmailVerification(userCredential.user);
            // Clear form data
            setData({ email: '', password: '', confirmPassword: '', error: '' });
            // Optionally, show a message to check email for verification
        }
        catch (error) {
            // Handle errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setData({ ...data, error: t('signup.error.emailInUse') });
                    break;
                default:
                    setData({ ...data, error: error.message || t('signup.error.failed') });
            }
        }
    }

    return (
        <>
        <h1 className="font-bold text-center">{t('signup.title')}</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">{t('signup.name')}</label>
            <input
                required
                value={data.name || ''}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                type="text"
                id="name"
                placeholder={t('signup.namePlaceholder')}
                className="w-full p-2 my-2 rounded"
            />
            <label htmlFor="email">{t('signup.email')}</label>
            <input
                required
                value={data.email || ''}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="email"
                id="email"
                placeholder={t('signup.emailPlaceholder')}
                className="w-full p-2 my-2 rounded"
            />
            <label htmlFor="password">{t('signup.password')}</label>
            <input
                required
                value={data.password || ''}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                type="password"
                id="password"
                placeholder={t('signup.passwordPlaceholder')}
                className="w-full p-2 my-2 rounded"
            />
            <label htmlFor="confirm-password">{t('signup.confirmPassword')}</label>
            <input
                required
                value={data.confirmPassword || ''}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                type="password"
                id="confirm-password"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                className="w-full p-2 my-2 rounded"
            />
            <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">{t('signup.alreadyHaveAccount')}</a>
            <input
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
                value={t('signup.signUpButton')}
            />
            {data.error && <p className="text-red-600 mt-2">{data.error}</p>}
        </form>
        </>
    )
}            

export default Signup;
