import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useProductCategory(id, token = null) {
    const queryKey = ['product_categories', id];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/productCategory/${id}`);
        
          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }


export function useProductCategoryAlphaNoLimit(token = null) {
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
    return useQuery({
      queryKey:['product_categories_alpha_no_limit'],
      queryFn: async () => {
        const response = await ApiService.get(`/productCategory/alphaNoLimit`);
          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5
    });
  }

export function useProductCategories(params) {
  const queryClient = useQueryClient();

  const queryKey = computed(() => {

    const { page, searchTerm } = params.value;
    return searchTerm
      ? ['product_categories', 'search', searchTerm, page]
      : ['product_categories', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page, searchTerm, limit } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = params.value.searchTerm
        ? `/productCategory?name[search]=${params.value.searchTerm}&page=${params.value.page}&limit=${params.value.limit}`
        : `/productCategory?page=${params.value.page || 1}&limit=${params.value.limit || 10}`;
    
        
      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        const url = searchTerm
        ? `/productCategory?name[search]=${searchTerm}&page=${targetPage}&limit=${limit}`
        : `/productCategory?page=${targetPage || 1}&limit=${limit || 10}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['product_categories', 'search', searchTerm, page + 1]
            : ['product_categories', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['product_categories', 'search', searchTerm, page - 1]
            : ['product_categories', page - 1],
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

export function useCreateProductCategory(token = null) {


  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/productCategory', data);
     
        return response.data;
      
    },
  });
}

export function useUpdateProductCategory(token = null) {

  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/productCategory/${id}`, data);

        return response.data;
     
    },
   
  });
}

export function useDeleteProductCategory(token = null) {

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/productCategory/${id}`);

        return response.data;
     
    }
  });
}
