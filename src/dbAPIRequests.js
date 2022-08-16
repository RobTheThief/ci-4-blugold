import baseUrl from './baseUrl';

function createStation(station, petrolPrice, dieselPrice) {
    bluConsoleLog('running', new Error().lineNumber);
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
    bluConsoleLog('running');
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
    bluConsoleLog('running');
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
    bluConsoleLog('running');
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

  export {
    getStation,
    deleteStation,
    updateStation,
    createStation,
  }