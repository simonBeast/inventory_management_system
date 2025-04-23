import { defineStore } from 'pinia';
import apiService from '../util/apiService';
export const useProductStore = defineStore('product', {
  state: () => ({
    result: [],
    singleProduct: null,
    alphaNoLimit: [],
    productData:[],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
    }
  }),
  actions: {

    async createProduct( data , token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/products', data);
      return response;
    },
    async getProducts(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/products?page=${page}&limit=${limit}`);
      
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
    async getProductsAlphaNolimit( token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/products/alphaNoLimit`);
      if (response.flag == 1) {
        this.alphaNoLimit = response.data.data;
      }
      return response;
    },
    async searchProducts(token = null , searchTerm = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/products?productName[search]=${searchTerm}&page=${page}&limit=${limit}`);
      
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
    async getProduct( token = null , id) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/products/${id}`);
      if (response.flag == 1) {
        this.singleProduct = response.data.data;
      }
      return response;
    },
    async getProductData( token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/products/productData`);
      if (response.flag == 1) {
        this.productData = response.data.data;
      }
      return response;
    },
    async updateProduct(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/products/${id}`, data);
      return response;
    },
    async addNewStock(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post(`/products/addNewStock/${id}`, data);
      return response;
    },
    async deleteProduct(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/products/${id}`);
      return response;
    },
    async changePage(token,page) {
      await this.getProducts(token, page, this.pagination.itemsPerPage);
    },
    async changePageBySearch(token, searchTerm, page) {
      await this.searchProducts(token, searchTerm, page, this.pagination.itemsPerPage);
    }
  },
});