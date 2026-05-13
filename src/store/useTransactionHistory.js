import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = `${import.meta.env.VITE_API_URL}/`;

const ApiService = new apiService(baseURL);

export function useTransactionHistory(params) {
  const queryClient = useQueryClient();

  const queryKey = computed(() => {
    const { page, productId, transactionType, startDate, endDate } = params.value;
    return ['transaction_history', page, productId, transactionType, startDate, endDate];
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page, limit, productId, transactionType, startDate, endDate } = params.value;

      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }

      let url = `/history?page=${page}&limit=${limit || 10}`;
      if (productId) url += `&productId[eq]=${productId}`;
      if (transactionType) url += `&transactionType[eq]=${transactionType}`;
      if (startDate) url += `&createdAt[gte]=${startDate}T00:00:00.000Z`;
      if (endDate) url += `&createdAt[lte]=${endDate}T23:59:59.999Z`;

      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        let prefetchUrl = `/history?page=${targetPage || 1}&limit=${limit || 10}`;
        if (productId) prefetchUrl += `&productId[eq]=${productId}`;
        if (transactionType) prefetchUrl += `&transactionType[eq]=${transactionType}`;
        if (startDate) prefetchUrl += `&createdAt[gte]=${startDate}T00:00:00.000Z`;
        if (endDate) prefetchUrl += `&createdAt[lte]=${endDate}T23:59:59.999Z`;

        const response = await ApiService.get(prefetchUrl);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ['transaction_history', page + 1, productId, transactionType, startDate, endDate],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ['transaction_history', page - 1, productId, transactionType, startDate, endDate],
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

