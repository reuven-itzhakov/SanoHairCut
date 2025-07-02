// Guest.jsx
// Component for unauthenticated users to sign in, sign up, or reset password.
// Renders the appropriate form based on the selected tab.

import Signin from './Signin.jsx'
import Signup from './Signup.jsx'
import ResetPassword from './ResetPassword.jsx'
import { useState } from 'react';

function Guest(){
    const [tab, setTab] = useState('signin'); // Current active tab
    return(
        <div className="bg-gray-300 rounded m-4 p-4 shadow-xl shadow-gray-500/40">
        {/* Render the selected auth form */}
        {tab === 'signin' && <Signin setTab={setTab} />}
        {tab === 'signup' && <Signup setTab={setTab} />}
        {tab === 'reset-password' && <ResetPassword setTab={setTab} />}
        </div>
    )
}
export default Guest;