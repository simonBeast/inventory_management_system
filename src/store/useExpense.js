import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import apiService from '../util/apiService';

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const ApiService = new apiService(baseURL);

export function useExpenses(params) {
  const queryClient = useQueryClient();

  const queryKey = computed(() => {
    const { page, category, startDate, endDate } = params.value;
    return ['expenses', page, category, startDate, endDate];
  });

  const buildUrl = (targetPage) => {
    const { limit, category, startDate, endDate } = params.value;
    let url = `/expenses?page=${targetPage || 1}&limit=${limit || 10}`;

    if (category) url += `&category[eq]=${category}`;
    if (startDate) url += `&expenseDate[gte]=${startDate}`;
    if (endDate) url += `&expenseDate[lte]=${endDate}`;

    return url;
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { page } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }

      const url = buildUrl(page);
      const response = await ApiService.get(url);

      const prefetch = async (targetPage) => {
        const url = buildUrl(targetPage);
        const response = await ApiService.get(url);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ['expenses', page + 1, params.value.category, params.value.startDate, params.value.endDate],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ['expenses', page - 1, params.value.category, params.value.startDate, params.value.endDate],
          queryFn: () => prefetch(page - 1),
        });
      }

      return response?.data;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
}

export function useCreateExpense(token = null) {
  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/expenses', data);
      return response;
    },
  });
}

export function useUpdateExpense(token = null) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/expenses/${id}`, data);
      return response.data;
    },
  });
}

export function useDeleteExpense(token = null) {
  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/expenses/${id}`);
      return response.data;
    },
  });
}
