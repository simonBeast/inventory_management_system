import { defineStore } from 'pinia';
import apiService from '../util/apiService';
export const useProductCategoryStore = defineStore('productCategory', {
  state: () => ({
    result: [],
    alphaNoLimit:[],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
    }
  }),
  actions: {

    async createProductCategory( data , token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/productCategory', data);
      return response;
    },
    async getProductCategories(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productCategory?page=${page}&limit=${limit}`);
      
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
    async searchProductCategories(token = null , searchTerm = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productCategory?name[search]=${searchTerm}&page=${page}&limit=${limit}`);
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
    async getProductCategory( token = null , id) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productCategory/${id}`);
      return response;
    },
    async getProductCategoriesAlphaNolimit( token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productCategory/alphaNoLimit`);
      if (response.flag == 1) {
        this.alphaNoLimit = response.data.data;
      }
      return response;
    },
    async updateProductCategory(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/productCategory/${id}`, data);
      return response;
    },
    async deleteProductCategory(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/productCategory/${id}`);
      return response;
    },
    async changePage(token,page) {
      await this.getProductCategories(token, page, this.pagination.itemsPerPage);
    },
    async changePageBySearch(token, searchTerm, page) {
      await this.searchProductCategories(token, searchTerm, page, this.pagination.itemsPerPage);
    }
  },
});