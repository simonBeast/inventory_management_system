<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ ኣቕሑ" : "Product Records" }}</h1>
      </div>
      <button v-if="authStore.isAdmin" @click="openCreateModal"
        class="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="plus" />
        {{ isLanguageTigrigna ? "ሓዱሽ ኣቕሓ መዝግብ" : "Create Product" }}
      </button>
    </div>
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ኣልሽ" : "Search Products" }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <font-awesome-icon icon="search" class="text-xs" />
              </span>
              <input v-model="searchInput" type="text" :placeholder="isLanguageTigrigna ? 'ብሽም ኣልሽ...' : 'Search by name...'"
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
            </div>
            <button @click="handleSearch"
              class="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap">
              {{ isLanguageTigrigna ? "ኣልሽ" : "Search" }}
            </button>
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
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ሽም ኣቕሓ" : "Product Name" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ንኡስ ምድብ" : "Sub Category" }}</th>
              <th class="px-6 py-4 text-center">{{ isLanguageTigrigna ? "በዝሒ" : "Qty" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ናይ መሸጣ ዋጋ" : "Sale Price" }}</th>
              <th class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(product, index) in products?.data || []" :key="product.id"
              @click="goToProductDetail(product.id)"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group cursor-pointer">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4">
                <div class="font-semibold text-gray-900 dark:text-white">{{ product.productName }}</div>
                <div class="text-[10px] text-gray-400 font-mono">{{ product.measurementUnit }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {{ product.ProductSubCategory?.name|| '-' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center font-bold" :class="product.quantity <= 10 ? 'text-red-500' : ''">
                {{ product.ProductDetail?.availableQuantity }}
                <div v-if="product.quantity <= 10" class="text-[10px] font-normal text-red-400 uppercase tracking-tighter">Low Stock</div>
              </td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                {{ (product.pricePerUnit || 0).toLocaleString() }} <span class="text-[10px] font-normal">Birr</span>
              </td>
              <td class="px-6 py-4 space-x-3 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <!-- Add Stock (Plus Button) -->
                <button v-if="authStore.isAdmin" @click.stop="openAddStockModal(product)"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-green-600 bg-green-50 hover:bg-green-600 hover:text-white dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="plus" />
                </button>
                <button v-if="authStore.isAdmin" @click.stop="handleEdit(product)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
                </button>
                <button v-if="authStore.isAdmin" @click.stop="openConfirmationModal(product.id)"
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
        {{ isLanguageTigrigna ? "እቲ ኣቕሓ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this product? This action cannot be undone." }}
      </p>
      <div class="modal-action flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
          {{ isLanguageTigrigna ? "ኣይኮንኩን" : "Cancel" }}
        </button>
        <button @click="confirmDelete" class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-sm transition-colors">
          {{ isLanguageTigrigna ? "እወ" : "Delete" }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- Add Stock Modal -->
  <BaseModal :isOpen="isAddStockModalOpen" @close="closeAddStockModal" :title="isLanguageTigrigna ? 'ክሳን ኣእትው' : 'Add New Stock'" class="max-w-md">
    <template #body>
      <form @submit.prevent="submitAddStock" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ" : "Quantity to Add" }}</label>
          <input v-model.number="addStockData.quantity" type="number" required min="1"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "መግለፂ" : "Price Per Unit" }}</label>
           <input v-model.number="addStockData.pricePerUnit" type="number" required min="0" step="0.01"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>
        
        <div v-if="formError" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
          <font-awesome-icon icon="circle-exclamation" class="mr-1" /> {{ formError }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" @click="closeAddStockModal" class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
            {{ isLanguageTigrigna ? "ተመለስ" : "Cancel" }}
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-100 dark:shadow-none hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50">
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            {{ isLanguageTigrigna ? "ኣእትው" : "Add Stock" }}
          </button>
        </div>
      </form>
    </template>
  </BaseModal>

  <!-- Product Form Modal -->
  <BaseModal :isOpen="isFormModalOpen" @close="closeFormModal" :title="formModalTitle" class="max-w-xl">
    <template #body>
      <form @submit.prevent="submitForm" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ሽም ኣቕሓ" : "Product Name" }}</label>
            <input v-model="formData.productName" type="text" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ሽም ኣቕሓ" : "Product Code" }}</label>
            <input v-model="formData.productCode" type="text" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ንኡስ ምድብ" : "Sub Category" }}</label>
            <select v-model="formData.productSubCategoryId" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
              <option v-for="sub in productSubCategoriesAlphaNoLimit || []" :key="sub.id" :value="sub.id">{{ sub.name}}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ዓቀን" : "Measurement Unit" }}</label>
            <select v-model="formData.measurementUnit" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none">
              <option v-for="unit in ['pieces', 'kilo']" :key="unit" :value="unit">{{ unit}}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ዋጋ መግዝኢ" : "Purchase Price (Unit)" }}</label>
            <input v-model.number="formData.pricePerUnit" type="number" step="0.01" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
          
          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ" : "Available Quantity" }}</label>
            <input v-model.number="formData.availableQuantity" type="number" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ትንሸ ብዛት" : "Minimum Stock Level" }}</label>
            <input v-model.number="formData.minimumStockLevel" type="number" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>
           <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ሽም ኣቕሓ" : "Product Description" }}</label>
            <input v-model="formData.productDescription" type="text" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
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
            {{ isEditing ? (isLanguageTigrigna ? 'ኣዐርይ' : 'Update Product') : (isLanguageTigrigna ? 'ፈጠር' : 'Create Product') }}
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
import { useProducts, useDeleteProduct, useCreateProduct, useUpdateProduct, useAddNewStock } from '../../store/useProduct';
import { useProductSubCategoryAlphaNoLimit } from '../../store/useProductSubCategory';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const searchInput = ref("");
const errorMessage = ref("");
const page = ref(Number(route.query.page) || 1);
const searchTerm = ref(route.query.search || '');

const queryClient = useQueryClient();

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const { isLoading: loading, data: products, isError, error } = useProducts(params);
const deleteProductMutation = useDeleteProduct(authStore.token);
const createMutation = useCreateProduct(authStore.token);
const updateMutation = useUpdateProduct(authStore.token);
const addNewStockMutation = useAddNewStock(authStore.token);

const { data: productSubCategoriesAlphaNoLimit } = useProductSubCategoryAlphaNoLimit(authStore.token);

const paginationData = computed(() => products.value?.pagination || null);

// --- Form State ---
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  productName: '',
  productSubCategoryId: null,
  measurementUnit: '',
  pricePerUnit: null,
  availableQuantity: null,
  minimumStockLevel: 0,
  productDescription: '',
  productCode: '',
});

// --- Add Stock State ---
const isAddStockModalOpen = ref(false);
const addStockData = reactive({
  productId: null,
  quantity: null,
  pricePerUnit: null,
});

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "ኣቕሓ ኣዐርይ" : "Edit Product") 
    : (isLanguageTigrigna.value ? "ሓዱሽ ኣቕሓ ፍጠር" : "Create New Product");
});

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});

