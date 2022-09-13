import React, { useEffect, useState } from 'react'
import {
    getProfile,
    logout,
    register,
    login
} from '../authRequests'

export default function LoginRegisterUI({ }) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [profile, setProfile] = useState();
    const [loggedIn, setLoggedIn] = useState(false);

    async function getAndSetProfile() {
        setProfile(await getProfile());
    }

    const handleLogin = async () => {
        await login(user, pass);
        await getAndSetProfile();
        checkIfLoggedIn()
    }

    function handleLogout () {
        logout();
        getAndSetProfile();
        checkIfLoggedIn()
    }

    async function checkIfLoggedIn () {
        setProfile(await getProfile());
        if (profile && profile.username) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
        console.log(loggedIn)
    }

    useEffect(() => {
        getAndSetProfile();
        checkIfLoggedIn();
    }, [])

    useEffect(() => {
        console.log(profile)
    }, [profile])

    return (
        
        <div className='login-ui-wrapper sidebar-ui'>
           { (profile && profile.username) ? (<div><span>Logged in as {profile.username}</span> <button className='button' onClick={handleLogout}>Logout</button></div>) : (<form className='login-form ui-form'>
                <label>Enter your username<br />
                    <input type="text" onChange={(e) => setUser(e.target.value)} />
                </label>
                <label>Enter your password<br />
                    <input type="password" onChange={(e) => setPass(e.target.value)} />
                </label>
                <label>Enter your password again<br />
                    <input type="password" onChange={(e) => setPass2(e.target.value)} />
                </label>
                <label>Enter your email<br />
                    <input type="text" onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>Enter your first name<br />
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label>Enter your last name<br />
                    <input type="text" onChange={(e) => setLastName(e.target.value)} />
                </label>
            </form>)}
            <div className='login-ui-button-group'>
                {(profile && !profile.username) && (<button className='button' onClick={handleLogin}>Login</button>)}
                {(profile && !profile.username) && (<button className='button' onClick={register(user, pass, pass2, email, firstName, lastName)}>Register</button>)}
            </div>
        </div>
    )
}
