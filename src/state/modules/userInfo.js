import axios from 'axios'
export const state = {
    Document: getSavedState('userInfo.Document'),
    Calendar:getSavedState('userInfo.Calendar'),
    Notification:getSavedState('userInfo.Notification'),
    
}
export const getters = {
    hasDocuments(state){
        return !!state.Document
    },
    hasCalendars(state){
        return !!state.Calendar
    },
    hasNotifications(state){
      return !!state.Notification
  },
}
export const mutations = {
    CACHE_DOCUMENT(state, Documents) {
        state.Document= Documents
        saveState('userInfo.Document', Documents)
      },
      CACHE_CALENDAR(state, Calendars) {
        state.Calendar= Calendars
        saveState('userInfo.Calendar', Calendars)
      },
      CACHE_NOTIFICATION(state, Notifications) {
        state.Notification= Notifications
      },
}
export const actions = {

    getDocuments({ commit,  getters }, { username } = {}){
        if (getters.hasDocuments) return state.Document
        axios
        .get('/api/document/all', { params: {username:username} })
        .then((response) => {
          const documents = response.data
          commit('CACHE_DOCUMENT', documents)
          
        })
    },
    getCalendars({ commit,  getters }, { username } = {}){
        if (getters.hasCalendars) return state.Calendar
        axios
        .get('/api/calendar', { params: {username:username} })
        .then((response) => {
          const Calendars = response.data
          commit('CACHE_CALENDAR', Calendars)
          
        })
    },
    getNotifications({ commit,  getters }, { username } = {}){
      if (getters.hasCalendars) return state.Calendar
      axios
      .get('/api/notification', { params: {username:username} })
      .then((response) => {
        const Notifications = response.data
        commit('CACHE_NOTIFICATION', Notifications)
        
      })
  },
    cleanAll({commit}){
      commit('CACHE_DOCUMENT', null)
      commit('CACHE_CALENDAR', null)
      commit('CACHE_NOTIFICATION', null)
    }
}
function getSavedState(key) {
    return JSON.parse(window.localStorage.getItem(key))
  }
  
  function saveState(key, state) {
    window.localStorage.setItem(key, JSON.stringify(state))
  }