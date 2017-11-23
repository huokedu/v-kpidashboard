<template>
    <div class="footer-bar">
         <div class="footer-bar-item">
          <div class="channel">HOLE DEPTH</div> 
          <div class="content">{{rigInfo.holeDepth}}&nbsp;{{rigInfo.holeDepthUnit}}</div>
        </div>
         <div class="footer-bar-item">
          <div class="channel">BIT DEPTH</div> 
          <div class="content">{{rigInfo.bitDepth}}&nbsp;{{rigInfo.bitDepthUnit}}</div>
        </div>
         <div class="footer-bar-item">
          <div class="channel">RIG STATE</div> 
          <div class="content">{{rigInfo.rigState}}</div>
        </div>
    </div>
</template>

<script>
import { DISPLAY_STATE_CHANNELS } from '@/util'

export default {
  name: 'footer-bar',
  computed: {
    rigInfo: function () {
      return this.$store.getters.rigInfo;
    }
  },

  mounted() {
    this.$bus.on(this.$bus.E_SETTINGS, (settings) => {
      this.$store.dispatch('getRigInfo', {
        mnemonics: DISPLAY_STATE_CHANNELS.map(channel => channel.name),
        units: DISPLAY_STATE_CHANNELS.map(channel => channel.unit)
      });
    })
  }
}
</script>

<style lang='scss' scoped>
@import "../global.scss";

.footer-bar {
  height: $bottombarHeight;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.footer-bar-item {
  margin: 0 20px;
  font-size: 14px;
}

.footer-bar-item:nth-child(3) {
  margin-right: 40px;
}

.content {
  font-family: RobotoBold;
}
</style>
