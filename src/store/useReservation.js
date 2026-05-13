import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = `${import.meta.env.VITE_API_URL}/`;
const ApiService = new apiService(baseURL);

export function useReservation(id, token = null) {
  const queryKey = ['reservations', id];
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await ApiService.get(`/reservations/${id}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id
  });
}

export function useReservations(params) {
  const queryClient = useQueryClient();
  const ApiService = new apiService(baseURL);

  const queryKey = computed(() => ['reservations', params.value]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page = 1, limit = 10, searchTerm = '', status = '', productId = '', from = '', to = '' } = params.value;
      if (params?.value?.token) {
        ApiService.setToken(params.value.token);
      }

      let url = `/reservations?page=${page}&limit=${limit}`;

      if (searchTerm) {
        url += `&productName[search]=${encodeURIComponent(searchTerm)}`;
      }
      if (status && status !== 'all') {
        url += `&status[eq]=${encodeURIComponent(status)}`;
      }
      if (productId) {
        url += `&productId[eq]=${encodeURIComponent(productId)}`;
      }
      if (from) {
        url += `&createdAt[gte]=${from}T00:00:00.000Z`;
      }
      if (to) {
        url += `&createdAt[lte]=${to}T23:59:59.999Z`;
      }

      const response = await ApiService.get(url);
      
      const prefetch = async (targetPage) => {
        let prefetchUrl = url.replace(`page=${page}`, `page=${targetPage}`);
        const response = await ApiService.get(prefetchUrl);
        return response?.data;
      };

      if (page < response.data.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ['reservations', { ...params.value, page: page + 1 }],
          queryFn: () => prefetch(page + 1)
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ['reservations', { ...params.value, page: page - 1 }],
          queryFn: () => prefetch(page - 1)
        });
      }

      return response?.data;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true
  });

  return query;
}

export function useCreateReservation(token = null) {
  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/reservations', data);
      return response.data;
    }
  });
}

export function useUpdateReservation(token = null) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/reservations/${id}`, data);
      return response.data;
    }
  });
}

export function usePendingReservationsCount(token = null) {
  const ApiService = new apiService(baseURL);
  if (token) {
    ApiService.setToken(token);
  }

  return useQuery({
    queryKey: ['reservations', 'pending-count'],
    queryFn: async () => {
      const response = await ApiService.get('/reservations/pending-count');
      return response.data.data;
    },
    staleTime: 1000 * 30
  });
}

export function useDeleteReservation(token = null) {
  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/reservations/${id}`);
      return response.data;
    }
  });
}
