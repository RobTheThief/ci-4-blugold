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
        </ul>
    )
}
