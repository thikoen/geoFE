import AuthRepository from "../../api/repositories/AuthRepository";

export function login({ commit }, loginCrediential) {
  return new Promise((resolve, reject) => {
    const authRepo = AuthRepository.getInstance();

    authRepo
      .login(loginCrediential.email, loginCrediential.password)
      .then(response => {
        if (!response) {
          reject();
        }

        commit("setUsername", response.email);
        commit("setAuthToken", response.authToken);
        console.log(response);
        resolve();
      })
      .catch(err => {
        console.log("Failed to login:", err);
        reject(err);
      });
  });
}

export function logout({ commit }) {
  return new Promise((resolve, reject) => {
    const authRepo = AuthRepository.getInstance();

    authRepo
      .logout()
      .then(response => {
        sessionStorage.clear();

        resolve();
      })
      .catch(err => {
        console.log("Failed to logout: ", err);
        reject(err);
      });
  });
}

export function registration({ commit }, registrationCrediential) {
  return new Promise((resolve, reject) => {
    const authRepo = AuthRepository.getInstance();
    //vnametext, nnametext, emailtext, pwtext)
    authRepo
      .registration(
        registrationCrediential.firstName,
        registrationCrediential.lastName,
        registrationCrediential.email,
        registrationCrediential.password
      )
      .then(response => {
        if (!response) {
          reject();
        }

        commit("setUsername", response.username);
        commit("setAuthToken", response.authToken);

        resolve();
      })
      .catch(err => {
        console.log("Failed to registrate:", err);
        reject(err);
      });
  });
}
