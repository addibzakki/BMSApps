import axios from 'axios';

const instance = axios.create({baseURL: 'http://devportal.mmproperty.com/api'});

export default instance;
