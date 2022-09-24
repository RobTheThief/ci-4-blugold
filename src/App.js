import "./App.css";
import { useEffect, useState } from "react";

import DeckSnapshot from "./components/DeckSnapshot";
import UISidebar from "./components/UISidebar";
import { getStationLocationData } from "./dbAPIRequests";
import { getProfile } from "./authRequests";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [profile, setProfile] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * Resets the stations data in order to force a state
   * change and re render the map layer.
   * @returns promise
   */
  const resetSatationData = () => {
    return new Promise(async (resolve) => {
      try {
        if (stationData) {
          let stationDataDeepCopy = JSON.parse(JSON.stringify(stationData));
          setStationData(stationDataDeepCopy);
        }
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

  /**
   * Gets the profile object and sets it to the
   * profile state variable.
   * @returns promise
   */
  async function getAndSetProfile() {
    return new Promise(async (resolve) => {
      try {
        setProfile(await getProfile());
        await resetSatationData();
        resolve();
      } catch (error) {
        console.log(error);
        setProfile(error);
        resolve();
      }
    });
  }

  /**
   * Checks if the user is logged in and then sets the loggedIn
   * state variable.
   * @returns promise
   */
  async function checkIfLoggedIn() {
    return new Promise(async (resolve) => {
      if (profile && profile.username) {
        setLoggedIn(true);
        resolve();
      } else {
        setLoggedIn(false);
        resolve();
      }
    });
  }

  /**
   * Sets an interval of 5 seconds and checks if valid session
   * cookies present, then sets the profile accordingly and
   * the isLoggedIn state variable.
   */
  const checkForAuthenticationInterval = () => {
    setInterval(() => {
      getAndSetProfile();
      checkIfLoggedIn();
    }, 5000);
  }

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

  useEffect(() => {
    checkIfLoggedIn();
  }, [profile]);

  useEffect(() => {
    getAndSetProfile();
    checkIfLoggedIn();
    checkForAuthenticationInterval();
  }, []);

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
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        profile={profile}
        getAndSetProfile={getAndSetProfile}
        loggedIn={loggedIn}
        checkIfLoggedIn={checkIfLoggedIn}
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
        setIsDrawerOpen={setIsDrawerOpen}
        profile={profile}
        setProfile={setProfile}
      />
    </>
  );
}

export default App;
