<template>
  <div id="app">
    <side-bar></side-bar>
    <div class="main-content">
      <header-bar></header-bar>
      <div class="view-content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <footer-bar></footer-bar>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar'
import SideBar from '@/components/SideBar'
import FooterBar from '@/components/FooterBar'
export default {
  name: 'app',
  data() {
    return {
      content: 'app root'
    }
  },

  components: {
    HeaderBar,
    SideBar,
    FooterBar
  },

  mounted() {
    console.log('app mounted')
    this.$store.dispatch('getSettings', { $route: this.$route, $bus: this.$bus })
  }
}
</script>

<style lang="scss">
@import './assets/main.scss';
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #ebeaec;
}

.main-content {
  height: 100%;
  width: calc(100% - #{$sidebarWidth});
}

.view-content {
  height: calc(100% - #{$topbarHeight} - #{$bottombarHeight});
  overflow-y: auto;
  background: white;
}
</style>
