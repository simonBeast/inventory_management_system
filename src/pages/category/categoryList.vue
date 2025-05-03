<template>
  <span v-if="isLoading && !isError" class="block loading loading-spinner text-indigo-600 mt-8 mx-auto"></span>

  <div v-else-if="!isError && authStore.isLoggedIn && authStore.isAdmin" :class="containerClass"
    class="mx-auto mt-8 w-full max-w-6xl px-2 md:px-2">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
      <div class="flex flex-1 gap-2">
        <input v-model="searchInput" type="text" placeholder="Search categories..."
          class="w-full sm:w-64 px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm" />
        <button @click="handleSearch"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 transition">
          {{ isLanguageTigrigna ? 'ኣልሽ' : 'Search' }}
        </button>
      </div>

      <router-link to="/category"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 transition">
        + {{ isLanguageTigrigna ? 'ምድብ ፍጠር' : "Create Category" }}
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-700">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-100 dark:bg-gray-800 text-gray-600 text-sm uppercase text-left">
          <tr>
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">{{ isLanguageTigrigna ? "ስም" : "Name" }}</th>
            <th class="px-4 py-3">{{ isLanguageTigrigna ? "ተግባራት" : "Actions" }}</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 dark:text-gray-200 text-sm">
          <tr v-for="(item, index) in categories?.data || []" :key="item.id"
            class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <td class="px-4 py-3 font-medium">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ item.name }}</td>
            <td class="px-4 py-3 space-x-2 whitespace-nowrap">
              <button @click="openConfirmationModal(item.id)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                {{ isLanguageTigrigna ? "ኣጥፍእ" : "Delete" }}
              </button>
              <button @click="handleUpdate(item)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">
                <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                {{ isLanguageTigrigna ? "ኣዐርይ" : "Edit" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6" >
      <pagination :total-pages="paginationData.totalPages" :current-page="paginationData.currentPage"
        @page-changed="handlePageChange" />
    </div>

  </div>

  <p v-if="isError" :class="containerClass" class="text-center text-red-600 font-medium mt-6">
    {{ errorMessage }}
  </p>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box rounded-lg shadow-xl">
      <h3 class="font-semibold text-lg text-gray-800">{{ isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ" : "Confirm Deletion" }}</h3>
      <p class="py-4 text-gray-600">
        {{ isLanguageTigrigna ? "እቲ ምድብ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?" : "Are you sure you want to delete this item ?" }}
      </p>
      <div class="modal-action flex justify-end gap-3">
        <button @click="confirmDelete" class="btn btn-sm bg-red-600 text-white hover:bg-red-700">
          {{ isLanguageTigrigna ? "እወ" : "Yes" }}
        </button>
        <button @click="closeModal" class="btn btn-sm bg-gray-300 text-gray-800 hover:bg-gray-400">
          {{ isLanguageTigrigna ? "ኣይኮንኩን" : "No" }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import pagination from '../../components/pagination.vue';
import { useCategories, useDeleteCategory } from '../../store/useCategory';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps(['drawerOpen']);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
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

const { data: categories, isLoading, isError,error } = useCategories(params);

const deleteCategoryMutation = useDeleteCategory(authStore.token);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen,
}));

const paginationData = computed(() => categories?.value.pagination || null);

function openConfirmationModal(id) {
  categoryIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}
const queryClient = useQueryClient();

async function confirmDelete() {
      await deleteCategoryMutation.mutateAsync(categoryIdToDelete.value,{
        onSuccess:()=>{

        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['product_categories']);
        queryClient.invalidateQueries(['categories_alpha_no_limit']);
        queryClient.invalidateQueries(["products_data"]);
        },
        onError:(e)=>{
          errorMessage.value = e.message;
        },

      });
   
    categoryIdToDelete.value = null;
    closeModal();

}

function closeModal() {
  document.getElementById('deleteModal').close();
}

function handlePageChange(newPage) {
  page.value = newPage;
}

function handleSearch() {
  page.value = 1; 
  searchTerm.value = searchInput.value.trim();
  if(searchTerm.value){
    router.replace({query:{
      ...route.query,
      search: searchTerm.value
    }})
  }
  
}

function handleUpdate(item) {
  router.push(`/editCategory/${item.id}`);
}


watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

</script>

<style scoped>

</style>
