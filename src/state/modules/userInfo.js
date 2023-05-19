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
        saveState('userInfo.Notification', Notifications)
      },
      ADD_EVENT(state, event) {
        state.Calendar.push(event)
        saveState('userInfo.Calendar', state.Calendar)
      },
      DELETE_EVENT(state, id) {
        state.Calendar = state.Calendar.filter(event => event.id != id)
        saveState('userInfo.Calendar', state.Calendar)
      },
      UPDATE_EVENT(state, events) {
        const index = state.Calendar.findIndex(event => event.id == events.id)
        console.log( events)

        if (index !== -1) {
          state.Calendar[index].title = events.title
          // state.Calendar[index].category = category
          // state.Calendar[index].start = start
          // state.Calendar[index].end = end
          saveState('userInfo.Calendar', state.Calendar)
        }
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
      if (getters.hasNotifications) return state.Notification
      axios
      .get('/api/notification', { params: {username:username} })
      .then((response) => {
        const Notifications = response.data
        commit('CACHE_NOTIFICATION', Notifications)
        
      })
  },
  createCalendarsEvent({ commit }, { id, title, category, start, end,username }) {
    try {
      
      // make POST request to '/api/events' with event data
       axios.post('/api/addEvents', { title, category, start, end,username }).then((response)=>{
        const new_id=response.data.new_id
        // update store immediately after successful save
        commit('ADD_EVENT', {  id:new_id , title, category:category+' text-white', start, end })
      })

      
      
    } catch (error) {
        console.error(error)
    }
  },
  deleteCalendarsEvent({ commit }, { id }) {
    try {
      // make DELETE request to '/api/events/:id' to delete event
      axios.delete(`/api/events/${id}`)
      // update store immediately after successful deletion
      commit('DELETE_EVENT', id)
    } catch (error) {
      console.error(error)
    }
  },
  updateCalendarsEvent({ commit }, { id, title, category, start, end }) {
    try {
      // make PUT request to '/api/events/:id' to update event
      axios.put(`/api/events/${id}`, { title, start, end })
      // update store immediately after successful update
      commit('UPDATE_EVENT', { id, title, start, end,category })
      console.log('ok')
    } catch (error) {
      console.error(error)
    }
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