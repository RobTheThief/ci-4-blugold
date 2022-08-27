import React, { useEffect, useState } from 'react'
import {
    getStation,
    getStationLocationData
} from '../dbAPIRequests'

export default function SearchStationSidebar({ stationData, setStationData, longView, setLongView, latView, setLatView }) {

    const [stationName, setStationName] = useState();
    const [area, setArea] = useState();
    const [long, setLong] = useState();
    const [lat, setLat] = useState();
    const [radius, setRadius] = useState();

    const handleSearchArea = () => async (e) => {
        console.log({ lat, long, location, radius, area })
        let location = `${lat},${long}`
        setStationData(await getStationLocationData(location, `${radius}`, 'fuel'))
        console.log('location')

    }

    const handleSearchStation = () => {

    }

    useEffect(() => {
        setLongView(long);
        setLatView(lat);
    }, [stationData])


    return (
        <div className='search-station-ui-wrapper sidebar-ui'>

            <div className='search-form ui-form'>
                <div className='btn-input-container'>
                    <label>Station name<br />
                        <input type="text" onChange={(e) => setStationName(e.target.value)} />
                    </label>
                    <button className='go-btn' onClick={handleSearchStation}>Go</button>
                </div>
                <div className='btn-input-container'>
                    <label>Area<br />
                        <input type="text" onChange={(e) => setArea(e.target.value)} />
                    </label>
                    <button className='go-btn' onClick={handleSearchArea} >Go</button>
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
                    <button className='go-btn' onClick={handleSearchArea}>Go</button>
                </div>
            </div>
        </div>
    )
}
