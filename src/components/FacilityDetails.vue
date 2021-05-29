<template>
  <q-card bordered class="my-card">
    <q-card-section dark bordered class="bg-teal text-white">
      {{ item.name }} #ID: {{ item.Id }}
    </q-card-section>
    <q-card-section dark bordered class="bg-grey-1 my-card">
      <q-spinner
        v-if="waitingForPicture"
        color="primary"
        size="9em"
        :thickness="2"/>
      <img
        v-if="!waitingForPicture"
        v-bind:src="facilityImage"
        :alt="alternativeText"
        style="width:250px;height:300px; margin-top:10px"
        class="center"
    /></q-card-section>
    <q-card-section dark bordered class="bg-grey-1 my-card">
      Name: {{ item.name }} #ID: {{ item.Id }}
      <br />
      Long:{{ item.lat }}
      <br />
      Lat:{{ item.lon }}
      <br />
      <div v-if="item.distance != undefined">
        Distanz: {{ item.distance.toFixed(3) }} km
      </div>
      <div class="q-pa-md" style="max-width: 300px">
        <q-icon />
        Anmerkungen
        <q-input v-model="newDescription" filled type="textarea">
          <!-- <q-btn style="position:absolute; bottom: 8px; right: 20px;" round color="primary" icon="attach_file" size="md" /> -->
        </q-input>
      </div>
      <!-- Bild hochladen. Drag and drop geht auch -->
      <div v-if="onLine">
        <q-uploader
          label="Bild hochladen"
          accept=".gif, .png, .jpg, image/*"
          @rejected="onRejected"
          max-total-size="1000000"
          :factory="factoryFn"
        />
      </div>
    </q-card-section>
    <q-card-actions dark bordered class="bg-grey-1 my-card">
      <q-btn color="green" @click="updateFacility()">Speichern</q-btn>
      <br />
      <div v-if="isUserAdmin()">
        <q-btn color="red" @click="confirm = true">Löschen</q-btn>
      </div>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm">Sind Sie sich sicher ?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Abbrechen" color="primary" v-close-popup />
            <q-btn
              flat
              label="Löschen"
              color="primary"
              v-close-popup
              @click="deleteFacility(item.Id)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div v-if="item.Id != undefined" style="display:none">
        <qriously :value="item.Id.toString()"></qriously>
      </div>
      <q-btn
        color="blue-grey-10"
        outline
        label="Download QR-Code"
        @click="downloadCanvas"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import Qriously from "v-qriously";
import { QrcodeStream } from "vue-qrcode-reader";
export default {
  components: {
    Qriously
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    onLine: {
      type: Boolean,
      required: true
    },
    curLat: {
      type: Number,
      required: false
    },
    curLon: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      selected_file: "",
      check_if_document_upload: false,
      confirm: false,
      facilityImage: undefined,
      newDescription: this.item.description,
      waitingForPicture: true,
      alternativeText:
        "Bild zu " + this.item.name + " konnte nicht geladen werden"
    };
  },
  mounted() {
    this.addDistanceToItem();
    this.loadFacilityimage();
  },
  methods: {
    /**
     * @description add the distance to a facility
     * @param facility item - item to add distance to
     */
    addDistanceToItem() {
      if (this.curLat == undefined) {
        return;
      }
      var distance = this.calcDist(
        this.item.lat,
        this.item.lon,
        this.curLat,
        this.curLon
      );
      this.item.distance = distance;
    },
    calcDist(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = this.toRad(lat2 - lat1);
      var dLon = this.toRad(lon2 - lon1);
      var lat1 = this.toRad(lat1);
      var lat2 = this.toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    },
    toRad(Value) {
      return (Value * Math.PI) / 180;
    },
    async isUserAdmin() {
      const response = await axios.get("/getuserrole/").catch(err => {
        console.log(err);
      });
      if (response.data.role === "admin") {
        return true;
      } else {
        return false;
      }
    },
    factoryFn(file) {
      const fileData = new FormData();
      fileData.append("image", file[0]);
      fileData.append("description", "test");
      fileData.append("facilityId", this.item.Id);
      return new Promise((resolve, reject) => {
        axios
          .post("/images", fileData)
          .then(resp => {
            console.log(resp);
            this.$emit("updatedFacility", this.item);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    facilityDescription(desc) {
      this.imageDescription = file[0];
      this.check_if_document_upload = true;
    },
    // Facility wird aus dem Backend gelöscht
    deleteFacility(id) {
      axios
        .delete("/facilities/" + id)
        .then(data => {
          this.$emit("deletedFacility", this.item);
        })
        .catch(err => {
          console.log(err);
        });
    },
    ...mapActions({ updateFacilityFunction: "facilities/updateFacility" }),
    async loadFacilityimage() {
      if (typeof this.item.images[0] == "undefined") {
        this.waitingForPicture = false;
        return;
      }
      if (typeof this.item.image != "undefined") {
        this.facilityImage = this.item.image;
        this.waitingForPicture = false;
        return;
      }
      console.log("Bildrequest sent");
      const response = await axios
        .get("/images/" + this.item.images[this.item.images.length - 1].id, {
          responseType: "arraybuffer"
        })
        .catch(err => {
          this.waitingForPicture = false;
        });
      this.facilityImage = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      this.waitingForPicture = false;
      this.facilityImage = "data:image/jpeg;base64," + this.facilityImage;
      this.$emit("addPicture", [this.item.Id, this.facilityImage]);
    },
    async updateFacility() {
      const toSend = {
        name: this.item.name,
        lon: this.item.lon,
        lat: this.item.lat,
        description: this.newDescription,
        templateId: this.item.templateId,
        customFields: this.item.customFields,
        Id: this.item.Id
      };
      if (!this.onLine) {
        this.$emit("updateList", toSend);
        return;
      }
      const response = await this.updateFacilityFunction(toSend).then(
        response => {
          this.$emit("updatedFacility", this.item);
        },
        error => {
          console.log(error);
        }
      );
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        type: "negative",
        message:
          "Bitte darauf achten, dass das Bild eine maximale Größe von 1mb hat und ein .jpg oder .png ist",
        icon: "warning"
      });
    },
    downloadCanvas() {
      const canvas = document.getElementsByTagName("canvas");
      const link = document.createElement("a");
      link.download = "QRCode.png";
      link.href = canvas[0].toDataURL();
      link.click();
    }
  }
};
</script>
