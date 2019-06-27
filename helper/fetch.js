import axios from 'axios';

const fetch = axios.create({
  baseURL: process.env.URL_BACKEND,
  timeout: 3000,
  headers: {
    Authorization: 'Bearer lalalal'
  }
});

export {
  fetch
}