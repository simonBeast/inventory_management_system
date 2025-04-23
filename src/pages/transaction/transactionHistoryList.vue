<template>
    
    <span v-if="loading && !errorMessage" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

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
              v-for="(transaction, index) in transactionStore.result"
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
          :total-pages="pagination2.totalPages"
          :current-page="pagination2.currentPage"
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
import { ref, onMounted,defineProps, computed, } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { convertReturnReasonToTigrigna } from '../../util/utilFunctions';
import pagination from '../../components/pagination.vue';
import { useTransactionHistoryStore } from '../../store/transactionStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let authStore = useAuthStore();
let transactionStore = useTransactionHistoryStore();
let response = ref("");
let errorMessage = ref(false);
let pagination2 = ref(transactionStore.pagination);
let loading = ref(true);

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen
}));

 
onMounted(async () => {
    response.value = await transactionStore.getTransactionHistories(authStore.token);
    if (response.value.flag == 1) {
        errorMessage.value = false;
    } else {
        errorMessage.value = response.value.message;
    }
    loading.value =  false;
});

async function handlePageChange(page) {
    await transactionStore.changePage(authStore.token, page);
}
</script>

<style scoped></style>
