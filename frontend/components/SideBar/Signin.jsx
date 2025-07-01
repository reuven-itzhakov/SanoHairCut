import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useTranslation } from 'react-i18next';

function Signin({setTab}){
    const { t } = useTranslation();

    const [data, setData] = useState({
        email: '',
        password: '',
        error: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.email.trim() === '' || data.password.trim() === '') {
            setData({ ...data, error: t('signin.error.required') });
            return;
        }
        else if (!data.email.includes('@')) {
            setData({ ...data, error: t('signin.error.invalidEmail') });
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
            setData({ email: '', password: '', error: '' });
        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setData({ ...data, error: t('signin.error.incorrectPassword') });
                    break;
                default:
                    setData({ ...data, error: error.message || t('signin.error.failed') });
            }
        }
    }

    return (
        <>
            <h1 className="font-bold text-center">{t('signin.title')}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">{t('signin.email')}</label>
                <input
                    required
                    value={data.email || ''}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    type="email" 
                    id="email" 
                    placeholder={t('signin.emailPlaceholder')} 
                    className="w-full p-2 my-2 rounded"
                />
                <label htmlFor="password">{t('signin.password')}</label>
                <input
                    required
                    value={data.password || ''}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    type="password"
                    id="password"
                    placeholder={t('signin.passwordPlaceholder')}
                    className="w-full p-2 my-2 rounded"
                />
                <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">{t('signin.createAccount')}</a>
                <br/>
                <a onClick={() => setTab('reset-password')} className="cursor-pointer text-blue-600 hover:underline">{t('signin.forgotPassword')}</a>
                <input
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
                    value={t('signin.signInButton')}
                />
                {data.error && <p className="text-red-600 mt-2">{data.error}</p>}
            </form>
        </>
    )
}            

export default Signin;
