import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useProductSubCategory(id, token = null) {
    const queryKey = ['product_sub_categories', id];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/productSubCategory/${id}`);

          return response.data.data;
      
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }


export function useProductSubCategoryAlphaNoLimit(token = null) {
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
    return useQuery({
      queryKey:['product_sub_categories_alpha_no_limit'],
      queryFn: async () => {
        const response = await ApiService.get(`/productSubCategory/alphaNoLimit`);
        
          return response.data.data;
        
      },
      staleTime: 1000 * 60 * 5
    });
  }

export function useProductSubCategories(params) {

  const queryClient = useQueryClient();

  const queryKey = computed(() => {

    const { page, searchTerm } = params.value;
    return searchTerm
      ? ['product_sub_categories', 'search', searchTerm, page]
      : ['product_sub_categories', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page, searchTerm, limit } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = params.value.searchTerm
        ? `/productSubCategory?name[search]=${params.value.searchTerm}&page=${params.value.page}&limit=${params.value.limit}`
        : `/productSubCategory?page=${params.value.page || 1}&limit=${params.value.limit || 10}`;
    
        
      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        const url = searchTerm
        ? `/productSubCategory?name[search]=${searchTerm}&page=${targetPage}&limit=${limit}`
        : `/productSubCategory?page=${targetPage || 1}&limit=${limit || 10}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['product_sub_categories', 'search', searchTerm, page + 1]
            : ['product_sub_categories', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['product_sub_categories', 'search', searchTerm, page - 1]
            : ['product_sub_categories', page - 1],
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

export function useCreateProductSubCategory(token = null) {

  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/productSubCategory', data);
     
        return response.data;
     
    },
  });
}

export function useUpdateProductSubCategory(token = null) {

  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log("update product sub category Mutation",data);
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/productSubCategory/${id}`, data);

        return response.data;
      
    },
   
  });
}

export function useDeleteProductSubCategory(token = null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/productSubCategory/${id}`);
      
        return response.data;
     
    },
    
  });
}
