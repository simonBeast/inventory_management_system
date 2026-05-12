<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="mx-auto mt-8 w-full max-w-7xl px-4 md:px-8 transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ ተመላሲ" : "Returns Records" }}</h1>
      </div>
      <button @click="openCreateModal"
        class="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="plus" />
        {{ isLanguageTigrigna ? "ተመላሲ ፍጠር" : "Log Return" }}
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div class="lg:col-span-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ብ ሽያጥ ቑፅሪ ኣልሽ" : "Search by Sale ID" }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <font-awesome-icon icon="search" class="text-xs" />
              </span>
              <input v-model="saleIdInput" type="text" :placeholder="isLanguageTigrigna ? 'ብ ሽያጥ ቑፅሪ...' : 'Search by sale id...'" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
            </div>
            <button @click="handleSearch" class="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
              {{ isLanguageTigrigna ? "ኣልሽ" : "Search" }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-3">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ኩነታት" : "Status" }}</label>
          <select v-model="returnStatusFilter" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option value="">{{ isLanguageTigrigna ? "ኩሎም ኩነታት" : "All Statuses" }}</option>
            <option value="received">{{ isLanguageTigrigna ? "ተቐቢሉ" : "Received" }}</option>
            <option value="inspected">{{ isLanguageTigrigna ? "ተመርሚሩ" : "Inspected" }}</option>
            <option value="restocked">{{ isLanguageTigrigna ? "ዳግማይ ተቐሚጡ" : "Restocked" }}</option>
            <option value="refunded">{{ isLanguageTigrigna ? "ሒሳብ ተመሊሱ" : "Refunded" }}</option>
          </select>
        </div>

        <div class="lg:col-span-3">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ምኽንያት" : "Reason" }}</label>
          <select v-model="reasonFilter" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white appearance-none">
            <option value="">{{ isLanguageTigrigna ? "ኩሎም ምኽንያታት" : "All Reasons" }}</option>
            <option value="damagedProduct">{{ isLanguageTigrigna ? "ዝተጎድአ ኣቅሓ" : "Damaged Product" }}</option>
            <option value="unwantedItem">{{ isLanguageTigrigna ? "ዘይተደለየ ኣቕሓ" : "Unwanted Item" }}</option>
            <option value="wrongSize">{{ isLanguageTigrigna ? "ዝተጋገየ ዓቐን" : "Wrong Size" }}</option>
          </select>
        </div>

        <div class="lg:col-span-5 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ካብ ዕለት" : "Start Date" }}</label>
            <input v-model="fromDateFilter" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ክሳብ ዕለት" : "End Date" }}</label>
            <input v-model="toDateFilter" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white" />
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
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "መሸጣ ቑፅሪ" : "Sale ID" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "በዝሒ" : "Qty" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ምኽንያት" : "Reason" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኩነታት" : "Status" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት" : "Date" }}</th>
              <th class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(item, index) in returns?.data || []" :key="item.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4 font-mono text-xs">#{{ item.saleId.toString().slice(0,10).toUpperCase()+".." }}</td>
              <td class="px-6 py-4 font-medium">{{ item.Product?.productName || '-' }}</td>
              <td class="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                {{ item.quantityReturned }} <span class="text-[10px] font-normal text-gray-400">{{ item.Product?.measurementUnit }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                  {{ isLanguageTigrigna ? convertReturnReasonToTigrigna(item.reason, item.reason) : item.reason }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(item.returnStatus)" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ isLanguageTigrigna ? convertReturnStatusToTigrigna(item.returnStatus, item.returnStatus) : item.returnStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ new Date(item.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4 space-x-3 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <button @click="handleEdit(item)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
                </button>
                <button @click="openConfirmationModal(item.id)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣጥፍእ" : "Delete" }}
                </button>
              </td>
            </tr>
            <tr v-if="!returns?.data || returns.data.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">{{ isLanguageTigrigna ? "ምንም ተመላሲ የለን" : "No return records found." }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <pagination v-if="paginationData && paginationData.totalPages > 1"
        :total-pages="paginationData.totalPages"
        :current-page="paginationData.currentPage"
        @page-changed="handlePageChange" />
    </div>
  </div>

  <p v-if="errorMessage" class="text-center text-red-600 font-semibold mt-10" :class="containerClass">
    <font-awesome-icon icon="circle-exclamation" class="mr-2" /> {{ errorMessage }}
  </p>

  <!-- Delete Modal -->
  <dialog id="deleteModal" class="modal">
    <div class="modal-box rounded-2xl shadow-2xl dark:bg-gray-800">
      <h3 class="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
        <font-awesome-icon icon="triangle-exclamation" class="text-red-500" />
        {{ isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ" : "Confirm Deletion" }}
      </h3>
      <p class="py-4 text-gray-600 dark:text-gray-300">
        {{ isLanguageTigrigna ? "እቲ ተመላሲ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this return record? This cannot be undone." }}
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

  <!-- Form Modal -->
  <BaseModal :isOpen="isFormModalOpen" @close="closeFormModal" :title="formModalTitle" class="max-w-md">
    <template #body>
      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label for="saleId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ሽያጥ ቑፅሪ" : "Sale ID" }}</label>
          <input id="saleId" type="text" v-model="formData.saleId" required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>

        <div>
          <label for="quantityReturned" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "በዝሒ ልተመለሰ" : "Quantity Returned" }}</label>
          <input id="quantityReturned" type="number" min="1" v-model="formData.quantityReturned" required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
        </div>

        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ምኽንያት" : "Reason" }}</label>
          <select id="reason" v-model="formData.reason" required 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
            <option disabled value="">Select reason</option>
            <option value="damagedProduct">{{ isLanguageTigrigna ? "ዝተጎድአ ኣቅሓ" : "Damaged Product" }}</option>
            <option value="unwantedItem">{{ isLanguageTigrigna ? "ዘይተደለየ ኣቕሓ" : "Unwanted Item" }}</option>
            <option value="wrongSize">{{ isLanguageTigrigna ? "ዝተጋገየ ዓቐን" : "Wrong Size" }}</option>
          </select>
        </div>

        <div>
          <label for="returnStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ናይ ምምላስ ኩነታት" : "Return Status" }}</label>
          <select id="returnStatus" v-model="formData.returnStatus" required
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
            <option disabled value="">Select status</option>
            <option value="received">{{ isLanguageTigrigna ? "ተቐቢሉ" : "Received" }}</option>
            <option value="inspected">{{ isLanguageTigrigna ? "ተመርሚሩ" : "Inspected" }}</option>
            <option value="restocked">{{ isLanguageTigrigna ? "ዳግማይ ተቐሚጡ" : "Restocked" }}</option>
            <option value="refunded">{{ isLanguageTigrigna ? "ሒሳብ ተመሊሱ" : "Refunded" }}</option>
          </select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "መግለፂ" : "Description" }}</label>
          <textarea id="description" rows="3" v-model="formData.description"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"></textarea>
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
            {{ isSubmitting ? (isLanguageTigrigna ? 'ይካየድ ኣሎ...' : 'Saving...') : (isEditing ? (isLanguageTigrigna ? 'ኣዐርይ' : 'Update Return') : (isLanguageTigrigna ? 'ተመላሲ ፍጠር' : 'Log Return')) }}
          </button>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, defineProps, computed, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import BaseModal from '../../components/BaseModal.vue';
