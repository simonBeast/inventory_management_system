<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ ምዕዳግ ኣቕሓ" : "Reservation Records" }}</h1>
      </div>
      <button v-if="authStore.isAdmin" @click="openCreateModal"
        class="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="bookmark" />
        {{ isLanguageTigrigna ? "ሓዱሽ ትእዛዝ መዝግብ" : "Create New Reservation" }}
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        
        <!-- Search -->
        <div class="lg:col-span-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ትእዛዛት ኣልሽ" : "Search Reservations" }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <font-awesome-icon icon="search" class="text-xs" />
              </span>
              <input v-model="searchInput" type="text" :placeholder="isLanguageTigrigna ? 'ብሽም ኣቕሓ ኣልሽ...' : 'Search by product...'"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" @keyup.enter="handleSearch" />
            </div>
            <button @click="handleSearch"
              class="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap">
              {{ isLanguageTigrigna ? "ኣልሽ" : "Search" }}
            </button>
          </div>
        </div>

        <!-- Product Filter -->
        <div class="lg:col-span-3">
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

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4 w-16">#</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዓሚል" : "Description" }}</th>
              <th class="px-6 py-4 text-center">{{ isLanguageTigrigna ? "በዝሒ" : "Qty" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ጠቕላላ" : "Total" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት" : "Date" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኩነታት" : "Status" }}</th>
              <th v-if="authStore.isAdmin" class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(res, index) in reservations?.data || []" :key="res.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {{ res.Product?.productName || res.ProductSubCategory?.name || 'Unknown' }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">{{ res.note || '-' }}</div>
              </td>
              <td class="px-6 py-4 text-center font-bold">{{ res.quantity }}</td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                {{ ((res.reservedSalePrice || res.Product?.pricePerUnit || 0) * res.quantity).toLocaleString() }}
              </td>
              <td class="px-6 py-4 text-xs text-gray-500">
                {{ new Date(res.createdAt).toLocaleString() }}
              </td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': res.status === 'pending',
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': res.status === 'fulfilled',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': res.status === 'cancelled'
                }" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ res.status }}
                </span>
              </td>
              <td v-if="authStore.isAdmin" class="px-6 py-4 space-x-2 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <!-- Sell Button -->
                <button v-if="res.status === 'pending'" @click="openSellModal(res)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-green-600 bg-green-50 hover:bg-green-600 hover:text-white dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="dollar-sign" />
                  {{ isLanguageTigrigna ? "ሸጥ" : "Sell" }}
                </button>
                <button @click="handleEdit(res)"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="text-xs" />
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



  <!-- Sell Modal (Record Sale from Reservation) -->
  <BaseModal :isOpen="isSellModalOpen" @close="closeSellModal" :title="isLanguageTigrigna ? 'መሸጣ መዝግብ' : 'Complete Sale'" class="max-w-md">
    <template #body>
      <div class="space-y-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <div class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Reservation Details</div>
          <div class="font-semibold text-gray-900 dark:text-white">{{ sellData.productName }}</div>
          <div class="text-sm text-gray-500">Note: {{ sellData.note || '-' }}</div>
        </div>

        <form @submit.prevent="submitSell" class="space-y-5">
           <div class="grid grid-cols-2 gap-4 mt-2">
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ" : "Quantity" }}</label>
               <input v-model.number="sellData.quantity" type="number" required min="1"
                 class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ዋጋ መሸጣ" : "Sale Price" }}</label>
               <input v-model.number="sellData.salePricePerUnit" type="number" step="0.01" required
                 class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
             </div>
           </div>
           
           <div class="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
             <span class="text-sm font-medium text-gray-500">{{ isLanguageTigrigna ? "ጠቕላላ ዋጋ" : "Total Amount" }}</span>
             <span class="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{{ (sellData.quantity * sellData.salePricePerUnit || 0).toLocaleString() }} Birr</span>
           </div>

           <div v-if="sellError" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
            <font-awesome-icon icon="circle-exclamation" class="mr-1" /> {{ sellError }}
          </div>

          <button type="submit" :disabled="isSelling"
            class="w-full py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-100 dark:shadow-none hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="isSelling" class="loading loading-spinner loading-sm"></span>
            {{ isLanguageTigrigna ? "መሸጣ ኣረጋግፅ" : "Confirm Sale & Update Stock" }}
          </button>
        </form>
      </div>
    </template>
  </BaseModal>

  <!-- Reservation Form Modal -->
  <BaseModal :isOpen="isFormModalOpen" @close="closeFormModal" :title="formModalTitle" class="max-w-xl">
    <template #body>
      <form @submit.prevent="submitForm" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</label>
            <select v-model="formData.productId" :disabled="isEditing"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
              <option :value="null">{{ isLanguageTigrigna ? "ምንም" : "None" }}</option>
              <option v-for="prod in productsAlphaNoLimit || []" :key="prod.id" :value="prod.id">
                {{ prod.productName }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ንኡስ ምድብ" : "Sub Category" }}</label>
            <select v-model="formData.productSubCategoryId" :disabled="isEditing || !!formData.productId"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
              <option :value="null">{{ isLanguageTigrigna ? "ምንም" : "None" }}</option>
              <option v-for="sub in productSubCategoriesAlphaNoLimit || []" :key="sub.id" :value="sub.id">
                {{ sub.name }}
              </option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "መግለፂ" : "Note / Description" }}</label>
            <textarea v-model="formData.note" rows="2"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ" : "Quantity" }}</label>
            <input v-model.number="formData.quantity" type="number" required min="1"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ዝተታሓዘ ዋጋ" : "Reserved Sale Price" }}</label>
            <input v-model.number="formData.reservedSalePrice" type="number" step="0.01"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
          <div class="md:col-span-2" v-if="isEditing">
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ኩነታት" : "Status" }}</label>
             <select v-model="formData.status" required
               class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
               <option value="pending">Pending</option>
               <option value="fulfilled">Fulfilled</option>
               <option value="cancelled">Cancelled</option>
             </select>
          </div>
        </div>
        
        <div class="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span class="text-sm font-medium text-gray-500">{{ isLanguageTigrigna ? "ጠቕላላ ዋጋ" : "Total Amount" }}</span>
          <span class="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">{{ (formData.quantity * (formData.reservedSalePrice || 0)).toLocaleString() }} Birr</span>
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
            {{ isEditing ? (isLanguageTigrigna ? 'ኣዐርይ' : 'Update') : (isLanguageTigrigna ? 'መዝግብ' : 'Reserve') }}
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
import { useReservations, useCreateReservation, useUpdateReservation } from '../../store/useReservation';
import { useCreateSale } from '../../store/useSales';
import { useProductsAlphaNoLimit } from '../../store/useProduct';
import { useProductSubCategoryAlphaNoLimit } from '../../store/useProductSubCategory';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const searchInput = ref("");
let page = ref(Number(route.query.page) || 1);
const searchTerm = ref(route.query.search || '');
const productFilter = ref(route.query.productId || '');
const fromDateFilter = ref(route.query.from || '');
const toDateFilter = ref(route.query.to || '');
const errorMessage = ref('');

const queryClient = useQueryClient();

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
  productId: productFilter.value,
  from: fromDateFilter.value,
  to: toDateFilter.value
}));

