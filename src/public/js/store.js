import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        getMenu: 0
    },
    mutations: {
        updateMenu (state) {
            state.getMenu++
        }
    }
})

export default store;
