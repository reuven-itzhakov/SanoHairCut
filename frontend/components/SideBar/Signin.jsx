function Signin({setTab}){
    return (
        <>
            <h1 className="font-bold text-center">Sign in</h1>
            <label for="email">Email</label>
            <input type="text" id="email" placeholder="Email" className="w-full p-2 my-2 rounded"/>
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password" className="w-full p-2 my-2 rounded"/>
            <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">Create an account</a>
            <br/>
            <a onClick={() => setTab('reset-password')} className="cursor-pointer text-blue-600 hover:underline">Forgot password?</a>
            <button className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700">Sign In</button>
        </>
    )
}            

export default Signin;
