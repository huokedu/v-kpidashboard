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

export default {
  name: 'footer-bar',
  data() {
    return {
      rigInfo: {
        rigState: '--',
        bitDepth: '--',
        holeDepth: '--',
        bitDepthUnit: 'ft',
        holeDepthUnit: 'ft'
      }
    }
  },

  mounted() {
    const rigState = [
      'Rotary Drill',
      'Slide Drill',
      'In Slips',
      'Ream',
      'Run In, Pump',
      'Run In, Rotate',
      'Run In',
      'Back Ream',
      'Pull Up, Pump',
      'Pull Up, Rotate',
      'Pull Up',
      'Rotate, Pump',
      'Pump',
      'Rotate',
      'Stationary',
      'Unknown',
      'Absent',
      'Data Gap'
    ];

    this.$bus.on(this.$bus.E_SETTINGS, (settings) => {
      let rigInfoUrl = settings.drillingApiTimeDataURI + '/2015/TimeData/GetLastValue';
      let postData = {
        mnemonics: ['DrillBoreHole.TD', 'DepthMonitoring.RBD', 'DepthMonitoring.ACTIVITY'],
        units: ['ft', 'ft', 'Euc']
      };
      this.$http
        .post(rigInfoUrl, postData, { headers: { Authorization: 'Bearer ' + settings.serviceToken, 'slb-wellId': settings.wellID } })
        .then((wellinfo) => {
          if (wellinfo && wellinfo.data) {
            let resp = wellinfo.data;
            let rigInfo = {
              holeDepth: '--',
              holeDepthTime: '',
              holeDepthUnit: 'ft',
              bitDepth: '--',
              bitDepthUnit: 'ft',
              rigState: '--'
            };
            for (let c of resp['lastValues']) {
              if (c['mnemonic'] === 'DrillBoreHole.TD' && c['value']['value']) {
                rigInfo.holeDepth = c['value']['value'].toFixed(2);
                rigInfo.holeDepthTime = c['value']['time'];
              }
              if (c['mnemonic'] === 'DepthMonitoring.RBD' && c['value']['value']) {
                rigInfo.bitDepth = c['value']['value'].toFixed(2);
              }
              if (c['mnemonic'] === 'DepthMonitoring.ACTIVITY') {
                let rig = c['value']['value'];
                if (rig !== undefined && rig !== null) {
                  rigInfo.rigState = rigState[rig] || '--';
                }
              }
            }
            this.rigInfo = rigInfo;
          }
        })
        .catch(err => console.log(err));
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
