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
  columnClickEvent,
}) {
  const [hoverInfo, setHoverInfo] = useState("");
  const [runOnce, setRunOnce] = useState(false);

  let petrolColumnLayer = new ColumnLayer({
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
  });

  let dieselColumnLayer = new ColumnLayer({
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
  });

  const layers = [petrolColumnLayer, dieselColumnLayer];

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
      if (bluDBStation === undefined && runOnce === false) {
        await createStation(
          `${stationData.results[idx].name}`,
          0,
          0,
          stationData.results[idx].place_id
        );
        let newbluDBStation = await findStationInDB(idx);
        newbluDBStation !== undefined && console.log(await newbluDBStation);
        mapDataTemp[idx].fuelInfo =
          newbluDBStation !== undefined
            ? newbluDBStation
            : mapDataTemp[idx].fuelInfo;
      } else {
        mapDataTemp[idx].fuelInfo = bluDBStation;
      }
      let mapDataDeepCopy = JSON.parse(JSON.stringify(mapDataTemp));
      setRunOnce(true);
      setMapData(mapDataDeepCopy);
      resolve();
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
        await checkAndAddToDB(bluDBStation, mapDataTemp, idx);
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
    setRunOnce(false);
  }, [mapData]);

  useEffect(() => {
    fetchAndSetStationData();
  }, []);

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
            //mapStyle="mapbox://styles/mapbox/streets-v11"
          />
        </DeckGL>
      )}
    </>
  );
}
