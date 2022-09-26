import React, { useEffect, useState } from "react";
import {
  getStationLocationData,
  getAreaData,
  updateStation,
  deleteStation,
} from "../dbAPIRequests";
import { logout, register, login } from "../authRequests";
import bloGoldLogo from "../assets/img/blu-gold-logo.png";
import PetrolLegendDot from "./PetrolLegendDot";
import DieselLegendDot from "./DieselLegendDot";

/**
 * Main UI sidebar for search stations, login, register,
 * and updating stations.
 * Accepts stationData, setStationData, setLongView,
 * setLatView, columnClickEvent, mapData and setMapData
 * as props.
 * @param {object} param0
 * @returns jsx
 */
export default function UISidebar({
  stationData,
  setStationData,
  setLongView,
  setLatView,
  columnClickEvent,
  setColumnClickEvent,
  mapData,
  setMapData,
  fetchAndSetStationData,
  setIsDrawerOpen,
  isDrawerOpen,
  profile,
  getAndSetProfile,
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
  const [dieselPrice, setDieselPrice] = useState();
  const [petrolPrice, setPetrolPrice] = useState();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteMessage, setIsDeleteMessage] = useState(false);

  const updateStationErrorMsg =
    "Price input must be a number and there must be both a Diesel and Petrol price.";
  const emailErrorMsg =
    "This email address has already been used to create an account.";
  const checkUserPass = "Please check your login details and try again.";
  const checkDelete =
    "Are you sure you want to reset the price? This will delete the station from the database and a new station will be created with '0' price values.";

  const searchLocation = async (e) => {
    let location = `${lat},${long}`;
    location && setStationData(await getStationLocationData(location, "fuel"));
  };

  /**
   * Makes an area search to the google places api to find and
   * set the coordinates of that area if the enter key is pressed
   * or if the 'Go' button is pressed.
   * @param {string} goButton
   */
  const handleSearchStationArea = (goButton) => async (e) => {
    if (e.code === "Enter" || goButton === "go") {
      if (area !== undefined) {
        setIsDrawerOpen(false);
        await getAreaData(area)
          .then((data) => {
            setLat(data.candidates[0].geometry.location.lat);
            return data;
          })
          .then((data) => {
            setLong(data.candidates[0].geometry.location.lng);
          })
          .catch((error) =>
            displayErrorMessage(
              "Cannot find place or address. Check input and try again.",
              false
            )
          );
      } else {
        displayErrorMessage(
          "Enter place name, address, or post code and try again.",
          false
        );
      }
    }
  };

  /**
   * Sets error message, sets booleaen for isDelete message and
   * then sets isError to true.
   * @param {string} error
   * @param {boolean} options
   */
  const displayErrorMessage = (error, options) => {
    setIsDeleteMessage(options);
    setErrorMessage(error);
    setIsError(true);
  };

  /**
   * Logs in the user if the username and password is correct.
   * @param {object} e
   * @returns promise
   */
  const handleLogin = (e) => {
    return new Promise(async (resolve) => {
      try {
        e && e.preventDefault();
        let result = await login(user, pass);
        if ((await result.statusText) === "Bad Request") {
          displayErrorMessage(checkUserPass, false);
        } else {
          await getAndSetProfile();
        }
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

  /**
   * Registers the user if the email address has not been used already
   * and displays an error message if it has been used before.
   * @param {object} e
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    let result = await register(user, pass, pass2, email, firstName, lastName);

    if (result.email && result.email[0] !== "This field must be unique.") {
      await handleLogin();
      await getAndSetProfile();
      let mapDataDeepCopy = JSON.parse(JSON.stringify(mapData));
      setMapData(mapDataDeepCopy);
    } else if (result.email) {
      displayErrorMessage(emailErrorMsg, false);
    } else {
      displayErrorMessage(
        result.username ? result.username[0] : result.password[0],
        false
      );
    }
  };

  /**
   * Logs out the user, resets the profile state variable
   * and then checks that the user has been logged out.
   */
  function handleLogout() {
    logout().then((response) => {
      getAndSetProfile();
    });
  }

  /**
   * Sets a state variable to control if the main UI drawer
   * is opened or closed.
   */
  const handleOpenCloseDrawer = () => {
    setIsDrawerOpen(isDrawerOpen ? false : true);
  };

  /**
   * Updates the mapData for a particular station after
   * a station has been updated.
   * @returns promise
   */
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
        mapDataTemp[stationIndex].fuelInfo.updated_by = profile.username;
        let mapDataDeepCopy = JSON.parse(JSON.stringify(mapDataTemp));
        setMapData(mapDataDeepCopy);
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

  /**
   * Checks if the fuel prices entered are numbers and updates the
   * stations in the database and on the map client side if true.
   * Displays error message if the input is not numbers.
   * @param {object} e
   */
  const handleUpdateStation = async (e) => {
    e.preventDefault();
    if (!isNaN(petrolPrice) && !isNaN(dieselPrice)) {
      await updateMapData();
      await updateStation(
        columnClickEvent.object.fuelInfo.id,
        toString(columnClickEvent.object.fuelInfo.station),
        columnClickEvent.object.fuelInfo.google_id,
        profile.username,
        petrolPrice,
        dieselPrice
      );
    } else {
      displayErrorMessage(updateStationErrorMsg, false);
    }
  };

  const handleDeleteStation = async (e) => {
    setColumnClickEvent(null);
    setMapData([]);
    await deleteStation(columnClickEvent.object.fuelInfo.id);
    await fetchAndSetStationData();
    setIsDeleteMessage(false);
    setIsError(false);
  };

  useEffect(() => {
    setLongView(long);
    setLatView(lat);
  }, [stationData]);

  useEffect(() => {
    lat && long && searchLocation();
  }, [long]);

  return (
    <>
      {/* DRAWER TAB */}
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
      {/* ERROR MESSAGE MODAL */}
      <div className={`tooltip ${isError ? "update-error-message" : "hidden"}`}>
        <div className='material-symbols-outlined warning-icon'>warning</div>{" "}
        <p>{errorMessage}</p>
        {isDeleteMessage && (
          <input type='button' value='OK' onClick={handleDeleteStation} />
        )}
        <input
          type='button'
          value='CANCEL'
          onClick={(e) => setIsError(false)}
        />
      </div>
      {/* SIDEBAR */}
      <div
        className={`sidebar-ui ${
          isDrawerOpen ? "open-drawer" : "close-drawer"
        }`}
      >
        {isDrawerOpen && (
          <>
            {/* LOGO AND SEARCH AREA SECTION */}
            <div className='ui-form'>
              <div className='logo-container'>
                <img
                  src={bloGoldLogo}
                  alt='blugold logo'
                  height='30'
                  className='blu-logo'
                />
                <h1 className='logo-text'>Blugold</h1>
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
                    {/* LOGOUT SECTION */}
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
                    {/* LOGIN AND REGISTER SECTION */}
                    <div className='ui-form'>
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
                          className='button form-btn login-btn'
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
                          className='button form-btn register-btn'
                        />
                      </form>
                    </div>
                  </>
                )}
                {/* UPDATE STATION SECTION */}
                {columnClickEvent && profile.username && (
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
                      </ul>
                      <input
                        className='button form-btn'
                        type='submit'
                        value='Update'
                      />
                      <input
                        className='button form-btn'
                        type='button'
                        value='Delete Prices'
                        onClick={() => displayErrorMessage(checkDelete, true)}
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
