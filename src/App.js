import './App.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import DeckSnapshot from './components/DeckSnapshot';
import LoginRegisterUI from './components/LoginRegisterUI';
import { url as baseUrl } from './baseUrl';
import {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData
} from './dbAPIRequests'
import SearchStationSidebar from './components/SearchStationSidebar';

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`${baseUrl}/api/`, fetcher, { refreshInterval: 10000 }) // dev
  //const { data: bluApiData, error: bluError } = useSWR('https://blugold.herokuapp.com/api/', fetcher, { refreshInterval: 10000 }) // prod
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState(); 

  useEffect(() => {
    var debug = console.log.bind(window.console)
    console.log({ apiData, bluApiData, debug })
  }, [apiData, bluApiData])

  useEffect(() => {
    //createStation();
    //updateStation()
    //deleteStation()
    //console.log(getStation())
    //login();
    // let result = getStationLocationData('53.34523915464418,-6.267469638550943')
    // console.log({result});
     createStation('The thing', 2, 2);
  }, [])

  return (
    <>
      <LoginRegisterUI />
      <SearchStationSidebar
        setLongView={setLongView}
        latView={setLongView}
        longView={longView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
      />
      <DeckSnapshot
        setLongView={setLongView}
        latView={setLongView}
        longView={longView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
        mapData={mapData}
        setMapData={setMapData}
      />
    </>
  );
}

export default App;