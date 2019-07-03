import axios from 'axios';

const fetch = axios.create({
  baseURL: process.env.URL_BACKEND,
  timeout: 5000,
});

export {
  fetch
}