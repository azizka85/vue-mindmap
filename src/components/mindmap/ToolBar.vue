<template>
  <div 
    class="toolbar" 
    v-if="activeNode"
  >
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Left"
      @click="onLeftBtnClick"
      v-if="canActiveNodeMoveLeft"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
    </svg>    
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Up"
      @click="onUpBtnClick"
      v-if="canActiveNodeMoveUp"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
    </svg>    
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Down"
      @click="onDownBtnClick"
      v-if="canActiveNodeMoveDown"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
    </svg>    
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Right"
      @click="onRightBtnClick"
      v-if="canActiveNodeMoveRight"
    >
      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg>    
    <svg 
      class="tool" 
      viewBox="0 0 16 16" 
      title="Save"
      @click="onSaveBtnClick"
      v-if="canSave"
    >
      <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
    </svg>     
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ToolBar',
  data: () => ({
    canSave: false,
    unsubscribe: null
  }),
  computed: {
    ...mapGetters([
      'activeNode',
      'canActiveNodeMoveLeft',
      'canActiveNodeMoveRight',
      'canActiveNodeMoveUp',
      'canActiveNodeMoveDown'
    ])
  },
  created() {
    this.unsubscribe = this.$store.subscribe(() => {
      this.canSave = true;
    });
  },
  beforeDestroy() {
    if(this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    onLeftBtnClick() {
      this.moveNodeToLeft();
    },
    onUpBtnClick() {
      this.moveNodeToUp();
    },
    onDownBtnClick() {
      this.moveNodeToDown();
    },
    onRightBtnClick() {
      this.moveNodeToRight();
    },
    onSaveBtnClick() {
      this.saveToLocalStorage();
      this.canSave = false;
    },
    ...mapActions([
      'moveNodeToLeft',
      'moveNodeToUp',
      'moveNodeToDown',
      'moveNodeToRight',
      'saveToLocalStorage'
    ])
  }
}
</script>

<style lang="scss">
.toolbar {
  padding: 0 0.125rem;
  background-color: #eee;    

  .tool {
    width: 1.5rem;
    height: 1.5rem;    
    margin: 0.25rem 0.125rem;
    cursor: pointer;

    &:hover {
      fill: orange;
    }
  }
}
</style>
