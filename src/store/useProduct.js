import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useProduct(id, token = null) {
    const queryKey = ['products', id];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/products/${id}`);
          return response.data.data;
        
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }


export function useProductsAlphaNoLimit(token = null) {
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
    return useQuery({
      queryKey:['products_alpha_no_limit'],
      queryFn: async () => {
        const response = await ApiService.get(`/products/alphaNoLimit`);
          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5
    });
  }

export function useProductsData(token = null) {
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
    return useQuery({
      queryKey:['products_data'],
      queryFn: async () => {
        const response = await ApiService.get(`/products/productData`);
       
          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5
    });
}

export function useProducts(params) {
  

  const queryClient = useQueryClient();


  const queryKey = computed(() => {

    const { page, searchTerm } = params.value;
    return searchTerm
      ? ['products', 'search', searchTerm, page]
      : ['products', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
     
      const { page, searchTerm, limit } = params.value;

      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = params.value.searchTerm
        ? `/products?productName[search]=${params.value.searchTerm}&page=${params.value.page}&limit=${params.value.limit}`
        : `/products?page=${params.value.page || 1}&limit=${params.value.limit || 10}`;
    
        
      const response = await ApiService.get(url);
     
      const prefetch = async (targetPage) => {
        const url = searchTerm
        ? `/products?productName[search]=${searchTerm}&page=${targetPage}&limit=${limit}`
        : `/products?page=${targetPage || 1}&limit=${limit || 10}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['products', 'search', searchTerm, page + 1]
            : ['products', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['products', 'search', searchTerm, page - 1]
            : ['products', page - 1],
          queryFn: () => prefetch(page - 1),
        });
      }

        return response?.data;
     
    },
    staleTime: 1000 * 60 * 5, 
    keepPreviousData: true,
  });

  return query;
}


export function useAddNewStock(token = null) {

  return useMutation({
    mutationFn: async ({id,data}) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post(`/products/addNewStock/${id}`, data);
      if (response.flag === 1) {
        return response;
      }
      throw new Error(response.message || 'Error adding product stock');
    },
  });
}

export function useCreateProduct(token = null) {

  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/products', data);
      if (response.flag === 1) {
        return response;
      }
      throw new Error(response.message || 'Error creating product');
    },
  });
}

export function useUpdateProduct(token = null) {

  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/products/${id}`, data);
      if (response.flag === 1) {
        return response;
      }
      throw new Error(response.message || 'Error updating products');
    },
   
  });
}

export function useDeleteProduct(token = null) {

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/products/${id}`);
     
        return response.data;
     
    },
    
  });
}
