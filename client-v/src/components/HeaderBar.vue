<template>
    <div class="header-bar">
        <div class="title">{{title}}</div>
    </div>
</template>

<script>

export default {
  name: 'header-bar',
  data () {
    return {
      title: 'Header bar'
    }
  },

  mounted () {
    console.log('Header bar mounted')
  },

  activated () {
    console.log('Header bar activated')
    this.$bus.on(this.$bus.E_SETTINGS, function (settings) {
      console.log(settings)
    })
  }
}
</script>

<style lang="scss" scoped>
  $font-size: 40px;
  $topbarHeight: 56px;
  .title {
    font-size: $font-size;
    font-weight: bold;
  }

  .header-bar{
    height: $topbarHeight;
  }
</style>
