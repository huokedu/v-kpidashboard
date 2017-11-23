<template>
    <div class="header-bar">
        <div class="title">
            <span class="top-title">{{topTitle}}</span>
            <span class="top-sub-title">{{topSubTitle}}</span>
            <div class="sub-title">{{subTitle}}</div>
        </div>
         <div class="header-profile">
            <div class="header-menu-btn">
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <title>Icons_Global Navigation</title>
                <rect y="29.47" width="10.53" height="10.53"/>
                <rect x="14.74" y="29.47" width="10.53" height="10.53"/>
                <rect x="29.47" y="29.47" width="10.53" height="10.53"/>
                <rect y="14.74" width="10.53" height="10.53"/>
                <rect x="14.74" y="14.74" width="10.53" height="10.53"/>
                <rect x="29.47" y="14.74" width="10.53" height="10.53"/>
                <rect width="10.53" height="10.53"/>
                <rect x="14.74" width="10.53" height="10.53"/>
                <rect x="29.47" width="10.53" height="10.53"/>
              </svg>
            </div>
            <div class="profile-dropdown">
              <button class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="top-bar-name">{{username}}</span>
                <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
              </button>
              <div class="dropdown-menu" id="profileMenu" aria-labelledby="dropdownMenu1">
                <form ngNoForm method="post" action="/logout">
                  <input type="submit" value="Log Out" class="btn btn-danger btn-block logout">
                  <div><a class="credits-link" target="_blank" href="/credits">Third Parties...</a></div>
                </form>
              </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'header-bar',
  data() {
    return {
      topTitle: 'Drilling Performance',
      username: ''
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
    },

    subTitle: function () {
      return this.$store.getters.wellInfo.wellname;
    }
  },

  mounted() {
    this.$bus.on(this.$bus.E_SETTINGS, (settings) => {
      this.$store.dispatch('getWellInfo');
    })

    this.updateProfile();
  },

  methods: {
    updateProfile() {
      this.$http
        .get('/api/user')
        .then((res) => {
          if (res && res.data) {
            this.username = res.data.name || res.data.upn;
          }
        })
        .catch(err => console.log(err));
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../global.scss";
.header-bar {
  font-family: "RobotoRegular";
  height: $topbarHeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.header-menu-btn {
  $svgIconSize: 24px;
  background: transparent;
  border: none;
  height: $svgIconSize;
  margin-right: 0.5rem;

  svg {
    fill: #009fc2;
    width: $svgIconSize;
    height: $svgIconSize;
  }
  &:hover {
    cursor: pointer;
  }
}

.header-profile {
  display: flex;
  align-items: center;
  .dropdown-toggle {
    background: transparent;
    border: none;
  }
  .glyphicon-triangle-bottom {
    color: #009fc2;
    font-size: 1rem;
  }
  .top-bar-name {
    color: black;
    cursor: pointer;
    user-select: none;
    font-family: RobotoBold;
  }
  .dropdown-menu {
    border-radius: 0;
    left: auto;
    right: 0;
    top: 40px;
    width: 375px;
    height: 118px;
    border: 1px solid #e7e7e7;
    box-shadow: none;
    background: white;
    text-align: center;
    padding: 3rem 1.5rem 1.5rem 1.5rem;

    .credits-link {
      font-size: 1rem;
      color: #a0a0a0;
      cursor: pointer;
      &:hover,
      &:visited,
      &:focus {
        color: #a0a0a0;
        text-decoration: underline;
      }
    }
    .logout {
      letter-spacing: 1px;
      height: 37px;
      font-size: 12px;
      border-radius: 0;
    }
  }
}
</style>
