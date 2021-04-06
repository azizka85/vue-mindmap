<template>
  <ul class="mindmap" @click="disposeActiveNode">
    <node 
      v-for="(node, index) in root.children"      
      :key="node.id"
      :node="node"
      :tabIndex="index"
    />
  </ul>  
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Node from './Node.vue';

export default {
  name: 'MindMap',
  components: { Node },
  computed: {
    ...mapGetters([
      'root'
    ])
  },
  created: function() {
    this.addParent({
      node: this.root.children[0], 
      parent: this.root
    });
  },
  methods: {
    disposeActiveNode() {
      this.setActiveNode(null);
    },
    ...mapActions([
      'setActiveNode'
    ]),
    ...mapMutations([
      'addParent'
    ])
  }
}
</script>

<style lang="scss">
.mindmap {
  flex: 1;
  margin: 0;
  padding: 0;
  overflow: auto;

  article {
    padding: 8px;
    border: 1px solid black;
    border-radius: 10px;
    outline: none;

    &.active {
      border: 3px dashed orange;
    }

    &.collapsed {
      box-shadow: 0px 1px 0px #888888, 0px 3px 0px #ffffff, 0px 4px 0px #888888, 0px 6px 0px #ffffff, 0px 7px 0px #888888;
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
