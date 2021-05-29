import FacilityRepository from "../../api/repositories/FacilityRepository";

export function fetchFacilities({ commit }) {
  return new Promise((resolve, reject) => {
    const facilityRepo = FacilityRepository.getInstance();

    facilityRepo
      .fetchFacilities()
      .then(response => {
        if (!response) {
          reject();
        }
        resolve(response);
      })
      .catch(err => {
        console.log("Konnte Facilities nicht laden:", err);
        reject(err);
      });
  });
}

export function updateFacility({ commit }, updateData) {
  return new Promise((resolve, reject) => {
    const facilityRepo = FacilityRepository.getInstance();

    facilityRepo
      .updateFacility(
        updateData.name,
        updateData.lon,
        updateData.lat,
        updateData.description,
        updateData.templateId,
        updateData.customFields,
        updateData.Id
      )
      .then(response => {
        if (!response) {
          reject();
        }
        resolve(response);
      })
      .catch(err => {
        console.log("Konnte Facilitie nicht aktualisieren:", err);
        reject(err);
      });
  });
}
