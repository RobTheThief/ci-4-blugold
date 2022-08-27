import './App.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import DeckSnapshot from './components/DeckSnapshot';
import LoginRegisterUI from './components/LoginRegisterUI';
import {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData
} from './dbAPIRequests'
import SearchStationSidebar from './components/SearchStationSidebar';
import {getProfile} from './authRequests';

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`/api/`, fetcher, { refreshInterval: 10000 })
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState(); 

  useEffect(() => {
    //console.log({ apiData, bluApiData, debug })
  }, [apiData, bluApiData])

  useEffect(() => {

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