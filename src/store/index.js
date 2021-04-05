import Vue from 'vue';
import Vuex from 'vuex';
import tree from './modules/tree';

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    tree
  }
});
