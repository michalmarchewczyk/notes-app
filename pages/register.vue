<template>
  <div>
    <h2>
      Register
    </h2>
    <form @submit.prevent="submit">
      <div class="text">
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder=" "
          autocomplete="off"
        >
        <label for="name">Name</label>
      </div>

      <div class="text">
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder=" "
          autocomplete="off"
        >
        <label for="email">Email</label>
      </div>

      <div class="text">
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder=" "
          autocomplete="off"
        >
        <label for="password">Password</label>
      </div>

      <button @click.prevent="submit">
        <span v-if="loading">Loading...</span>
        <span v-if="!loading">Register</span>
        <svg
          v-if="!loading"
          id="form_send_arrow_right"
          width="32"
          height="24"
          viewBox="0 0 32 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="-3.27835e-08"
            y1="12.25"
            x2="30"
            y2="12.25"
            stroke="white"
            stroke-width="1.5"
          />
          <line
            x1="19.5303"
            y1="1.46967"
            x2="30.5303"
            y2="12.4697"
            stroke="white"
            stroke-width="1.5"
          />
          <line
            y1="-0.75"
            x2="15.5563"
            y2="-0.75"
            transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 19 22.5)"
            stroke="white"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </form>
    <div v-if="error" class="msg">
      <span>Error</span>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Register',
  middleware: ['route-guard-logged-out'],
  data: () => ({
    name: '',
    email: '',
    password: ''
  }),
  head: () => ({
    title: 'Register - Marchewczyk.notes'
  }),
  computed: mapState('user', ['error', 'user', 'logged', 'loading']),
  beforeMount () {
    this.setError('')
  },
  methods: {
    ...mapActions('user', ['signUp']),
    ...mapMutations('user', ['setError']),
    async submit () {
      await this.signUp({ name: this.name, email: this.email, password: this.password })
    }
  }
}
</script>

<style scoped lang='scss'>
h2 {
  text-align: center;
  font-family: Quicksand, sans-serif;
  font-weight: 300;
  font-size: 1.8em;
  margin-bottom: 1.4em;
  color: white;
}
form {
  display: block;
  position: relative;
  margin: 2em auto;
  width: 28em;
  max-width: calc(100vw - 4em);

  div.text {
    display: block;
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin-top: 1.8em;

    label {
      display: block;
      position: absolute;
      background: black;
      top: 0;
      margin-top: -1.5em;
      margin-left: 0.4em;
      padding: 0.1em 0.4em 0.1em 0.4em;
      font-size: 1em;
      font-family: Quicksand, sans-serif;
      font-weight: 300;
      pointer-events: none;
      transition: all 0.08s linear;
      color: rgba(255, 255, 255, 0.6);
      user-select: none;
    }

    input:placeholder-shown:not(:focus) + label {
      margin-top: -0.1em;
      font-size: 1.1em;
      margin-left: 0.1em;
    }

    input {
      margin-top: -0.5em;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.4);
      font-size: 1.1em;
      color: white;
      outline: none;
      padding: 0.4em 0 0.4em 0;
      text-indent: 0.4em;
      font-family: Quicksand, sans-serif;
      font-weight: 300;
      transition: border 0.08s linear;
      box-shadow: none;
    }

    input:focus {
      border: 2px solid rgb(255, 255, 255);
    }

    input:focus + label {
      color: rgb(255, 255, 255);
    }
  }

  button {
    display: block;
    background: rgba(0, 0, 0, 0.6);
    height: 2.2em;
    color: white;
    border: 2px solid white;
    outline: none;
    font-family: Quicksand, sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1.6em;
    cursor: pointer;
    overflow: hidden;
    opacity: 0.8;
    user-select: none;

    &:hover {
      opacity: 1;
    }

    &:hover #form_send_arrow_right {
      animation: arrow_right 0.4s linear;
    }

    svg {
      display: block;
      position: relative;
      float: left;
      top: 0;
      left: 0;

      &#form_send_arrow_right {
        margin-top: 0.25em;
        margin-left: 0.15em;
        margin-right: 0.45em;
      }
    }

    span {
      float: left;
      margin-top: 0;
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
  }
}

@keyframes arrow_right {
  0% {
    left: 0;
  }
  30% {
    left: 0.4em;
  }
  70% {
    left: -0.1em;
  }
  100% {
    left: 0;
  }
}

.msg {
  display: block;
  position: relative;
  width: 26.4em;
  margin: 2em auto;
  font-family: Quicksand, sans-serif;
  padding: 0.8em;
  border: 2px solid white;
  color: white;

  span {
    font-size: 1.2em;
    font-weight: 300;

    &:first-child {
      display: block;
      font-weight: 500;
      float: none;
      margin-bottom: 0.2em;
    }

    a {
      color: white;
      font-weight: 500;
    }
  }

}
</style>
