import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}
export const TaskComputed = {
  ...mapState('documentTask', {
    Tasks: (state) => state.Tasks,
    DetailTask:(state)=>state.DetailTask
  }),
  ...mapGetters('documentTask', ['hasTasks','hasDetailTask']),
}

export const userInfoComputed = {
  ...mapState('userInfo',{
    Document:(state)=>state.Document,
    Calendar:(state)=>state.Calendar,
    Notification:(state)=>state.Notification,
  }),
  ...mapGetters('userInfo',['hasDocuments','hasCalendars','hasNotifications',])
}

export const layoutComputed = {
  ...mapState('layout', {
    layoutType: (state) => state.layoutType,
    leftSidebarTheme: (state) => state.leftSidebarTheme,
    leftSidebarType: (state) => state.leftSidebarType,
    layoutWidth: (state) => state.layoutWidth,
  }),
}

export const userInfoMethods = mapActions('userInfo', [
  'getDocuments',
  'getCalendars',
  'cleanAll',
  'getNotifications',
  'createCalendarsEvent',
  'deleteCalendarsEvent',
  'updateCalendarsEvent'
  // 'resetPassword',
])

export const TasksMethods = mapActions('documentTask', [
  'getTasks',
  'createTask',
  'cleanAll',
  'getTasksDetail',
  'deleteTasks',
  'updateTasks',
])

export const authMethods = mapActions('auth', [
  'logIn',
  'logOut',
  'register',
  'resetPassword',
])

export const layoutMethods = mapActions('layout', [
  'changeLayoutType',
  'changeLeftSidebarTheme',
  'changeLeftSidebarType',
  'changeLayoutWidth',
])
