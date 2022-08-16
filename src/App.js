import './App.css';
import DeckGL from 'deck.gl';
import { LineLayer } from 'deck.gl';
import Map from 'react-map-gl';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import "mapbox-gl/dist/mapbox-gl.css";

const BASE_URL = 'https://8000-robthethief-ci4blugold-gsro7huqcm1.ws-eu61.gitpod.io';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const data = [
  { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  let linelayer = new LineLayer({ id: 'line-layer', data })

  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`${BASE_URL}/api/`, fetcher, { refreshInterval: 10000 }) // dev
  //const { data: bluApiData, error: bluError } = useSWR('https://blugold.herokuapp.com/api/', fetcher, { refreshInterval: 10000 }) // prod

  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  function createStation( station, petrolPrice, dieselPrice) {
    console.log('running');
    fetch(`${BASE_URL}/api/create/`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "station": station,
          "petrol": petrolPrice,
          "diesel": dieselPrice
        })
    })
      .then(res => {
        if (res.ok) return res.json()
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  function updateStation(id, station, petrolPrice, dieselPrice) {
    console.log('running');
    fetch(`${BASE_URL}/api/update/${id}/`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "station": station,
          "petrol": petrolPrice,
          "diesel": dieselPrice
        })
    })
      .then(res => {
        if (res.ok) return res.json()
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  function deleteStation(id) {
    console.log('running');
    fetch(`${BASE_URL}/api/delete/${id}/`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.ok) return res.json()
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  function getStation(id) {
    console.log('running');
    fetch(`${BASE_URL}/api/${id}/`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.ok) return res.json()
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  const login = () => {
    console.log(user, pass)

    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    fetch(`${BASE_URL}/login/`, requestOptions) 
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const register = () => {
    console.log(user, pass, pass2, email, firstName, lastName)

    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);
    formdata.append("password2", pass2);
    formdata.append("email", email);
    formdata.append("first_name", firstName);
    formdata.append("last_name", lastName);

    var requestOptions = {
      credentials: "include",
      method: 'POST',
      body: formdata,
    };

    fetch(`${BASE_URL}/register/`, requestOptions) 
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const logout = () => {
    var requestOptions = {
      credentials: "include",
      method: 'POST',
    };

    fetch(`${BASE_URL}/logout/`, requestOptions) 
      .then(response => response)
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const getProfile = () => {
    var requestOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: 'GET',
    };

    fetch(`${BASE_URL}/profile/`, requestOptions) 
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    console.log(apiData, bluApiData)
  }, [apiData, bluApiData])

  useEffect(() => {
    //createStation();
    //updateStation()
    //deleteStation()
    //console.log(getStation())
    //login();
    getProfile();
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
      <button className='login-button' onClick={login}>Login</button>
      <button className='register-button' onClick={register}>Register</button>
      <button className='logout-button' onClick={logout}>Logout</button>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={linelayer}
      >
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09"
          //mapStyle="mapbox://styles/mapbox/streets-v11"
        />
      </DeckGL>
    </>
  );
}

export default App;
