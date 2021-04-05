<template>
  <li>
    <article 
      ref="article"
      :class="{collapsed: node.collapsed}"
      :tabindex="tabIndex"
      :contenteditable="node.editable"  
      @focus="onNodeFocus"
      @blur="onNodeBlur"
      @input="onNodeInput"
      @click="onNodeClicked"      
      @keydown.space="onNodeSpacePressed"
      @keydown.tab.prevent="onNodeTabPressed"
      @keydown.enter.prevent="onNodeEnterPressed"
      @keydown.delete="onNodeDelPressed"      
      @keydown.left="onNodeLeftPressed"
      @keydown.right="onNodeRightPressed"
      @keydown.up="onNodeUpPressed"   
      @keydown.down="onNodeDownPressed"    
      @keydown.68.exact="onNodeDPressed"
      @keydown.shift.68="onNodeShiftDPressed"        
    />
    <ul v-if="!node.collapsed && node.children && node.children.length">
      <node-tree 
        v-for="(child, index) in node.children"
        :key="child.id"
        :node="child"
        :tabIndex="index"
        :parent="node"
      />
    </ul>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NodeTree',
  data: () => ({
    numClicks: 0,
    childrenCollapsed: false
  }),  
  props: {
    node: Object,
    tabIndex: Number,
    parent: Object
  },
  computed: {
    label() {
      return this.node.label;
    },
    active() {
      return this.node.active;
    }
  },
  watch: {
    label(newLabel) {
      this.updateArticleContent(newLabel);
    },
    active(newActive) {
      this.updateArticleFocus(newActive);
    }
  },
  mounted: function() {
    this.updateArticleContent(this.label);
    this.updateArticleFocus(this.active);
  },
  methods: {
    onNodeFocus: function() {
      if(!this.node.active) {
        this.setNodeActive({
          node: this.node,
          active: true
        });        
      }
    },
    onNodeBlur: function() {
      if(this.node.active) {
        this.setNodeActive({
          node: this.node,
          active: false
        });        
      }
    },
    onNodeInput: function() {
      this.setNodeLabel({
        node: this.node,
        label: this.$refs.article.textContent
      });
    },
    onNodeClicked: function() {
      this.numClicks++;

      setTimeout(() => {
        if(this.numClicks > 1 && !this.node.editable) {
          this.setNodeEditable({
            node: this.node,
            editable: true
          });
        }
        this.numClicks = 0;
      }, 300);
    },
    onNodeSpacePressed: function(event) {
      if(!this.node.editable) {
        event.preventDefault();

        this.setNodeEditable({
          node: this.node,
          editable: true
        });        
      }
    },  
    onNodeTabPressed: function() {
      this.addNewNode(this.node);
    },  
    onNodeEnterPressed: function() {
      if(!this.node.editable) {
        this.addNewNode(this.parent);       
      } else {
        this.setNodeEditable({
          node: this.node,
          editable: false
        });
      }
    },
    onNodeDelPressed: function() {
      if(!this.node.editable) {
        this.removeNode({
          parent: this.parent,
          node: this.node
        });        
      }
    },
    onNodeLeftPressed: function() {
      if(!this.node.editable) {
        this.moveNodeToLeft({
          node: this.node,
          parent: this.parent
        });
      }
    },
    onNodeRightPressed: function() {
      if(!this.node.editable) {        
        this.moveNodeToRight(this.node);
      }      
    },
    onNodeUpPressed: function() {
      this.moveNodeToUp({
        node: this.node,
        parent: this.parent
      });          
    },
    onNodeDownPressed: function() {
      this.moveNodeToDown({
        node: this.node,
        parent: this.parent
      });          
    },
    onNodeDPressed: function() {
      if(!this.node.editable) {
        if(this.node.collapsed) {
          this.setNodeCollapsed({
            node: this.node,
            collapsed: false
          });
        } else {
          this.setNodeCollapsed({
            node: this.node,
            collapsed: true
          });
        }
      }
    },
    onNodeShiftDPressed: function() {
      if(!this.node.editable) {
        this.childrenCollapsed = !this.childrenCollapsed;

        this.setChildNodesCollapsed({
          node: this.node,
          collapsed: this.childrenCollapsed
        });        
      }
    },    
    addNewNode(parent) {
      this.createChildNode({
        parent,
        newNode: {
          id: Date.now(),
          label: '',
          active: true,
          editable: true,
          collapsed: false,
          children: []          
        }
      });
    },    
    updateArticleContent(content) {
      this.$refs.article.textContent = content;
    },
    updateArticleFocus(active) {
      if(active) {
        this.$refs.article.focus();
      } else {
        this.$refs.article.blur();
      }
    },    
    ...mapActions([
      'setNodeLabel',
      'setNodeActive',      
      'setNodeEditable',
      'setNodeCollapsed',
      'setChildNodesCollapsed',
      'createChildNode',
      'removeNode',
      'moveNodeToLeft',
      'moveNodeToRight',
      'moveNodeToUp',
      'moveNodeToDown'
    ])    
  }
}
</script>
