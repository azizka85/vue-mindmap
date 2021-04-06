<template>
  <li>
    <article 
      ref="article"
      :class="{collapsed: node.collapsed, active: node.active}"
      :tabindex="tabIndex"
      :contenteditable="node.editable"  
      @input="onNodeInput"
      @click.stop="onNodeClicked"      
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
      <node 
        v-for="(child, index) in node.children"
        :key="child.id"
        :node="child"
        :tabIndex="index"
      />
    </ul>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Node',
  data: () => ({
    numClicks: 0,
    childrenCollapsed: false
  }),  
  props: {
    node: Object,
    tabIndex: Number
  },
  computed: {
    label() {
      return this.node.label;
    },
    active() {
      return this.node.active;
    },
    ...mapGetters([
      'parent'
    ])
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
    onNodeInput: function() {
      this.setNodeLabel({
        node: this.node,
        label: this.$refs.article.textContent
      });
    },
    onNodeClicked: function() {
      this.numClicks++;

      if(!this.node.active) {
        this.setActiveNode(this.node);
      }

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
      this.createChildNode(this.node);
    },  
    onNodeEnterPressed: function() {
      if(!this.node.editable) {
        this.createChildNode(this.parent(this.node));       
      } else {
        this.setNodeEditable({
          node: this.node,
          editable: false
        });
      }
    },
    onNodeDelPressed: function() {
      if(!this.node.editable) {
        this.removeNode(this.node);        
      }
    },
    onNodeLeftPressed: function() {
      if(!this.node.editable) {
        this.moveNodeToLeft();
      }
    },
    onNodeRightPressed: function() {
      if(!this.node.editable) {        
        this.moveNodeToRight();
      }      
    },
    onNodeUpPressed: function() {
      this.moveNodeToUp();          
    },
    onNodeDownPressed: function() {
      this.moveNodeToDown();          
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
      'setActiveNode',
      'setNodeLabel',      
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
