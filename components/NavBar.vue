<template>
  <nav>
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 1920 85" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M49 82H-36V-72L2048 -59L2042 73.5H1568.5C1296.5 73.5 1050.5 60.5 818.5 60.5C553.5 60.5 222.5 82 49 82Z"
        fill="black"
        fill-opacity="0.8"
        stroke="url(#svg-grad)"
        stroke-width="5"
      />
      <defs>
        <linearGradient id="svg-grad" x1="-200%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(0,100,200);stop-opacity:1" />
          <stop offset="33%" style="stop-color:rgb(0,220,250);stop-opacity:1" />
          <stop offset="66%" style="stop-color:rgb(0,100,200);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(0,220,250);stop-opacity:1" />
          <animate
            attributeName="x1"
            attributeType="XML"
            begin="0s"
            dur="5s"
            from="-200%"
            repeatCount="indefinite"
            to="-0%"
          />
          <animate
            attributeName="x2"
            attributeType="XML"
            begin="0s"
            dur="5s"
            from="100%"
            repeatCount="indefinite"
            to="300%"
          />
        </linearGradient>
      </defs>
    </svg>

    <NuxtLink class="nav_logo w-24 mx-0 lg:w-96 lg:-mx-3 " to="/">
      <img alt="Marchewczyk.notes" class="invisible lg:visible w-full" src="~/assets/images/logotype-notes-white.svg">
      <img alt="Marchewczyk.notes" class="lg:invisible w-22 ml-3" src="~/assets/images/logo.svg">
    </NuxtLink>
    <div v-if="logged">
      <NuxtLink to="/notes">
        <button>
          Notes
        </button>
      </NuxtLink>
      <hr class="inline-block relative w-0.5 h-10 t-0 m-0 mr-5 bg-white z-10 align-top rounded mt-0.5">
      <span class="hidden lg:inline-block">
        {{ user.displayName }}
      </span>
      <button @click="logout">
        Logout
      </button>
    </div>
    <div v-if="!logged">
      <NuxtLink to="/login">
        <button>
          Login
        </button>
      </NuxtLink>

      <NuxtLink to="/register">
        <button>
          Register
        </button>
      </NuxtLink>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'NavBar',
  computed: mapState('user', ['user', 'logged']),
  methods: {
    ...mapActions('user', ['signOut']),
    async logout () {
      await this.signOut()
      if (!this.logged) {
        await this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
nav {
  display: block;
  position: absolute;
  width: 100vw;
  height: 3.5em;
  overflow-x: hidden;
  @apply select-none;

  svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    height: 100%;
  }

  .nav_logo {
    display: inline-block;
    position: relative;
    height: 3em;
    //width: 15em;
    //margin-left: 0.1em;
    text-decoration: none;
    user-select: none;
    z-index: 10;

    img {
      position: absolute;
      height: 2.4em;
      top: 0.35em;
      left: 0em;
    }

  }

  div {
    float: right;
    margin-right: 0.4em;
    margin-top: 0.5em;
    z-index: 10;

    a.nuxt-link-active button {
      font-weight: 500;
    }

    span {
      //display: inline-block;
      position: relative;
      outline: none;
      border: none;
      background: none;
      color: white;
      text-decoration: none;
      font-size: 1.2em;
      margin-right: .8em;
      font-weight: 300;
      font-family: Quicksand, sans-serif;
      z-index: 10;
    }

    button {
      display: inline-block;
      position: relative;
      outline: none;
      border: none;
      background: none;
      color: white;
      text-decoration: none;
      font-size: 1.2em;
      margin-right: .8em;
      font-weight: 300;
      font-family: Quicksand, sans-serif;
      cursor: pointer;
      z-index: 10;

      &:hover {
        &:before, &:after {
          width: 100%;
        }

        &:before {
          top: calc(100% + 2px);
        }

        &:after {
          top: -2px;
        }
      }

      &:before, &:after {
        content: "";
        display: block;
        position: absolute;
        height: 2px;
        background-color: white;
        width: 0;
        border-radius: 4px;
        transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      &:before {
        right: 0;
        top: -2px;
      }

      &:after {
        left: 0;
        top: calc(100% + 2px);
      }
    }
  }

}
</style>
