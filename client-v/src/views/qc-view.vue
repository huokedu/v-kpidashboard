<template>
    <div>
        <div class="title">{{title}}</div>
        <router-link :to="{ path: 'performance', query: $route.query}">Go to Performance</router-link>
    </div>
</template>

<script>

export default {
  name: 'qc-view',
  data () {
    return {
      title: 'QC View'
    }
  },

  mounted () {
    console.log('qcview mounted')
    this.$bus.on(this.$bus.E_SETTINGS, function (settings) {
      console.log(settings)
    })
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
