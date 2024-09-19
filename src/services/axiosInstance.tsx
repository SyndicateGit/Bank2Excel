'use client'
import axios from 'axios';

const axiosInstance = (contentType = 'application/json') => {
  
  const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api/'}`,
  });

  return axiosClient;
};

export default axiosInstance;
