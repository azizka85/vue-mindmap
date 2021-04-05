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
    }
  },
  mutations: {
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
    }
  },
  actions: {
    createChildNode({commit, dispatch}, {parent, newNode}) {
      commit('addNode', {
        children: parent.children, 
        newNode
      });

      if(parent.id) {
        dispatch('setNodeCollapsed', {
          node: parent,
          collapsed: false
        });
      }      
    },
    removeNode({commit, dispatch}, {parent, node}) {
      if(!parent.id && parent.children.length < 2) return;

      const index = parent.children.indexOf(node);

      dispatch('setNodeActive', {
        node, 
        active: false
      });      

      commit('deleteNode', {
        children: parent.children, 
        node
      });

      let focusIndex = parent.children.length - 1;

      if(parent.children.length > index) {
        focusIndex = index;
      }

      if(focusIndex >= 0) {
        const focusNode = parent.children[focusIndex];

        dispatch('setNodeActive', {
          node: focusNode, 
          active: true
        });        
      } else if(parent.id) {
        dispatch('setNodeActive', {
          node: parent, 
          active: true
        });  
      }     
    },
    setNodeLabel({commit}, {node, label}) {
      commit('updateNodeLabel', {node, label});
    },
    setNodeActive({commit, dispatch}, {node, active}) {
      commit('updateNodeActive', {node, active});

      if(!active) {
        dispatch('setNodeEditable', {
          node,
          editable: false
        });
      }
    },
    setNodeEditable({commit}, {node, editable}) {
      commit('updateNodeEditable', {node, editable});
    },
    setNodeCollapsed({commit}, {node, collapsed}) {
      commit('updateNodeCollapsed', {node, collapsed});
    },
    setChildNodesCollapsed({dispatch}, {node, collapsed}) {
      dispatch('setNodeCollapsed', {
        node,
        collapsed: false
      });   
      
      node.children.forEach(child => {
        if(child.children.length > 0) {
          dispatch('setNodeCollapsed', {
            node: child,
            collapsed
          });          
        }
      });
    },
    moveNodeToLeft({dispatch, getters}, {node, parent}) {
      if(getters.canMoveLeft(parent)) {
        dispatch('setNodeActive', {
          node, 
          active: false
        });

        dispatch('setNodeActive', {
          node: parent,
          active: true
        });
      }
    },
    moveNodeToRight({dispatch, getters}, node) {
      const childNode = getters.middleChildNode(node);

      if(childNode) {
        dispatch('setNodeActive', {
          node, 
          active: false
        });

        dispatch('setNodeActive', {
          node: childNode,
          active: true
        });
      }
    },
    moveNodeToUp({dispatch, getters}, {node, parent}) {
      const upNode = getters.upNode(node, parent);

      if(upNode) {
        dispatch('setNodeActive', {
          node, 
          active: false
        });

        dispatch('setNodeActive', {
          node: upNode,
          active: true
        });        
      }
    },
    moveNodeToDown({dispatch, getters}, {node, parent}) {
      const downNode = getters.downNode(node, parent);

      if(downNode) {
        dispatch('setNodeActive', {
          node, 
          active: false
        });

        dispatch('setNodeActive', {
          node: downNode,
          active: true
        });         
      }
    }
  },
  getters: {
    root(state) {
      return state.root;
    },
    canMoveLeft: _ => parent => parent.id,
    canMoveRight: _ => node => node.children.length > 0,
    canMoveUp: _ => (node, parent) => parent.children.indexOf(node) > 0,
    canMoveDown: _ => (node, parent) => {
      const index = parent.children.indexOf(node);

      return index >= 0 && index < parent.children.length-1;
    },
    middleChildNode: _ => node => {
      if(node.children.length > 0) {
        const index = Math.floor((node.children.length - 1) / 2);
      
        return node.children[index];  
      }

      return null;
    },
    upNode: _ => (node, parent) => {
      const index = parent.children.indexOf(node);
  
      if(index > 0) return parent.children[index-1];
  
      return null;
    },
    downNode: _ => (node, parent) => {
      const index = parent.children.indexOf(node);
        
      if(index >= 0 && index < parent.children.length-1) {
        return parent.children[index + 1];
      }
  
      return null;
    }
  }
}
