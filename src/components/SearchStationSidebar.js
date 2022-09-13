import React, { useEffect, useState } from 'react'
import {
    getStationLocationData,
    getAreaData
} from '../dbAPIRequests'

export default function SearchStationSidebar({ stationData, setStationData, longView, setLongView, latView, setLatView, viewState, setViewState }) {

    const [area, setArea] = useState();

    const [long, setLong] = useState();
    const [lat, setLat] = useState();

    const searchLocation = async (e) => {
        console.log('yes');
        let location = `${lat},${long}`
        location && setStationData(await getStationLocationData(location, 'fuel'))
    }

    const handleSearchStationArea = async (e) => {
        await getAreaData(area)
            .then(data => { setLat(data.candidates[0].geometry.location.lat); console.log('yes'); return data })
            .then(data => { setLong(data.candidates[0].geometry.location.lng); console.log('and yes'); return data })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        setLongView(long);
        setLatView(lat);
    }, [stationData])

    useEffect(() => {
        lat && long && searchLocation();
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
            </div>
        </div>
    )
}
