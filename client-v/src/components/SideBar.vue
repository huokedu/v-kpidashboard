<template>
    <div class="side-bar">
        <div class="title">{{title}}</div>
    </div>
</template>

<script>

export default {
  name: 'side-bar',
  data() {
    return {
      title: 'Side bar'
    }
  },

  mounted() {
    console.log('Side bar mounted')
  },

  activated() {
    console.log('Side bar activated')
    this.$bus.on(this.$bus.E_SETTINGS, function (settings) {
      console.log(settings)
    })
  }
}
</script>

<style lang='scss' scoped>
@import '../global.scss';
.title {
  font-weight: bold;
}

.side-bar {
  width: $sidebarWidth;
  height: 100%;
  background: #242424;
  color: hsla(0, 0%, 100%, 0.87);
}
</style>
