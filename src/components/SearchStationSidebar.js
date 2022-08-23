import React, { useState } from 'react'
import {
    getStation,
    getStationLocationData
} from '../dbAPIRequests'

export default function SearchStationSidebar() {

    const [stationName, setStationName] = useState();
    const [area, setArea] = useState();
    const [long, setLong] = useState();
    const [lat, setLat] = useState();

    const handleSearchStation = () => {
        getStationLocationData()
    }

    return (
        <div className='search-station-ui-wrapper sidebar-ui'>

            <form className='search-form ui-form'>
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
                    <button className='go-btn' >Go</button>
                </div>
                <div className='long-lat-search-group'>
                    <label>Long<br />
                        <input className='coord-input' type="text" onChange={(e) => setLong(e.target.value)} />
                    </label>
                    <label>lat<br />
                        <input className='coord-input' type="text" onChange={(e) => setLat(e.target.value)} />
                    </label>
                    <button className='go-btn' >Go</button>
                </div>
            </form>
        </div>
    )
}
