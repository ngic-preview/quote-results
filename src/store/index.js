import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {},
    filters: {},
    showFilter: false,
  },
  mutations: {
    // toggle filter menu when on mobile
    toggleFilter({ state }) {
      state.showFilter = !state.showFilter
    },
    addFilterItem({ state }, key, item) {},
    addFilterKey({ state }, key) {},
  },
  actions: {},
  modules: {},
})
