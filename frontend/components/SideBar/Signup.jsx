
function Signup({setTab}){
    return (
        <>
            <h1 className="font-bold text-center">Sign up</h1>
            <label for="email">Email</label>
            <input required type="email" id="email" placeholder="Email" className="w-full p-2 my-2 rounded"/>
            <label for="password">Password</label>
            <input required type="password" id="password" placeholder="Password" className="w-full p-2 my-2 rounded"/>
            <label for="confirm-password">Confirm Password</label>
            <input required type="password" id="confirm-password" placeholder="Confirm Password" className="w-full p-2 my-2 rounded"/>
            <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">Already have an account?</a>
            <button onClick={() => {}} className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700">Sign Up</button>
        </>
    )
}            

export default Signup;
