import React, { useEffect, useState } from "react";
import {
  getStationLocationData,
  getAreaData,
  updateStation,
} from "../dbAPIRequests";
import { getProfile, logout, register, login } from "../authRequests";
import bloGoldLogo from "../assets/img/blu-gold-logo.png";
import PetrolLegendDot from "./PetrolLegendDot";
import DieselLegendDot from "./DieselLegendDot";

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
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateStationErrorMsg =
    "Price input must be a number and there must be both a Diesel and Petrol price.";
  const emailErrorMsg =
    "This email address has already been used to create an account.";
  const checkUserPass = "Please check your login details and try again.";

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

  const displayErrorMessage = (error) => {
    setErrorMessage(error);
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let result = await login(user, pass);
    if (result.statusText === "Bad Request") {
      displayErrorMessage(checkUserPass);
    } else {
      await getAndSetProfile();
      checkIfLoggedIn();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let result = await register(user, pass, pass2, email, firstName, lastName);
    if (result.email[0] !== "This field must be unique.") {
      await login(user, pass);
      await getAndSetProfile();
      await checkIfLoggedIn();
    } else {
      displayErrorMessage(emailErrorMsg);
    }
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
    e.preventDefault();
    if (!isNaN(petrolPrice) && !isNaN(dieselPrice)) {
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
      displayErrorMessage(updateStationErrorMsg);
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
    <>
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
      <div className={`tooltip ${isError ? "update-error-message" : "hidden"}`}>
        <div className='material-symbols-outlined warning-icon'>warning</div>{" "}
        {errorMessage}
      </div>
      <div
        className={`sidebar-ui ${
          isDrawerOpen ? "open-drawer" : "close-drawer"
        }`}
      >
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
                    Enter an address or place name to find stations within 3km
                    of that location.
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
                      To update the station fuel prices please log in or
                      register.
                    </p>
                    <div className='login-form ui-form'>
                      <form onSubmit={(e) => handleLogin(e)}>
                        <label>
                          Username
                          <br />
                          <input
                            type='text'
                            onChange={(e) => setUser(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Password
                          <br />
                          <input
                            type='password'
                            onChange={(e) => setPass(e.target.value)}
                            required
                          />
                        </label>
                        <input
                          type='submit'
                          value='Login'
                          className='button form-btn login'
                        />
                      </form>
                      <form onSubmit={(e) => handleRegister(e)}>
                        <label>
                          Username
                          <br />
                          <input
                            type='text'
                            onChange={(e) => setUser(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Password
                          <br />
                          <input
                            type='password'
                            onChange={(e) => setPass(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Type password again
                          <br />
                          <input
                            type='password'
                            onChange={(e) => setPass2(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Email
                          <br />
                          <input
                            type='email'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          First name
                          <br />
                          <input
                            type='text'
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Last name
                          <br />
                          <input
                            type='text'
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </label>
                        <input
                          type='submit'
                          value='Register'
                          className='button form-btn'
                        />
                      </form>
                    </div>
                  </>
                )}
                <div className='login-ui-button-group'></div>
                {columnClickEvent && loggedIn && (
                  <div className='update-station-section'>
                    <form onSubmit={(e) => handleUpdateStation(e)}>
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
                        <li className='tooltip-list-item'>
                          <PetrolLegendDot />
                          Petrol:{" "}
                          <input
                            className='update-price-input'
                            type='text'
                            placeholder={
                              columnClickEvent.object.fuelInfo.petrol
                            }
                            onChange={(e) => setPetrolPrice(e.target.value)}
                            required
                          ></input>
                        </li>
                        <li className='tooltip-list-item'>
                          <DieselLegendDot />
                          Diesel:{"  "}
                          <input
                            className='update-price-input'
                            type='text'
                            placeholder={
                              columnClickEvent.object.fuelInfo.diesel
                            }
                            onChange={(e) => setDieselPrice(e.target.value)}
                            required
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
                      <input
                        className='button form-btn'
                        type='submit'
                        value='Update Station'
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
