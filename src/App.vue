<template>
  <tree :treeData="tree"></tree>
</template>

<script>
import Tree from './components/tree/Tree.vue';

export default {
  components: { Tree },
  name: 'App',
  data: () => ({
    tree: [{
      id: Date.now(),
      label: 'Press Space or double click to edit',
      active: false,
      editable: false,
      children: []      
    }]
  })
}
</script>
