<template>
    <div>
        <div class="title">{{title}}</div>
        <router-link :to="{ path: 'qcview', query: $route.query}">Go to QC</router-link>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'performance-view',
  data () {
    return {
      title: 'Performance View'
    }
  },

  computed: {
    ...mapGetters([
      'settings'
    ])
  },

  mounted () {
    console.log('peroformance mounted')
    console.log(this.$bus)
    console.log(this.E_APPSETTINGS)
    this.$bus.on(this.E_APPSETTINGS, function (settings) {
      console.log(settings)
    })
  },

  watch: {
    'settings' (settings) {
      console.log('perf', settings)
    }
  }
}
</script>

<style lang='scss' scoped>
$font-size: 40px;
.title {
  font-size: $font-size;
  font-weight: bold;
}
</style>
