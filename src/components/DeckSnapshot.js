import React, { useEffect, useState } from "react";
import DeckGL, { ColumnLayer, FlyToInterpolator } from "deck.gl";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getStationLocationData,
  createStation,
  getAllStations,
} from "../dbAPIRequests";
import BluTooltip from "./BluTooltip";
import { getProfile } from "../authRequests";

export default function DeckSnapshot({
  mapData,
  setMapData,
  stationData,
  setStationData,
  longView,
  latView,
  viewState,
  setViewState,
  setColumnClickEvent,
}) {
  const [hoverInfo, setHoverInfo] = useState("");
  const [runOnce, setRunOnce] = useState(false);
  const [petrolLayer, setPetrolLayer] = useState();
  const [dieselLayer, setDieselLayer] = useState();
  const [layers, setLayers] = useState();

  function handleClick(event) {
    setColumnClickEvent(event);
  }

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

  const updateHoverInfo = (info) => {
    setHoverInfo(info);
  };

  const fetchAndSetStationData = async (
    long = "53.34523915464418",
    lat = "-6.267469638550943"
  ) => {
    let location = `${long},${lat}`;
    setStationData(await getStationLocationData(location, "fuel"));
  };

  const handleFindStationInDBAsync = (idx) => {
    return new Promise(async (resolve) => {
      let dbStations = await getAllStations();
      let station = dbStations.find((station) => {
        return station.google_id === stationData.results[idx].place_id;
      });
      resolve(station);
    });
  };

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

  const checkAndAddToDB = (bluDBStation, mapDataTemp, idx) => {
    return new Promise(async (resolve) => {
      let profile = await getProfile();
      if (bluDBStation === undefined && runOnce === false && profile.username ) { // if not in db and logged in
        await createStation(
          `${stationData.results[idx].name}`,
          0,
          0,
          stationData.results[idx].place_id
        );
        let newbluDBStation = await findStationInDB(idx);
        mapDataTemp[idx].fuelInfo =
          newbluDBStation !== undefined
            ? newbluDBStation
            : mapDataTemp[idx].fuelInfo;
        setRunOnce(true);
      } else if (!profile.username && runOnce === false && bluDBStation !== undefined) { // if is in db and not logged in
        mapDataTemp[idx].fuelInfo = bluDBStation;
        setRunOnce(true);
      } else if (profile.username && runOnce === false && bluDBStation !== undefined) { // is logged in and is in the db
        mapDataTemp[idx].fuelInfo = bluDBStation;
        setRunOnce(true);
      } 
      else if (runOnce === false){ // if not in the db and not logged in
        mapDataTemp[idx].fuelInfo = {
          name: stationData.results[idx].name,
          petrol: '0',
          diesel: '0',
          google_id: stationData.results[idx].place_id,
        }
      }
      let mapDataDeepCopy = JSON.parse(JSON.stringify(mapDataTemp));
      
      resolve(mapDataDeepCopy);
    });
  };

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
        let updatedMapData = await checkAndAddToDB(bluDBStation, mapDataTemp, idx);
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

  useEffect(() => {
    setDieselLayer(new ColumnLayer({
      id: "diesel-column-layer",
      data: mapData,
      dataComparator: (newData, oldData) => false,
      diskResolution: 12,
      radius: 25,
      extruded: true,
      pickable: true,
      elevationScale: 5000,
      getPosition: (d) => [d.coordinates[0] + 0.0005, d.coordinates[1] + 0.0005],
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
    }));
    setPetrolLayer(new ColumnLayer({
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
    }));
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
      {hoverInfo && (
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
