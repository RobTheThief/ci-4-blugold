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

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -6.267469638550943,
  latitude: 53.34523915464418,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

function App() {
  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR(`/api/`, fetcher, { refreshInterval: 10000 })
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState(); 
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

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
        latView={latView}
        longView={longView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
        viewState={viewState}
        setViewState={setViewState}
      />
      <DeckSnapshot
        setLongView={setLongView}
        latView={latView}
        longView={longView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
        mapData={mapData}
        setMapData={setMapData}
        viewState={viewState}
        setViewState={setViewState}
      />
    </>
  );
}

export default App;