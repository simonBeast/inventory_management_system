import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useUser(id, token = null) {
    const queryKey = ['users', id];
    const ApiService = new apiService(baseURL);
    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {

        const response = await ApiService.get(`/users/${id}`);

          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }



export function useUsers(params) {
  const queryClient = useQueryClient();
  const queryKey = computed(() => {
    const { page, searchTerm } = params.value;
    return searchTerm
      ? ['users', 'search', searchTerm, page]
      : ['users', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page, searchTerm, limit } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = params.value.searchTerm
      ? `/users?fullName[search]=${params.value.searchTerm}&page=${params.value.page}&limit=${params.value.limit}`
      : `/users?page=${params.value.page}&limit=${params.value.limit}`;

      const response = await ApiService.get(url);

      
      const prefetch = async (targetPage) => {
        const url = searchTerm
        ? `/users?fullName[search]=${searchTerm}&page=${targetPage}&limit=${limit}`
        : `/users?page=${targetPage || 1}&limit=${limit || 10}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['users', 'search', searchTerm, page + 1]
            : ['users', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: searchTerm
            ? ['users', 'search', searchTerm, page - 1]
            : ['users', page - 1],
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

export function useChangeUserPassword(token = null) {
 
  return useMutation({
    mutationFn: async ({userId,data}) => {
   
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post(`/users/changePassword/${userId}`, data);

        return response;

    },
  });
}

export function useCreateUser(token = null) {
 
  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/users/signup', data);

        return response;
    
    },
  });
}

export function useUpdateUser(token = null) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/users/${id}`, data);

        return response.data;
     
    },
   
  });
}

export function useDeleteUser(token = null) {

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/users/${id}`);
      
        return response.data;
     
    },
    
  });
}
