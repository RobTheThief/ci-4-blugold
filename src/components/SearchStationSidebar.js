import React, { useEffect, useState } from 'react'
import {
    getStation,
    getStationLocationData,
    getAreaData
} from '../dbAPIRequests'

export default function SearchStationSidebar({ stationData, setStationData, longView, setLongView, latView, setLatView, viewState, setViewState }) {

    const [area, setArea] = useState();
    const [long, setLong] = useState();
    const [lat, setLat] = useState();
    const [radius, setRadius] = useState();
    const [areaData, setAreaData] = useState();

    const handleSearchLocation = async (e) => {
        let location = `${lat},${long}`
        location && radius && setStationData(await getStationLocationData(`${radius}`, location, 'fuel'))
    }

    const handleSearchStationArea = async (e) => {
        await getAreaData(area)
            .then(data => { setLat(data.candidates[0].geometry.location.lat); return data })
            .then(data => { setLong(data.candidates[0].geometry.location.lng); return data })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        setLongView(long);
        setLatView(lat);
    }, [stationData])

    useEffect(() => {
        console.log({lat, long})
        setRadius(100010)
        lat && long && handleSearchLocation();
    }, [lat, long])

    return (
        <div className='search-station-ui-wrapper sidebar-ui'>

            <div className='search-form ui-form'>
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
