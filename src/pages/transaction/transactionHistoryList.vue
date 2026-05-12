<template>
  <span v-if="isLoading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "ታሪኽ ትራንዛክሽን" : "Transaction History" }}</h1>
      </div>
    </div>
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        
        <!-- Transaction Type -->
        <div class="lg:col-span-3">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ዓይነት ትራንሳክሽን" : "Transaction Type" }}</label>
          <select v-model="typeFilter"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option default value="">{{ isLanguageTigrigna ? "ኩሎም ዓይነታት" : "All Types" }}</option>
            <option value="sale">{{ isLanguageTigrigna ? "መሸጣ" : "Sale" }}</option>
            <option value="return">{{ isLanguageTigrigna ? "ተመላሲ" : "Return" }}</option>
            <option value="stock_in">{{ isLanguageTigrigna ? "ምእታው ኣቕሓ" : "Stock In" }}</option>
            <option value="stock_out">{{ isLanguageTigrigna ? "ምውፃእ ኣቕሓ" : "Stock Out" }}</option>
            <option value="sale_update">{{ isLanguageTigrigna ? "መሸጣ ምዕራይ" : "Sale Update" }}</option>
            <option value="sale_cancel">{{ isLanguageTigrigna ? "መሸጣ ምስራዝ" : "Sale Cancel" }}</option>
            <option value="return_update">{{ isLanguageTigrigna ? "ተመላሲ ምዕራይ" : "Return Update" }}</option>
            <option value="return_cancel">{{ isLanguageTigrigna ? "ተመላሲ ምስራዝ" : "Return Cancel" }}</option>
          </select>
        </div>

        <!-- Product Filter -->
        <div class="lg:col-span-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ኣቕሓ ምረፅ" : "Filter by Product" }}</label>
          <select v-model="productFilter"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option value="">{{ isLanguageTigrigna ? "ኩሎም ኣቕሑት" : "All Products" }}</option>
            <option v-for="prod in productsAlphaNoLimit || []" :key="prod.id" :value="prod.id">
              {{ prod.productName }}
            </option>
          </select>
        </div>

        <!-- Date Interval -->
        <div class="lg:col-span-5 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ካብ ዕለት" : "Start Date" }}</label>
            <input v-model="fromDateFilter" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ክሳብ ዕለት" : "End Date" }}</label>
            <input v-model="toDateFilter" type="date"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ትራንሳክሽን ዓይነት":"Type"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኣቕሓ":"Product"}}</th>
              <th class="px-6 py-4 text-center">{{ isLanguageTigrigna ? "በዝሒ":"Qty"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዋጋ":"Price"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ጠቕላላ":"Total"}}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት":"Date"}}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
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
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ transaction.Product?.productName || transaction.productId }}</td>
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

  <p v-if="errorMessage" class="text-center text-red-600 font-semibold mt-10 px-8">
    <font-awesome-icon icon="circle-exclamation" class="mr-2" /> {{ errorMessage }}
  </p>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useTransactionHistory } from '../../store/useTransactionHistory';
import { useProductsAlphaNoLimit } from '../../store/useProduct';
import { useRoute, useRouter } from 'vue-router';
import pagination from '../../components/pagination.vue';

const authStore = useAuthStore();
const languageStore = useLanguageStore();
const route = useRoute();
const router = useRouter();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const page = ref(Number(route.query.page) || 1);
const typeFilter = ref(route.query.type || '');
const productFilter = ref(route.query.productId || '');
const fromDateFilter = ref(route.query.from || '');
const toDateFilter = ref(route.query.to || '');
const errorMessage = ref("");

const { data: productsAlphaNoLimit } = useProductsAlphaNoLimit(authStore.token);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  transactionType: typeFilter.value,
  productId: productFilter.value,
  startDate: fromDateFilter.value,
  endDate: toDateFilter.value
}));

const { isLoading, data: transactions, isError, error } = useTransactionHistory(params);

const paginationData = computed(() => transactions.value?.pagination || null);

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});

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

watch([typeFilter, productFilter, fromDateFilter, toDateFilter], () => {
  page.value = 1;
  router.replace({
    query: {
      ...route.query,
      type: typeFilter.value || undefined,
      productId: productFilter.value || undefined,
      from: fromDateFilter.value || undefined,
      to: toDateFilter.value || undefined,
      page: page.value
    }
  });
});

function handlePageChange(newPage) {
  page.value = newPage;
  router.push({ query: { ...route.query, page: newPage } });
}
</script>

<style scoped></style>
