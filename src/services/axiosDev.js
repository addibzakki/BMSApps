import axios from 'axios';

const instance = axios.create({baseURL: 'http://devapi.mmproperty.com'});
instance.defaults.timeout = 60000;
instance.defaults.maxContentLength = Infinity;
instance.defaults.maxBodyLength = Infinity;

export default instance;
