import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useCategory(id, token = null) {
    const queryKey = ['categories', id];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/categories/${id}`);
        if (response.flag === 1) {
          return response.data.data;
        }
        throw new Error(response.message || 'Error fetching category');
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }


export function useCategoryAlphaNoLimit(token = null) {
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
    return useQuery({
      queryKey:['categories_alpha_no_limit'],
      queryFn: async () => {
        const response = await ApiService.get(`/categories/alphaNoLimit`);

          return response.data.data;
        
      },
      staleTime: 1000 * 60 * 5
    });
  }

export function useCategories(params) {
  const queryClient = useQueryClient();

  const queryKey = computed(() => {
    const { page, searchTerm } = params.value;
    return searchTerm
      ? ['categories', 'search', searchTerm, page]
      : ['categories', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page, searchTerm, limit } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = searchTerm
        ? `/categories?name[search]=${searchTerm}&page=${page}&limit=${limit}`
        : `/categories?page=${page || 1}&limit=${limit || 10}`;
    
        
      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        if (params?.value?.token) ApiService.setToken(params?.value?.token);
      
        const url = searchTerm
          ? `/categories?name[search]=${searchTerm}&page=${targetPage}&limit=${limit}`
          : `/categories?page=${targetPage}&limit=${limit}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['categories', 'search', searchTerm, page + 1]
            : ['categories', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['categories', 'search', searchTerm, page - 1]
            : ['categories', page - 1],
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


export function useCreateCategory(token = null) {
  
  return useMutation({
    mutationFn: async (name) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/categories', { name });
      
        return response;
     
    },
  });
}

export function useUpdateCategory(token = null) {

  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/categories/${id}`, data);
      
        return response.data;
      
    },
   
  });
}

export function useDeleteCategory(token = null) {
 

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/categories/${id}`);
     
        return response.data;
      
    }
  });
}
