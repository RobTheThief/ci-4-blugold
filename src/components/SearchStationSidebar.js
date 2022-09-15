import React, { useEffect, useState } from "react";
import {
  getStationLocationData,
  getAreaData,
  updateStation,
} from "../dbAPIRequests";
import { getProfile, logout, register, login } from "../authRequests";
import bloGoldLogo from "../assets/img/blu-gold-logo.png";

export default function SearchStationSidebar({
  stationData,
  setStationData,
  setLongView,
  setLatView,
  columnClickEvent,
  mapData,
  setMapData,
}) {
  const [area, setArea] = useState();
  const [long, setLong] = useState();
  const [lat, setLat] = useState();
  const [user, setUser] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profile, setProfile] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [dieselPrice, setDieselPrice] = useState();
  const [petrolPrice, setPetrolPrice] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const searchLocation = async (e) => {
    console.log("yes");
    let location = `${lat},${long}`;
    location && setStationData(await getStationLocationData(location, "fuel"));
  };

  const handleSearchStationArea = (goButton) => async (e) => {
    if (e.code === "Enter" || goButton === "go") {
      await getAreaData(area)
        .then((data) => {
          setLat(data.candidates[0].geometry.location.lat);
          console.log("yes");
          return data;
        })
        .then((data) => {
          setLong(data.candidates[0].geometry.location.lng);
          console.log("and yes");
          return data;
        })
        .catch((error) => console.log(error));
    }
  };

  async function getAndSetProfile() {
    setProfile(await getProfile());
  }

  const handleLogin = async () => {
    await login(user, pass);
    await getAndSetProfile();
    checkIfLoggedIn();
  };

  const handleRegister = async () => {
    await register(user, pass, pass2, email, firstName, lastName);
    await login(user, pass);
    await getAndSetProfile();
    await checkIfLoggedIn();
  };

  function handleLogout() {
    logout();
    getAndSetProfile();
    checkIfLoggedIn();
  }

  const handleOpenCloseDrawer = () => {
    setIsDrawerOpen(isDrawerOpen ? false : true);
  };

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

  const updateMapData = () => {
    return new Promise(async (resolve) => {
      try {
        let stationIndex = mapData.findIndex((station) => {
          return (
            station.reference === columnClickEvent.object.fuelInfo.google_id
          );
        });
        let mapDataTemp = mapData;
        mapDataTemp[stationIndex].fuelInfo.petrol = petrolPrice;
        mapDataTemp[stationIndex].fuelInfo.diesel = dieselPrice;
        setMapData(mapDataTemp);
        console.log(mapData);
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

  const handleUpdateStation = async (e) => {
    if (columnClickEvent && petrolPrice && dieselPrice) {
      await updateMapData();
      await updateStation(
        columnClickEvent.object.fuelInfo.id,
        toString(columnClickEvent.object.fuelInfo.station),
        columnClickEvent.object.fuelInfo.google_id,
        columnClickEvent.object.fuelInfo.updated_by,
        petrolPrice,
        dieselPrice
      );
    } else {
      alert("There must be both an updated Diesel and Petrol price");
    }
  };

  useEffect(() => {
    console.log(profile);
    checkIfLoggedIn();
  }, [profile]);

  useEffect(() => {
    setLongView(long);
    setLatView(lat);
  }, [stationData]);

  useEffect(() => {
    lat && long && searchLocation();
  }, [long]);

  useEffect(() => {
    getAndSetProfile();
    checkIfLoggedIn();
  }, []);

  return (
    <div
      className={`sidebar-ui ${isDrawerOpen ? "open-drawer" : "close-drawer"}`}
    >
      <div
        className={`drawer-tab ${
          isDrawerOpen ? "container-left" : "container-right"
        }`}
        onClick={handleOpenCloseDrawer}
      >
        <span
          className={`material-symbols-outlined arrow ${
            isDrawerOpen ? "point-arrow-left" : "point-arrow-right"
          }`}
        >
          {" "}
          double_arrow
        </span>
      </div>
      {isDrawerOpen && (
        <>
          <div className='search-form ui-form'>
            <div className='logo-container'>
              <img
                src={bloGoldLogo}
                alt='blugold logo'
                height='30'
                className='blu-logo'
              />
              <span className='logo-text'>BLUGOLD</span>
            </div>
            <div className='btn-input-container'>
              <label>
                Search Area
                <span className='material-symbols-outlined info-icon'>
                  info
                </span>
                <span className='info-icon-tooltip'>
                  Enter an address or place name to find stations within 3km of
                  that location.
                </span>
                <br />
                <input
                  className='search-input'
                  type='text'
                  onChange={(e) => setArea(e.target.value)}
                  onKeyDown={handleSearchStationArea()}
                />
              </label>
              <span
                className='go-btn button'
                onClick={handleSearchStationArea("go")}
              >
                Go
              </span>
            </div>
          </div>
          <div className='login-and-update-wrapper'>
            <div className='login-ui-wrapper'>
              {profile && profile.username ? (
                <>
                  <div className='logout-section'>
                    <span>Logged in as {profile.username}</span>{" "}
                    <span className='button' onClick={handleLogout}>
                      Logout
                    </span>
                  </div>
                  <p>
                    Click on a station on the map to view details and update
                    fuel prices.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    To update the station fuel prices please log in or register.
                  </p>
                  <form className='login-form ui-form'>
                    <label>
                      Username
                      <br />
                      <input
                        type='text'
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </label>
                    <label>
                      Password
                      <br />
                      <input
                        type='password'
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </label>
                    <span className='button login' onClick={handleLogin}>
                      Login
                    </span>
                    <label>
                      Username
                      <br />
                      <input
                        type='text'
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </label>
                    <label>
                      Password
                      <br />
                      <input
                        type='password'
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </label>
                    <label>
                      Type password again
                      <br />
                      <input
                        type='password'
                        onChange={(e) => setPass2(e.target.value)}
                      />
                    </label>
                    <label>
                      Email
                      <br />
                      <input
                        type='text'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <label>
                      First name
                      <br />
                      <input
                        type='text'
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </label>
                    <label>
                      Last name
                      <br />
                      <input
                        type='text'
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </label>
                    <span className='button' onClick={handleRegister}>
                      Register
                    </span>
                  </form>
                </>
              )}
              <div className='login-ui-button-group'></div>
              {columnClickEvent && loggedIn && (
                <div className='update-station-section'>
                  <ul className='station-info'>
                    <li>{columnClickEvent.object.name}</li>
                    <li>{columnClickEvent.object.vicinity}</li>
                    <br />
                    <li>
                      {columnClickEvent.object.opening_hours &&
                      columnClickEvent.object.opening_hours.open_now
                        ? "Open: Yes"
                        : columnClickEvent.object.opening_hours
                        ? "Open: No"
                        : "No opening hours set"}
                    </li>
                    <br />
                    <li>
                      Petrol:{" "}
                      <input
                        type='text'
                        placeholder={columnClickEvent.object.fuelInfo.petrol}
                        onChange={(e) => setPetrolPrice(e.target.value)}
                      ></input>
                    </li>
                    <li>
                      Diesel:{" "}
                      <input
                        type='text'
                        placeholder={columnClickEvent.object.fuelInfo.diesel}
                        onChange={(e) => setDieselPrice(e.target.value)}
                      ></input>
                    </li>
                    <br />
                    {columnClickEvent.object.fuelInfo.petrol !== "0" ? (
                      <li>
                        Updated by:{" "}
                        {columnClickEvent.object.fuelInfo.updated_by}
                      </li>
                    ) : (
                      <li>Updated by: Not updated yet</li>
                    )}
                    <li>
                      Updated on: {columnClickEvent.object.fuelInfo.updated}
                    </li>
                    <li>ID: {columnClickEvent.object.fuelInfo.id}</li>
                  </ul>
                  <span
                    className='button update-btn'
                    onClick={handleUpdateStation}
                  >
                    Update Station
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
