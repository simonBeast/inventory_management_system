import { defineStore } from 'pinia';
import apiService from '../util/apiService';

export const useSaleStore = defineStore('sale', {
  state: () => ({
    result: [],
    topSellingProductsOfMonth: [],
    topSellingProductsOfQuarter: [],
    topSellingProductsOfYear: [],
    totalSalesAndProfitsOfMonth: [],
    totalSalesAndProfitsOfQuarter:[],
    totalSalesAndProfitsOfYear: [],
    salesAndProfitsOfInterval:null,
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
    }
  }),
  actions: {

    async createSale( data , token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/sales', data);
      return response;
    },
    async createSales( data , token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/sales/many', data);
      return response;
    },
    async getSales(token = null , page = 1, limit = 10 ) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales?page=${page}&limit=${limit}`);
      
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
    async getSale( token = null , id) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/${id}`);
      return response;
    },
    async updateSale(id, data, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/sales/${id}`, data);
      return response;
    },
    async deleteSale(id, token = null) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/sales/${id}`);
      return response;
    },
    async getSalesByProduct(token,id,page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/reports/sales-by-category/1/${id}/0/0?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.result = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getSalesByDate(token, from, to, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/reports/sales-by-date/${from}/${to}?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.result = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getSalesBySeller(token, sellerId, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/reports/sales-by-seller/${sellerId}?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.result = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTopSellingProductsOfMonth(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/topSellingProducts/month?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.topSellingProductsOfMonth = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTopSellingProductsOfQuarter(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`/sales/topSellingProducts/quarter?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.topSellingProductsOfQuarter = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTopSellingProductsOfYear(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/topSellingProducts/year?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.topSellingProductsOfYear = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTotalSalesAndProfitsOfMonth(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/month?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.totalSalesAndProfitsOfMonth = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTotalSalesAndProfitsOfQuarter(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/quarter?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.totalSalesAndProfitsOfQuarter = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTotalSalesAndProfitsOfYear(token, page = 1 , limit = 10) {
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/year?page=${page}&limit=${limit}`);
      if (response.flag == 1) {
        this.totalSalesAndProfitsOfYear = response.data.data;
        this.pagination.totalItems = response.data.pagination.totalItems;
        this.pagination.totalPages = response.data.pagination.totalPages;
        this.pagination.currentPage = response.data.pagination.currentPage;
        this.pagination.itemsPerPage = response.data.pagination.itemsPerPage;
        return response;
      }
      return response;
    },
    async getTotalSalesAndProfitInterval(token,startDate,endDate){
      const ApiService = new apiService('http://localhost:3001/api/v1/');
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/${startDate}/${endDate}`);
      if(response.flag == 1){
        this.salesAndProfitsOfInterval = response.data.data;
        return response;
      }
      return response;
    },
    async changePage(token,page) {
      await this.getSales(token, page, this.pagination.itemsPerPage);
    },
    async changePageByDate(token,from,to,page) {
      await this.getSalesByDate(token,from,to,page,this.pagination.itemsPerPage);
    }
  },
});