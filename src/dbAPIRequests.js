import baseUrl from './baseUrl';
import { bluConsoleLog } from './helpers';

function createStation(station, petrolPrice, dieselPrice) {
  fetch(`${baseUrl}/api/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        "station": station,
        "petrol": petrolPrice,
        "diesel": dieselPrice
      })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .catch(error => {
      console.log('error', error);
    })
}

function updateStation(id, station, petrolPrice, dieselPrice) {
  fetch(`${baseUrl}/api/update/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        "station": station,
        "petrol": petrolPrice,
        "diesel": dieselPrice
      })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .catch(error => {
      console.log('error', error);
    })
}

function deleteStation(id) {
  fetch(`${baseUrl}/api/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .catch(error => {
      console.log('error', error);
    })
}

function getStation(id) {
  fetch(`${baseUrl}/api/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .catch(error => {
      console.log('error', error);
    })
}

/* location in format of: '53.46473616374262,-10.688388878528719' radius in meters, name of place as a string, default='fuel' */
const getStationLocationData = (location, radius, name='fuel') => {
  return new Promise(async resolve => {
    try {
      const response = await fetch(`https://8000-robthethief-ci4blugold-gsro7huqcm1.ws-eu62.gitpod.io/externalapiequest/${location}/${radius}/${name}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  })
};

export {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData
}