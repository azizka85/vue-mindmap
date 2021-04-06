<template>
  <div class="container">
    <tool-bar></tool-bar>
    <mind-map></mind-map>
  </div>
</template>

<script>
import MindMap from './components/mindmap/MindMap.vue';
import ToolBar from './components/mindmap/ToolBar.vue';

export default {  
  name: 'App',
  components: { MindMap, ToolBar }
}
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
