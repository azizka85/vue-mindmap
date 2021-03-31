<template>
  <li>
    <article 
      contenteditable="true"
      @dblclick="createNode"
      @keyup.alt.67="removeSelf"
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
  props: {
    node: Object
  },
  methods: {
    createNode: function(args) {
      this.node.children.push({
        label: 'New node',
        children: []          
      });
    },
    removeSelf: function(args) {                 
      this.$emit('deleteNode');
    },
    deleteChildNode: function(index) {
      if(this.node.children.length > index) {
        this.node.children.splice(index, 1);
      }
    }
  }
}
</script>
