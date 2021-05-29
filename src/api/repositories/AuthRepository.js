import axios from "axios";
import HttpClient from "../util/HttpClient";

export default class AuthRepository {
  _instance;
  _httpClient;

  constructor() {
    this._httpClient = new HttpClient();
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new AuthRepository();
    }
    return this._instance;
  }

  async login(email, password) {
    const data = { email: email, password: password };
    const response = await axios.post("/login", data);
    return response;
  }

  async registration(firstName, lastName, email, password) {
    const data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    });

    const response = await axios.post("/register", data);

    return response;
  }

  async logout() {
    const response = await axios.post("/logout");
    console.log(response);
    return response;
  }
}
