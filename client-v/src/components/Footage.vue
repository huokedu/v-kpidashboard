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
                    <div class="current-title">CURRENT(ft)</div>
                    <div class="current-value">--</div>
                </div>
                <div class="projected">
                    <div class="projected-title">PROJECTED/TARGET(ft/day)</div>
                    <div class="projected-target-value">
                        <span class="projected-value" :class="{'projected-value-alert':isAlert}">--</span>
                        <span class="value-splitter">/</span>
                        <span class="target-value"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="chart" ref="footageChart"></div>
    </div>
</template>

<script>

export default {
    props: ['name'],

    data() {
        return {
            isAlert: false,
            chartDom: ''
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
                    position: function (point, params, dom, rect, size) {
                        if (params[0].dataIndex === 0) {
                            return ['14%', '40%'];
                        }
                        if (params[0].dataIndex === 1) {
                            return ['32%', '40%'];
                        }
                        if (params[0].dataIndex === 2) {
                            return ['50%', '40%'];
                        }
                        if (params[0].dataIndex === 3) {
                            return ['70%', '40%'];
                        }
                        if (params[0].dataIndex === 4) {
                            return ['88%', '40%'];
                        }
                    },
                    backgroundColor: 'transparent'
                }
            };
        },

        adjustSizeOpt(opt) {
            let barW = parseInt('' + this.chartDom.getWidth() * 0.2 * 0.3 * 0.95, 10);
            opt.series[0].barGap = -1;
            opt.series[1].symbolSize = [barW, 3];
            opt.series[3].barGap = -1;
            return opt;
        }
    },

    mounted() {
        console.log('footage component mounted');
        this.chartDom = window.echarts.init(this.$refs.footageChart);
        this.chartDom.setOption(this.adjustSizeOpt(this.getDefaultOptions()), true);
        window.addEventListener('resize', () => this.chartDom.resize())
    },

    activated() {
        console.log('footage component avtivated');
    }
}
</script>

<style lang="scss" scoped>
$normalFontSize: 14px;
$onTrackColor:#8cc151;
$alertColor:#d34c4b;

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
