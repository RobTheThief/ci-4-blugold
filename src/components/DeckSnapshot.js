import React, { useEffect, useState } from "react";
import DeckGL, { ColumnLayer, FlyToInterpolator } from "deck.gl";
import { IconLayer } from "deck.gl";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getStationLocationData,
  createStation,
  getAllStations,
} from "../dbAPIRequests";
import BluTooltip from "./BluTooltip";

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

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
  const [deckMapData, setDeckMapData] = useState();

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

  const handleTestClick = () => {
    let mapDataDeepCopy = JSON.parse(JSON.stringify(mapData));
    setMapData({ mapData });
    console.log(mapDataDeepCopy, mapData);
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
    return await handleFindStationInDBAsync(idx);
  };

  const checkAndAddToDB = (bluDBStation, mapDataTemp, idx) => {
    return new Promise(async (resolve) => {
      if (
        bluDBStation === undefined &&
        (mapData === undefined || mapData[0] === undefined)
      ) {
        createStation(
          `${stationData.results[idx].name}`,
          1.85,
          1.96,
          stationData.results[idx].place_id
        );
        mapDataTemp[idx].fuelInfo = {
          petrol: "0",
          diesel: "0",
        };
      } else {
        mapDataTemp[idx].fuelInfo = bluDBStation;
      }
      let mapDataDeepCopy = JSON.parse(JSON.stringify(mapDataTemp));
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
    fetchAndSetStationData();
  }, []);

  useEffect(() => {
    focusView();
  }, [longView, latView]);

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
            mapStyle="mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09"
            //mapStyle="mapbox://styles/mapbox/streets-v11"
          />
          <button
            style={{ position: "absolute", right: "50%" }}
            onClick={handleTestClick}
          >
            PRESS TO TEST
          </button>
        </DeckGL>
      )}
    </>
  );
}
