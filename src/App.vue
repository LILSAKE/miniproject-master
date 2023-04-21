<template>
  <div id="app">
    <HelloWorld :folders="folders"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      folders: [
        {
          id: 0,
          title: 'Покупки',
          color: "#42B883",
          tasks: [
            {
              isDone: false
            }
          ]
        },
        {
          id: 1,
          title: 'Фронтенд',
          color: "#64C4ED",
        },
        {
          id: 2,
          title: 'Фильмы и сериалы',
          color: '#FFBBCC'
        },
        {
          id: 3,
          title: 'Киниги',
          color: '#B6E6BD'
        },
        {
          id: 4,
          title: 'Личное',
          color: '#C9D1D3'
        },
      ],
    };
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

