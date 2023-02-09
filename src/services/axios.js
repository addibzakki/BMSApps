import axios from 'axios';

// ? For production route
const instance = axios.create({
  baseURL: 'https://mmpportal.mmproperty.com/api',
});

export default instance;
