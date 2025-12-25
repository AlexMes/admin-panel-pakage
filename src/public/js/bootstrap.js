import 'bootstrap';

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
window.axios.defaults.baseURL = 'https://admin-panel.local';

window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

localStorage.setItem('project', 23)

window.axios.interceptors.response.use({}, error => {
    if (error.response.status === 401 || error.response.status === 403 || error.response.status === 419) {
        const token = localStorage.getItem('token');
        if(token) {
            localStorage.removeItem('token')
        }
        router.push({name: 'adminpanel/home'})
    }
    return error
})


import local from 'axios';
local.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
local.defaults.headers.common['Accept'] = 'application/json';
local.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
local.defaults.baseURL = 'https://admin-panel.local';

/*const api1 = axios.create({
    baseURL: 'https://api.example.com'
});
const api2 = axios.create({
    baseURL: 'https://another-api.com'
});

api1.get('/users');
api2.get('/posts');*/
