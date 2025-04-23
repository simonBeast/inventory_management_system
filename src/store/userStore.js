import { defineStore } from 'pinia';
import apiService from '../util/apiService';
export const useUserStore = defineStore('user', {
  state: () => ({
    result: [],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
    }
  }),
  actions: {

    async getUsers(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/users?page=${page}&limit=${limit}`);
      
      if (response.flag == 1) {
        this.result = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems        ;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
        
      }
      return response;
    },
    async getUser(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/users/${id}`);
      return response;
    },
    async changeUserPassword(userId,data,token = null){
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post(`/users/changePassword/${userId}`,data);
      return response;
    },
    async updateUser(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/users/${id}`, data);
      return response;
    },
    async searchUsers(token = null , searchTerm = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/users?fullName[search]=${searchTerm}&page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.result = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems        ;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
        
      }
      return response;
    }
    ,
    async deleteUser(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/users/${id}`);
      return response;
    },
    async changePage(token,page) {
      await this.getUsers(token, page, this.pagination.itemsPerPage);
    },
    async changePageBySearch(token, searchTerm, page) {
      await this.searchUsers(token, searchTerm, page, this.pagination.itemsPerPage);
    }
  },
});