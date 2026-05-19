<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ መሸጣ" : "Sales Records" }}</h1>
      </div>
      <button v-if="authStore.isAdmin" @click="openCreateModal"
        class="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="cart-plus" />
        {{ isLanguageTigrigna ? "ሓዱሽ መሸጣ መዝግብ" : "Create New Sale" }}
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        
        <!-- Search -->
        <div class="lg:col-span-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "መሸጣታት ኣልሽ" : "Search Sales" }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <font-awesome-icon icon="search" class="text-xs" />
              </span>
              <input v-model="searchInput" type="text" :placeholder="isLanguageTigrigna ? 'ብሽም ኣቕሓ ኣልሽ...' : 'Search by product name...'"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" @keyup.enter="handleSearch" />
            </div>
            <button @click="handleSearch"
              class="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap">
              {{ isLanguageTigrigna ? "ኣልሽ" : "Search" }}
            </button>
          </div>
        </div>

        <!-- Seller Filter -->
        <div class="lg:col-span-3">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ሸያጢ" : "Seller" }}</label>
          <select v-model="sellerFilter"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option value="">{{ isLanguageTigrigna ? "ኩሎም" : "All Sellers" }}</option>
            <option v-for="user in users?.data || []" :key="user.id" :value="user.id">
              {{ user.fullName }}
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

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "መሸጣ ID" : "Sale ID" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</th>
              <th class="px-6 py-4 text-center">{{ isLanguageTigrigna ? "በዝሒ" : "Qty" }}</th>
              <th v-if="authStore.isAdmin" class="px-6 py-4">{{ isLanguageTigrigna ? "ዋጋ" : "Unit Price" }}</th>
              <th v-if="authStore.isAdmin" class="px-6 py-4">{{ isLanguageTigrigna ? "ጠቕላላ" : "Total" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት" : "Date" }}</th>
              <th v-if="authStore.isAdmin" class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(sale, index) in sales?.data || []" :key="sale.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-gray-500" :title="sale.id">{{ sale.id.substring(0, 8) }}...</span>
                  <button @click="copyToClipboard(sale.id)" class="text-gray-400 hover:text-blue-600 transition-colors relative" :title="isLanguageTigrigna ? 'ኮፒ ግበር' : 'Copy ID'">
                    <font-awesome-icon v-if="copiedId !== sale.id" icon="copy" class="w-3.5 h-3.5" />
                    <font-awesome-icon v-else icon="check" class="w-3.5 h-3.5 text-green-500" />
                  </button>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-semibold text-gray-900 dark:text-white">{{ sale.Product?.productName || 'Unknown Product' }}</div>
                <div v-if="sale.User" class="text-[10px] text-gray-400">Sold by: {{ sale.User.fullName }}</div>
              </td>
              <td class="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">{{ sale.quantity }}</td>
              <td v-if="authStore.isAdmin" class="px-6 py-4 font-mono">{{ sale.salePricePerUnit.toLocaleString() }}</td>
              <td v-if="authStore.isAdmin" class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                {{ (sale.quantity * sale.salePricePerUnit || 0).toLocaleString() }}
              </td>
              <td class="px-6 py-4 text-xs text-gray-500">
                {{ new Date(sale.createdAt).toLocaleString() }}
              </td>
              <td v-if="authStore.isAdmin" class="px-6 py-4 space-x-3 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <button @click="handleEdit(sale)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
                </button>
                <button v-if="authStore.isAdmin" @click="openConfirmationModal(sale.id)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣጥፍእ" : "Delete" }}
                </button>
              </td>
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

  <!-- Delete Modal -->
  <dialog id="deleteModal" class="modal">
    <div class="modal-box rounded-2xl shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <h3 class="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
        <font-awesome-icon icon="triangle-exclamation" class="text-red-500" />
        {{ isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ" : "Confirm Deletion" }}
      </h3>
      <p class="py-4 text-gray-600 dark:text-gray-300">
        {{ isLanguageTigrigna ? "እቲ መሸጣ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this sale record? This will revert the stock changes." }}
      </p>
      <div class="modal-action flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
          {{ isLanguageTigrigna ? "ኣይኮንኩን" : "Cancel" }}
        </button>
        <button @click="confirmDelete" class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-sm transition-colors">
          {{ isLanguageTigrigna ? "እወ" : "Delete Sale" }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- Sale Form Modal -->
  <BaseModal :isOpen="isFormModalOpen" @close="closeFormModal" :title="formModalTitle" class="max-w-md">
    <template #body>
      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</label>
          <select v-model="formData.productId" required :disabled="isEditing"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
            <option v-for="prod in productsAlphaNoLimit || []" :key="prod.id" :value="prod.id">
              {{ prod.productName }} {{ prod.quantity }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ" : "Quantity" }}</label>
          <input v-model.number="formData.quantity" type="number" required min="1"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ዋጋ መሸጣ (ነፍሲ ወከፍ)" : "Sale Price (Per Unit)" }}</label>
          <input v-model.number="formData.salePricePerUnit" type="number" required min="0" step="0.01"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>
        
        <div class="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span class="text-sm font-medium text-gray-500">{{ isLanguageTigrigna ? "ጠቕላላ ዋጋ" : "Total Amount" }}</span>
          <span class="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{{ (formData.quantity * formData.salePricePerUnit || 0).toLocaleString() }} Birr</span>
        </div>

        <div v-if="formError" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
          <font-awesome-icon icon="circle-exclamation" class="mr-1" /> {{ formError }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" @click="closeFormModal" class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
            {{ isLanguageTigrigna ? "ተመለስ" : "Cancel" }}
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50">
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            {{ isEditing ? (isLanguageTigrigna ? 'ኣዐርይ' : 'Update Sale') : (isLanguageTigrigna ? 'መሸጣ መዝግብ' : 'Record Sale') }}
          </button>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import BaseModal from '../../components/BaseModal.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useSales, useDeleteSale, useCreateSale, useUpdateSale } from '../../store/useSales';
import { useProductsAlphaNoLimit } from '../../store/useProduct';
import { useUsers } from '../../store/useUser';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const searchInput = ref("");
let page = ref(Number(route.query.page) || 1);
const searchTerm = ref(route.query.search || '');
const fromDateFilter = ref(route.query.from || '');
const toDateFilter = ref(route.query.to || '');
const sellerFilter = ref(route.query.sellerId || '');
const errorMessage = ref('');

const queryClient = useQueryClient();

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
  from: fromDateFilter.value,
  to: toDateFilter.value,
  sellerId: sellerFilter.value
}));

const userParams = computed(() => ({ page: 1, limit: 100, token: authStore.token, searchTerm: '' }));
const { data: users } = useUsers(userParams);

const { isLoading: loading, data: sales, isError, error } = useSales(params);
const { data: productsAlphaNoLimit } = useProductsAlphaNoLimit(authStore.token);

const deleteMutation = useDeleteSale(authStore.token);
const createMutation = useCreateSale(authStore.token);
const updateMutation = useUpdateSale(authStore.token);

const paginationData = computed(() => sales.value?.pagination || null);

// --- Copy ID Logic ---
const copiedId = ref(null);
const copyToClipboard = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    copiedId.value = id;
    setTimeout(() => { copiedId.value = null; }, 2000);
  } catch (e) {
    console.error('Failed to copy', e);
  }
};