const { isLoading: loading, data: reservations, isError, error } = useReservations(params);
const { data: productsAlphaNoLimit } = useProductsAlphaNoLimit(authStore.token);
const { data: productSubCategoriesAlphaNoLimit } = useProductSubCategoryAlphaNoLimit(authStore.token);

const createMutation = useCreateReservation(authStore.token);
const updateMutation = useUpdateReservation(authStore.token);
const createSaleMutation = useCreateSale(authStore.token);

const paginationData = computed(() => reservations.value?.pagination || null);

// --- Form State ---
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  productId: null,
  productSubCategoryId: null,
  quantity: 1,
  reservedSalePrice: null,
  note: '',
  status: 'pending'
});

// --- Sell State ---
const isSellModalOpen = ref(false);
const isSelling = ref(false);
const sellError = ref('');
const sellData = reactive({
  reservationId: null,
  productId: null,
  productName: '',
  note: '',
  quantity: 0,
  salePricePerUnit: 0
});

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "ትእዛዝ ኣዐርይ" : "Edit Reservation") 
    : (isLanguageTigrigna.value ? "ሓዱሽ ትእዛዝ መዝግብ" : "Create New Reservation");
});

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});

// Auto-fill price when product selected
watch(() => formData.productId, (newId) => {
  if (!isEditing.value && newId) {
    formData.productSubCategoryId = null; // Product takes precedence
    const product = productsAlphaNoLimit.value?.find(p => p.id === newId);
    if (product) {
      formData.reservedSalePrice = product.pricePerUnit;
    }
  }
});

function handleSearch() {
  searchTerm.value = searchInput.value.trim();
  page.value = 1;
  router.replace({
    query: { ...route.query, search: searchTerm.value || undefined, page: page.value }
  });
}

watch([productFilter, fromDateFilter, toDateFilter], () => {
  page.value = 1;
  router.replace({
    query: {
      ...route.query,
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

// Form Handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formData.productId = null;
  formData.productSubCategoryId = null;
  formData.quantity = 1;
  formData.reservedSalePrice = null;
  formData.note = '';
  formData.status = 'pending';
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(res) {
  isEditing.value = true;
  editingId.value = res.id;
  formData.productId = res.productId;
  formData.productSubCategoryId = res.productSubCategoryId;
  formData.quantity = res.quantity;
  formData.reservedSalePrice = res.reservedSalePrice;
  formData.note = res.note;
  formData.status = res.status;
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
      await updateMutation.mutateAsync({ id: editingId.value, data: formData });
    } else {
      const { status, ...createData } = formData;
      await createMutation.mutateAsync(createData);
    }
    queryClient.invalidateQueries(['reservations']);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Sell Handlers
function openSellModal(res) {
  sellData.reservationId = res.id;
  sellData.productId = res.productId;
  sellData.productName = res.Product?.productName || res.ProductSubCategory?.name;
  sellData.note = res.note;
  sellData.quantity = res.quantity;
  sellData.salePricePerUnit = res.reservedSalePrice || res.Product?.pricePerUnit || 0;
  sellError.value = '';
  isSellModalOpen.value = true;
}

function closeSellModal() {
  isSellModalOpen.value = false;
}

async function submitSell() {
  isSelling.value = true;
  sellError.value = '';
  try {
    // 1. Create a sale
    await createSaleMutation.mutateAsync({
      reservationId: sellData.reservationId,
      productId: sellData.productId,
      quantity: sellData.quantity,
      salePricePerUnit: sellData.salePricePerUnit
    });
    queryClient.invalidateQueries(['reservations']);
    queryClient.invalidateQueries(['sales']);
    queryClient.invalidateQueries(['products']);
    closeSellModal();
  } catch (err) {
    sellError.value = err.message;
  } finally {
    isSelling.value = false;
  }
}

</script>

<style scoped></style>
