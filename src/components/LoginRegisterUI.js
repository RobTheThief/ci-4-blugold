import React, { useEffect, useState } from 'react'
import {
    getProfile,
    logout,
    register,
    login
  } from '../authRequests'

export default function SearchStationSidebar({}) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function checkLogin() {
      let response = await getProfile();
      if (response !== "Authentication credentials were not provided.") {
        setIsLoggedIn(true)
      }
      console.log({ isLoggedIn });
    }
  
    useEffect(() => {
      checkLogin()
    }, [isLoggedIn])
    
    return (

        <div className='login-ui-wrapper'>
            <form className='login-form'>
                <label>Enter your username:<br />
                    <input type="text" onChange={(e) => setUser(e.target.value)} />
                </label>
                <label>Enter your password:<br />
                    <input type="text" onChange={(e) => setPass(e.target.value)} />
                </label>
                <label>Enter your password again:<br />
                    <input type="text" onChange={(e) => setPass2(e.target.value)} />
                </label>
                <label>Enter your email:<br />
                    <input type="text" onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>Enter your first name:<br />
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label>Enter your last name:<br />
                    <input type="text" onChange={(e) => setLastName(e.target.value)} />
                </label>
            </form>
            <div className='login-ui-button-group'>
                <button className='button' onClick={login(user, pass)}>Login</button>
                <button className='button' onClick={register(user, pass, pass2, email, firstName, lastName)}>Register</button>
                <button className='button' onClick={logout}>Logout</button>
            </div>
        </div>
    )
}
