<template>
  <div id="app">
    <div class="container mt-5">
      <div class="form-group">
        <label for="exampleInputEmail1">Email</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="loginForm.email">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="loginForm.password">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Confirm Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="loginForm.confirmPassword">
      </div>
      <button v-on:click="register(loginForm)" class="btn btn-primary">Login</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';

export default Vue.component('SubmitRecord', {
  data: () => ({
    loginForm: {
      email: null,
      password: null,
      confirmPassword: null
    },
    valid: false,
  }),
  methods: {
    register(loginForm: any) {
      Axios.post('http://localhost:3001/auth/register', loginForm)
        .then((response: any) => {
          this.$router.push({ path: '/about' })
        });
    }
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>