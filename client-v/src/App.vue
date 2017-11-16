<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>{{content}}</div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      content: 'app root'
    }
  },

  mounted () {
    console.log('app mounted')
    this.$store.dispatch('getSettings', { $route: this.$route, $bus: this.$bus })
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
