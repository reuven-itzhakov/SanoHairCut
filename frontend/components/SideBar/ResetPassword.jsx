function ResetPassword({setTab}){
    return (
        <>
        <h1 className="font-bold text-center">Reset Password</h1>
        <label for="email">Email</label>
        <input type="text" id="email" placeholder="Email" className="w-full p-2 my-2 rounded"/>
        <a onClick={() => setTab('signup')} className="cursor-pointer text-blue-600 hover:underline">Create an account</a>
        <br/>
        <a onClick={() => setTab('signin')} className="cursor-pointer text-blue-600 hover:underline">Already have an account?</a>
        <button className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700">Reset Password</button>
        </>
    )
}            

export default ResetPassword;
