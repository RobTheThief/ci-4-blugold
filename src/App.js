import './App.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import DeckSnapshot from './components/DeckSnapshot';
import RightSidebar from './components/RightSidebar';

import SearchStationSidebar from './components/SearchStationSidebar';
import {getProfile} from './authRequests';
import {
  getStationLocationData,
  createStation,
  getAllStations
} from './dbAPIRequests'

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
  const { data: bluApiData, error: bluError } = useSWR(`/api/`, fetcher, { refreshInterval: 10000 })
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState(); 
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [columnClickEvent, setColumnClickEvent] = useState();

  useEffect(() => {
  }, [bluApiData])

  return (
    <>
      <RightSidebar 
        setColumnClickEvent={setColumnClickEvent}
        columnClickEvent={columnClickEvent}
        mapData={mapData}
        setMapData={setMapData}
      />
      <SearchStationSidebar
        setLongView={setLongView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
      />
      <DeckSnapshot
        columnClickEvent={columnClickEvent}
        setColumnClickEvent={setColumnClickEvent}
        latView={latView}
        longView={longView}
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