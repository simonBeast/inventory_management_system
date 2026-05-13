import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import apiService from '../util/apiService';
import { computed } from 'vue';

const baseURL = `${import.meta.env.VITE_API_URL}/`;

const ApiService = new apiService(baseURL);

export function useReturn(id, token = null) {

    const queryKey = ['return', id];

    const ApiService = new apiService(baseURL);

    if (token) {
      ApiService.setToken(token);
    }
  
    return useQuery({
      queryKey,
      queryFn: async () => {
        const response = await ApiService.get(`/returns/${id}`);

          return response.data.data;
       
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id
    });
  }



export function useReturns(params) {
  const queryClient = useQueryClient();

  
  const queryKey = computed(() => {
    const { page, saleIdSearch, returnStatus, reason, startDate, endDate } = params.value;
    return  ['returns', page, saleIdSearch, returnStatus, reason, startDate, endDate];
  });

  const buildUrl = (targetPage) => {
    const { limit, saleIdSearch, returnStatus, reason, startDate, endDate } = params.value;
    let url = `/returns?page=${targetPage || 1}&limit=${limit || 10}`;

    if (saleIdSearch) url += `&saleId[search]=${saleIdSearch}`;
    if (returnStatus) url += `&returnStatus[eq]=${returnStatus}`;
    if (reason) url += `&reason[eq]=${reason}`;
    if (startDate) url += `&createdAt[gte]=${startDate}T00:00:00.000Z`;
    if (endDate) url += `&createdAt[lte]=${endDate}T23:59:59.999Z`;

    return url;
  };

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { page,limit } = params.value;
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
          queryKey: ['returns', page + 1, params.value.saleIdSearch, params.value.returnStatus, params.value.reason, params.value.startDate, params.value.endDate],
          queryFn: () => prefetch(page + 1),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: ['returns', page - 1, params.value.saleIdSearch, params.value.returnStatus, params.value.reason, params.value.startDate, params.value.endDate],
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

export function useCreateReturn(token = null) {
 
  return useMutation({
    mutationFn: async (data) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.post('/returns', data);

        return response;
     
    },
  });
}

export function useUpdateReturn(token = null) {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.patch(`/returns/${id}`, data);

        return response.data;
    
    },
   
  });
}

export function useDeleteReturn(token = null) {

  return useMutation({
    mutationFn: async (id) => {
      if (token) {
        ApiService.setToken(token);
      }
      const response = await ApiService.delete(`/returns/${id}`);
      
        return response.data;
      
    },
   
  });
}
