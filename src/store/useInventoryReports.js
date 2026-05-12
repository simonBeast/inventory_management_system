import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import apiService from '../util/apiService';

const baseURL = 'http://localhost:3001/api/v1/';
const ApiService = new apiService(baseURL);

export function useAssetHoldingReport(params) {
  const queryKey = computed(() => ['asset_holding_report']);

  if (params.value?.token) {
    ApiService.setToken(params.value.token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await ApiService.get('/reports/assets');
      return response?.data?.data || null;
    },
    staleTime: 1000 * 60 * 5
  });
}

export function useSalesGroupedReport(params) {
  const queryKey = computed(() => [
    'sales_grouped_report',
    params.value.startDate,
    params.value.endDate
  ]);

  if (params.value?.token) {
    ApiService.setToken(params.value.token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { startDate, endDate } = params.value;
      if (!startDate || !endDate) return null;
      const response = await ApiService.get('/reports/sales', { startDate, endDate });
      return response?.data?.data || null;
    },
    enabled: computed(() => !!params.value.startDate && !!params.value.endDate),
    staleTime: 1000 * 60 * 5
  });
}
