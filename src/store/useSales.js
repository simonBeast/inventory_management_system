import { useQuery, useMutation } from '@tanstack/vue-query';
import { computed } from 'vue';
import apiService from '../util/apiService';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useTotalSalesAndProfitInterval(token = null) {

  return useMutation({
    mutationFn: async ({ startDate, endDate }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.get(`sales/profits/${startDate}/${endDate}`);

      return response?.data?.data;

    },
  });
}


export function useTopSellingProductMonth(token, page = 1, limit = 10) {
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

export function useTopSellingProductQuarter(token, page = 1, limit = 10) {
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

export function useTopSellingProductYear(token, page = 1, limit = 10) {
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
export function useSales(params) {
  const queryKey = computed(() => ['sales', params.value]);
  const ApiService = new apiService(baseURL);
  if (params.value.token) {
    ApiService.setToken(params.value.token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { page = 1, limit = 10, searchTerm = '', from = '', to = '', sellerId = '' } = params.value;

      let url = `/sales?page=${page}&limit=${limit}`;

      if (searchTerm) {
        url += `&$Product.productName$[like]=${searchTerm}`;
      }
      if (from) {
        url += `&createdAt[gte]=${from}T00:00:00.000Z`;
      }
      if (to) {
        url += `&createdAt[lte]=${to}T23:59:59.999Z`;
      }
      if (sellerId) {
        url += `&sellerId[eq]=${sellerId}`;
      }

      const response = await ApiService.get(url);
      return response?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateSale(token) {
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useMutation({
    mutationFn: async (data) => {
      const response = await ApiService.post('/sales', data);
      return response?.data;
    },
  });
}

export function useUpdateSale(token) {
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await ApiService.patch(`/sales/${id}`, data);
      return response?.data;
    },
  });
}

export function useDeleteSale(token) {
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useMutation({
    mutationFn: async (id) => {
      const response = await ApiService.delete(`/sales/${id}`);
      return response?.data;
    },
  });
}

