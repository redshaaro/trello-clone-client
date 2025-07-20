// lib/axios.js

import axios from 'axios';

export const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    
});


export const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const token = localStorage.getItem('token');
if (token) {
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const setAuthToken = (token) => {
    if (token) {
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete authAxios.defaults.headers.common['Authorization'];
    }
};
