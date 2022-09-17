import './App.css';
import { useState } from 'react';

import DeckSnapshot from './components/DeckSnapshot';
import UISidebar from './components/UISidebar';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -6.267469638550943,
  latitude: 53.34523915464418,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

function App() {
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState(); 
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [columnClickEvent, setColumnClickEvent] = useState();

  return (
    <>
      <UISidebar
        setLongView={setLongView}
        setLatView={setLatView}
        stationData={stationData}
        setStationData={setStationData}
        setColumnClickEvent={setColumnClickEvent}
        columnClickEvent={columnClickEvent}
        mapData={mapData}
        setMapData={setMapData}
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