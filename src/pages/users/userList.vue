<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-blue-600 mt-8 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    class="p-4 md:p-8 w-full max-w-7xl mx-auto transition-all duration-300">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isLanguageTigrigna ? "መዝገብ ተጠቀምቲ" : "User Management" }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ isLanguageTigrigna ? "ዝተመዝገቡ ተጠቀምቲ ኣብዚ ይርከቡ" : "View and manage all system users" }}</p>
      </div>
      <button @click="openCreateModal"
        class="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto">
        <font-awesome-icon icon="user-plus" />
        {{ isLanguageTigrigna ? "ተጠቃሚ መዝግብ" : "Register User" }}
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{ isLanguageTigrigna ? "ተጠቀምቲ ኣልሽ" : "Search Users" }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <font-awesome-icon icon="search" class="text-xs" />
              </span>
              <input v-model="searchInput" type="text" :placeholder="isLanguageTigrigna ? 'ብሽም ወይ ኢመይል ኣልሽ...' : 'Search by name or email...'"
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
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ምሉእ ስም" : "Full Name" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ኢመይል" : "Email Address" }}</th>
              <th class="px-6 py-4">{{ isLanguageTigrigna ? "ግደ" : "Role" }}</th>
              <th class="px-6 py-4 text-right">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(user, index) in users?.data || []" :key="user.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group">
              <td class="px-6 py-4 font-medium text-gray-500">{{ (page - 1) * 10 + index + 1 }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {{ user.fullName?.charAt(0) || 'U' }}
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ user.fullName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span :class="user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 space-x-3 whitespace-nowrap text-right opacity-80 group-hover:opacity-100 transition-opacity">
                <button @click="handleEdit(user)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                  <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                  {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
                </button>
                <button @click="openConfirmationModal(user.id)"
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
        {{ isLanguageTigrigna ? "እቲ ተጠቃሚ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this user? This action cannot be undone." }}
      </p>
      <div class="modal-action flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors">
          {{ isLanguageTigrigna ? "ኣይኮንኩን" : "Cancel" }}
        </button>
        <button @click="confirmDelete" class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-sm transition-colors">
          {{ isLanguageTigrigna ? "እወ" : "Delete User" }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <!-- User Form Modal -->
  <BaseModal :isOpen="isFormModalOpen" @close="closeFormModal" :title="formModalTitle" class="max-w-md">
    <template #body>
      <div class="space-y-6">
        <form @submit.prevent="submitMainForm" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ምሉእ ስም" : "Full Name" }}</label>
            <input v-model="formData.fullName" type="text" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "ኢመይል" : "Email Address" }}</label>
            <input v-model="formData.email" type="email" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>

          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ isLanguageTigrigna ? "መሕለፊ ቃል" : "Password" }}</label>
            <input v-model="formData.password" type="password" required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
          </div>

          <div v-if="formError" class="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
            <font-awesome-icon icon="circle-exclamation" class="mr-1" /> {{ formError }}
          </div>

          <button type="submit" :disabled="isSubmitting"
            class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            {{ isEditing ? (isLanguageTigrigna ? 'መረዳእታ ተጠቃሚ ኣዐርይ' : 'Update User Info') : (isLanguageTigrigna ? 'መዝግብ' : 'Register User') }}
          </button>
        </form>

        <!-- Password Reset Section (Only when editing) -->
        <div v-if="isEditing" class="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ isLanguageTigrigna ? "መሕለፊ ቃል ዳግማይ ስራዕ" : "Reset Password" }}</h3>
          <form @submit.prevent="submitPasswordReset" class="space-y-4">
            <div class="relative">
              <input v-model="passwordData.newPassword" :type="passwordVisible ? 'text' : 'password'" required :placeholder="isLanguageTigrigna ? 'ሓዱሽ መሕለፊ ቃል' : 'New Password'"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
              <button type="button" @click="passwordVisible = !passwordVisible" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                <font-awesome-icon :icon="passwordVisible ? 'eye-slash' : 'eye'" />
              </button>
            </div>
            <div class="relative">
              <input v-model="passwordData.confirmPassword" :type="passwordVisible ? 'text' : 'password'" required :placeholder="isLanguageTigrigna ? 'መሕለፊ ቃል ኣረጋግፅ' : 'Confirm Password'"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            </div>
            
            <div v-if="passwordError" class="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
               {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
               {{ isLanguageTigrigna ? 'መሕለፊ ቃል ብትኽክል ተቐይሩ' : 'Password reset successfully!' }}
            </div>

            <button type="submit" :disabled="isPasswordSubmitting"
              class="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <span v-if="isPasswordSubmitting" class="loading loading-spinner loading-sm"></span>
              {{ isLanguageTigrigna ? 'መሕለፊ ቃል ቀይር' : 'Change Password' }}
            </button>
          </form>
        </div>
      </div>
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
import { useUsers, useDeleteUser, useCreateUser, useUpdateUser, useChangeUserPassword } from '../../store/useUser';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const queryClient = useQueryClient();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

// State
const page = ref(Number(route.query.page) || 1);
const searchInput = ref('');
const searchTerm = ref(route.query.search || '');
const errorMessage = ref('');
const userIdToDelete = ref(null);

// Form State
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const formError = ref('');
const formData = reactive({
  fullName: '',
  email: '',
  password: ''
});

// Password Reset State
const passwordData = reactive({
  newPassword: '',
  confirmPassword: ''
});
const passwordVisible = ref(false);
const isPasswordSubmitting = ref(false);
const passwordError = ref('');
const passwordSuccess = ref(false);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const { isLoading: loading, data: users, isError, error } = useUsers(params);
const deleteMutation = useDeleteUser(authStore.token);
const createMutation = useCreateUser(authStore.token);
const updateMutation = useUpdateUser(authStore.token);
const changePasswordMutation = useChangeUserPassword(authStore.token);

const paginationData = computed(() => users.value?.pagination || null);

const formModalTitle = computed(() => {
  return isEditing.value 
    ? (isLanguageTigrigna.value ? "መረዳእታ ተጠቃማይ ኣዐርይ" : "Edit User Profile") 
    : (isLanguageTigrigna.value ? "ሓዱሽ ተጠቃሚ መዝግብ" : "Register New User");
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
  formData.fullName = '';
  formData.email = '';
  formData.password = '';
  formError.value = '';
  isFormModalOpen.value = true;
}

function handleEdit(user) {
  isEditing.value = true;
  editingId.value = user.id;
  formData.fullName = user.fullName;
  formData.email = user.email;
  formData.password = '';
  formError.value = '';
  // Reset password form
  passwordData.newPassword = '';
  passwordData.confirmPassword = '';
  passwordError.value = '';
  passwordSuccess.value = false;
  isFormModalOpen.value = true;
}

function closeFormModal() {
  isFormModalOpen.value = false;
}

async function submitMainForm() {
  isSubmitting.value = true;
  formError.value = '';
  try {
    if (isEditing.value) {
      await updateMutation.mutateAsync({ id: editingId.value, data: { fullName: formData.fullName, email: formData.email } });
    } else {
      await createMutation.mutateAsync(formData);
    }
    queryClient.invalidateQueries(['users']);
    closeFormModal();
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}

async function submitPasswordReset() {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    passwordError.value = isLanguageTigrigna.value ? 'መሕለፊ ቃል ኣይተመሳሰለን' : 'Passwords do not match.';
    return;
  }
  isPasswordSubmitting.value = true;
  passwordError.value = '';
  passwordSuccess.value = false;
  try {
    await changePasswordMutation.mutateAsync({ userId: editingId.value, data: passwordData });
    passwordSuccess.value = true;
    passwordData.newPassword = '';
    passwordData.confirmPassword = '';
  } catch (err) {
    passwordError.value = err.message;
  } finally {
    isPasswordSubmitting.value = false;
  }
}

// Delete Handlers
function openConfirmationModal(id) {
  userIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  try {
    await deleteMutation.mutateAsync(userIdToDelete.value);
    queryClient.invalidateQueries(['users']);
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