<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div></div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      appsettings: ''
    }
  },
  computed: {
    settings () {
      return Object.keys(this.$store.getters.settings).length > 0
        ? this.$store.getters.settings
        : ''
    }
  },

  mounted () {
    this.$store.dispatch('getAppSettings')
  },

  watch: {
    '$route' (to, from) {
      console.log(to)
      console.log(from)
      console.log(this.$route.query)
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
