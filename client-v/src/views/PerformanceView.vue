<template>
    <div class="performance-view">
        <div class="performance-view-col left-col">
          <div class="left-col-top">
            <div class="left-col-top-left">
              <footage name="DAILY FOOTAGE" kind="footage"></footage>
            </div>
            <div class="left-col-top-right">
              <footage name="ON-BOTTOM ROP" kind="ROP"></footage>
            </div>
          </div>
          <div class="left-col-bottom">

          </div>
        </div>
        <div class="performance-view-col middle-col">

        </div>
        <div class="performance-view-col right-col">

        </div>
    </div>
</template>

<script>
import Footage from '@/components/Footage'
import { PREVIOUS_DAYS } from '@/util'

export default {
  name: 'performance-view',
  data() {
    return {
      title: 'Performance View',
      config: ''
    }
  },

  components: {
    Footage
  },

  mounted() {
    this.$bus.on(this.$bus.E_SETTINGS, (settings) => {
      this.config = settings;
    });
  },

  activated() {
    if (!this.config) {
      return;
    }
    this.update();
  },

  methods: {
    getTimeList(currentTime) {
      let timeList = [];
      for (let i = 0; i < PREVIOUS_DAYS + 1; i++) {
        let daytime = new Date(currentTime);
        daytime.setDate(daytime.getDate() - i);
        timeList.push(daytime.toISOString());
      }
      return timeList;
    },

    update() {
      return 0;
    }
  },

  computed: {
    'ready': function () {
      if (this.$store.getters.wellInfo && this.$store.getters.rigInfo && this.$store.getters.rigInfo.holeDepthTime) {
        return { ...this.$store.getters.wellInfo, ...this.$store.getters.rigInfo }
      }
    }
  },

  watch: {
    'ready': function (val) {
      let postData = {
        'wellId': this.$store.getters.settings.wellID,
        'wellboreId': this.$store.getters.settings.wellboreID,
        'ropType': 'OnBottom',
        'dates': this.getTimeList(this.$store.getters.rigInfo.holeDepthTime)
      }
      this.$store.dispatch('getFootage', postData)
    }
  }
}
</script>

<style lang='scss' scoped>
.performance-view {
  height: 100%;
  display: flex;
  margin-right: 10px;
}

.performance-view-col {
  height: 100%;
  margin-left: 10px;
}

.left-col {
  width: 50%;
  .left-col-top {
    height: calc(50% - 5px);
    margin-bottom: 10px;
    display: flex;
    .left-col-top-left {
      width: 50%;
      background: white;
      height: 100%;
      margin-right: 5px;
    }
    .left-col-top-right {
      width: 50%;
      background: white;
      height: 100%;
      margin-left: 5px;
    }
  }
  .left-col-bottom {
    height: calc(50% - 5px);
    background: white;
    margin-top: 10px;
  }
}

.middle-col {
  width: 25%;
  background: white;
}

.right-col {
  width: 25%;
  background: white;
}

@media (max-width: 992px) {
  .performance-view {
    height: 100%;
    display: block;
    margin-left: 10px;
  }

  .performance-view-col {
    height: 100%;
    margin-left: 0;
  }

  .left-col {
    width: 100%;
    .left-col-top {
      height: calc(50% - 5px);
      margin-bottom: 10px;
      display: block;
      .left-col-top-left {
        height: calc(50% - 5px);
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
      }
      .left-col-top-right {
        height: calc(50% - 5px);
        width: 100%;
        margin-left: 0;
        margin-top: 10px;
      }
    }
    .left-col-bottom {
      height: calc(50% - 5px);
      margin-top: 10px;
    }
  }

  .middle-col,
  .right-col {
    width: 100%;
    margin-top: 10px;
    height: calc(100% - 15px);
  }
}
</style>
