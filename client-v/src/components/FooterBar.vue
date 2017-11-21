<template>
    <div class="footer-bar">
        <div class="title">{{title}}</div>
    </div>
</template>

<script>

export default {
  name: 'footer-bar',
  data() {
    return {
      title: 'Footer bar'
    }
  },

  mounted() {
    console.log('Footer bar mounted')
  },

  activated() {
    console.log('Footer bar activated')
    this.$bus.on(this.$bus.E_SETTINGS, function (settings) {
      console.log(settings);
    })
  }
}
</script>

<style lang='scss' scoped>
@import '../global.scss';
$font-size: 40px;
.title {
  font-size: $font-size;
  font-weight: bold;
}

.footer-bar {
  height: $bottombarHeight;
}
</style>
