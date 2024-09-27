import axios from 'axios';
import {useAuth0 } from '@auth0/auth0-react';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers:{
        'Content-Type': 'application/json',
    },
});

//function to add authorization token to Axios requests

export const authorizedRequest = async (endpoint,method,data=null) => {
    const { getAccessTokenSilently } = useAuth0();
    const token = await getAccessTokenSilently();

    return api({
        method: method,
        url: endpoint,
        data:data,
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
};

export default api;