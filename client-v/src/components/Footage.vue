<template>
    <div class="footage">
        <div class="info">
            <div class="info-row">
                <div class="name">{{name}}</div>
                <div class="state-target-container">
                    <div v-if="isAlert" class="state state-alert">
                        <svg fill="#D34C4B" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                            <path d="M20,1.92,0,38.08H40ZM4.39,35.48,20,7.34,35.57,35.48Z" />
                            <rect x="18.71" y="18.47" width="2.57" height="8.92" />
                            <rect x="18.71" y="29.01" width="2.57" height="3.02" />
                        </svg>
                        <span class="icon-text">Behind</span>
                    </div>
                    <div v-else class="state">
                        <span class="icon fa fa-check-circle-o"></span>
                        <span class="icon-text">On Track</span>
                    </div>
                    <div class="target">
                        <span class="target-icon fa fa-cog"></span>
                    </div>
                </div>
            </div>
            <div class="info-row">
                <div class="current">
                    <div class="current-title">CURRENT ({{currentFootage.unit}})</div>
                    <div class="current-value">{{currentFootage.value}}</div>
                </div>
                <div class="projected">
                    <div class="projected-title">PROJECTED/TARGET(ft/day)</div>
                    <div class="projected-target-value">
                        <span class="projected-value" :class="{'projected-value-alert':isAlert}">{{projectedFootage.value}}</span>
                        <span class="value-splitter">/</span>
                        <span class="target-value">{{currentTarget.value}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="chart" ref="footageChart"></div>
    </div>
</template>

<script>

export default {
    props: ['name', 'kind'],

    data() {
        return {
            isAlert: false,
            chartDom: '',
            chartData: '',
            chartOption: ''
        }
    },

    computed: {
        currentFootage: function () {
            let footageData = this.$store.getters.footage.slice();
            if (!footageData || !footageData.length) {
                return {
                    value: '--',
                    unit: '--'
                };
            }
            footageData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            let cf = footageData[footageData.length - 1] || {};
            let previousFootageData = footageData.slice();
            previousFootageData.length = footageData.length - 1;
            let chartData = {};
            let rigTimeZone = this.$store.getters.wellInfo.rigTimezone;
            chartData.dayAxis = previousFootageData.map(it => new Date(it.startTime))
                .map(date => new Date(date.valueOf() + rigTimeZone * 3600 * 1000).toISOString())
                .map(d => {
                    const MONTH_STR = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
                    let m = new Date(d);
                    return (d.split('-')[2].split('T'))[0] + ' ' + MONTH_STR[m.getUTCMonth()];
                });
            if (this.kind === 'ROP') {
                chartData.perDayData = previousFootageData.map(it => this.convertValue(it.rop));
                this.chartData = chartData;
                return {
                    value: this.convertValue(cf.rop) || '--',
                    unit: 'ft/h' || cf.ropUnit || '--'
                }
            } else {
                chartData.perDayData = previousFootageData.map(it => this.convertValue(it.drilledFootage));
                this.chartData = chartData;
                return {
                    value: this.convertValue(cf.drilledFootage) || '--',
                    unit: 'ft' || cf.footageUnit || '--'
                };
            }
        },

        projectedFootage: function () {
            let projected = { ...this.$store.getters.projected };
            if (this.kind === 'ROP') {
                return {
                    value: this.convertValue(projected.projectRop),
                    unit: projected.ropUnit
                }
            } else {
                return {
                    value: this.convertValue(projected.projectFootage),
                    unit: projected.footageUnit
                }
            }
        },

        currentTarget: function () {
            if (!this.$store.getters.target) {
                return { value: '--', unit: '' };
            }
            let t = { ...this.$store.getters.target };
            let curTarget = t.data.find(it => it.state === 'Active');

            if (this.kind === 'ROP') {
                return {
                    value: parseFloat(curTarget.targetOnBottomRop).toFixed(1),
                    unit: t.ropUnit
                }
            } else {
                return {
                    value: parseFloat(curTarget.targetFootage).toFixed(1),
                    unit: t.lengthUnit
                }
            }
        }
    },

    methods: {
        getDefaultOptions() {
            return {
                animation: false,
                grid: {
                    top: 20,
                    bottom: 20,
                    left: 15,
                    right: 15
                },
                xAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    type: 'category',
                    data: ['', '', '', '', ''],
                    axisLabel: {
                        show: true,
                        rotate: 0,
                        textStyle: {
                            color: '#737373',
                            fontFamily: 'RobotoRegular'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    nameGap: 0,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'white',
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'Footage',
                        type: 'bar',
                        z: 10,
                        itemStyle: {
                            normal: {
                                color: '#009fc2'
                            }
                        }
                    },
                    {
                        name: 'Target',
                        type: 'scatter',
                        z: 20,
                        symbol: 'rect',
                        silent: true,
                        symbolOffset: [0, 0],
                        itemStyle: {
                            normal: {
                                color: '#3D3D3D'
                            }
                        }
                    },
                    {
                        name: 'Projected',
                        type: 'bar',
                        barWidth: '50%',
                        itemStyle: {
                            normal: {
                                color: '#587644'
                            }
                        }
                    },
                    {
                        name: 'TargetBar',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#f5f5f5'
                            }
                        }
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    confine: true,
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: 'rgba(255,0,0,0)'
                        }
                    },
                    // position: function (point, params, dom, rect, size) {
                    //     if (params[0].dataIndex === 0) {
                    //         return ['14%', '40%'];
                    //     }
                    //     if (params[0].dataIndex === 1) {
                    //         return ['32%', '40%'];
                    //     }
                    //     if (params[0].dataIndex === 2) {
                    //         return ['50%', '40%'];
                    //     }
                    //     if (params[0].dataIndex === 3) {
                    //         return ['70%', '40%'];
                    //     }
                    //     if (params[0].dataIndex === 4) {
                    //         return ['88%', '40%'];
                    //     }
                    // },
                    backgroundColor: 'black'
                }
            };
        },

        adjustSizeOpt(opt) {
            let barW = parseInt('' + this.chartDom.getWidth() * 0.2 * 0.3 * 0.95, 10);
            opt.series[0].barGap = -1;
            opt.series[1].symbolSize = [barW, 3];
            opt.series[3].barGap = -1;
            return opt;
        },

        convertValue(value) {
            const FACTOR = 3.28083989501312;
            if (value === '--') {
                return '--';
            }
            if (value > 0) {
                return (Math.floor(FACTOR * value * 10) / 10).toString();
            } else {
                return '0';
            }
        },

        updateChart() {
            var opt = this.chartOption;
            opt.series[0].name = this.kind;
            opt.series[0].data = this.chartData.perDayData;
            opt.xAxis.data = this.chartData.dayAxis;
            this.chartDom.setOption(opt);
        },

        tipFormatter(params) {
            var $ = window.$;
            var footageValue = '--';
            var targetValue = '--';
            var ropValue = '--';
            params.forEach((param) => {
                let v = param.value;
                let n = param.seriesName;
                if (n === 'ROP') {
                    ropValue = v;
                }
                if (n === 'footage') {
                    footageValue = v;
                }
                if (n === 'TargetBar') {
                    targetValue = v;
                }
            });
            var divWarp = $('<div style="position: relative;display: inline-block;">');
            var divContent = $('<div class="tooltiptext"></div>');
            var divTitle = $('<div style="font-size:14px;color:#E7e7e7;padding:10px 14px 0 14px;font-family: Roboto">');
            var span1;
            var span2;
            if (footageValue !== '--') {
                span1 = $('<span style="text-align:left;margin-right:20px">').text('FOOTAGE (ft)');
            }
            if (ropValue !== '--') {
                span1 = $('<span style="text-align:left;margin-right:20px">').text('ROP (ft/hr)');
            }
            if (footageValue !== '--') {
                span2 = $('<span style="float:right">').text('TARGET (ft/day)');
            }
            if (ropValue !== '--') {
                span2 = $('<span style="float:right">').text('TARGET (ft/hr)');
            }
            var divValue = $('<div style="font-size:24px;color:#E7e7e7;padding:0px 14px 14px 14px;font-family: RobotoBold">');
            var span3;
            if (footageValue !== '--') {
                span3 = $('<span style="text-align:left">').text(footageValue);
            }
            if (ropValue !== '--') {
                span3 = $('<span style="text-align:left">').text(ropValue);
            }
            var span4 = $('<span style="float:right;padding-right:18px">').text(targetValue);
            divTitle.append(span1).append(span2);
            divValue.append(span3).append(span4);
            divContent.append(divTitle).append(divValue);
            divWarp.append(divContent);
            return divWarp.html();
        },

        getLastDaysTargets(targetList, currentDateString, lastDaysCount = 5) {
            if (!targetList || !currentDateString || !targetList.length) {
                return [];
            }

            let lastDaysDate = [];
            for (let i = lastDaysCount; i > 0; i--) {
                let currentDate = new Date(currentDateString);
                let currentTargetDate = new Date(new Date(currentDate.setHours(0)).setMinutes(0)).setSeconds(0);
                lastDaysDate.push(currentDate.setDate(new Date(currentTargetDate).getDate() - i));
            }
            let lastDaysTargets = [];
            for (var j = 0; j < lastDaysDate.length; j++) {
                let tar = targetList.find((t) => {
                    let targetStartTime = new Date(new Date(new Date(t.startDate).setHours(0)).setMinutes(0)).setSeconds(0);
                    if (t.state === 'Historical') {
                        return (Number(new Date(targetStartTime)) <= lastDaysDate[j] && lastDaysDate[j] <= Number(new Date(t.endDate)));
                    }
                    if (t.state === 'Active') {
                        return (Number(new Date(targetStartTime)) <= lastDaysDate[j]);
                    }
                });
                lastDaysTargets.push(tar);
            }
            return lastDaysTargets;
        }

    },

    mounted() {
        console.log('footage component mounted');
        this.chartDom = window.echarts.init(this.$refs.footageChart);
        this.chartOption = this.getDefaultOptions();
        this.chartOption.tooltip.formatter = this.tipFormatter;
        this.chartDom.setOption(this.adjustSizeOpt(this.chartOption), true);
        window.addEventListener('resize', () => this.chartDom.resize())
    },

    activated() {
        console.log('footage component avtivated');
    },

    watch: {
        'chartData': function () {
            this.updateChart();
        }
    }

}
</script>

<style lang="scss" scoped>
$normalFontSize: 14px;
$onTrackColor: #8cc151;
$alertColor: #d34c4b;

.footage {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 9px $normalFontSize 0 $normalFontSize;
}

.info-row:nth-child(1) {
  margin-bottom: $normalFontSize;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-family: RobotoBold;
    font-size: $normalFontSize;
  }
  .state-target-container {
    display: flex;
    align-items: center;
    .state {
      color: $onTrackColor;
      svg {
        height: $normalFontSize;
        position: relative;
        top: 1px;
      }
    }
    .state-alert {
      color: $alertColor;
    }
    .target {
      margin-left: 2em;
      .target-icon {
        color: #009fc2;
      }
    }
  }

  .current-title,
  .projected-title {
    font-size: 12px;
  }
  .current-value,
  .projected-target-value {
    font-size: 24px;
    font-family: RobotoBold;
  }

  .projected-value {
    color: $onTrackColor;
  }

  .projected-value-alert {
    color: $alertColor;
  }
}

.chart {
  display: flex;
  flex: 1;
}
</style>
