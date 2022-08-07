import logo from './logo.svg';
import './App.css';
import DeckGL from 'deck.gl';
import { LineLayer } from 'deck.gl';
import Map from 'react-map-gl';
import { useEffect } from 'react';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

const data = [
  { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

function App() {
  let linelayer = new LineLayer({ id: 'line-layer', data })

 useEffect(() => {
  
 },[])

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={linelayer}
    >
     <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      />
    </DeckGL>
  );
}

export default App;
