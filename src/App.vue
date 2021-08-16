<template>
    <div id="app">
        <h1>Mapsi, Path finding visualizer</h1>
        <Map/>
    </div>
</template>

<script>
import Map from '@/components/Map.vue';

export default {
  name: 'App',
  components:{
      Map
  }
}
</script>

<style>
*{
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.node{
    border: 1px solid gray;
    width: 20px;
    height: 20px;
    cursor: cell;
}
.node:hover{
    background-color: aqua;
}

.node.wall{background-color: gray;}
.node.start{background-color: blue;}
.node.end{background-color: red;}
.node.path{background-color: yellow;}

</style>
