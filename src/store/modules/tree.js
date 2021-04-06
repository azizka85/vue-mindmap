export default {
  state: {
    root: {
      id: null,
      children: [{
        id: Date.now(),
        label: 'Press Space or double click to edit',
        active: false,
        editable: false,
        collapsed: false,
        children: []      
      }]      
    },
    activeNode: null,
    parents: {}
  },
  mutations: {
    updateActiveNode(state, node) {
      state.activeNode = node;
    },
    addNode(_, {children, newNode}) {
      children.push(newNode);
    },
    deleteNode(_, {children, node}) {
      const index = children.findIndex(elem => elem.id === node.id);
      
      children.splice(index, 1);
    },
    updateNodeLabel(_, {node, label}) {
      node.label = label;
    },
    updateNodeActive(_, {node, active}) {
      node.active = active;
    },
    updateNodeEditable(_, {node, editable}) {
      node.editable = editable;
    },
    updateNodeCollapsed(_, {node, collapsed}) {
      node.collapsed = collapsed;
    },
    addParent(state, {node, parent}) {
      state.parents[node.id] = parent;
    },
    deleteParent(state, node) {
      delete state.parents[node.id];
    },
    clearState(state) {
      state.root.children = [];
      state.activeNode = null;
      state.parents = {};
    }
  },
  actions: {
    setActiveNode({commit, dispatch, getters}, node) {
      if(!node || !getters.activeNode || node.id !== getters.activeNode.id) {
        if(getters.activeNode) {
          commit('updateNodeActive', {
            node: getters.activeNode,
            active: false
          });

          dispatch('setNodeEditable', {
            node: getters.activeNode,
            editable: false
          });
        }
  
        if(node) {
          commit('updateNodeActive', {
            node: node,
            active: true
          });        
        }        

        commit('updateActiveNode', node);
      }      
    },
    createChildNode({commit, dispatch}, parent) {
      const newNode = {
        id: Date.now(),
        label: '',
        active: false,
        editable: true,
        collapsed: false,
        children: []          
      };

      commit('addNode', {
        children: parent.children, 
        newNode
      });

      commit('addParent', {
        node: newNode,
        parent
      });

      dispatch('setActiveNode', newNode);

      if(parent.id) {
        dispatch('setNodeCollapsed', {
          node: parent,
          collapsed: false
        });
      }      
    },
    appendNode({commit}, {node, parent}) {

    },
    removeNode({commit, dispatch, getters}, node) {
      const parent = getters.parent(node);

      if(!parent.id && parent.children.length < 2) return;

      const index = parent.children.indexOf(node);    

      commit('deleteNode', {
        children: parent.children, 
        node
      });

      commit('deleteParent', node);

      let focusIndex = parent.children.length - 1;

      if(parent.children.length > index) {
        focusIndex = index;
      }

      if(focusIndex >= 0) {
        const focusNode = parent.children[focusIndex];

        dispatch('setActiveNode', focusNode);        
      } else if(parent.id) {
        dispatch('setActiveNode', parent);  
      }     
    },
    setNodeLabel({commit}, {node, label}) {
      commit('updateNodeLabel', {node, label});
    },
    setNodeEditable({commit}, {node, editable}) {
      commit('updateNodeEditable', {node, editable});
    },
    setNodeCollapsed({commit}, {node, collapsed}) {
      if(!collapsed || node.children.length > 0) {
        commit('updateNodeCollapsed', {node, collapsed});
      }
    },
    setChildNodesCollapsed({dispatch}, {node, collapsed}) {
      dispatch('setNodeCollapsed', {
        node,
        collapsed: false
      });   
      
      node.children.forEach(child => {
        if(!collapsed || child.children.length > 0) {
          dispatch('setNodeCollapsed', {
            node: child,
            collapsed
          });          
        }
      });
    },
    moveNodeToLeft({dispatch, getters}) {
      if(getters.canActiveNodeMoveLeft) {
        dispatch('setActiveNode', getters.parent(getters.activeNode));
      }
    },
    moveNodeToRight({dispatch, getters}) {
      if(getters.canActiveNodeMoveRight) {
        const childNode = getters.middleChildNode(getters.activeNode);

        if(childNode) {
          dispatch('setActiveNode', childNode);
        }        
      }
    },
    moveNodeToUp({dispatch, getters}) {
      if(getters.canActiveNodeMoveUp) {
        const upNode = getters.upNode(getters.activeNode);

        if(upNode) {
          dispatch('setActiveNode', upNode);        
        }        
      }
    },
    moveNodeToDown({dispatch, getters}) {
      if(getters.canActiveNodeMoveDown) {
        const downNode = getters.downNode(getters.activeNode);

        if(downNode) {
          dispatch('setActiveNode', downNode);         
        }        
      }
    },
    saveToLocalStorage({getters}) {
      localStorage.setItem('tree', JSON.stringify(getters.root.children));
    },
    loadFromLocalStorage({commit}) {

    }
  },
  getters: {
    activeNode(state) {
      return state.activeNode;
    },
    canActiveNodeMoveLeft(state, getters) {
      if(!state.activeNode) return false;

      return getters.parent(state.activeNode).id;
    },
    canActiveNodeMoveRight(state) {
      if(!state.activeNode || state.activeNode.collapsed) return false;

      return state.activeNode.children.length > 0;
    },
    canActiveNodeMoveUp(state, getters) {
      if(!state.activeNode) return false;

      return getters.parent(state.activeNode).children.indexOf(state.activeNode) > 0;
    },
    canActiveNodeMoveDown(state, getters) {
      if(!state.activeNode) return false;

      const index = getters.parent(state.activeNode).children.indexOf(state.activeNode);

      return index >= 0 && index < getters.parent(state.activeNode).children.length-1;
    },
    root(state) {
      return state.root;
    },
    parent: state => node => {
      if(node.id) {
        return state.parents[node.id];
      }

      return null;
    },
    middleChildNode: _ => node => {
      if(node.children.length > 0) {
        const index = Math.floor((node.children.length - 1) / 2);
      
        return node.children[index];  
      }

      return null;
    },
    upNode: (_, getters) => node => {
      const index = getters.parent(node).children.indexOf(node);
  
      if(index > 0) return getters.parent(node).children[index-1];
  
      return null;
    },
    downNode: (_, getters) => node => {
      const index = getters.parent(node).children.indexOf(node);
        
      if(index >= 0 && index < getters.parent(node).children.length-1) {
        return getters.parent(node).children[index + 1];
      }
  
      return null;
    }
  }
}
