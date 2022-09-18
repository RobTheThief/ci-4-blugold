import { getCookie } from "./helpers";

/**
 * Makes a POST request to create a station in the database.
 * @param {string} station
 * @param {string} petrolPrice
 * @param {string} dieselPrice
 * @param {string} googleId
 * @param {string} updatedBy
 * @returns promise
 */
function createStation(
  station,
  petrolPrice,
  dieselPrice,
  googleId,
  updatedBy = "me-dev"
) {
  return new Promise(async (resolve) => {
    try {
     let response = fetch(`/api/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie(),
        },
        body: JSON.stringify({
          station: station,
          petrol: petrolPrice,
          diesel: dieselPrice,
          updated_by: updatedBy,
          google_id: googleId,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .catch((error) => {
          console.log(error);
        });
      resolve(response);
    } catch (error) {
      resolve();
      console.log(error);
    }
  });
}

/**
 *
 * @param {int} id
 * @param {string} station
 * @param {string} google_id
 * @param {string} updated_by
 * @param {string} petrolPrice
 * @param {string} dieselPrice
 * @returns promise
 */
function updateStation(
  id,
  station,
  google_id,
  updated_by,
  petrolPrice,
  dieselPrice
) {
  return new Promise(async (resolve) => {
    try {
      var formdata = new FormData();
      formdata.append("station", station);
      formdata.append("petrol", petrolPrice);
      formdata.append("diesel", dieselPrice);
      formdata.append("google_id", google_id);
      formdata.append("updated_by", updated_by);

      await fetch(`/api/update/${id}/`, {
        headers: { "X-CSRFToken": getCookie() },
        method: "PUT",
        redirect: "follow",
        body: formdata,
      });

      resolve();
    } catch (error) {
      console.log(error);
      resolve();
    }
  });
}

/**
 * Deletes a station using the id.
 * @param {int} id 
 * @returns promise
 */
function deleteStation(id) {
  return new Promise(async (resolve) => {
    try {
      await fetch(`/api/delete/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie(),
        },
      });

      resolve();
    } catch (error) {
      console.log(error);
      resolve();
    }
  });
}

/**
 * Finds a station using the id.
 * If ok returns the station object.
 * @param {int} id
 */
function getStation(id) {
  fetch(`/api/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Gets an array of all stations in the database.
 * @returns promise, array
 */
const getAllStations = () => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`/api/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie(),
        },
      });

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  });
};

/**
 * Makes a request to the middleware which makes a request
 * to google places api to find fuel stations in a given coordinate
 * in a 3km radius.
 * @param {string} location
 * @param {string} name
 * @returns array, promise
 */
const getStationLocationData = (location, name = "fuel") => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(
        `places-api-location-request/${name}/${location}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      console.log(error);
      resolve();
    }
  });
};

/**
 * Makes a request to the middleware which makes a request
 * to google places api to find coordinates of a given area
 * @param {string} area
 * @returns array, promise
 */
const getAreaData = (area) => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`places-api-area-request/${area}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json(); //extract JSON from the http response

      resolve(responseJson);
    } catch (error) {
      alert(error);
      resolve();
    }
  });
};

export {
  getStation,
  deleteStation,
  updateStation,
  createStation,
  getStationLocationData,
  getAreaData,
  getAllStations,
};
