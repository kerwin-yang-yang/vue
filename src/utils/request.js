import axios from 'axios'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 500, // request timeout
    // headers: {
    //     'Content-Type': 'application/json',
    //   },
})

// Request interceptors
service.interceptors.request.use(
    (config) => {
        // Add any custom headers here
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

// Response interceptors
service.interceptors.response.use(
    (response) => {
        const res = response.data
        // You can add some code here to handle API response error
        return res
    },
    (error) => {
        // You can add some code here to handle API response error
        return Promise.reject(error)
    }
)

export default service
