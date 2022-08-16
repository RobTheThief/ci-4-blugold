import './App.css';
import DeckGL from 'deck.gl';
import { IconLayer } from 'deck.gl';
import Map from 'react-map-gl';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import "mapbox-gl/dist/mapbox-gl.css";

import { bluConsoleLog } from './helpers';

const BASE_URL = 'https://8000-robthethief-ci4blugold-gsro7huqcm1.ws-eu61.gitpod.io';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -6.267469638550943,
  latitude: 53.34523915464418,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

const iconLayerData= [{name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-6.263469638550943, 53.34521353452406]},]

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

const iconLayer = new IconLayer({
  id: 'icon-layer',
  data: iconLayerData,
  pickable: true,
  // iconAtlas and iconMapping are required
  // getIcon: return a string
  iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
  iconMapping: ICON_MAPPING,
  getIcon: d => 'marker',

  sizeScale: 15,
  getPosition: d => d.coordinates,
  getSize: d => 5,
  getColor: d => [Math.sqrt(d.exits), 140, 0]
});

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {

  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`${BASE_URL}/api/`, fetcher, { refreshInterval: 10000 }) // dev
  //const { data: bluApiData, error: bluError } = useSWR('https://blugold.herokuapp.com/api/', fetcher, { refreshInterval: 10000 }) // prod

  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  function createStation(station, petrolPrice, dieselPrice) {
    bluConsoleLog('running', new Error().lineNumber);
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
    bluConsoleLog('running');
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
    bluConsoleLog('running');
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
    bluConsoleLog('running');
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
    bluConsoleLog(user, pass)

    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };

    fetch(`${BASE_URL}/login/`, requestOptions)
      .then(response => response)
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const register = () => {
    bluConsoleLog(user, pass, pass2, email, firstName, lastName)

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
    var debug = console.log.bind(window.console)
    bluConsoleLog(apiData, bluApiData, debug)
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
        layers={iconLayer}
      >
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          //mapStyle="mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09"
          mapStyle="mapbox://styles/mapbox/streets-v11"
        />
      </DeckGL>
    </>
  );
}

export default App;
