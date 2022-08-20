import baseUrl from './baseUrl';

const login = (user, pass) => (e) => {
  var formdata = new FormData();
  formdata.append("username", user);
  formdata.append("password", pass);

  var requestOptions = {
    method: 'POST',
    body: formdata,
  };

  fetch(`${baseUrl.url}/login/`, requestOptions)
    .then(response => response)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const register = (user, pass, pass2, email, firstName, lastName) => (e) => {
  var formdata = new FormData();
  formdata.append("username", user);
  formdata.append("password", pass);
  formdata.append("password2", pass2);
  formdata.append("email", email);
  formdata.append("first_name", firstName);
  formdata.append("last_name", lastName);

  var requestOptions = {
    credentials: "include",
    method: 'POST',
    body: formdata,
  };

  fetch(`${baseUrl.url}/register/`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const logout = () => {
  var requestOptions = {
    credentials: "include",
    method: 'POST',
  };

  fetch(`${baseUrl.url}/logout/`, requestOptions)
    .then(response => response)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const getProfile = () => {
  return new Promise(async resolve => {
    var requestOptions = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: 'GET',
    };
    try {
      let result = await fetch(`${baseUrl.url}/profile/`, requestOptions)
        .then(response => response.json())
      resolve(result.detail);
    } catch (error) {
      resolve(error)
    }
  })
}

export {
  getProfile,
  logout,
  register,
  login
}