function handleSearch() {
  searchTerm.value = searchInput.value.trim();
  page.value = 1;
  router.replace({
    query: { ...route.query, search: searchTerm.value || undefined, page: page.value }
  });
}

function handlePageChange(newPage) {
  page.value = newPage;
  router.push({ query: { ...route.query, page: newPage } });
}

function goToProductDetail(id) {
  router.push(`/productList/${id}`);
}

// Form Handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formData.productName = '';
  formData.productSubCategoryId = null;
  formData.measurementUnit = '';
  formData.pricePerUnit = null;
  formData.availableQuantity = null;
  formData.minimumStockLevel = 0;
  formData.productDescription = '';
  formData.productCode = '';
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(product) {
  isEditing.value = true;
  editingId.value = product.id;
  formData.productName = product.productName;
  formData.productSubCategoryId = product.productSubCategoryId;
  formData.measurementUnit = product.measurementUnit;
  formData.pricePerUnit = product.pricePerUnit;
  formData.availableQuantity = product?.ProductDetail?.availableQuantity;
  formData.minimumStockLevel = product?.ProductDetail?.minimumStockLevel;
  formData.productDescription = product.productDescription;
  formData.productCode = product.productCode;
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
      await createMutation.mutateAsync(formData);
    }
    queryClient.invalidateQueries(['products']);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Add Stock Handlers
function openAddStockModal(product) {
  addStockData.productId = product.id;
  addStockData.quantity = null;
  addStockData.pricePerUnit = null;
  formError.value = '';
  isAddStockModalOpen.value = true;
}

function closeAddStockModal() {
  isAddStockModalOpen.value = false;
}

async function submitAddStock() {
  isSubmitting.value = true;
  formError.value = '';
  try {
    console.log("Submitting Add Stock with data:", addStockData);
        await addNewStockMutation.mutateAsync({productId: addStockData.productId, data: {
          quantity: addStockData.quantity,
          pricePerUnit: addStockData.pricePerUnit,
        }});
    queryClient.invalidateQueries(['products']);
    closeAddStockModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Delete Handlers
const productIdToDelete = ref(null);
function openConfirmationModal(id) {
  productIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  try {
    await deleteProductMutation.mutateAsync(productIdToDelete.value);
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