<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>{{appsettings}}</div>
    <router-view/>
  </div>
</template>

<script>
import http from './services/http'
export default {
  name: 'app',
  data () {
    return {
      appsettings: ''
    }
  },
  mounted () {
    http.getAppSettings()
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
