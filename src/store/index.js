import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {},
    filters: {},
    showFilter: true,
    compare: [],
    showCompare: false,
    sortBy: '',
    sortDesc: false,
  },
  mutations: {
    // toggle filter menu when on mobile
    TOGGLE_FILTER(state) {
      state.showFilter = !state.showFilter
    },
    ADD_FILTER_ITEM(state, key, item) {
      if (Object.keys(state.filters).some(el => key === el)) {
        state.filters[key].push(item)
      } else {
        state.filters[key] = [item]
      }
    },
    TOGGLE_COMPARE(state) {
      state.showCompare = !state.showCompare
    },
    ADD_TO_COMPARE(state, item) {
      if (!state.compare.some(el => el.plan.id === item.plan.id)) {
        state.compare.push(item)
      }
    },
    REMOVE_FROM_COMPARE(state, item) {
      if (state.compare.some(el => el.plan.id === item.plan.id)) {
        state.compare.pop(item)
      }
    },
    TOGGLE_SORT_DESC(state) {
      state.sortDesc = !state.sortDesc
    },
    SORT_BY(state, value) {
      state.sortBy = value
    },
  },
  actions: {
    toggleFilter({ commit }) {
      commit('TOGGLE_FILTER')
    },
    addFilterItem({ commit }, key, item) {
      commit('ADD_FILTER_ITEM', key, item)
    },
    toggleCompare({ commit }) {
      commit('TOGGLE_COMPARE')
    },
    addToCompare({ commit }, quote) {
      commit('ADD_TO_COMPARE', quote)
    },
    removeFromCompare({ commit }, quote) {
      commit('REMOVE_FROM_COMPARE', quote)
    },
    toggleSortDesc({ commit }) {
      commit('TOGGLE_SORT_DESC')
    },
    sortBy({ commit }, value) {
      commit('SORT_BY', value)
    },
  },
  getters: {
    compare: state => state.compare,
    compareLength: (state, getters) => getters.compare.length,
    showCompare: state => state.showCompare,
    filters: state => state.filters,
    showFilter: state => state.showFilter,
    sortBy: state => state.sortBy,
    sortDesc: state => state.sortDesc,
  },
})
