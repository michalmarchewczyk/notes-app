<template>
  <nav>
    <svg viewBox="0 0 1920 85" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M49 82H-36V-72L2048 -59L2042 73.5H1568.5C1296.5 73.5 1050.5 60.5 818.5 60.5C553.5 60.5 222.5 82 49 82Z"
        fill="black"
        fill-opacity="0.8"
        stroke="url(#svg-grad)"
        stroke-width="5"
      />
      <defs>
        <linearGradient id="svg-grad" x1="-200%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(0,100,200);stop-opacity:1" />
          <stop offset="33%" style="stop-color:rgb(0,220,250);stop-opacity:1" />
          <stop offset="66%" style="stop-color:rgb(0,100,200);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(0,220,250);stop-opacity:1" />
          <animate
            attributeType="XML"
            attributeName="x1"
            from="-200%"
            to="-0%"
            dur="5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeType="XML"
            attributeName="x2"
            from="100%"
            to="300%"
            dur="5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>

    <NuxtLink to="/" class="nav_logo w-24 mx-0 lg:w-96 lg:-mx-3 ">
      <img src="~/assets/images/logotype-notes-white.svg" alt="" class="invisible lg:visible w-full">
      <img src="~/assets/images/logo.svg" alt="" class="lg:invisible w-22 ml-3">
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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  computed: mapState('user', ['user', 'logged']),
  methods: {
    ...mapActions('user', ['signOut']),
    async logout () {
      await this.signOut()
      if (!this.logged) {
        // await router.push('/login')
        await this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped lang='scss'>
nav {
  display: block;
  position: absolute;
  //box-shadow: 0 -22px 16px 20px rgba(0,0,0,0.4);
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

  div{
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
