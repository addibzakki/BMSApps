import axios from 'axios';

const myAPI = axios.create({
  baseURL: 'https://mynet.mmproperty.com/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default myAPI;
