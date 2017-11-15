<template>
    <div>
        <div class="title">{{title}}</div>
        <router-link :to="{ path: 'qcview', query: $route.query}">Go to QC</router-link>
    </div>
</template>
<script>
export default {
  name: 'performance-view',
  data () {
    return {
      title: 'Performance View'
    }
  }
}
</script>
<style lang='scss' scoped>
    $font-size:40px;
    .title{
        font-size:$font-size;
        font-weight:bold;
    }
</style>
