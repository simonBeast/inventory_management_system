import axios from 'axios';

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }

    });
  }
  setToken(token) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return {
        data:response.data,
        flag:1
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return {
        data: response.data,
        flag: 1
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch(endpoint, data) {
    try {
      const response = await this.client.patch(endpoint, data);
      return {
        data: response.data,
        flag: 1
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return {
        data: response.data,
        flag: 1
      };;
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Request was made and server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      return {
        status: error.response.status,
        flag:0,
        message: error.response.data.message || 'An error occurred'
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      return {
        status: null,
        flag:0,
        message: 'No response received from server'
      };
    } else {
      // Something happened in setting up the request that triggered an Error 
      console.error('Error message:', error.message);
      return {
        status: null,
        flag:0,
        message: error.message
      };
    }
  }
}
export default ApiService;