import axios from 'axios';
const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"


const instance = axios.create({
    baseURL: url,
});

instance.interceptors.request.use((config) => {
    if(localStorage.getItem("token")) {
        return {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }
    } else if(localStorage.getItem("changePasswordToken")) {
        return {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${localStorage.getItem("changePasswordToken")}`
            }
        }
    } else {
        return {
            ...config,
        }
    }
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
        return response.data
    }
);

export default instance;