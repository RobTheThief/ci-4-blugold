import React, { useEffect, useState } from 'react'
import DeckGL from 'deck.gl';
import { IconLayer } from 'deck.gl';
import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {
    getStationLocationData
} from '../dbAPIRequests'

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -6.267469638550943,
    latitude: 53.34523915464418,
    zoom: 13,
    pitch: 45,
    bearing: 0
};

const ICON_LAYER_DATA = [{ name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-6.263469638550943, 53.34521353452406] },]

const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
}

export default function DeckSnapshot() {
    const [stationData, setStationData] = useState();
    const [mapData, setMapData] = useState(); 

    const ICON_LAYER = new IconLayer({
        id: 'icon-layer',
        data: mapData,
        pickable: true,
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',

        sizeScale: 15,
        getPosition: d => d.coordinates,
        getSize: d => 5,
        getColor: d => [Math.sqrt(d.exits), 140, 0]
    });

    const fetchAndSetStationData = async () => {
        setStationData(await getStationLocationData('53.34523915464418,-6.267469638550943', '100000'))
    }

    useEffect(() => {
        fetchAndSetStationData();
    }, [])

    useEffect(() => {
        let mapData = []
        stationData && stationData.results.forEach((station, idx )=> {
            mapData.push(station)
            mapData[idx].coordinates = [station.geometry.location.lng, station.geometry.location.lat]
        });
        setMapData(mapData)
        console.log({mapData})
    }, [stationData])



    return (
        <>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={ICON_LAYER}
            >
                <Map
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09"
                    //mapStyle="mapbox://styles/mapbox/streets-v11"
                />
            </DeckGL>
        </>
    )
}
