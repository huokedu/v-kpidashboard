<template>
    <div class="header-bar">
        <div class="title">
            <span class="top-title">{{topTitle}}</span>
            <span class="top-sub-title">{{topSubTitle}}</span>
            <div class="sub-title">{{subTitle}}</div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'header-bar',
  data() {
    return {
      topTitle: 'Drilling Performance',
      subTitle: ''
    }
  },

  computed: {
    topSubTitle: function () {
      switch (this.$route.path) {
        case '/performance':
          return '/ View'
        case '/qcview':
          return '/ Stand Analysis'
      }
    }
  },

  mounted() {
    this.$bus.on(this.$bus.E_SETTINGS, (settings) => {
      this.$http
        .get(settings['wellURI'] + '/' + settings.wellID, { headers: { Authorization: 'Bearer ' + settings.serviceToken } })
        .then((wellinfo) => {
          if (wellinfo && wellinfo.data && wellinfo.data.data) {
            let wellname = wellinfo.data.data.match(/<eml:Title>(.+?)<\/eml:Title>/)
            this.subTitle = wellname ? wellname[1] : ''
          }
        })
        .catch(err => console.log(err))
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/main.scss';
.header-bar {
  height: $topbarHeight;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.title {
  font-size: 1.71em;
  color: #737373;
}

.top-sub-title {
  color: rgba(0, 0, 0, 0.7);
}

.sub-title {
  font-size: 0.75rem;
  color: #737373;
}
</style>
