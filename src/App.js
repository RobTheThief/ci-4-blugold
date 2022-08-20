import './App.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import DeckSnapshot from './components/DeckSnapshot';
import baseUrl from './baseUrl';
import {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData
} from './dbAPIRequests'
import {
  getProfile,
  logout,
  register,
  login
} from './authRequests'

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`${baseUrl.url}/api/`, fetcher, { refreshInterval: 10000 }) // dev
  //const { data: bluApiData, error: bluError } = useSWR('https://blugold.herokuapp.com/api/', fetcher, { refreshInterval: 10000 }) // prod

  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    var debug = console.log.bind(window.console)
    console.log({apiData, bluApiData, debug})
  }, [apiData, bluApiData])

  useEffect(() => {
    //createStation();
    //updateStation()
    //deleteStation()
    //console.log(getStation())
    //login();
    getProfile();
   // let result = getStationLocationData('53.34523915464418,-6.267469638550943')
   // console.log({result});
  }, [])

  return (
    <>
      <form className='login-form'>
        <label>Enter your username:
          <input type="text" onChange={(e) => setUser(e.target.value)} />
        </label>
        <label>Enter your password:
          <input type="text" onChange={(e) => setPass(e.target.value)} />
        </label>
        <label>Enter your password again:
          <input type="text" onChange={(e) => setPass2(e.target.value)} />
        </label>
        <label>Enter your email:
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Enter your first name:
          <input type="text" onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>Enter your last name:
          <input type="text" onChange={(e) => setLastName(e.target.value)} />
        </label>
      </form>
      <button className='login-button' onClick={login(user, pass)}>Login</button>
      <button className='register-button' onClick={register(user, pass, pass2, email, firstName, lastName)}>Register</button>
      <button className='logout-button' onClick={logout}>Logout</button>
      <DeckSnapshot />
    </>
  );
}

export default App;