import { useLanguageStore } from '../../store/languageStore';
import { convertReturnReasonToTigrigna, convertReturnStatusToTigrigna } from '../../util/utilFunctions';
import { useReturns, useDeleteReturn, useCreateReturn, useUpdateReturn } from '../../store/useReturn';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps(['drawerOpen']);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const queryClient = useQueryClient();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

// const containerClass = computed(() => ({
//   'ml-56 md:ml-60 lg:ml-72 w-[calc(100%-14rem)] lg:w-[calc(100%-18rem)]': props.drawerOpen,
//   'ml-0 w-full': !props.drawerOpen
// }));

// State
const page = ref(Number(route.query.page) || 1);
const saleIdInput = ref(route.query.saleIdSearch || '');
const saleIdSearch = ref(route.query.saleIdSearch || '');
const returnStatusFilter = ref(route.query.returnStatus || '');
const reasonFilter = ref(route.query.reason || '');
const fromDateFilter = ref(route.query.from || '');
const toDateFilter = ref(route.query.to || '');
const errorMessage = ref('');
const returnIdToDelete = ref(null);

// Form Modal State
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  saleId: null,
  quantityReturned: 0,
  reason: '',
  returnStatus: '',
  description: ''
});

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  saleIdSearch: saleIdSearch.value,
  returnStatus: returnStatusFilter.value,
  reason: reasonFilter.value,
  startDate: fromDateFilter.value,
  endDate: toDateFilter.value,
}));

const { isLoading: loading, data: returns, isError, error } = useReturns(params);
const deleteReturnMutation = useDeleteReturn(authStore.token);
const createMutation = useCreateReturn(authStore.token);
const updateMutation = useUpdateReturn(authStore.token);

const paginationData = computed(() => returns.value?.pagination || null);

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "ተመላሲ ኣዐርይ" : "Edit Return") 
    : (isLanguageTigrigna.value ? "ሓዱሽ ተመላሲ ፍጠር" : "Log New Return");
});

function getStatusClass(status) {
  switch(status) {
    case 'received': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'inspected': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'restocked': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'refunded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}

// Form Handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formData.saleId = null;
  formData.quantityReturned = 1;
  formData.reason = '';
  formData.returnStatus = '';
  formData.description = '';
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(item) {
  isEditing.value = true;
  editingId.value = item.id;
  formData.saleId = item.saleId;
  formData.quantityReturned = item.quantityReturned;
  formData.reason = item.reason;
  formData.returnStatus = item.returnStatus;
  formData.description = item.description;
  formError.value = '';
  isFormModalOpen.value = true;
}

function closeFormModal() {
  isFormModalOpen.value = false;
}

function syncQuery() {
  router.replace({
    query: {
      ...route.query,
      page: page.value,
      saleIdSearch: saleIdSearch.value || undefined,
      returnStatus: returnStatusFilter.value || undefined,
      reason: reasonFilter.value || undefined,
      from: fromDateFilter.value || undefined,
      to: toDateFilter.value || undefined,
    }
  });
}

function handleSearch() {
  saleIdSearch.value = saleIdInput.value.trim();
  page.value = 1;
  syncQuery();
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
    queryClient.invalidateQueries(['returns']);
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(["products_data"]);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Delete Handlers
function openConfirmationModal(id) {
  returnIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  try {
    await deleteReturnMutation.mutateAsync(returnIdToDelete.value);
    queryClient.invalidateQueries(['returns']);
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(["products_data"]);
    closeModal();
  } catch (e) {
    errorMessage.value = e.message;
  }
}

function closeModal() {
  document.getElementById('deleteModal').close();
}

function handlePageChange(newPage) {
  page.value = newPage;
  syncQuery();
}

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});

watch([returnStatusFilter, reasonFilter, fromDateFilter, toDateFilter], () => {
  page.value = 1;
  syncQuery();
});
</script>

<style scoped></style>