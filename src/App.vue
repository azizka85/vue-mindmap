<template>
  <tree :treeData="tree"></tree>
</template>

<script>
import Tree from './components/tree/Tree.vue';

export default {
  components: { Tree },
  name: 'App',
  data: () => ({
    tree: {
      label: 'Food',
      children: []      
    }
  })
}
</script>
