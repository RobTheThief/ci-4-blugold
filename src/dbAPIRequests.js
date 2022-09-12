function createStation(station, petrolPrice, dieselPrice, googleId, updatedBy='me-dev') {
  fetch(`/api/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        "station": station,
        "petrol": petrolPrice,
        "diesel": dieselPrice,
        "updated_by": updatedBy,
        "google_id": googleId
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
  fetch(`/api/update/${id}/`, {
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
  fetch(`/api/delete/${id}/`, {
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
  fetch(`/api/${id}/`, {
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

const getAllStations = () => {
  return new Promise(async resolve => {
    try {
      const response = await fetch(`/api/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const responseJson = await response.json(); //extract JSON from the http response
      
      console.log(responseJson)

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  })
};

/* location in format of: '53.46473616374262,-10.688388878528719' radius in meters, name of place as a string, default='fuel' */
const getStationLocationData = (radius, location, name='fuel') => {
  console.log({location, radius, name})
  return new Promise(async resolve => {
    try {
      const response = await fetch(`places-api-location-request/${name}/${radius}/${location}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseJson = await response.json(); //extract JSON from the http response
      
      console.log(responseJson.results)

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  })
};

/*  area as a string */
const getAreaData = (area) => {
  console.log({area})
  return new Promise(async resolve => {
    try {
      const response = await fetch(`places-api-area-request/${area}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseJson = await response.json(); //extract JSON from the http response
      
      console.log(responseJson)

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
  getStationLocationData,
  getAreaData,
  getAllStations
}