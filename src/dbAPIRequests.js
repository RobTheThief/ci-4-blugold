import getCookie from './helpers';

const CSRFTOKEN = getCookie();

function createStation(station, petrolPrice, dieselPrice, googleId, updatedBy = 'me-dev') {
  return new Promise(async resolve => {
    try {
      fetch(`/api/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
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
        resolve()
    } catch (error) {
      resolve()
      console.log(error)
    }
  })
}

function updateStation(id, station, google_id, updated_by, petrolPrice, dieselPrice) {
  console.log(id, station, google_id, updated_by, petrolPrice, dieselPrice)
  return new Promise(async resolve => {
    try {
      var formdata = new FormData();
      formdata.append("station", station);
      formdata.append("petrol", petrolPrice);
      formdata.append("diesel", dieselPrice);
      formdata.append("google_id", google_id);
      formdata.append("updated_by", updated_by);

      const response = await fetch(`/api/update/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
        },
        method: 'PUT',
        redirect: 'follow',
        body: formdata,
      })

      const responseJson = await response.json(); //extract JSON from the http response
      console.log(responseJson)

      resolve(responseJson);
    } catch (error) {
      console.log('error', error);
      resolve();
    }
  })
}

function deleteStation(id) {
  fetch(`/api/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': CSRFTOKEN,
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
      'Content-Type': 'application/json',
      'X-CSRFToken': CSRFTOKEN,
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
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
        },
      });

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  })
};

/* location in format of: '53.46473616374262,-10.688388878528719' radius in meters, name of place as a string, default='fuel' */
const getStationLocationData = (location, name = 'fuel') => {
  return new Promise(async resolve => {
    try {
      const response = await fetch(`places-api-location-request/${name}/${location}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
        },
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
  console.log({ area })
  return new Promise(async resolve => {
    try {
      const response = await fetch(`places-api-area-request/${area}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
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

export {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData,
  getAreaData,
  getAllStations
}