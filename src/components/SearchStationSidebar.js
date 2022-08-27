import React, { useEffect, useState } from 'react'
import {
    getStation,
    getStationLocationData,
    getAreaData
} from '../dbAPIRequests'

export default function SearchStationSidebar({ stationData, setStationData, longView, setLongView, latView, setLatView }) {

    const [stationName, setStationName] = useState();
    const [area, setArea] = useState();
    const [long, setLong] = useState();
    const [lat, setLat] = useState();
    const [radius, setRadius] = useState();
    const [areaData, setAreaData] = useState();

    const handleSearchLocation = async (e) => {
        let location = `${lat},${long}`
        location && radius && setStationData(await getStationLocationData(`${radius}`, location, 'fuel'))
        console.log('location')

    }

    const handleSearchStationName = async (e) => {

    }

    const handleSearchStationArea = async (e) => {
        setAreaData(await getAreaData(area))
    }

    useEffect(() => {
        setLongView(long);
        setLatView(lat);
    }, [stationData])

    useEffect(() => {
        console.log(areaData && areaData.candidates[0].geometry.location)
    }, [areaData])

    return (
        <div className='search-station-ui-wrapper sidebar-ui'>

            <div className='search-form ui-form'>
                <div className='btn-input-container'>
                    <label>Station name<br />
                        <input type="text" onChange={(e) => setStationName(e.target.value)} />
                    </label>
                    <button className='go-btn' onClick={handleSearchStationName}>Go</button>
                </div>
                <div className='btn-input-container'>
                    <label>Area<br />
                        <input type="text" onChange={(e) => setArea(e.target.value)} />
                    </label>
                    <button className='go-btn' onClick={handleSearchStationArea} >Go</button>
                </div>
                <label>Radius<br />
                    <input type="text" onChange={(e) => setRadius(e.target.value)} />
                </label>
                <div className='long-lat-search-group'>
                    <label>Long<br />
                        <input className='coord-input' type="text" onChange={(e) => setLong(e.target.value)} />
                    </label>
                    <label>lat<br />
                        <input className='coord-input' type="text" onChange={(e) => setLat(e.target.value)} />
                    </label>
                    <button className='go-btn' onClick={handleSearchLocation}>Go</button>
                </div>
            </div>
        </div>
    )
}
