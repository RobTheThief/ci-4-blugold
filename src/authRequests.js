const login = (user, pass) => {
  return new Promise(async resolve => {
    var formdata = new FormData();
    formdata.append("username", user);
    formdata.append("password", pass);

    var requestOptions = {
      method: 'POST',
      body: formdata,
    };
    try {
      const response = fetch(`/login/`, requestOptions)
         .then(response => response)
         .then(result => console.log(result))
         .catch(error => console.log('error', error));
      resolve(response)
    } catch (error) {
      console.log(error);
      resolve()
    }
  })
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

  fetch(`/register/`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const logout = () => {
  var requestOptions = {
    credentials: "include",
    method: 'POST',
  };

  fetch(`/logout/`, requestOptions)
    .then(response => response)
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const getProfile = () => {
  return new Promise(async resolve => {

    try {
      const response = await fetch(`/profile/`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        method: 'GET',
      })

      const responseJson = await response.json(); //extract JSON from the http response

      console.log(responseJson)

      resolve(responseJson);
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