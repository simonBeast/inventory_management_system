<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && productData"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header with Back Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div class="flex items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ productData.productName }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ productData.productDescription }}</p>
        </div>
      </div>
    </div>

    <!-- Product Summary Card -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isLanguageTigrigna ? "ኣቕሓ ቑፅሪ" : "Product Code" }}</span>
        <span class="text-gray-900 dark:text-white font-medium">{{ productData.productCode }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isLanguageTigrigna ? "ንኡስ ምድብ" : "Sub Category" }}</span>
        <span class="text-gray-900 dark:text-white font-medium">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {{ productData.ProductSubCategory?.name || '-' }}
          </span>
        </span>
      </div>
      <div v-if="authStore.isAdmin" class="flex flex-col">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isLanguageTigrigna ? "ዋጋ" : "Price" }}</span>
        <span class="text-blue-600 dark:text-blue-400 font-bold font-mono">{{ productData.pricePerUnit }} <span class="text-[10px] font-normal text-gray-500">Birr/{{ productData.measurementUnit }}</span></span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isLanguageTigrigna ? "ቅሩብ" : "Available Stock" }}</span>
        <span class="font-bold text-gray-900 dark:text-white" :class="productData.ProductDetail?.availableQuantity <= productData.ProductDetail?.minimumStockLevel ? 'text-red-500' : ''">
          {{ productData.ProductDetail?.availableQuantity }} {{ productData.measurementUnit }}
        </span>
      </div>
        <div class="flex flex-col">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isLanguageTigrigna ? " ዝተጀመረ" : "Minimum Stock Level" }}</span>
        <span class="font-bold text-gray-900 dark:text-white" :class="productData.ProductDetail?.availableQuantity <= productData.ProductDetail?.minimumStockLevel ? 'text-red-500' : ''">
          {{ productData.ProductDetail?.minimumStockLevel }} {{  productData.measurementUnit }}
        </span>
      </div>
    </div>

    <!-- Transaction History Section -->
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ isLanguageTigrigna ? "ታሪኽ ትራንዛክሽን" : "Transaction History" }}</h2>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ዓይነት ትራንዛክሽን" : "Transaction Type" }}</label>
          <select v-model="transactionTypeFilter"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option value="">{{ isLanguageTigrigna ? "ኩሉ" : "All Types" }}</option>
            <option value="sale">{{ isLanguageTigrigna ? "መሸጣ" : "Sale" }}</option>
            <option value="return">{{ isLanguageTigrigna ? "ተመላሲ" : "Return" }}</option>
            <option value="stock_in">{{ isLanguageTigrigna ? "ምእታው ኣቕሓ" : "Stock In" }}</option>
            <option value="stock_out">{{ isLanguageTigrigna ? "ምውፃእ ኣቕሓ" : "Stock Out" }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ካብ ዕለት" : "Start Date" }}</label>
            <input v-model="startDateFilter" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ክሳብ ዕለት" : "End Date" }}</label>
            <input v-model="endDateFilter" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
      <div v-if="transactionsLoading" class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
        <span class="loading loading-spinner text-blue-600"></span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ትራንሳክሽን ዓይነት":"Type"}}</th>
              <th class="px-6 py-4 text-center">{{ isLanguageTigrigna ? "በዝሒ":"Qty"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዋጋ":"Price"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ጠቕላላ":"Total"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት":"Date"}}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="!transactions?.data || transactions.data.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                {{ isLanguageTigrigna ? "ምንም ትራንዛክሽን የለን" : "No transactions found" }}
              </td>
            </tr>
            <tr v-for="(transaction, index) in transactions?.data" :key="index"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': transaction.transactionType === 'sale',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': transaction.transactionType === 'return',
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': transaction.transactionType === 'stock_in'
                }" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ formatTransactionType(transaction.transactionType) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">{{ transaction.quantity }}</td>
              <td class="px-6 py-4 font-mono">{{ transaction.unitPrice.toLocaleString() }}</td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{{ transaction.totalCost.toLocaleString() }}</td>
              <td class="px-6 py-4 text-xs text-gray-500">{{ new Date(transaction.createdAt).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <pagination v-if="paginationData && paginationData.totalPages > 1" :total-pages="paginationData.totalPages" :current-page="paginationData.currentPage" @page-changed="handlePageChange" />
    </div>

  </div>

  <p v-if="errorMessage || transactionsError" class="text-center text-red-600 font-semibold mt-10 px-8">
    <font-awesome-icon icon="circle-exclamation" class="mr-2" /> {{ errorMessage || transactionsError }}
  </p>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useRoute, useRouter } from 'vue-router';
import { useLanguageStore } from '../../store/languageStore'; 
import { useProduct } from '../../store/useProduct';
import { useTransactionHistory } from '../../store/useTransactionHistory';
import pagination from '../../components/pagination.vue';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const productId = route.params.id;
const errorMessage = ref("");
const transactionsError = ref("");

// Product Data
const { isLoading: loading, data: productData, isError, error } = useProduct(productId, authStore.token);

watch([isError, error], ([hasError, err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong loading the product";
  } else {
    errorMessage.value = "";
  }
});

// Transaction History Filter State
const page = ref(1);
const transactionTypeFilter = ref("");
const startDateFilter = ref("");
const endDateFilter = ref("");

watch([transactionTypeFilter, startDateFilter, endDateFilter], () => {
  page.value = 1; // Reset page on filter change
});

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  productId: productId,
  transactionType: transactionTypeFilter.value || undefined,
  startDate: startDateFilter.value || undefined,
  endDate: endDateFilter.value || undefined
}));

const { isLoading: transactionsLoading, data: transactions, isError: isTransactionsError, error: tError } = useTransactionHistory(params);

const paginationData = computed(() => transactions.value?.pagination || null);

watch([isTransactionsError, tError], ([hasError, err]) => {
  if (hasError) {
    transactionsError.value = err.message || "Something went wrong loading transactions";
  } else {
    transactionsError.value = "";
  }
});

function handlePageChange(newPage) {
  page.value = newPage;
}

const formatTransactionType = (type) => {
  if (!isLanguageTigrigna.value) return type.replace('_', ' ');
  const map = {
    sale: "መሸጣ",
    return: "ተመላሲ",
    stock_in: "ምእታው ኣቕሓ",
    stock_out: "ምውፃእ ኣቕሓ",
    sale_update: "መሸጣ ምዕራይ",
    sale_cancel: "መሸጣ ምስራዝ",
    return_update: "ተመላሲ ምዕራይ",
    return_cancel: "ተመላሲ ምስራዝ"
  };
  return map[type] || type;
};
</script>

<style scoped>
</style>
