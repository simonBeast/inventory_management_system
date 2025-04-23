import { defineStore } from 'pinia';
import apiService from '../util/apiService';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    isLoggedIn: localStorage.getItem('auth_token') !== null,
    isAdmin:false,
    isCheckingAuth : true ,
    user: {
      id: null,
      email: null,
      fullName: null,
      role: null,
    }
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    async login(email, password) {

      let ApiService = new apiService('http://localhost:3001/api/v1/users');
      let response = await ApiService.post('/signin', { email, password });
      if (response.flag == 1) {
        if (response.data['token']) {
          const token = response.data.token;
          this.token = token;
          localStorage.setItem('auth_token', this.token);
          this.isLoggedIn = true;

        }
        if (response.data['user']) {
          const user = response.data.user;
          this.user = user;
        }
      }
      return response;

    },
    async register(email, password, fullName) {
      let ApiService = new apiService('http://localhost:3001/api/v1/users');
      let response = await ApiService.post('/signup', { email, password, fullName });
      return response;
    },
    async forgotPassword(email){
      let ApiService = new apiService('http://localhost:3001/api/v1/users');
      let response = await ApiService.post('/forgotPassword', { email});
      return response;
    },
    async resetPassword(data,resetToken){
      let ApiService = new apiService('http://localhost:3001/api/v1/users');
      let response = await ApiService.post(`/resetPassword/${resetToken}`, data);
      return response;
    },
    async checkTokenValidity(token) {
      let ApiService = new apiService('http://localhost:3001/api/v1/users');
      let response = await ApiService.post('/checkTokenValidity', { token });
      return response;
    },
    logout() {
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem('auth_token');
    }
  },
});