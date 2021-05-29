<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>
          <div>
            <q-avatar>
              <q-img :src="require('../assets/logo.svg')"></q-img>
            </q-avatar>
            Map
          </div>
        </q-toolbar-title>
        <a v-if="!onLine">
          <q-chip
            color="red"
            text-color="white"
            icon="signal_wifi_off"
            label="Offline-Mode"
          />
        </a>
        <q-btn
          v-if="onLine"
          stretch
          flat
          label="LOGOUT"
          @click="logoutFunction()"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="left" side="left" overlay elevated>
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList">
            <q-item
              :key="index"
              clickable
              :to="menuItem.link"
              :active="menuItem.label === 'Outbox'"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <div class="container">
        <div class="q-pl-md q-pt-sm q-pr-sm q-gutter-md">
          <q-btn
            @click="changeMap()"
            :color="getColour"
            id="id_SetCurPos"
            icon="style"
          />

          <q-btn
            @click="
              centerGeoLocation2();
              updateMap();
              centerMap();
            "
            :color="getColour"
            :label="updateMapString"
            id="id_UpdateMap"
            icon="refresh"
          />
          <q-btn-dropdown
            :color="getColour"
            :label="searchString"
            dropdown-icon="search"
          >
            <div class="toolbar">
              <q-list>
                <q-input
                  bottom-slots
                  v-model="ComponentName"
                  :disable="isIDbeingSearched()"
                  label="Name"
                >
                  <template v-slot:before> </template>
                </q-input>
                <q-input
                  bottom-slots
                  v-model="ComponentID"
                  label="ID"
                  @keypress="isNumber($event)"
                >
                  <template v-slot:before> </template>
                </q-input>
                <q-input
                  bottom-slots
                  v-model.number="perimeterInMeters"
                  label="Umkreis in Metern"
                  :disable="!posChanged"
                  @keypress="isNumber($event)"
                >
                  <template v-slot:before> </template>
                </q-input>
                <q-btn
                  color="positive"
                  label="Suchen"
                  @click="setNewList()"
                  id="id_componentSearch"
                />
                <!--<q-btn
                  color="positive"
                  label="Clear Markers"
                  @click="removeHighlighterAll()"
                  id="id_removeHighlighter"
                />-->
                <div v-if="this.flag">
                  <p style="color:red">Keine Treffer</p>
                </div>
                <div v-for="item in showList" :key="item.id">
                  <q-expansion-item
                    dense
                    dense-toggle
                    expand-separator
                    icon="house"
                    v-bind:label="item.name"
                  >
                    <q-card>
                      <a class="hover">
                        <q-card-section
                          @click="
                            setView(item.lat, item.lon);
                            addHighlighter(item);
                          "
                        >
                          Name: {{ item.name }}
                          <br />
                          ID: {{ item.id }}
                          <br />
                          Long:{{ item.lon }}
                          <br />
                          Lat:{{ item.lat }}
                          <br />
                        </q-card-section>
                      </a>
                    </q-card>
                  </q-expansion-item>
                </div>
              </q-list>
            </div>
          </q-btn-dropdown>

          <q-btn
            @click="
              addComponent = !addComponent;
              onReset();
            "
            :label="addComponentString"
            :color="getColour"
            id="id_AddComponent"
            icon="add_location_alt"
            :disabled="!onLine"
          >
            <q-menu persistent>
              <q-list style="min-width: 100px">
                <div v-if="addComponent" class="q-pa-xl">
                  <q-form
                    @submit="onSubmit"
                    @reset="onReset"
                    class="q-gutter-md"
                  >
                    <q-select
                      v-model="newTemplate"
                      outlined
                      :options="template_list"
                      label="Template"
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Dieses Feld darf nicht leer sein.'
                      ]"
                      :disable="pointMap == true"
                      id="id_Template"
                    />
                    <q-input
                      filled
                      v-model="newDesc"
                      label="Beschreibung"
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          'Dieses Feld darf nicht leer sein.'
                      ]"
                      :disable="pointMap == true"
                      id="id_Name"
                    />

                    <q-input
                      filled
                      v-model="newLat"
                      label="Latitude"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          this.newLat > 0 ||
                          this.newLat < 0 ||
                          'Dieses Feld darf nicht leer sein.'
                      ]"
                      :disable="pointMap == true"
                      id="id_Latitude"
                      @keypress="isNumberWithNegatives($event)"
                    />
                    <q-input
                      filled
                      v-model="newLong"
                      label="Longitude"
                      lazy-rules
                      :rules="[
                        val =>
                          (val && val.length > 0) ||
                          this.newLong > 0 ||
                          this.newLong < 0 ||
                          'Dieses Feld darf nicht leer sein.'
                      ]"
                      :disable="pointMap == true"
                      id="id_Longitude"
                      @keypress="isNumberWithNegatives($event)"
                    />
                    <q-btn
                      label="Punkt auf Karte auswählen"
                      @click="pointMap = !pointMap"
                      :color="getColour"
                      id="id_PunktaufKarte"
                    />

                    <div>
                      <q-btn
                        label="Submit"
                        type="submit"
                        :color="getColour"
                        :disabled="pointMap == true"
                        id="id_Submit"
                      />
                      <q-btn
                        label="Reset"
                        type="reset"
                        :color="getColour"
                        flat
                        class="q-ml-sm"
                        id="id_Reset"
                      />
                    </div>
                  </q-form>
                </div>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            @click="centerGeoLocation()"
            :label="setPosString"
            :color="getColour"
            id="id_SetCurPos"
            icon="my_location"
          />
          <div v-if="gettingLocation">
            Lade Standort ...
          </div>
          <q-btn
            :color="getColour"
            icon="qr_code_scanner"
            :label="qrString"
            @click="turnCameraOn()"
            v-show="!showCamera"
            disabled
          />
          <q-toggle v-model="hide" :color="getColour" label="Detailed View" />
          <div v-if="hide" class="detail-view">
            <q-list>
              <div v-for="item in highlighter_all" :key="item.id">
                <FacilityDetails
                  :item="item"
                  :onLine="onLine"
                  :curLat="curLat"
                  :curLon="curLon"
                  @addPicture="addPicture"
                  @updatedFacility="updateFacility"
                  @deletedFacility="deleteFacility"
                  @updateList="updateFacilitiesOnceOnlineList"
                />
              </div>
            </q-list>
          </div>
          <p class="text-subtitle1" v-if="result">
            Last result: <b>{{ result }}</b>
          </p>
          <div v-if="showCamera">
            <qrcode-stream :camera="camera" @decode="onDecode"> </qrcode-stream>
          </div>
        </div>
        <transition name="fade"> </transition>
        <q-page padding class="flex curs">
          <q-card style="flex:1" class="map-container">
            <l-map
              :zoom="zoom"
              :maxZoom="maxzoom"
              :center="center"
              @click="onMapClick"
              ref="map"
            >
              <l-tile-layer
                :url="url"
                :attribution="attribution"
                :options="{ maxNativeZoom: 18, maxZoom: maxzoom }"
              ></l-tile-layer>
              <!-- Marker All -->
              <l-marker
                v-for="(marker, index) in marker_all"
                :key="index"
                ref="markersRef"
                :lat-lng="marker.position"
                :icon="marker.icon"
                @click="addHighlighter(getItem(marker.Id))"
              >
                <l-tooltip :content="marker.desc"></l-tooltip>
              </l-marker>

              <l-marker
                v-for="marker in highlighter_all"
                :key="marker.id"
                ref="highlightersRef"
                :lat-lng="marker.position"
                :icon="marker.icon"
                @click="removeHighlighter(marker.Id)"
              >
                <l-tooltip :content="marker.desc"></l-tooltip>
              </l-marker>

              <l-marker
                v-for="marker in marker_currentPos"
                :key="marker.desc"
                ref="currentPosRef"
                :lat-lng="marker.position"
                :icon="marker.icon"
              >
                <l-tooltip :content="marker.desc"></l-tooltip>
              </l-marker>
              <l-circle
                :lat-lng="circlePos"
                :radius="perimeterInMeters"
                :opacity="0.2"
              />
              <!-- Marker All -->
            </l-map>
          </q-card>
        </q-page>
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import { QrcodeStream } from "vue-qrcode-reader";
import {
  LMap,
  LTileLayer,
  LMarker,
  LTooltip,
  LPopup,
  LCircle,
  LIcon
} from "vue2-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FacilityDetails from "components/FacilityDetails";
const menuList = [
  {
    icon: "dashboard",
    label: "Dashboard",
    separator: true,
    link: "/Dashboard"
  },
  {
    icon: "room",
    label: "Map",
    separator: true,
    link: "/Map"
  },
  {
    icon: "settings",
    label: "Einstellungen",
    separator: true,
    link: "/Map"
  }
];

