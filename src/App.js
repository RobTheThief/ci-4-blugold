import logo from './logo.svg';
import './App.css';
import DeckGL from 'deck.gl';
import { LineLayer } from 'deck.gl';
import Map from 'react-map-gl';
import { useEffect } from 'react';
import useSWR from 'swr';
import "mapbox-gl/dist/mapbox-gl.css";

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

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  let linelayer = new LineLayer({ id: 'line-layer', data })

  const { data: apiData, error: apiError } = useSWR('https://api.reliefweb.int/v1/reports?appname=apidoc&limit=2', fetcher, { refreshInterval: 10000 })
  const { data: bluApiData, error: bluError } = useSWR('https://8000-robthethief-ci4blugold-gsro7huqcm1.ws-eu59.gitpod.io/api/', fetcher, { refreshInterval: 10000 })

  useEffect(() => {
    console.log(apiData, bluApiData)
 },[apiData, bluApiData])

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
