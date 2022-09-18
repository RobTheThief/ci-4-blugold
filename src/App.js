import "./App.css";
import { useState } from "react";

import DeckSnapshot from "./components/DeckSnapshot";
import UISidebar from "./components/UISidebar";
import { getStationLocationData } from "./dbAPIRequests";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -6.267469638550943,
  latitude: 53.34523915464418,
  zoom: 13,
  pitch: 45,
  bearing: 0,
};

function App() {
  const [stationData, setStationData] = useState();
  const [mapData, setMapData] = useState();
  const [longView, setLongView] = useState();
  const [latView, setLatView] = useState();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [columnClickEvent, setColumnClickEvent] = useState();

  /**
   * Fetches station data form the google places api throught
   * the middleware and sets it to the stationData state variable.
   * Defaults to coordinates in Dublin city centre.
   * @param {string} long
   * @param {string} lat
   */
  const fetchAndSetStationData = async (
    long = "53.34523915464418",
    lat = "-6.267469638550943"
  ) => {
    return new Promise(async (resolve) => {
      try {
        let location = `${long},${lat}`;
        setStationData(await getStationLocationData(location, "fuel"));
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

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
        fetchAndSetStationData={fetchAndSetStationData}
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
        fetchAndSetStationData={fetchAndSetStationData}
      />
    </>
  );
}

export default App;
