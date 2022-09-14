import React, { useEffect, useState } from 'react'
import {
    getProfile,
    logout,
    register,
    login
} from '../authRequests'
import { updateStation, getAllStations } from '../dbAPIRequests';

export default function RightSidebar({ columnClickEvent, mapData, setMapData }) {
    const [user, setUser] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [profile, setProfile] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [dieselPrice, setDieselPrice] = useState();
    const [petrolPrice, setPetrolPrice] = useState();
    
    async function getAndSetProfile() {
        setProfile(await getProfile());
    }

    const handleLogin = async () => {
        await login(user, pass);
        await getAndSetProfile();
        checkIfLoggedIn()
    }

    function handleLogout() {
        logout();
        getAndSetProfile();
        checkIfLoggedIn()
    }

    async function checkIfLoggedIn() {
        if (profile && profile.username) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
        console.log(loggedIn)
    }

    const handleUpdateStation = async (e) => {
        if (columnClickEvent && petrolPrice && dieselPrice) {

            let stationIndex = mapData.findIndex( (station) => {
                return station.reference === columnClickEvent.object.fuelInfo.google_id;
            })
            let mapDataTemp = mapData;
            mapDataTemp[stationIndex].fuelInfo.petrol = petrolPrice;
            mapDataTemp[stationIndex].fuelInfo.diesel = dieselPrice;
            setMapData(mapDataTemp);

            await updateStation(columnClickEvent.object.fuelInfo.id, 
                toString(columnClickEvent.object.fuelInfo.station), 
                columnClickEvent.object.fuelInfo.google_id, 
                columnClickEvent.object.fuelInfo.updated_by, 
                petrolPrice, dieselPrice);
        } else {
            alert('There must be both an updated Diesel and Petrol price')
        }
    }

    useEffect(() => {
        getAndSetProfile();
        checkIfLoggedIn();
    }, [])

    useEffect(() => {
        console.log(profile)
        checkIfLoggedIn();
    }, [profile])

    return (

        <div className='login-ui-wrapper sidebar-ui'>
            {(profile && profile.username) ? (<div><span>Logged in as {profile.username}</span> <button className='button' onClick={handleLogout}>Logout</button></div>) : (<form className='login-form ui-form'>
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
            {columnClickEvent && loggedIn &&
                <div>
                    <ul className='station-info'>
                        <li>{columnClickEvent.object.name}</li>
                        <li>{columnClickEvent.object.vicinity}</li>
                        <br />
                        <li>{columnClickEvent.object.opening_hours && columnClickEvent.object.opening_hours.open_now ?
                            'Open: Yes' : columnClickEvent.object.opening_hours ?
                                'Open: No' : 'No opening hours set'}</li>
                        <br />
                        <li>Petrol: <input type='text' placeholder={columnClickEvent.object.fuelInfo.petrol} onChange={(e) => setPetrolPrice(e.target.value)}></input></li>
                        <li>Diesel: <input type='text' placeholder={columnClickEvent.object.fuelInfo.diesel} onChange={(e) => setDieselPrice(e.target.value)}></input></li>
                        <br />
                        {columnClickEvent.object.fuelInfo.petrol !== '0' ? (<li>Updated by: {columnClickEvent.object.fuelInfo.updated_by}</li>) : (<li>Updated by: Not updated yet</li>)}
                        <li>Updated on: {columnClickEvent.object.fuelInfo.updated}</li>
                        <li>ID: {columnClickEvent.object.fuelInfo.id}</li>
                    </ul>
                    <button onClick={handleUpdateStation} >Update Station</button>
                </div>
            }
        </div>
    )
}
