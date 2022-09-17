import React from "react";
import PetrolLegendDot from "./PetrolLegendDot";
import DieselLegendDot from "./DieselLegendDot";

/**
 * Renders the map tooltip for the stations that show on hover.
 * Accepts hoverInfo as a prop.
 * @param {object} param0
 * @returns jsx
 */
export default function BluTooltip({ hoverInfo }) {
  return (
    <ul className='tooltip'>
      <li>{hoverInfo.object.name}</li>
      <li>{hoverInfo.object.vicinity}</li>
      <br />
      <li>
        {hoverInfo.object.opening_hours &&
        hoverInfo.object.opening_hours.open_now
          ? "Open: Yes"
          : hoverInfo.object.opening_hours
          ? "Open: No"
          : "No opening hours set"}
      </li>
      <br />
      {hoverInfo.object.fuelInfo.petrol === "0" ? (
        <li className='tooltip-list-item'>
          <PetrolLegendDot /> Petrol: no information
        </li>
      ) : (
        <li className='tooltip-list-item'>
          <PetrolLegendDot /> Petrol: €{hoverInfo.object.fuelInfo.petrol} on{" "}
          {hoverInfo.object.fuelInfo.updated}
        </li>
      )}
      {hoverInfo.object.fuelInfo.diesel === "0" ? (
        <li className='tooltip-list-item'>
          <DieselLegendDot /> Diesel: no information
        </li>
      ) : (
        <li className='tooltip-list-item'>
          <DieselLegendDot /> Diesel: €{hoverInfo.object.fuelInfo.diesel} on{" "}
          {hoverInfo.object.fuelInfo.updated}
        </li>
      )}
      <br />
      {hoverInfo.object.fuelInfo.petrol !== "0" ? (
        <li>Updated by: {hoverInfo.object.fuelInfo.updated_by}</li>
      ) : (
        <li>Updated by: Not updated yet</li>
      )}
    </ul>
  );
}
