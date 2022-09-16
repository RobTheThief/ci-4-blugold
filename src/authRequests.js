import { getCookie } from './helpers';

const CSRFTOKEN = getCookie();

const login = (user, pass) => {
  return new Promise(async (resolve) => {
    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);

    var requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRFTOKEN,
      },
      method: "POST",
      body: formdata,
    };
    try {
      const response = await fetch(`/login/`, requestOptions);

      resolve(response);
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
};

const register = (user, pass, pass2, email, firstName, lastName) => {
  return new Promise(async (resolve) => {
    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);
    formdata.append("password2", pass2);
    formdata.append("email", email);
    formdata.append("first_name", firstName);
    formdata.append("last_name", lastName);

    var requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRFTOKEN,
      },
      credentials: "include",
      method: "POST",
      body: formdata,
    };
    try {
      let response = await fetch(`/register/`, requestOptions);

      let responseJson = await response.json();

      resolve(responseJson)
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
};

const logout = () => {
  var requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': CSRFTOKEN,
    },
    credentials: "include",
    method: "POST",
  };

  fetch(`/logout/`, requestOptions)
    .then((response) => response)
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

const getProfile = () => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`/profile/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFTOKEN,
        },
        credentials: "include",
        method: "GET",
      });

      const responseJson = await response.json(); //extract JSON from the http response

      console.log(responseJson);

      resolve(responseJson);
    } catch (error) {
      resolve(error);
    }
  });
};

export { getProfile, logout, register, login };
