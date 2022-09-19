import React, { useEffect, useState } from "react";
import DeckGL, { ColumnLayer, FlyToInterpolator } from "deck.gl";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createStation, getAllStations } from "../dbAPIRequests";
import BluTooltip from "./BluTooltip";

/**
 * Renders the map with column layers to visualize station price.
 * Accepts mapData, setMapData, stationData, setStationData, longView,
  latView, viewState, setViewState, setColumnClickEvent, as props.
 * @param {object} param0 
 * @returns jsx
 */
export default function DeckSnapshot({
  mapData,
  setMapData,
  stationData,
  longView,
  latView,
  viewState,
  setViewState,
  setColumnClickEvent,
  fetchAndSetStationData,
  setIsDrawerOpen,
  profile,
}) {
  const [hoverInfo, setHoverInfo] = useState("");
  const [runOnce, setRunOnce] = useState(false);
  const [petrolLayer, setPetrolLayer] = useState();
  const [dieselLayer, setDieselLayer] = useState();
  const [layers, setLayers] = useState();
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 1024 ? true : false
  );

  /**
   * sets columnClickEvent state variable to the click
   * event object and sets the isDrawerOpen state variable
   * to true if user is loggeed in.
   * @param {object} event
   */
  function handleClick(event) {
    console.log(isMobile);
    setColumnClickEvent(event);
    profile.username && setIsDrawerOpen(true);
  }

  /**
   * Sets the viewState variable for deckgl whicj transitions
   * to the new coordinates on the map.
   */
  function focusView() {
    if (longView && latView) {
      setViewState({
        longitude: longView,
        latitude: latView,
        zoom: 13.5,
        pitch: 45,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  }

  /**
   * Sets the hoverInfo state variable to the event
   * object returned from the onHover event from the
   * colmn layer for the the tooltip.
   * @param {object} info
   */
  const updateHoverInfo = (info) => {
    setHoverInfo(info);
  };

  /**
   * Checks the database for a station that matches the google referencs
   * in stationData for a given index in the stationData array and returns
   * the station object.
   * @param {int} idx
   * @returns object, promise
   */
  const handleFindStationInDBAsync = (idx) => {
    return new Promise(async (resolve) => {
      let dbStations = await getAllStations();
      let station = dbStations.find((station) => {
        return station.google_id === stationData.results[idx].place_id;
      });
      resolve(station);
    });
  };

  /**
   * Uses a promise to control the flow of the script using
   * handleFindStationInDBAsync to find a station that matches
   * the google references in stationData.
   * @param {int} idx
   * @returns object, promise
   */
  const findStationInDB = async (idx) => {
    return new Promise(async (resolve) => {
      try {
        resolve(await handleFindStationInDBAsync(idx));
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  };

  /**
   * Checks if a station from google places api mapped to mapDataTemp is in the database
   * and adds it to the station object as the key fuelInfo. If not found it will either create it in the database
   * and add it from the database if user is logged in or it will add the data to fuelInfo if not logged in
   * ecept without the database object id.
   * @param {object} bluDBStation
   * @param {array} mapDataTemp
   * @param {int} idx
   * @returns array, promise
   */
  const checkAndAddToDB = (bluDBStation, mapDataTemp, idx) => {
    return new Promise(async (resolve) => {
      if (bluDBStation === undefined && runOnce === false && profile.username) {
        await createStation(
          `${stationData.results[idx].name}`,
          0,
          0,
          stationData.results[idx].place_id
        ).then((station) => (mapDataTemp[idx].fuelInfo = station));

        setRunOnce(true);
      } else if (
        !profile.username &&
        runOnce === false &&
        bluDBStation !== undefined
      ) {
        mapDataTemp[idx].fuelInfo = bluDBStation;
        setRunOnce(true);
      } else if (
        profile.username &&
        runOnce === false &&
        bluDBStation !== undefined
      ) {
        mapDataTemp[idx].fuelInfo = bluDBStation;
        setRunOnce(true);
      } else if (runOnce === false) {
        mapDataTemp[idx].fuelInfo = {
          name: stationData.results[idx].name,
          petrol: "0",
          diesel: "0",
          google_id: stationData.results[idx].place_id,
        };
        setRunOnce(true);
      }
      let mapDataDeepCopy = JSON.parse(JSON.stringify(mapDataTemp));
      resolve(mapDataDeepCopy);
    });
  };

  /**
   * Creates and and sets an array to mapData to be used for the map layer
   * and station data.
   */
  const createMapData = () => {
    if (stationData) {
      let mapDataTemp = stationData.results.map((station, idx) => {
        station.coordinates = [
          station.geometry.location.lng,
          station.geometry.location.lat,
        ];
        return station;
      });
      stationData.results.forEach(async (item, idx) => {
        let bluDBStation = await findStationInDB(idx);
        let updatedMapData = await checkAndAddToDB(
          bluDBStation,
          mapDataTemp,
          idx
        );
        setMapData(updatedMapData);
      });
    }
  };

  useEffect(() => {
    createMapData();
  }, [stationData]);

  useEffect(() => {
    focusView();
  }, [longView, latView]);

  /* Sets the dieselLayer and petrolLayer state variables from the deckgl
     ColumnLayer class.
  */
  useEffect(() => {
    setDieselLayer(
      new ColumnLayer({
        id: "diesel-column-layer",
        data: mapData,
        dataComparator: (newData, oldData) => false,
        diskResolution: 12,
        radius: 25,
        extruded: true,
        pickable: true,
        elevationScale: 5000,
        getPosition: (d) => [
          d.coordinates[0] + 0.0005,
          d.coordinates[1] + 0.0005,
        ],
        getFillColor: (d) => [48, 128, 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: (d) => {
          let price = parseFloat(d.fuelInfo && d.fuelInfo.diesel);
          if (price === 0) {
            return parseFloat(d.fuelInfo && d.fuelInfo.diesel) + 0.01;
          }
          return parseFloat(d.fuelInfo && d.fuelInfo.diesel) - 1.7;
        },
        onHover: (info) => updateHoverInfo(info),
        onClick: (event) => handleClick(event),
      })
    );
    setPetrolLayer(
      new ColumnLayer({
        id: "petrol-column-layer",
        data: mapData,
        dataComparator: (newData, oldData) => false,
        diskResolution: 12,
        radius: 25,
        extruded: true,
        pickable: true,
        elevationScale: 5000,
        getPosition: (d) => d.coordinates,
        getFillColor: (d) => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: (d) => {
          let price = parseFloat(d.fuelInfo && d.fuelInfo.petrol);
          if (price === 0) {
            return parseFloat(d.fuelInfo && d.fuelInfo.petrol) + 0.01;
          }
          return parseFloat(d.fuelInfo && d.fuelInfo.petrol) - 1.7;
        },
        onHover: (info) => updateHoverInfo(info),
        onClick: (event) => handleClick(event),
      })
    );
    setRunOnce(false);
  }, [mapData]);

  useEffect(() => {
    fetchAndSetStationData();
  }, []);

  useEffect(() => {
    setLayers([petrolLayer, dieselLayer]);
  }, [dieselLayer, petrolLayer]);

  return (
    <>
      {hoverInfo && ((isMobile && !profile.username) || !isMobile) && (
        /* MAP TOOLTIP */
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            pointerEvents: "none",
            left: hoverInfo.x,
            top: hoverInfo.y,
            color: "white",
          }}
        >
          {hoverInfo && hoverInfo.object && (
            <BluTooltip hoverInfo={hoverInfo} />
          )}
        </div>
      )}
      {layers && (
        /* DECKGL AND MAPBOX MAP COMPONENTS */
        <DeckGL
          initialViewState={viewState}
          onViewportChange={setViewState}
          controller={true}
          layers={layers}
        >
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            mapStyle='mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09'
          />
        </DeckGL>
      )}
    </>
  );
}
