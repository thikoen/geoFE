<template>
  <q-page class="flex column">
    <q-header elevated>
      <q-toolbar color="primary" dense>
        <q-toolbar-title>
          <q-avatar>
            <q-img :src="require('../assets/logo.svg')"></q-img>
          </q-avatar>
          GeoApp
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="column items-center q-pt-lg">
      <div class="text-h3 text-weight-bold">Registrieren</div>
    </div>
    <div class="row q-pt-xl">
      <div class="col-3"></div>
      <div class="col-6">
        <div class="text-h5">Vorname</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="firstName"
            bg-color="accent"
            :rules="[val => val.length > 0 || 'Bitte Name eingeben']"
            id="id_registrationFirstName"
          />
        </div>
        <div class="text-h5">Nachname</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="lastName"
            bg-color="accent"
            :rules="[val => val.length > 0 || 'Bitte Name eingeben']"
            id="id_registrationLastName"
          />
        </div>
        <div class="text-h5">E-Mail</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="email"
            bg-color="accent"
            :rules="emailRules"
            id="id_registrationEmail"
          />
        </div>
        <div class="text-h5">Passwort</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="password"
            bg-color="accent"
            type="password"
            :rules="[
              val => !(val.length == 0) || 'Bitte Passwort eingeben',
              val => val.length > 7 || 'Passwort zu kurz'
            ]"
            id="id_registrationPassword"
          />
        </div>
        <div v-if="succ" class="column items-center q-pt-md">
          <div class="text-h5">
            <a href="/#/login">Erfolgreich registriest</a>
          </div>
        </div>
        <div class="column items-center q-pt-md">
          <div>
            <q-btn
              color="positive"
              label="Registrieren"
              @click="submit()"
              id="id_registrationButton"
            />
          </div>
        </div>
        <div class="q-pt-sm text-h7">
          Sie haben sich schon registriert? <a href="/#/login">Hier Anmelden</a>
        </div>
      </div>
      <div class="col-3"></div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",

  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      succ: false,
      emailRules: [
        val => !(val.length == 0) || "Bitte Email eingeben",
        val =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
          "Bitte valide Email benutzen"
      ]
    };
  },

  methods: {
    ...mapActions("session", ["registration"]),

    submit() {
      this.registration({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      })
        .then(resp => {
          console.log("Success: ", resp);
          this.succ = true;
        })
        .catch(err => {
          console.log("Failed: ", err);
        });
    }
  }
};
</script>

<style lang="stylus">
.q-page
  background-color $secondary
  color white
.q-input
  font-size 25px
</style>
