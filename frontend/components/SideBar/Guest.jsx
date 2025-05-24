import Signin from './Signin.jsx'
import Signup from './Signup.jsx'
import ResetPassword from './ResetPassword.jsx'
import { useState } from 'react';

function Guest(){
    const [tab, setTab] = useState('signin');
    return(
        <div className="bg-gray-300 rounded m-4 p-4 shadow-xl shadow-gray-500/40">
        {tab === 'signin' && <Signin setTab={setTab} />}
        {tab === 'signup' && <Signup setTab={setTab} />}
        {tab === 'reset-password' && <ResetPassword setTab={setTab} />}
        </div>
    )
}
export default Guest;