// --- Form State ---
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  productId: null,
  quantity: 0,
  salePricePerUnit: 0
});

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "መሸጣ ኣዐርይ" : "Edit Sale Record") 
    : (isLanguageTigrigna.value ? "ሓዱሽ መሸጣ መዝግብ" : "Record New Sale");
});

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});

// Auto-fill price when product selected
watch(() => formData.productId, (newId) => {
  if (!isEditing.value && newId) {
    const product = productsAlphaNoLimit.value?.find(p => p.id === newId);
    if (product) {
      formData.salePricePerUnit = product.salePricePerUnit;
    }
  }
});

function handleSearch() {
  searchTerm.value = searchInput.value.trim();
  page.value = 1;
  router.replace({
    query: { 
      ...route.query, 
      search: searchTerm.value || undefined, 
      page: page.value 
    }
  });
}

watch([fromDateFilter, toDateFilter, sellerFilter], () => {
  page.value = 1;
  router.replace({
    query: {
      ...route.query,
      from: fromDateFilter.value || undefined,
      to: toDateFilter.value || undefined,
      sellerId: sellerFilter.value || undefined,
      page: page.value
    }
  });
});

function handlePageChange(newPage) {
  page.value = newPage;
  router.push({ query: { ...route.query, page: newPage } });
}

// Form Handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formData.productId = null;
  formData.quantity = 1;
  formData.salePricePerUnit = 0;
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(sale) {
  isEditing.value = true;
  editingId.value = sale.id;
  formData.productId = sale.productId;
  formData.quantity = sale.quantity;
  formData.salePricePerUnit = sale.salePricePerUnit;
  formError.value = '';
  isFormModalOpen.value = true;
}

function closeFormModal() {
  isFormModalOpen.value = false;
}

async function submitForm() {
  isSubmitting.value = true;
  formError.value = '';
  try {
    if (isEditing.value) {
      await updateMutation.mutateAsync({ id: editingId.value, data: { quantity: formData.quantity, salePricePerUnit: formData.salePricePerUnit } });
    } else {
      await createMutation.mutateAsync(formData);
    }
    queryClient.invalidateQueries(['sales']);
    queryClient.invalidateQueries(['products']);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Delete Handlers
const saleIdToDelete = ref(null);
function openConfirmationModal(id) {
  saleIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  try {
    await deleteMutation.mutateAsync(saleIdToDelete.value);
    queryClient.invalidateQueries(['sales']);
    queryClient.invalidateQueries(['products']);
    closeModal();
  } catch (err) {
    errorMessage.value = err.message;
  }
}

function closeModal() {
  document.getElementById('deleteModal').close();
}
</script>

<style scoped></style>