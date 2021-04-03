<template>
  <li>
    <article 
      ref="article"
      :class="{collapsed: node.collapsed}"
      :tabindex="tabIndex"
      :contenteditable="contentEditable"  
      @click="onNodeClicked"
      @focus="onNodeFocus"
      @blur="onNodeBlur"
      @keydown.space="enableContentEditable"    
      @keydown.enter="onNodeEnterPressed"
      @keydown.tab.prevent="createChildNode"
      @keydown.delete="onNodeDelPressed"  
      @keydown.left="onNodeLeftPressed"
      @keydown.right="onNodeRightPressed"
      @keydown.up="onNodeUpPressed"   
      @keydown.down="onNodeDownPressed"
      @keydown.70.exact="toggleCollapse"
      @keydown.shift.70="childrenToggleCollapse"
      v-html="node.label" 
    />
    <ul v-if="!node.collapsed && node.children && node.children.length">
      <node-tree 
        v-for="(child, index) in node.children"
        :key="child.key"
        :node="child"
        :tabIndex="index"
        :root="false"
        @delete-node="deleteChildNode(index)"     
        @create-node="createChildNode"   
        @focus-node="focusNode"
        @focus-child-up-node="focusChildUpNode(index)"
        @focus-child-down-node="focusChildDownNode(index)"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'NodeTree',
  data: () => ({
    numClicks: 0,
    contentEditable: true
  }),
  props: {
    node: Object,
    tabIndex: Number,
    root: Boolean
  },
  mounted: function() {
    if(this.node.active) {      
      this.$refs.article.focus();
    }

    if(this.node.editable) {
      this.enableContentEditable();      
    } else {
      this.disableContentEditable();
    }

    setTimeout(() => {
      this.$refs.article.innerHTML = this.node.label;
    });
  },
  methods: {
    onNodeFocus: function() {
      this.node.active = true;
    },
    onNodeBlur: function() {
      this.node.active = false;
      this.disableContentEditable();
    },
    onNodeEnterPressed: function() {
      if(!this.contentEditable) {
        this.$emit('create-node');
      } else {
        this.disableContentEditable();
      }
    },
    onNodeDelPressed: function(event) {
      if(!this.contentEditable) {
        event.preventDefault();
        this.removeSelf();
      }
    },
    onNodeClicked: function() {    
      this.numClicks++;

      setTimeout(() => {
        if(this.numClicks > 1) {
          this.enableContentEditable();
        }
        this.numClicks = 0;
      }, 300);
    },
    onNodeLeftPressed: function() {
      if(!this.contentEditable) {
        this.$emit('focus-node');

        if(!this.root) {
          this.$refs.article.blur();
        }
      }
    },
    onNodeRightPressed: function() {
      if(!this.contentEditable) {        
        if(this.node.children.length > 0) {
          this.$refs.article.blur();

          const index = Math.floor((this.node.children.length - 1) / 2);

          this.node.children[index].active = true;
          this.node.children[index].key = Date.now();
        }
      }      
    },
    onNodeUpPressed: function() {
      this.$refs.article.blur();           
      this.$emit('focus-child-up-node');      
    },
    onNodeDownPressed: function() {
      this.$refs.article.blur();           
      this.$emit('focus-child-down-node');    
    },
    disableContentEditable: function() {
      this.node.editable = false;
      this.node.label = this.$refs.article.innerText;
      this.contentEditable = false;
    },
    enableContentEditable: function() {
      this.node.editable = true;
      this.contentEditable = true;   
    },
    focusNode: function() {
      this.$refs.article.focus();
    },
    focusChildUpNode: function(childIndex) {
      let index = 0;
      if(childIndex > 0) {        
        index = childIndex - 1;              
      }

      this.node.children[index].active = true;
      this.node.children[index].key = Date.now();         
    },
    focusChildDownNode: function(childIndex) {
      let index = this.node.children.length - 1;
      if(childIndex < this.node.children.length - 1) {        
        index = childIndex + 1;              
      }

      this.node.children[index].active = true;
      this.node.children[index].key = Date.now();  
    },
    createChildNode: function() {      
      this.node.children.push({
        key: Date.now(),
        label: '',
        active: true,
        editable: true,
        collapsed: false,
        children: []          
      });
      this.node.collapsed = false;
    },
    removeSelf: function() {    
      this.$emit('delete-node');
    },
    deleteChildNode: function(index) {
      this.node.children.splice(index, 1);

      let focusIndex = this.node.children.length - 1;

      if(this.node.children.length > index) {
        focusIndex = index;
      }

      if(focusIndex >= 0) {
        this.node.children[focusIndex].active = true;
        this.node.children[focusIndex].key = Date.now();                
      } else {
        this.focusNode();
        this.node.collapsed = false;
      }
    },
    toggleCollapse: function() {
      if(this.node.children.length > 0) {
        this.node.collapsed = !this.node.collapsed;
      }
    },
    childrenToggleCollapse: function() {
      for(let child of this.node.children) {
        if(child.children.length > 0) {
          child.collapsed = !child.collapsed;
          child.key = Date.now();
        }
      }
      
      this.node.collapsed = false;
    }
  }
}
</script>
