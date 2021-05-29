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
            Dashboard
          </div>
        </q-toolbar-title>

        <q-btn to="/login" stretch flat label="LOGOUT" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay elevated>
      <q-scroll-area class="fit">
          <q-list>

            <template v-for="(menuItem, index) in menuList">
              <q-item :key="index" clickable :to="menuItem.link"  :active="menuItem.label === 'Outbox'" v-ripple>
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
      <q-page class="flex column q-gutter-lg">
        <div class="fit row no-wrap q-gutter-lg ">

          <div class="col-5 ">
            <div class="row justify-around">

              <div class="col-5 ">
                <q-card class="my-card">
                  <q-card-section horizontal>
                    <q-card-section>
                      <q-avatar>
                        <q-img :src="require('../assets/logo.svg')"></q-img>
                      </q-avatar>
                    </q-card-section>
                    <q-card-section vertical>
                      <q-card-section class="text-no-wrap">
                        Letzte Wartung
                      </q-card-section>
                      <q-card-section>
                        05.08.2020
                      </q-card-section>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-5">
                <q-card class="my-card">
                  <q-card-section horizontal>
                    <q-card-section>
                      <q-avatar>
                        <q-img :src="require('../assets/logo.svg')"></q-img>
                      </q-avatar>
                    </q-card-section>
                    <q-card-section vertical>
                      <q-card-section class="text-no-wrap">
                        Anzahl Komponenten
                      </q-card-section>
                      <q-card-section>
                        344
                      </q-card-section>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>

            </div>
          </div>

          <div class="col-5">
            <div class="row justify-around">

              <div class="col-5">
                <q-card class="my-card">
                  <q-card-section horizontal>
                    <q-card-section>
                      <q-avatar>
                        <q-img :src="require('../assets/logo.svg')"></q-img>
                      </q-avatar>
                    </q-card-section>
                    <q-card-section vertical>
                      <q-card-section class="text-no-wrap">
                        Administratoren
                      </q-card-section>
                      <q-card-section>
                        3
                      </q-card-section>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-5">
                <q-card class="my-card">
                  <q-card-section horizontal>
                    <q-card-section>
                      <q-avatar>
                        <q-img :src="require('../assets/logo.svg')"></q-img>
                      </q-avatar>
                    </q-card-section>
                    <q-card-section vertical>
                      <q-card-section class="text-no-wrap">
                        Sonstige Mitarbeiter
                      </q-card-section>
                      <q-card-section>
                        14
                      </q-card-section>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>

            </div>  
          </div>

        </div>
        <div class="fit row no-wrap q-gutter-lg" >
          <div class="col-5">
            <q-card class="my-card">
            <div class="row-3">
              <q-card-section>
                <div class="text-h6">Benutzer</div>
                
             </q-card-section>
            <!-- </q-card> -->
            </div>
            <div class="row-9">
              <q-separator  />
              
              <!-- <q-card class="my-card"> -->
                <q-card-actions >
                  <q-btn 
                    color="positive" 
                    label="Benutzer hinzufügen"
                    @click="addUserDialog = true; deleteForm()"
                  />
                </q-card-actions>
                <q-card-section>
                  <div class="q-pt-md q-gutter-sm">
                    
                    <template v-for="(user, index) in userList">
                      <q-banner :key="index" inline-actions class="text-white bg-primary">
                        {{ user.name }}
                        <template v-slot:action>
                          <div style="width: 200px; text-color:white; overflow: auto">
                            <q-select 
                              style="height: 35px; overflow: hidden"
                              v-model="user.role"
                              :options="role_list"
                              bg-color="white" filled
                              @input="updateUserRole(user)"
                            />
                          </div>
                          <div class="q-pl-md">
                            <q-btn 
                              color="negative" 
                              icon="delete"
                              @click="deleteUserDialog = true; deleteUserIndex = user.id"
                            /> 
                          </div>
                          
                        </template>
                      </q-banner>
                      
                    </template>

                  </div>
                </q-card-section>
            </div>
          </q-card>
          </div>

          <div class="col-5">
          <q-card class="my-card">
            <div class="row-3">
              <!-- <q-card class="my-card"> -->
              <q-card-section>
                <div class="text-h6">Templates</div>
             </q-card-section>
            <!-- </q-card> -->
            </div>
            
            <div class="row-9">
              <!-- <q-card class="my-card"> -->
              <q-separator  />
                <q-card-actions>
                  <q-btn 
                    color="positive" 
                    label="Template hinzufügen"
                    @click="addTemplateDialog = true; deleteForm()"
                  />
                  <q-btn 
                    color="positive" 
                    label="Download Report"
                    @click="downloadReport()"
                  />
                </q-card-actions>
                <q-card-section>
                  <div class="q-pt-md q-gutter-sm">

                    <template v-for="(template, index) in componentList">
                      <q-banner :key="index" inline-actions class="text-white bg-primary">
                        {{ template.name }}
                        <template v-slot:action>
                          <q-btn flat color="white" icon="search" @click="templateView = true; templateView2 = template"/>
                          <div class="q-pl-md">
                            <q-btn 
                              color="negative" 
                              icon="delete"
                              @click="warningTemplate = true; deleteTemplateIndex = template.id"
                            /> 
                          </div>
                        </template>
                        
                      </q-banner>
                    </template>

                  </div>
                </q-card-section>
              <!-- </q-card> -->
            </div>
          </q-card>
          </div>

       </div>
      </q-page>
    </q-page-container>
    <q-dialog v-model="addUserDialog"  >
      <q-card style="width:700px;">
        
        <q-card-section>
          <div class="text-h6">Benutzer hinzufügen</div>
        </q-card-section>
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Vorname</div>
              <q-input v-model="form.firstName" type="text" />
          </q-form>
        </q-card-section>
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Nachname</div>
              <q-input v-model="form.lastName" type="text" />
          </q-form>
        </q-card-section>
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">E-Mail</div>
              <q-input v-model="form.email" type="email"/>
          </q-form>
        </q-card-section>
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Passwort</div>
              <q-input v-model="form.password" type="password"/>
          </q-form>
        </q-card-section>
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Rolle</div>
            <q-select
              v-model="form.role"
              :options="role_list"
              bg-color="white" 
            />
          </q-form>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="submitNewUser()" />
        </q-card-actions>
      
      </q-card>
    </q-dialog>
    <q-dialog v-model="addTemplateDialog">
      <q-card style="width:700px;">
        
        <q-card-section>
          <div class="text-h6">Template hinzufügen</div>
        </q-card-section>
        
        <q-separator  />
        
        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Name</div>
            <q-input v-model="newTemplate.name" type="text" />
          </q-form>
        </q-card-section>

        <q-separator  />

        <q-card-section>
          <q-form>
            <div class="text-subtitle2">Eigenschaften</div>
          </q-form>
        </q-card-section>

        <q-card-section>
          <div
            v-for="(input, index) in eigenschaftenListe"
            :key="`eigenInput-${index}`">
              <div>    
                <q-input 
                   v-model="input.eigen"
                   type="text" 
                   placeholder="Eigenschaften hinzufügen">
                      <template v-slot:append>
                          <q-btn round dense flat  icon="add"
                                 @click="addField(input.eigen, eigenschaftenListe)" 
                                 v-show="index == ((eigenschaftenListe.length-1) || 0 )"/>
                          <q-btn round dense flat  icon="remove" 
                                 @click="removeField(index, eigenschaftenListe)" 
                                 v-show="eigenschaftenListe.length > 1" />
                      </template>
                </q-input>
              </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="addTemplate()"/>
        </q-card-actions>
      
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteUserDialog" persistent>
      <q-card style="width:700px;">
        
        <q-card-section>
          <div class="text-h6">Möchten Sie wirklich diesen User löschen?</div>
        </q-card-section>
        
        <q-card-actions>    
            <q-btn dense  color="positive"  label="Ja" v-close-popup @click="deleteUser()" />
            <q-btn dense  flat color="grey" label="Nein" v-close-popup/>
        </q-card-actions>
        
      </q-card>
    </q-dialog>
    <q-dialog v-model="warningTemplate" persistent>
      <q-card style="width:700px;">
        
        <q-card-section>
          <div class="text-h6">Möchten Sie wirklich dieses Template löschen?</div>
        </q-card-section>
        
        <q-card-actions>    
            <q-btn dense  color="positive"  label="Ja" v-close-popup @click="deleteTemplate()" />
            <q-btn dense  flat color="grey" label="Nein" v-close-popup/>
        </q-card-actions>
        
      </q-card>
    </q-dialog>
    <q-dialog v-model="templateView">
      <q-card style="width:700px;">
        <q-card-section>
          <div class="text-h6">{{ templateView2['name'] }}</div>
        </q-card-section>
        <q-card-section v-if="templateView2['fields']">
          <div class="text-subtitle2">{{ (Object.keys(templateView2['fields'])).join(', ') }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    
  </q-layout>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      //ComponentList Data Start
      menuList: [
        {
          icon: 'dashboard',
          label: 'Dashboard',
          separator: true,
          link: '/Dashboard'
        },
        {
          icon: 'room',
          label: 'Map',
          separator: true,
          link: '/Map'
        },
        {
          icon: 'settings',
          label: 'Einstellungen',
          separator: true,
          link: '/Map'
        }
      ],
      userList: [],
      isValid: undefined,
      componentList: [],
      left: false,
      role_list: ["viewer", "editor", "admin"],
      addUserDialog: false,
      addTemplateDialog: false,
      deleteUserDialog: false,
      form: {
      	firstName: null,
        lastName: null,
        email: null,
        role: null,
        password: null
      },
      newTemplate:[{
        name:"",
        fields: {}
      }],
      eigenschaftenListe: [
                      {name: "", 
                       eigen: ""
                      }
                    ],
      eigenschaftenListeFinal: [
                      {name: "", 
                       fields: {
                      }
                      }
                    ],
      deleteUserIndex: null,
      warningTemplate: false,
      deleteTemplateIndex: null,
      templateView: false,
      templateView2:  [
                      {name: "", 
                       fields: {}
                      }
                    ]
    };
  },
  computed: {
  },
  beforeMount(){
    this.getServerData();
  },
  methods: {
    downloadReport() { //Download Report
      this.$q.loading.show({
        message:'PDF wird generiert'
      })
      this.loading = true;
      axios({
        url: "/reports/",
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.setAttribute('download', 'Report.pdf');
          document.body.appendChild(fileLink);
          fileLink.click();
          this.loading = false;
          this.$q.loading.hide()
          
      })
      .catch(err => {
        console.log("Fehler PDF Download: \n", err);
        this.loading = false;
        this.$q.loading.hide()
      });
    },
    updateUserRole(user){ //Update User Role
      if(user.id != 1){
        axios.put('/users/'+ user.id + '/', {role: user.role}).then(
          response => {
            this.$q.notify({message: 'Done!'});
            console.log(response);
          },
          error => {
            this.$q.notify({message: 'Fail!'});
            console.log(error);
          }
        );
      }
    },
    
    getServerData(){ // Get Users & Templates from Backend
        this.userList = [];
        this.componentList = [];
        axios({
          url: "/getUsers/",
          method: 'GET',
        }).then((response) => {
            const resultArray = [];
            for (let cfu of response['data']) {
              this.userList.push({name: cfu['email'], role:cfu['role'], id:cfu['id']});
            }
        })
        .catch(err => {
          console.log("Fehler Mitarbeiter laden... \n", err);
        });
        
        axios({
          url: "/templates/",
          method: 'GET',
        }).then((response) => {
          const resultArray = [];
          for (let cfu of response['data']) {
            this.componentList.push({name: cfu['name'], id: cfu['id'], fields:cfu['fields']});
          }
        })
        .catch(err => {
          console.log("Fehler Templates laden... \n", err);
        });
        
    },
    /**
     * @description add new User to Page & Database
     */
    submitNewUser: function () { //
      axios.post('/register/', this.form).then(
        response => {
          this.$q.notify({message: 'Done!'});
          console.log(response);
          this.userList.push({id: response.data.id, name: this.form.email, role: this.form.role});
        },
        error => {
          this.$q.notify({message: 'Fail!'});
          console.log(error);
        }
      );

    },
    /**
     * @description Inputfields will be cleared 
     */
    deleteForm: function(){
      this.form={
      	firstName: null,
        lastName: null,
        email: null,
        role: null
      },
      this.newTemplate=[{
        name:"",
        fields: {}
      }],
      this.eigenschaftenListe= [
                      {name: "", 
                       eigen: ""
                      }
                    ],
      this.eigenschaftenListeFinal= [
                      {name: "", 
                       fields: {
                      }
                      }
                    ]
    },
    /**
     * @description add new Inputfield in Template Dialog
     */
    addField(value, fieldType) {
      fieldType.push({ value: "" });
    },
    /**
     * @description remove Inputfield in Template Dialog
     */
    removeField(index, fieldType) {
      fieldType.splice(index, 1);
    },
    /**
     * @description get Index from List where id equals index
     */
    getListIndex(ID, list){
      let i = 0;
      while(i <= list.length && ID != list[i].id) {
        i++;
      }
      return i;
    },
    /**
     * @description delete User from Page and Database
     */
    deleteUser(){
      axios.delete('/users/'+ this.deleteUserIndex + '/').then(
        response => {
          this.$q.notify({message: 'Done!'});
          console.log(response);

          let delIndex = this.getListIndex(this.deleteUserIndex, this.userList)
          this.userList.splice(delIndex, 1);
          this.deleteUserIndex = null;
        },
        error => {
          this.$q.notify({message: 'Fail!'});
          console.log(error);
        }
        
      );
    },
    /**
     * @description delete Template from Page and Database
     */
    deleteTemplate(){
      axios.delete('/templates/'+ this.deleteTemplateIndex + '/').then(
        response => {
          this.$q.notify({message: 'Done!'});
          console.log(response);

          let delIndex = this.getListIndex(this.deleteTemplateIndex, this.componentList)
          this.componentList.splice(delIndex, 1);
          this.deleteTemplateIndex = null;
        },
        error => {
          this.$q.notify({message: 'Fail!'});
          console.log(error);
        }
        
      );
    },
    /**
     * @description add Template to Page and Database
     */
    addTemplate(){
      this.eigenschaftenListeFinal[0]['name'] = this.newTemplate.name
      for(let eigenschaft of this.eigenschaftenListe){
        let feld = eigenschaft.eigen;
        if (typeof feld !== "undefined") {
          this.eigenschaftenListeFinal[0]['fields'][feld] = ""
        }
      }
      axios.post('/templates/', this.eigenschaftenListeFinal[0]).then(
        response => {
          this.$q.notify({message: 'Done!'});
          console.log(response);

          this.componentList.push({
            id: response.data.id, 
            name: this.newTemplate.name, 
            fields: this.eigenschaftenListeFinal[0]["fields"]
          });
        },
        error => {
          this.$q.notify({message: 'Fail!'});
          console.log(error);
        }
      );
    },
  }
}
</script>
<style>



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

.q-page{
  background-color: white;
}

body {
  overflow: scroll;
  overflow-x: hidden;
}

</style>