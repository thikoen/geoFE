<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="green" label="Search component" dropdown-icon="search">
      <q-list>
              <q-input bottom-slots v-model="ComponentName" label="Name">
                <template v-slot:before> </template>
              </q-input>
              <q-input bottom-slots v-model="ComponentID" label="ID">
                <template v-slot:before> </template>
              </q-input>
              <q-btn
                color="positive"
                label="Suchen"
                @click="
                  req();
                  setNewList();
                "
                id="id_componentSearch"
              />
              <div v-for="item in showList" :key="item.id">
                <q-expansion-item
                  dense
                  dense-toggle
                  expand-separator
                  icon="house"
                  v-bind:label="item.name"
                >
                  <q-card>
                    <q-card-section>
                      Name: {{ item.name }}
                      <br />
                      ID: {{ item.id }}
                      <br />
                      Long:{{ item.lon }}
                      <br />
                      Lat:{{ item.lat }}
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testList: [
        {
          id: 1,
          name: "Tank",
          lon: "8.22299228",
          lat: "50.09269636",
          createdAt: "2020-12-01T09:02:32.612Z",
          updatedAt: "2020-12-01T09:02:32.612Z"
        },
        {
          id: 2,
          name: "Tank",
          lon: "8.22299228",
          lat: "50.09269636",
          createdAt: "2020-12-01T09:02:32.612Z",
          updatedAt: "2020-12-01T09:02:32.612Z"
        }
      ],
      showList: [],
      ComponentName: "",
      ComponentID: 0,
      fabPos: [18, 18],
      draggingFab: false
    };
    results: [];
  },

  methods: {
    req() {
      console.log("Request sent");
      this.$http
        .get("https://test-4afd1.firebaseio.com/.json")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const resultArray = [];
          for (let cfu in data) {
            resultArray.push(data[cfu]);
          }
          this.testList = resultArray;
        });
      /*this.$axios
        .get("facilities/")
        .then(response => {
          this.testList = response.data;
        })*/
      /*.catch(error => {
          console.log("Error");
        });*/
      //testList = await this.$axios.get("facilities/");
    },

    setNewList() {
      this.showList = [];
      for (let index = 0; index < this.testList.length; index++) {
        if (this.ComponentID != "" || this.ComponentID != 0) {
          if (this.testList[index].id == this.ComponentID) {
            this.showList.push(this.testList[index]);
            break;
          }
        } else if (
          this.testList[index].name
            .toLowerCase()
            .includes(this.ComponentName.toLowerCase())
        ) {
          this.showList.push(this.testList[index]);
        }
      }
    },

  }
};
</script>
