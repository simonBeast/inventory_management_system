import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useTotalSalesAndProfitInterval(token = null) {

  return useMutation({
    mutationFn: async ({startDate,endDate}) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/${startDate}/${endDate}`);
      
        return response?.data?.data;

    },
  });
}


export function useTopSellingProductMonth(token, page = 1 , limit = 10) {
    const queryKey = ['top_products_month'];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/sales/topSellingProducts/month?page=${page}&limit=${limit}`);
        
          return response?.data?.data;
       
      },
      staleTime: 1000 * 60 * 5,
    });
}

export function useTopSellingProductQuarter(token, page = 1 , limit = 10) {
  const queryKey = ['top_products_quarter'];
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await ApiService.get(`/sales/topSellingProducts/quarter?page=${page}&limit=${limit}`);
      
        return response?.data?.data;
     
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopSellingProductYear(token, page = 1 , limit = 10) {
  const queryKey = ['top_products_year'];
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await ApiService.get(`/sales/topSellingProducts/year?page=${page}&limit=${limit}`);
      
        return response?.data?.data;
     
    },
    staleTime: 1000 * 60 * 5,
  });
}






