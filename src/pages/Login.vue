<template>
  <q-page class="flex column login-page">
    <div v-if="this.flag">
      <q-banner inline-actions class="text-white bg-red">
        Login Daten sind falsch. Bitte überprüfen sie ihre Email-Adresse und ihr
        Passwort !
        <template v-slot:action>
          <q-icon name="warning" color="white" size="sm" />
        </template>
      </q-banner>
    </div>
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
      <div class="text-h3 text-weight-bold">Anmelden</div>
    </div>
    <div class="row q-pt-xl">
      <div class="col-3"></div>
      <div class="col-6">
        <div class="text-h5">E-Mail</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="email"
            bg-color="accent"
            :rules="emailRules"
            id="id_loginEmail"
          />
        </div>
        <div class="text-h5">Passwort</div>
        <div class="q-pa-sm">
          <q-input
            outlined
            v-model="password"
            bg-color="accent"
            type="password"
            :rules="[val => val.length > 0 || 'Bitte Passwort eingeben']"
            id="id_loginPassword"
          />
        </div>
        <!-- <q-checkbox
          v-model="save"
          label="Nutzerdaten speichern"
          color="positive"
          id="id_loginSaveUserLoginCheckbox"
        /> -->
        <div class="row q-pt-md">
          <!-- <div><q-btn color="primary" label="Passwort vergessen?" /></div> -->
          <q-btn
            color="positive"
            label="Anmelden"
            @click="submit()"
            id="id_loginButton"
          />
        </div>
        <div class="q-pt-lg text-h7">
          Sie haben sich noch nicht registriert?
          <a href="/#/registration">Hier Registrieren</a>
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
      isPwd: true,
      save: false,
      email: "",
      password: "",
      emailRules: [
        val => !(val.length == 0) || "Bitte Email eingeben",
        val =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
          "Bitte valide Email benutzen"
      ],
      flag: undefined
    };
  },

  methods: {
    ...mapActions("session", ["login"]),

    submit() {
      this.login({ email: this.email, password: this.password })
        .then(resp => {
          //console.log("Success: ", resp);
          window.location.replace("/#/Map");
        })
        .catch(err => {
          console.log("Failed: ", err);
          this.password = "";
          this.flag = true;
        });
    }
  },
  async beforeMount() {
    if (!navigator.onLine) {
      window.location.replace("/#/Map");
    }
  }
};
</script>

<style lang="stylus">
.login-page{
  background linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6) ), url('../assets/background.jpg');
  background-color $secondary
  color white
  background-repeat no-repeat
  background-position center
  height 100%
  background-size cover
}
</style>
