<template>
  <li>
    <article 
      contenteditable="true"
      @contextmenu.prevent="removeSelf"
      @click="createNode"
      @keyup.shift.delete="removeSelf"
    >
      {{ node.label }}
    </article>
    <ul v-if="node.children && node.children.length">
      <node-tree 
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        @delete-node="deleteChildNode(index)"        
      ></node-tree>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'NodeTree',
  data: () => ({
    numClicks: 0
  }),
  props: {
    node: Object
  },
  methods: {
    createNode: function() {
      this.numClicks++;
      setTimeout(() => {
        if(this.numClicks > 1) {
          this.node.children.push({
            label: 'New node',
            children: []          
          });
        }
        this.numClicks = 0;
      }, 300);
    },
    removeSelf: function() {    
      this.$emit('delete-node');
    },
    deleteChildNode: function(index) {
      if(this.node.children.length > index) {
        this.node.children.splice(index, 1);
      }
    }
  }
}
</script>
