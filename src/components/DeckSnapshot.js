import React, { useEffect, useState } from 'react'
import DeckGL, { ColumnLayer, FlyToInterpolator } from 'deck.gl';
import { IconLayer } from 'deck.gl';
import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {
    getStationLocationData
} from '../dbAPIRequests'
import BluTooltip from './BluTooltip';

const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
}

export default function DeckSnapshot({ mapData, setMapData, stationData, setStationData, longView, setLongView, latView, setLatView, viewState, setViewState }) {
    const [hoverInfo, setHoverInfo] = useState('');

    const iconLayer = new IconLayer({
        id: 'icon-layer',
        data: mapData,
        pickable: true,
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',

        sizeScale: 15,
        getPosition: d => d.coordinates,
        getSize: d => 5,
        getColor: d => [Math.sqrt(d.exits), 140, 0],
        onHover: info => updateHoverInfo(info)
    });

    const petrolColumnLayer = new ColumnLayer({
        id: 'petrol-column-layer',
        data: mapData,
        diskResolution: 12,
        radius: 25,
        extruded: true,
        pickable: true,
        elevationScale: 5000,
        getPosition: d => d.coordinates,
        getFillColor: d => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: d => 0.1,
        onHover: info => updateHoverInfo(info)
    });

    const dieselColumnLayer = new ColumnLayer({
        id: 'diesel-column-layer',
        data: mapData,
        diskResolution: 12,
        radius: 25,
        extruded: true,
        pickable: true,
        elevationScale: 5000,
        getPosition: d => [d.coordinates[0] + 0.0005, d.coordinates[1] + 0.0005],
        getFillColor: d => [48, 128, 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: d => 0.2,
        onHover: info => updateHoverInfo(info)
    });

    function focusView() {
        console.log({ longView, latView })
        if (longView && latView) {
            setViewState({
                longitude: longView,
                latitude: latView,
                zoom: 13.5,
                pitch: 45,
                bearing: 0,
                transitionDuration: 2000,
                transitionInterpolator: new FlyToInterpolator()
            })
        }
    }

    const updateHoverInfo = (info) => {
        setHoverInfo(info);
    }

    const fetchAndSetStationData = async () => {
        setStationData(await getStationLocationData('100000', '53.34523915464418,-6.267469638550943', 'fuel'))
    }

    useEffect(() => {
        fetchAndSetStationData();
    }, [])

    useEffect(() => {
        let mapData = []
        stationData && stationData.results.forEach((station, idx) => {
            mapData.push(station)
            mapData[idx].coordinates = [station.geometry.location.lng, station.geometry.location.lat]
        });
        setMapData(mapData)
        console.log({ mapData })

    }, [stationData])

    useEffect(() => {
        focusView();
    }, [longView, latView])
    
    return (
        <>
        {hoverInfo && (
            <div style={{ position: 'absolute', zIndex: 100000000, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y, color: 'white'}}>
                {hoverInfo && hoverInfo.object && (<BluTooltip hoverInfo={hoverInfo} />)}
            </div>)}
            <DeckGL
                initialViewState={viewState}
                onViewportChange={setViewState}
                controller={true}
                layers={[dieselColumnLayer, petrolColumnLayer]}
            >
                <Map
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09"
                //mapStyle="mapbox://styles/mapbox/streets-v11"
                />
                <button style={{ position: 'relative', left: '500px' }} onClick={focusView}>PRESS</button>
            </DeckGL>
        </>
    )
}
