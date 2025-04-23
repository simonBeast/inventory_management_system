import { defineStore } from 'pinia';
import apiService from '../util/apiService';
export const useProductSubCategoryStore = defineStore('productSubCategory', {
  state: () => ({
    result: [],
    alphaNoLimit: [],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
    }
  }),
  actions: {

    async createProductSubCategory( data , token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/productSubCategory', data);
      return response;
    },
    async getProductSubCategories(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productSubCategory?page=${page}&limit=${limit}`);
      
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
    async getProductSubCategory( token = null , id) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productSubCategory/${id}`);
      return response;
    },
    async getProductSubCategoriesAlphaNoLimit( token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productSubCategory/alphaNoLimit`);
      if (response.flag == 1) {
        this.alphaNoLimit = response.data.data;
      }
      return response;
    },
    async searchProductSubCategories(token = null , searchTerm = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/productSubCategory?name[search]=${searchTerm}&page=${page}&limit=${limit}`);
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
    async updateProductSubCategory(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/productSubCategory/${id}`, data);
      return response;
    },
    async deleteProductSubCategory(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/productSubCategory/${id}`);
      return response;
    },
    async changePage(token,page) {
      await this.getProductSubCategories(token, page, this.pagination.itemsPerPage);
    },
    async changePageBySearch(token, searchTerm, page) {
      await this.searchProductSubCategories(token, searchTerm, page, this.pagination.itemsPerPage);
    }
  },
});