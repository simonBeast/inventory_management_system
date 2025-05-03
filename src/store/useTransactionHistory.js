import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = 'http://localhost:3001/api/v1/';

const ApiService = new apiService(baseURL);

export function useTransactionHistory(params) {
  const queryClient = useQueryClient();
  
  const queryKey = computed(() => {
    const { page} = params.value;
    return ['transaction_history', page];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page,limit } = params.value;

      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }
   
      const url = `/history?page=${params.value.page}&limit=${params.value.limit}`;

      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        const url = `/history?page=${targetPage || 1}&limit=${limit || 10}`;
      
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ['transaction_history', page + 1],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ['transaction_history', page - 1],
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

