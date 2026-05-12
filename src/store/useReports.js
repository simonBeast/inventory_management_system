import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import apiService from '../util/apiService';

const baseURL = 'http://localhost:3001/api/v1/';
const ApiService = new apiService(baseURL);

export function useSalesReport(params) {
  const queryKey = computed(() => ['sales_report', params.value.startDate, params.value.endDate]);
  
  if (params.value.token) {
    ApiService.setToken(params.value.token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { startDate, endDate, page = 1, limit = 100 } = params.value;
      if (!startDate || !endDate) return null;
      
      const response = await ApiService.get(`/sales/reports/sales-by-date/${startDate}/${endDate}?page=${page}&limit=${limit}`);
      // The API returns data in a specific format, we might need to calculate summary stats
      const sales = response?.data?.data || [];
      
      const summary = {
        totalRevenue: sales.reduce((acc, s) => acc + (s.totalSalePrice || 0), 0),
        totalProfit: sales.reduce((acc, s) => acc + (s.profit || 0), 0),
        totalItemsSold: sales.reduce((acc, s) => acc + (s.quantity || 0), 0),
        transactionCount: sales.length
      };

      return { sales, summary };
    },
    enabled: computed(() => !!params.value.startDate && !!params.value.endDate),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSalesStats(token) {
  const queryKey = ['sales_stats'];
  
  if (token) {
    ApiService.setToken(token);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Fetch multiple endpoints to aggregate stats if a single endpoint doesn't exist
      // For now, let's assume we can get basic stats from sales
      const response = await ApiService.get('/sales?limit=1000');
      const sales = response?.data?.data || [];
      
      const totalRevenue = sales.reduce((acc, s) => acc + (s.totalSalePrice || 0), 0);
      const totalProfit = sales.reduce((acc, s) => acc + (s.profit || 0), 0);
      const totalItemsSold = sales.reduce((acc, s) => acc + (s.quantity || 0), 0);
      
      // Get top products (mock logic based on available sales)
      const productMap = {};
      sales.forEach(s => {
        const pid = s.productId;
        if (!productMap[pid]) {
          productMap[pid] = { 
            productId: pid, 
            productName: s.Product?.productName || 'Unknown', 
            quantitySold: 0, 
            revenue: 0, 
            profit: 0 
          };
        }
        productMap[pid].quantitySold += s.quantity;
        productMap[pid].revenue += s.totalSalePrice;
        productMap[pid].profit += s.profit;
      });

      const topProducts = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalRevenue,
        totalProfit,
        totalItemsSold,
        transactionCount: sales.length,
        topProducts
      };
    },
    staleTime: 1000 * 60 * 10,
  });
}
