import React from 'react'

export default function BluTooltip({ hoverInfo }) {
    return (
        <ul className='tooltip'>
            <li>{hoverInfo.object.name}</li>
            <li>{hoverInfo.object.vicinity}</li>
            <br />
            <li>
                {hoverInfo.object.opening_hours && hoverInfo.object.opening_hours.open_now ?
                    'Open: Yes' : hoverInfo.object.opening_hours ?
                        'Open: No' : 'No opening hours set'
                }
            </li>
            <br />
            {hoverInfo.object.fuelInfo.petrol === '0' ?
                (<li>Petrol: no information</li>) :
                (<li>Petrol: €{hoverInfo.object.fuelInfo.petrol} on {hoverInfo.object.fuelInfo.updated}</li>)}
            {hoverInfo.object.fuelInfo.diesel === '0' ?
                (<li>Diesel: no information</li>) :
                (<li>Diesel: €{hoverInfo.object.fuelInfo.diesel} on {hoverInfo.object.fuelInfo.updated}</li>)}
            <br />
            {hoverInfo.object.fuelInfo.petrol !== '0' ? (<li>Updated by: {hoverInfo.object.fuelInfo.updated_by}</li>) : (<li>Updated by: Not updated yet</li>)}
        </ul>
    )
}