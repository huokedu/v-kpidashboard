<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div></div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
    this.$store.dispatch('getSettings', { $route: this.$route })
  },

  watch: {
    settings (val) {
      this.$bus.emit(this.E_SETTINGS, val)
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
