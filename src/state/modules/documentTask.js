
import axios from 'axios'
export const state = {
    Tasks: '',
    DetailTask: ''

}
export const getters = {
    hasTasks(state) {
        return !!state.Tasks
    },
    hasDetailTask(state) {
        return !!state.DetailTask
    },

}
export const mutations = {
    CACHE_TASKS(state, Tasks) {
        state.Tasks = Tasks

    },
    CACHE_DETAILTASK(state, DetailTask) {
        state.DetailTask = DetailTask
    },

    DETAIL_TASK(state, id) {

        const index = state.Tasks.findIndex(event => event.id == id)
        if (index !== -1) {
            state.DetailTask = state.Tasks[index]

        }

    },

    ADD_TASKS(state, Task) {
        state.Tasks.push(Task)
    },

}
export const actions = {

    async getTasks({ commit, getters }, { username } = {}) {
        try {

            // let savedData = await checkIndexedDb()

            // if (savedData) {

            //     commit('CACHE_TASKS', savedData);

            // } else {



            // }
                            // console.log('数据库中无数据')
                            let response = await axios.get('/api/document/tasks', { params: { username } })


                            commit('CACHE_TASKS', response.data);
            
                            //update IndexedDb with latest data received from server.
            
                            // updateIndexedDb(response.data);
        } catch (error) {

            console.log('Error while fetching data from server', error);
        }
    },

     getTasksDetail({ commit }, { id } = {}) {

        // try {
        //     let savedData = await checkIndexedDb()

        //     if (savedData) {

        //         state.Tasks = savedData;

        //     }
        //     // else {

        //     //     let response = await axios.get('/api/document/tasks', { params: { id: id }})


        //     //     state.Tasks = response.data;

        //     //     //update IndexedDb with latest data received from server.

        //     //     updateIndexedDb(response.data);


        //     // }

        // } catch (error) {

        //     console.log('Error in retrieving tasks list: ', error)
        // }
        commit('DETAIL_TASK', id)



    },
     addTask({ commit }, Task) {

        // // Make the backend API call to add new task.

        // try {

        //     const response = await axios.post('/api/task/saveTask', Task);

        //     const newTask = response.data;

        //     commit('ADD_TASKS', newTask);

        // } catch (error) {

        //     console.error('Failed to save a new task. Error = ', error);

        // }


        // // Update IndexedDB database

        // try {

        //     let updatedList = [...state.Tasks, Task];

        //     updateIndexedDb(updatedList);

        // } catch (err) {

        //     console.error("Unable to update indexeddb with the latest data. Error:", err);

        // }
        commit('ADD_TASKS', newTask);
    },

     cleanAll({ commit }) {
        // try {

        //     const dbPromise = await openDB('documentTask', 1)

        //     if (dbPromise) {

        //         await dbPromise.clear();

        //         // clear the local state as well
        //         commit('CACHE_TASKS', null)
        //         commit('CACHE_DETAILTASK', null)


        //     }

        // } catch (error) {

        //     console.log("Error in clearing indexeddb", error);
        // }
        commit('CACHE_TASKS', null)
        commit('CACHE_DETAILTASK', null)
    }
}

/* Helper functions */

// function checkIndexedDb() {

//     return new Promise(async (resolve) => {

//         const DB_NAME = 'documentTask';
//         const OBJECT_STORE_NAME = 'tasks';

//         try {

//             let dbpromise = await openDB(DB_NAME, 1);

//             if (dbpromise.objectStoreNames.contains(OBJECT_STORE_NAME)) {

//                 let taskList = await dbpromise.get(OBJECT_STORE_NAME, 'all-tasks');
//                 console.log(taskList)

//                 resolve(taskList);

//             } else {

//                 resolve(null);

//             }

//         } catch (error) {

//             console.log("Failed to retrieve data from database");

//             reject();

//         }
//     })

// }
 
// async function updateIndexedDb(tasksList) {

    
    
//         const DB_NAME = 'documentTask';
//         const OBJECT_STORE_NAME = 'tasks';



//         let dbPromise = await openDB(DB_NAME, 1);

//         if (!dbPromise.objectStoreNames.contains(OBJECT_STORE_NAME)) {
//             await openDB(DB_NAME, 1, {
//                 upgrade(db) {

//                     db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });

//                 },
//             });
//         }
//         if (dbPromise.objectStoreNames.contains(OBJECT_STORE_NAME)) {
//             console.log('1111111')

//             await dbPromise.put(OBJECT_STORE_NAME, tasksList);


//         }



    

// }