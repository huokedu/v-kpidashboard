<template>
  <div class="sidebar" :class="{opened:isOpened}">
     <div class="sidebar-switcher" @click="onSwitchClick">
         <span class="icon fa fa-bars"></span>
         <span class="sidebar-title">DrillOps</span>
     </div>
     <div class="sidebar-menu">
         <router-link :to="{ path: 'performance', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/performance'}">
             <span class="item-icon fa fa-bar-chart"></span>
             <span class="sidebar-menu-item-txt">Performance</span>
         </router-link>
         <router-link :to="{ path: 'qcview', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/qcview'}">
             <span class="item-icon fa fa-line-chart"></span>
             <span class="sidebar-menu-item-txt">Stand Analysis</span>
         </router-link>
         <router-link :to="{ path: 'alertcenter', query: $route.query}" class="sidebar-menu-item" :class="{active:$route.path==='/alertcenter'}">
            <span class="item-icon">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,1.92,0,38.08H40ZM4.39,35.48,20,7.34,35.57,35.48Z"></path>
                    <rect height="8.92" width="2.57" x="18.71" y="18.47"></rect>
                    <rect height="3.02" width="2.57" x="18.71" y="29.01"></rect>
                </svg>
            </span>
            <span class="sidebar-menu-item-txt">Alert Center</span>
        </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'side-bar',
  data() {
    return {
      isOpened: false
    }
  },

  mounted() {
  },

  methods: {
    onSwitchClick() {
      this.isOpened = !this.isOpened;
    }
  }

}
</script>

<style lang='scss' scoped>
@import "../global.scss";

$expandWidth: 20rem;

.sidebar {
  width: $sidebarWidth;
  min-width: $sidebarWidth;
  transition: all 0.5s cubic-bezier(0.35, 0, 0.25, 1);
  transform: translateZ(0);
  overflow: hidden;
  z-index: 1030;
  background-color: #242424;
  color: hsla(0, 0%, 100%, 0.87);
}

.sidebar-switcher,
.sidebar-menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 2.5rem;
  overflow: hidden;
  width: $expandWidth;
  height: $topbarHeight;
  box-sizing: border-box;
  border-bottom: 1px solid #373737;
  border-left: 1px solid #373737;
  border-right: 1px solid #373737;
  text-decoration: none;
  .icon {
    width: $topbarHeight;
    text-align: center;
    color: rgba(255, 255, 255, 0.87);
    cursor: pointer;
  }
  .sidebar-title {
    font-family: Exo, "Helvetica Neue", sans-serif;
    font-size: 2.2rem;
    line-height: 1.6rem;
    letter-spacing: 0.2rem;
    color: rgba(255, 255, 255, 0.87);
  }
}

.sidebar-menu-item {
  transition: all 0.4s ease-in;
  color: #009fc2;
  &:hover {
    cursor: pointer;
    background-color: #009fc2;
    color: white;
    .item-icon svg {
      fill: white;
    }
  }
  .item-icon {
    width: $topbarHeight;
    text-align: center;
    svg {
      fill: #009fc2;
      width: 32px;
      height: 32px;
    }
  }
  .sidebar-menu-item-txt {
    font-size: 1.6rem;
    line-height: 1.6rem;
  }
}

.sidebar-menu-item.active {
  transition: all 0.5s ease-in;
  color: white;
  background-color: #545454;
  .item-icon {
    svg {
      fill: white;
    }
  }
}

.sidebar.opened {
  width: $expandWidth;
  min-width: $expandWidth;
}
</style>
