<template>
  <ul class="mindmap">
    <node-tree 
      v-for="(nodeData, index) in treeData"
      :key="nodeData.id"
      :node="nodeData"
      :tabIndex="index"
      :root="true"
      @delete-node="deleteChildNode(index)"
      @create-node="createChildNode"
      @focus-child-up-node="focusChildUpNode(index)"
      @focus-child-down-node="focusChildDownNode(index)"
    />
  </ul>  
</template>

<script>
import NodeTree from './NodeTree.vue';

export default {
  name: 'Tree',
  props: {
    treeData: Array
  },
  methods: {
    deleteChildNode: function(index) {
      if(this.treeData.length > 1 && this.treeData.length > index) {
        this.treeData.splice(index, 1);
      }
    },
    createChildNode: function() {
      this.treeData.push({
        id: Date.now(),
        label: '',
        active: true,
        editable: true,
        children: []          
      });            
    },
    focusChildUpNode: function(childIndex) {
      let index = 0;
      if(childIndex > 0) {        
        index = childIndex - 1;              
      }

      this.treeData[index].active = true;
      this.treeData[index].id = Date.now();         
    },
    focusChildDownNode: function(childIndex) {
      let index = this.treeData.length - 1;
      if(childIndex < this.treeData.length - 1) {        
        index = childIndex + 1;              
      }

      this.treeData[index].active = true;
      this.treeData[index].id = Date.now();  
    }            
  },
  components: { NodeTree }
}
</script>

<style lang="scss">
.mindmap {
  article {
    padding: 8px;
    border: 1px solid black;

    &:focus {
      outline: 3px dashed orange;
      border: none;
    }
  }  
  li {
    list-style: none;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    margin: 16px;
    line-height: 1;
    position: relative;

    & > ul:before {
      content: "";
      border: 1px solid black;
      border-top: none;
      border-left: none;
      width: calc(16px - 2px);
      height: 0px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &:before {
      content: "";
      border: 1px solid black;
      border-top: none;
      border-left: none;
      width: 16px;
      height: 0px;
      position: absolute;
      left: calc(-16px - 1px);
    }

    &:after {
      content: "";
      border: 1px solid black;
      border-top: none;
      border-left: none;
      width: 0px;
      height: calc(100% + 16px);
      position: absolute;
      left: calc(-16px - 2px);
    }

    &:first-of-type:after {
      top: 50%;
      height: calc(100% / 2 + 16px);
    }

    &:first-of-type:nth-last-child(1):after {
      height: 0;
    }

    &:last-of-type:after {
      bottom: 50%;
      height: calc(100% / 2 + 16px);
    }
    
    ul {
      padding: 0 0 0 16px;
      position: relative;
    }                    
  }

  & > li {
    &:after,
    &:before {
      display: none;
    }
  }  
}
</style>
