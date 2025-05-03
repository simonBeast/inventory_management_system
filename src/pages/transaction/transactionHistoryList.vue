<template>
    
    <span v-if="isLoading && !errorMessage" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

    <div
      v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
      :class="containerClass"
      class="mx-auto mt-8 w-full max-w-7xl px-4"
    >
      <div class="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-100">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-100 text-gray-800 text-sm">
            <tr>
              <th class="px-4 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "ትራንሳክሽን ዓይነት":"Transaction Type"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "ኣቕሓ":"Product"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "በዝሒ":"Quantity"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "ናይ ሓንቲ ዋጋ":"Unit Price (Birr)"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "ጠቕላላ ወፃኢ" : "Total Cost (Birr)"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "መመለሲ ምኽንያት" : "Return Reason"}}</th>
              <th class="px-4 py-3 text-left">{{ isLanguageTigrigna ? "ዝተኻየደሉ ዕለት":"Transaction Date"}}</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-700">
            <tr
              v-for="(transaction, index) in transactions?.data"
              :key="index"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="px-4 py-2">{{ index + 1 }}</td>
              <td class="px-4 py-2 capitalize">{{ isLanguageTigrigna ? transaction.transactionType == "sale" ? "መሸጣ" : "ተመላሲ"  : transaction.transactionType   }}</td>
              <td class="px-4 py-2">{{ transaction.productId }}</td>
              <td class="px-4 py-2">{{ transaction.quantity }}</td>
              <td class="px-4 py-2">{{ transaction.unitPrice }}</td>
              <td class="px-4 py-2 font-semibold text-indigo-700">{{ transaction.totalCost }}</td>
              <td class="px-4 py-2 text-gray-500 italic">{{ convertReturnReasonToTigrigna(transaction.returnReason,'N/A' ) }}</td>
              <td class="px-4 py-2">{{ new Date(transaction.createdAt).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="mt-6">
        <pagination
          :total-pages="paginationData.totalPages"
          :current-page="paginationData.currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>
  
    <p
      v-if="errorMessage"
      :class="containerClass"
      class="mt-6 font-semibold text-red-600 text-center"
    >
      {{ errorMessage }}
    </p>
  </template>
  

<script setup>
import { ref,defineProps, computed, watch, } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { convertReturnReasonToTigrigna } from '../../util/utilFunctions';
import pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useTransactionHistory } from '../../store/useTransactionHistory';
import { useRoute } from 'vue-router';

const languageStore = useLanguageStore();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let authStore = useAuthStore();

const errorMessage = ref(false);

let route = useRoute();

let page = ref(Number(route.query.page) || 1);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
}));

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen
}));

const {isLoading, data:transactions ,isError,error} = useTransactionHistory(params);

const paginationData = computed(()=>transactions.value?.pagination || null);

watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

async function handlePageChange(page1) {
    page.value = page1;
}
</script>

<style scoped></style>
