<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div></div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      appsettings: this.$store.getters.settings
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ])
  },

  mounted () {
    console.log('app mounted')
    // this.$store.dispatch('getAppSettings')
    axios
        .get('/api/appsettings')
        .then(res => {
          this.$bus.emit(this.E_APPSETTINGS, res.data)
        })
        .catch(err => console.log(err))
  },

  watch: {
    '$route' (to, from) {
      console.log(to)
      console.log(from)
      console.log(this.$route.query)
    },

    settings (val) {
      val.wellID = this.$route.query.wellID || val.debugWellID
      val.wellboreID = this.$route.query.wellboreID
      console.log(val)
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
