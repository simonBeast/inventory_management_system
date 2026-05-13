<template>
  <div v-if="authStore.isLoggedIn && authStore.isAdmin"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
      </div>
    </div>

    <!-- Asset Holding Section -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-10">
      <div class="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Asset Holding</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Current stock value grouped by category levels.</p>
        </div>
        <div class="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button v-for="option in groupOptions" :key="option.key" @click="assetGroup = option.key"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              assetGroup === option.key
                ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400'
                : 'text-gray-500 hover:text-blue-600 dark:text-gray-400'
            ]">
            {{ option.label }}
          </button>
        </div>
      </div>

      <div v-if="assetLoading" class="p-10 text-center">
        <span class="loading loading-spinner text-blue-600"></span>
      </div>
      <div v-else-if="assetErrorMessage" class="p-6 text-sm text-red-600">
        {{ assetErrorMessage }}
      </div>
      <div v-else class="overflow-x-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Total Qty</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(assetSummary.totalQty) }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Total Holding Value</div>
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(assetSummary.totalValue) }}</div>
          </div>
        </div>
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4 text-center">Total Qty</th>
              <th class="px-6 py-4">Total Value</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(row, index) in assetRows" :key="row.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ row.name }}</td>
              <td class="px-6 py-4 text-center font-bold">{{ formatNumber(row.totalQty) }}</td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(row.totalValue) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="assetRows.length === 0" class="p-6 text-sm text-gray-500 dark:text-gray-400">
          No asset data available.
        </div>
      </div>
    </section>

    <!-- Sales Report Section -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="p-6 flex flex-col gap-6 border-b border-gray-100 dark:border-gray-800">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Sales Report</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Filter by sale date and group by category levels.</p>
          </div>
          <div class="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button v-for="option in groupOptions" :key="option.key" @click="salesGroup = option.key"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                salesGroup === option.key
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400'
                  : 'text-gray-500 hover:text-blue-600 dark:text-gray-400'
              ]">
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
            <input v-model="fromDate" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
            <input v-model="toDate" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Total Qty</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(salesSummary.totalQty) }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Revenue</div>
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(salesSummary.totalRevenue) }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Cost</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatNumber(salesSummary.totalCost) }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="text-xs text-gray-500">Profit</div>
            <div class="text-lg font-bold text-emerald-600">{{ formatNumber(salesSummary.totalProfit) }}</div>
          </div>
        </div>
      </div>

      <div v-if="salesLoading" class="p-10 text-center">
        <span class="loading loading-spinner text-blue-600"></span>
      </div>
      <div v-else-if="salesErrorMessage" class="p-6 text-sm text-red-600">
        {{ salesErrorMessage }}
      </div>
      <div v-else-if="!fromDate || !toDate" class="p-6 text-sm text-gray-500 dark:text-gray-400">
        Select start and end dates to view sales.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4 text-center">Total Qty</th>
              <th class="px-6 py-4">Revenue</th>
              <th class="px-6 py-4">Cost</th>
              <th class="px-6 py-4">Profit</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(row, index) in salesRows" :key="row.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ row.name }}</td>
              <td class="px-6 py-4 text-center font-bold">{{ formatNumber(row.totalQty) }}</td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(row.totalRevenue) }}</td>
              <td class="px-6 py-4 font-mono">{{ formatNumber(row.totalCost) }}</td>
              <td class="px-6 py-4 font-mono font-bold text-emerald-600">{{ formatNumber(row.totalProfit) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="salesRows.length === 0" class="p-6 text-sm text-gray-500 dark:text-gray-400">
          No sales data available for this range.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useAssetHoldingReport, useSalesGroupedReport } from '../../store/useInventoryReports';

const authStore = useAuthStore();

const groupOptions = [
  { key: 'category', label: 'Category' },
  { key: 'productCategory', label: 'Product Category' },
  { key: 'productSubCategory', label: 'Product Sub Category' }
];

const assetGroup = ref('category');
const salesGroup = ref('category');
const fromDate = ref('');
const toDate = ref('');

const assetParams = computed(() => ({ token: authStore.token }));
const salesParams = computed(() => ({
  token: authStore.token,
  startDate: fromDate.value,
  endDate: toDate.value
}));

const { data: assetData, isLoading: assetLoading, isError: assetIsError, error: assetError } = useAssetHoldingReport(assetParams);
const { data: salesData, isLoading: salesLoading, isError: salesIsError, error: salesError } = useSalesGroupedReport(salesParams);

const assetRows = computed(() => {
  const data = assetData.value || {};
  if (assetGroup.value === 'category') return data.categories || [];
  if (assetGroup.value === 'productCategory') return data.productCategories || [];
  return data.productSubCategories || [];
});

const assetSummary = computed(() => {
  const data = assetData.value || {};
  if (data.summary) return data.summary;

  return assetRows.value.reduce(
    (acc, row) => {
      acc.totalQty += Number(row.totalQty || 0);
      acc.totalValue += Number(row.totalValue || 0);
      return acc;
    },
    { totalQty: 0, totalValue: 0 }
  );
});

const salesRows = computed(() => {
  const data = salesData.value || {};
  if (salesGroup.value === 'category') return data.categories || [];
  if (salesGroup.value === 'productCategory') return data.productCategories || [];
  return data.productSubCategories || [];
});

const salesSummary = computed(() => {
  const data = salesData.value || {};
  if (data.summary) return data.summary;

  return salesRows.value.reduce(
    (acc, row) => {
      acc.totalQty += Number(row.totalQty || 0);
      acc.totalRevenue += Number(row.totalRevenue || 0);
      acc.totalCost += Number(row.totalCost || 0);
      acc.totalProfit += Number(row.totalProfit || 0);
      return acc;
    },
    { totalQty: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0 }
  );
});

const assetErrorMessage = computed(() => (assetIsError.value ? (assetError.value?.message || 'Something went wrong') : ''));
const salesErrorMessage = computed(() => (salesIsError.value ? (salesError.value?.message || 'Something went wrong') : ''));

const formatNumber = (value) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : '0';
};
</script>

<style scoped></style>
