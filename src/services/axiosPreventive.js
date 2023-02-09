import axios from 'axios';

// ? For production route
const instance = axios.create({baseURL: 'https://api.mmproperty.com/'});
// const instance = axios.create({baseURL: 'http://devapi.mmproperty.com'});

export default instance;
