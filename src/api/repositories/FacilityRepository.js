import axios from "axios";
import HttpClient from "../util/HttpClient";

export default class FacilityRepository {
  _instance;
  _httpClient;

  constructor() {
    this._httpClient = new HttpClient();
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new FacilityRepository();
    }
    return this._instance;
  }

  async fetchFacilities() {
    const response = await axios.get("/facilities");
    return response.data;
  }

  async updateFacility(
    name,
    lon,
    lat,
    description,
    templateId,
    customFields,
    id
  ) {
    const data = {
      name: name,
      lon: lon,
      lat: lat,
      description: description,
      customFields: customFields,
      templateId: templateId
    };
    const response = await axios.put("/facilities" + "/" + id, data);
    return response;
  }
}
