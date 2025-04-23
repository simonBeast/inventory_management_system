import { defineStore } from 'pinia';
import apiService from '../util/apiService';

export const useTransactionHistoryStore = defineStore('transactionHistory', {
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
    async getTransactionHistories(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/history?page=${page}&limit=${limit}`);
      
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
    async gettransactionHistory( token = null , id) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/history/${id}`);
      return response;
    },
    async changePage(token,page) {
      await this.getTransactionHistories(token, page, this.pagination.itemsPerPage);
    }
  },
});