export default {
  name: "Map",
  components: {
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-marker": LMarker,
    "l-tooltip": LTooltip,
    "l-circle": LCircle,
    QrcodeStream,
    FacilityDetails
  },
  data() {
    return {
      flag: false,
      hide: false,
      //ComponentList Data Start
      isValid: undefined,
      menuList,
      camera: "auto",
      result: null,
      showCamera: false,
      //list used to test and display everything
      testList: [],
      //list used by search method
      showList: [],
      ComponentName: "",
      ComponentID: "",
      //qrCodeContent:"id",
      //ComponentList Data End

      model: null,
      template_list: [
        "Container",
        "ErsteHilfe",
        "Feuerlöscher",
        "Garage",
        "Gebäude",
        "Pumpe",
        "Rohr",
        "Sammelplatz",
        "Sprinkler",
        "Tank",
        "Water"
      ],
      addComponent: false,
      sendData: {
        templateId: "",
        name: "",
        lon: "",
        lat: "",
        description: "",
        customFields: {}
      },
      //backend URL for request
      facilityURL: "/facilities",
      left: false,
      zoom: 17,
      maxzoom: 1000,
      center: L.latLng(50.09696400540071, 8.216426456522177),
      users: [],
      users2: [],
      newTemplate: null,
      newDesc: null,
      newLat: null,
      newLong: null,
      newFuellwert: null,
      accept: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      url_satelite:
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      //list of markers dispalyed on map
      marker_all: [],
      //list of all highlighters
      highlighter_all: [],
      //once-item-list of current position
      marker_currentPos: [],
      pointMap: false,
      markerObjects: null,
      curLat: undefined,
      curLon: undefined,
      perimeterInMeters: 0,
      perimeterInMetersOld: 0,
      tmpList: [],
      posChanged: false,
      urlLogo: "",
      circlePos: L.latLng(50.09696400540071, 8.216426456522177),
      location: null,
      gettingLocation: false,
      errorStr: null,
      onLine: navigator.onLine,
      showBackOnline: false,
      facilitiesToUpdateOnceOnline: [],
      offlineColour: "red"
    };
  },
  computed: {
    getColour() {
      var colour;
      if (this.onLine) {
        colour = "green";
      } else {
        colour = "red";
      }
      return colour;
    },
    updateMapString() {
      if (this.$q.screen.width < 1100) {
        return "";
      } else {
        return "Update Map";
      }
    },
    searchString() {
      if (this.$q.screen.width < 1100) {
        return "";
      } else {
        return "Search Component";
      }
    },
    addComponentString() {
      if (this.$q.screen.width < 1100) {
        return "";
      } else {
        return "Add Component";
      }
    },
    setPosString() {
      if (this.$q.screen.width < 1100) {
        return "";
      } else {
        return "Set Current Position";
      }
    },
    qrString() {
      if (this.$q.screen.width < 1100) {
        return "";
      } else {
        return "Read QRCode";
      }
    }
  },
  methods: {
    changeMap() {
      if (this.url == "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") {
        this.url = this.url_satelite;
      } else {
        this.url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      }
    },
    ...mapActions("session", ["logout"]),
    ...mapActions("facilities", ["fetchFacilities"]),
    ...mapActions({ updateFacilityFunction: "facilities/updateFacility" }),
    /**
     * @description notification method once an item got updated (used in FacilityDetails)
     * @param facility item - updated item
     */
    updateFacility(item) {
      this.req(true, true);
      this.notify(item.name + " aktualisiert", "update");
    },
    /**
     * @description notification method once an item got deleted (used in FacilityDetails)
     * @param facility item - deleted item
     */
    deleteFacility(item) {
      this.req(true, true);
      this.notify(item.name + " gelöscht", "warning");
    },
    /**
     * @description getter for facility by id
     * @param int itemId - id of the facility
     */
    getItem(itemId) {
      for (var i = 0; i < this.testList.length; i++) {
        if (this.testList[i].id == itemId) {
          return this.testList[i];
        }
      }
      throw "error in getItem(itemId)";
    },
    /**
     * @description used in FacilityDetails to store images that already got downloaded
     * @param array IdPicture - index 0: id, index 1: picture
     */
    addPicture(IdPicture) {
      for (var i = 0; i < this.testList.length; i++) {
        if (this.testList[i].id == IdPicture[0]) {
          this.testList[i].image = IdPicture[1];
          break;
        }
      }
    },
    async onDecode(content) {
      this.result = content;
      this.turnCameraOff();
    },
    donwloadCanvas() {
      const canvas = document.getElementsByTagName("canvas");
      const link = document.createElement("a");
      link.download = "QRCode.png";
      link.href = canvas[0].toDataURL();
      link.click();
    },
    turnCameraOn() {
      this.camera = "auto";
      this.showCamera = true;
    },
    turnCameraOff() {
      this.camera = "off";
      this.showCamera = false;
    },

    /**
     * @description setzt die Ansicht auf gewünschte Koordinaten
     * @param double lat - Lat von von Facility
     * @param double lng - Lon von von Facility
     */
    setView(lat, lon) {
      this.$refs.map.mapObject.panTo(new L.LatLng(lat, lon));
    },
    /**
     * @description getter for QRCode
     * @param int item_id - id von Facility
     */
    getID(item_id) {
      return item_id + "";
    },
    /**
     * @description check if the current id is being searched
     * @param int item_id - id von Facility
     */
    isIDbeingSearched() {
      return this.ComponentID.length > 0 && this.ComponentID != 0;
    },
    /**
     * @description distance between two objects
     * @param double lat1 - lat of object 1
     * @param double lon1 - lon of object 1
     * @param double lat2 - lat of object 2
     * @param double lon2 - lon of object 2
     */
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
    /**
     * @description sets the list to display with the parameters given in the search function
     */
    setNewList() {
      this.clearAllMarkers();
      this.showList = [];
      //filter all elements
      if (
        !this.posChanged ||
        this.perimeterInMeters == "" ||
        this.perimeterInMeters == 0
      ) {
        this.tmpList = this.testList;
      }
      //only re-filter by perimeter if it got set new
      else if (this.perimeterInMeters != this.perimeterInMetersOld) {
        this.perimeterInMetersOld = this.perimeterInMeters;
        this.tmpList = [];
        for (let index = 0; index < this.testList.length; index++) {
          var cmp = this.calcDist(
            this.curLat,
            this.curLon,
            this.testList[index].lat,
            this.testList[index].lon
          );
          if (cmp * 1000 <= this.perimeterInMeters) {
            this.tmpList.push(this.testList[index]);
          }
        }
      }
      //filter for name + id with the above-set list
      for (let index = 0; index < this.tmpList.length; index++) {
        if (this.ComponentID != "" && this.ComponentID != 0) {
          if (this.tmpList[index].id == this.ComponentID) {
            this.showList.push(this.tmpList[index]);
            break;
          }
        } else if (
          this.tmpList[index].name
            .toLowerCase()
            .includes(this.ComponentName.toLowerCase())
        ) {
          this.showList.push(this.tmpList[index]);
        }
      }
      if (this.showList.length == 0) {
        this.flag = true;
      } else {
        this.flag = false;
      }
      //Show all elements from newly built list
      for (let y = 0; y < this.showList.length; y++) {
        this.addToMap(this.showList[y]);
      }
      this.AddExistingHighlighter();
    },
    /**
     * @description delete all marker
     */
    clearAllMarkers() {
      this.marker_all = [];
    },

    /**
     * @description delete all red circles (Highlighter)
     */
    removeHighlighterAll() {
      this.highlighter_all = [];
    },

    /**
     * @description delete one red circle (Highlighter)
     * @param int id - id of the marker to delete
     */
    removeHighlighter(id) {
      var newHighlighterList = this.highlighter_all;
      this.highlighter_all = [];
      //Workaround to the bug regarding the facilitydetails component not updating the pictures correctly once a marker is removed
      setTimeout(() => {
        loop1: for (let i = 0; i < newHighlighterList.length; i++) {
          if (newHighlighterList[i].Id != id) {
            loop2: for (let j = 0; j < this.testList.length; j++) {
              if (newHighlighterList[i].Id == this.testList[j].id) {
                this.addHighlighter(this.testList[j]);
                break loop2;
              }
            }
          }
        }
      }, 1);
    },
    /**
     * @description add red circles to map (highlighters)
     * @param facility item - facility from array
     */
    async addHighlighter(item) {
      //if the highlighter already exists, do not set it again
      for (let index = 0; index < this.highlighter_all.length; index++) {
        if (this.highlighter_all[index].Id == item.id) {
          return;
        }
      }
      var idToSearch = item.id == null ? item.Id : item.id;
      //push all necessary array items to the list of highlighters
      this.highlighter_all.push({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        Id: idToSearch,
        templateId: item.templateId,
        desc: item.desc,
        description: item.description,
        image: item.image,
        images: item.images,
        icon: L.icon({
          iconUrl: require("../assets/res/" + "Highlighter" + ".png"),
          iconSize: [35, 35],
          iconAnchor: [25, 25]
        }),
        position: L.latLng(item.lat, item.lon)
      });
    },
    /**
     * @description set current position
     * @param string marker_lat - lat of the position
     * @param string marker_long - lon of the position
     */
    addCurrentPos(marker_lat, marker_long) {
      this.circlePos = L.latLng(marker_lat, marker_long);
      this.posChanged = true;
      this.curLat = marker_lat;
      this.curLon = marker_long;
      this.marker_currentPos = [];
      var L_icon = L.icon({
        iconUrl: require("../assets/res/" + "CurrentPosition" + ".png"),
        iconSize: [35, 35],
        iconAnchor: [20, 30]
      });
      //push to the list of 1 item to display
      this.marker_currentPos.push({
        highlighted: false,
        lat: marker_lat,
        lon: marker_long,
        desc:
          "eigene Position<br>Lat: " + marker_lat + "<br>Lon " + marker_long,
        id: 0,
        name: "CurrentPosition",
        icon: L_icon,
        position: L.latLng(marker_lat, marker_long)
      });
      this.perimeterInMetersOld = 0;
      this.setNewList();
    },
    /**
     * @description adds facilties to map
     * @param facility item - Facility
     */
    addToMap(item) {
      var L_icon;
      //try the fitting item / catch the Default
      try {
        L_icon = L.icon({
          iconUrl: require("../assets/res/" + item.name + ".png"),
          iconSize: [35, 35],
          iconAnchor: [25, 25]
        });
      } catch {
        L_icon = L.icon({
          iconUrl: require("../assets/res/" + "Default" + ".png"),
          iconSize: [35, 35],
          iconAnchor: [25, 25]
        });
      }
      //push item to the list with all markers for v-for
      this.marker_all.push({
        name: item.name,
        Id: item.id,
        desc: item.desc,
        icon: L_icon,
        position: L.latLng(item.lat, item.lon)
      });
    },
    /**
     * @description set lat/lon at click on map
     */
    onMapClick(e) {
      if (this.pointMap == true) {
        this.newLat = e.latlng.lat;
        this.newLong = e.latlng.lng;
        this.pointMap = false;
      }
      if (this.curPos == true) {
        this.addCurrentPos(e.latlng.lat, e.latlng.lng);
        this.curPos = false;
      }
    },
    displayTooltip(selectedIndex) {
      for (let markerObject of this.markerObjects) {
        markerObject.closeTooltip();
      }
      this.markerObjects[selectedIndex].toggleTooltip();
    },
    /**
     * @description notify method
     * @param String submitText - text to show in notification
     * @param String icon - icon to show
     */
    notify(submitText, icon) {
      this.$q.notify({
        color: this.onLine ? "green" : this.offlineColour,
        textColor: "white",
        icon: icon,
        message: submitText
      });
    },
    onSubmit() {
      this.sendData.name = this.newTemplate;
      this.sendData.lon = this.newLong;
      this.sendData.lat = this.newLat;
      this.sendData.description = this.newDesc;
      this.sendData.customFields = {};
      this.sendData.templateId = this.Id = 1;
      axios.post(this.facilityURL, this.sendData).then(
        response => {
          this.notify(this.newTemplate + " erstellt", "cloud_done");
          this.req(true, true);
        },
        error => {
          this.notify("Fehler beim erstellen der Komponente", "warning");
          console.log(error);
        }
      );
    },
    /**
     * @description check input for being a number (only positives)
     */
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    /**
     * @description check input for being a number (allows negatives)
     */
    isNumberWithNegatives(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46 &&
        charCode !== 45
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    /**
     * @description fully update map
     */
    updateMap() {
      this.req(true, true);
    },
    /**
     * @description re-add all existing highlighters
     */
    AddExistingHighlighter() {
      var tmpHighlighter = this.highlighter_all;
      // 1. remove all highlighters
      this.removeHighlighterAll();
      //timeout must be set because of v-for
      setTimeout(() => {
        for (var i = 0; i < tmpHighlighter.length; i++) {
          for (var j = 0; j < this.testList.length; j++) {
            if (this.testList[j].id == tmpHighlighter[i].Id) {
              // 2. re-add all highlighters
              this.addHighlighter(this.testList[j]);
            }
          }
        }
      }, 250);
    },

    onReset() {
      this.newTemplate = null;
      this.newDesc = null;
      this.newLat = null;
      this.newLong = null;
    },
    /**
     * @description center the map to a position
     */
    centerMap() {
      this.$refs.map.mapObject.setView(this.center, 17);
    },
    /**
     * @description show all facilities from testList on map
     */
    addAll() {
      this.marker_all = [];
      for (let index = 0; index < this.testList.length; index++) {
        this.addToMap(this.testList[index]);
      }
    },

    /**
     * @description request to backend for all facilities
     * @param boolean displayBoolean - true: update map after request, false: don't
     * @param boolean highlighterBoolean - true: reset all markers (to keep them above facilities on map), false: don't
     */
    req(displayBoolean, highlighterBoolean) {
      //check if offline
      if (!this.onLine) {
        //if offline, use local storage as items to display
        this.testList = JSON.parse(localStorage.getItem("AllComponents"));
        if (displayBoolean) this.addAll();
        if (highlighterBoolean) {
          this.AddExistingHighlighter();
        }
        return;
      }
      //api call for all facilities from backend
      this.fetchFacilities()
        .then(data => {
          //list to test and use for all items
          this.testList = [];
          const resultArray = [];
          //put all facilities in the testList
          for (let cfu in data) {
            resultArray.push(data[cfu]);
          }
          this.testList = resultArray;
          //add a description for the items (this will be displayed on hover over markers on map)
          for (var i = 0; i < this.testList.length; i++) {
            var description =
              "Name: " +
              this.testList[i].name +
              "<br>ID: " +
              this.testList[i].id +
              "<br>Lat: " +
              this.testList[i].lat +
              "<br>Lon: " +
              this.testList[i].lon;
            this.testList[i].desc = description;
          }
          //put all item in the local storage for offline mode usage
          localStorage.setItem("AllComponents", JSON.stringify(this.testList));
          if (displayBoolean) this.addAll();
          if (highlighterBoolean) {
            this.AddExistingHighlighter();
          }
          //send notification after loading
          this.notify("Karte aktualisiert", "update");
        })
        .catch(err => {
          console.log("Fehler req(): \n", err);
        });
    },
    //method for logging out
    logoutFunction() {
      //call logout from api repository
      this.logout();
      //replace current window with login screen
      window.location.replace("/#/login");
    },
    getGeoLocation() {
      this.gettingLocation = true;
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.gettingLocation = false;
          this.location = pos;
          this.addCurrentPos(
            this.location.coords.latitude,
            this.location.coords.longitude
          );
        },
        err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
          console.log("Fehlermeldung GPS: ", this.errorStr);
        }
      );
    },
    centerGeoLocation() {
      if (this.location) {
        this.center = L.latLng(
          this.location.coords.latitude,
          this.location.coords.longitude
        );
      } else {
        this.curPos = true;
        this.notify(
          "Bitte wählen Sie ein Punkt auf der Karte als Standort",
          "warning"
        );
      }
    },
    centerGeoLocation2() {
      if (this.location) {
        this.center = L.latLng(
          this.location.coords.latitude,
          this.location.coords.longitude
        );
      }
    },
    /**
     * @description method to create the list of facilities to update once online
     * @param facility item - facility to check
     */
    updateFacilitiesOnceOnlineList(item) {
      //check if a facility already got updated
      var alreadyUpdated = false;
      for (var i = 0; i < this.facilitiesToUpdateOnceOnline.length; i++) {
        if (item.Id == this.facilitiesToUpdateOnceOnline[i].Id) {
          //if the facility already got updated once while being offline, overwrite the last update
          alreadyUpdated = true;
          this.facilitiesToUpdateOnceOnline[i] = item;
        }
      }
      //if a facility did not get updated already, push the update to the list
      if (!alreadyUpdated) {
        this.facilitiesToUpdateOnceOnline.push(item);
      }
      this.notify(item.name + " wird bei Internetverbindung aktualisiert");
    },
    /**
     * @description update facilities once online
     */
    updateFacilitiesOnceOnline() {
      //send a request to backend for every facility that got updated while in offline-mode
      var updatedFacilities = 0;
      for (var i = 0; i < this.facilitiesToUpdateOnceOnline.length; i++) {
        this.updateFacilityFunction(this.facilitiesToUpdateOnceOnline[i])
          .then(
            //count facilities that got updated
            updatedFacilities++,
            //notify for every updated facility
            this.notify(
              this.facilitiesToUpdateOnceOnline[i].name + " aktualisiert",
              "update"
            )
          )
          .then(data => {
            //once all facilities got updated, reload the testList
            if (updatedFacilities == this.facilitiesToUpdateOnceOnline.length) {
              //empty the list of facilities to update once online
              this.facilitiesToUpdateOnceOnline = [];
              //send reqeust
              this.req(true, true);
            }
          });
      }
    },
    /**
     * @description update the current online status
     */
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
      //things to do once online/offline switches
      if (this.onLine && this.facilitiesToUpdateOnceOnline.length > 0)
        this.updateFacilitiesOnceOnline();
      this.addComponent = !this.addComponent;
      this.notify(
        "Sie sind jetzt " + (this.onLine ? "online" : "offline"),
        this.onLine ? "" : "warning"
      );
    }
  },
  watch: {
    //check if currently online
    onLine(v) {
      if (v) {
        this.showBackOnline = true;
        setTimeout(() => {
          this.showBackOnline = false;
        }, 1000);
      }
    }
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  //bei erstem Aufruf alle Daten laden
  async beforeMount() {
    this.onLine = navigator.onLine;
    this.req(true, false);
    this.getGeoLocation();
  }
};
</script>
<style>
div.container {
  width: 100%;
  margin: auto;
}

body,
html {
  height: 100%;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

a.hover {
  cursor: pointer;
}

.q-layout-padding {
  padding: 0px;
  margin: 23px;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
body {
  overflow: hidden;
}

.map-container {
  width: 90vw;
  height: 80vh;
}

.detail-view {
  float: right;
  height: 80vh;
  margin-top: 3%;
  /*z-index: 7;
  margin-top:3%*/
  overflow-y: auto;
}
</style>
