<template>
  <span v-if="isLoading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ ጉጅለታት" : "Category Records" }}</h1>
      </div>
      <button @click="openCreateModal"
        class="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="plus" />
        {{ isLanguageTigrigna ? "ጉጅለ ፍጠር" : "Create Category" }}
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ጉጅለታት ኣልሽ" : "Search Categories" }}</label>
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
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ሽም ጉጅለ" : "Category Name" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ዕለት" : "Date Created" }}</th>
              <th class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(category, index) in categories?.data || []" :key="category.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ category.name }}</td>
              <td class="px-6 py-4 text-gray-500">{{ new Date(category.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4 space-x-3 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <button @click="handleEdit(category)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
                </button>
                <button @click="openConfirmationModal(category.id)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣጥፍእ" : "Delete" }}
                </button>
              </td>
            </tr>
            <tr v-if="categories?.data?.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                {{ isLanguageTigrigna ? "ምንም ዝተመዝገበ ጉጅለ የለን" : "No categories found." }}
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
        {{ isLanguageTigrigna ? "እቲ ጉጅለ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this category? This action cannot be undone." }}
      </p>
      <div class="modal-action flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
          {{ isLanguageTigrigna ? "ኣይኮንኩን" : "Cancel" }}
        </button>
        <button @click="confirmDelete" class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-sm transition-colors">
          {{ isLanguageTigrigna ? "እወ" : "Delete Category" }}
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ሽም ጉጅለ" : "Category Name" }}</label>
          <input v-model="formData.name" type="text" required
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
            {{ isEditing ? (isLanguageTigrigna ? 'ኣዐርይ' : 'Update Category') : (isLanguageTigrigna ? 'ፈጠር' : 'Create Category') }}
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
import { useCategories, useDeleteCategory, useCreateCategory, useUpdateCategory } from '../../store/useCategory';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const searchInput = ref('');
let page = ref(Number(route.query.page) || 1);
const searchTerm = ref(route.query.search || '');
const categoryIdToDelete = ref(null);
const errorMessage = ref(false);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const { data: categories, isLoading, isError, error } = useCategories(params);
const deleteCategoryMutation = useDeleteCategory(authStore.token);
const createMutation = useCreateCategory(authStore.token);
const updateMutation = useUpdateCategory(authStore.token);

const queryClient = useQueryClient();

const paginationData = computed(() => categories?.value?.pagination || null);

// --- Form Modal State & Logic ---
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  name: '',
});

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "ጉጅለ ኣዐርይ" : "Edit Category") 
    : (isLanguageTigrigna.value ? "ሓዱሽ ጉጅለ ፍጠር" : "Create New Category");
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

// Form Handlers
function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  formData.name = '';
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(category) {
  isEditing.value = true;
  editingId.value = category.id;
  formData.name = category.name;
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
    queryClient.invalidateQueries(['categories']);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

// Delete Handlers
function openConfirmationModal(id) {
  categoryIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  try {
    await deleteCategoryMutation.mutateAsync(categoryIdToDelete.value);
    queryClient.invalidateQueries(['categories']);
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
