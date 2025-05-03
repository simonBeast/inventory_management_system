<template>

  <div v-if="loading && !errorMessage" class="flex justify-center mt-10">
    <span class="loading loading-spinner text-indigo-600"></span>
  </div>


  <transition  v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin" name="fade-slide" appear>
    <div
     
      :class="containerClass"
      class="mt-8 mx-auto px-4 py-4 bg-white rounded-xl w-full max-w-7xl"
    >

      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div class="flex flex-1 w-full md:w-auto gap-2">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search categories..."
            class="w-full md:w-64 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            @click="handleSearch"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition"
          >
          {{ isLanguageTigrigna ? 'ኣልሽ' :'Search'}}
          </button>
        </div>

        <router-link
          to="/ProductSubCategory"
          class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 rounded-md transition whitespace-nowrap"
        >
        + {{isLanguageTigrigna ? 'ንኡስ ምድብ ፍጠር':"Create Product Sub Category"}}
        </router-link>
      </div>

      <div class="overflow-x-auto rounded-md">
        <table class="min-w-full text-sm border border-gray-200">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="py-3 px-4 text-left">#</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ስም":"Name"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna? "ምድብ ኣቕሓ ":"Product Category"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "መግለፂ":"Description"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(item, index) in productSubCategories.data"
              :key="index"
              class="hover:bg-gray-50 transition"
            >
            <th>{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.ProductCategory.name }}</td>
          <td class="wrap">{{ item.description }}</td>
              <td class="px-4 py-3 space-x-2 whitespace-nowrap">
              <button @click="openConfirmationModal(item.id)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                {{isLanguageTigrigna ? "ኣጥፍእ":"Delete"}}
              </button>
              <button @click="handleUpdate(item)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">
                <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
                {{isLanguageTigrigna ? "ኣዐርይ":"Edit"}}
              </button>
            </td>
            </tr>
          </tbody>
        </table>
      </div>

      <pagination
        :total-pages="paginationData.totalPages"
        :current-page="paginationData.currentPage"
        @page-changed="handlePageChange"
        class="mt-6"
      />
    </div>
  </transition>

  <transition name="fade">
    <p
      v-if="errorMessage"
      class="text-center text-red-600 font-medium mt-8"
      :class="containerClass"
    >
      {{ errorMessage }}
    </p>
  </transition>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box rounded-lg shadow-lg">
      <h3 class="text-lg font-bold mb-2">{{isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ":"Confirm Deletion"}}</h3>
      <p class="mb-4 text-gray-700">{{isLanguageTigrigna ? "እቲ ንኡስ ምድብ ኣቕሓ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this item ?"}}</p>
      <div class="flex justify-end gap-2">
        <button @click="confirmDelete" class="btn bg-red-600 text-white hover:bg-red-700">{{isLanguageTigrigna ? "እወ" : "Yes"}}</button>
        <button @click="closeModal" class="btn bg-gray-200 hover:bg-gray-300"> {{isLanguageTigrigna ? "ኣይኮንኩን" : "No"}}</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, defineProps, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useDeleteProductSubCategory, useProductSubCategories } from '../../store/useProductSubCategory';
import { useQueryClient } from '@tanstack/vue-query';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
const route = useRoute();
const router = useRouter();
const errorMessage = ref(false);
let authStore = useAuthStore();
let searchInput = ref("");

let page = ref(Number(route.query.page) || 1);
const searchTerm = ref(route.query.search || '');

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-2/3': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen
}));

let productIdToDelete = ref(null);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const {data:productSubCategories,isLoading:loading,isError,error} = useProductSubCategories(params);

const paginationData = computed(() => productSubCategories.value?.pagination || null);

watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

const deleteProductSubCategoryMutation = useDeleteProductSubCategory(authStore.token);

function openConfirmationModal(id) {
  productIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}
const queryClient = useQueryClient();

async function confirmDelete() {
 
      await deleteProductSubCategoryMutation.mutateAsync(productIdToDelete.value,{
        onSuccess:()=>{
        queryClient.invalidateQueries(["product_sub_categories"]);
        queryClient.invalidateQueries(['products']);
        queryClient.invalidateQueries(['product_sub_categories_alpha_no_limit']);
        queryClient.invalidateQueries(["products_data"]);
        },
        onError:(e)=>{
          errorMessage.value =  e.message;
        }
      });
    productIdToDelete.value = null;
  closeModal();
}

function closeModal() {
  document.getElementById('deleteModal').close();
}

async function handleSearch() {
  if (searchInput.value.trim()) {

    page.value = 1;
    searchTerm.value = searchInput.value.trim();
    router.replace({
    query: {
      ...route.query,
      search: searchTerm.value,
      page: page.value,
    }
   });

  }
}

async function handlePageChange(page1) {
  page.value = page1;
}

async function handleUpdate(item) {
  router.push(`/editProductSubCategory/${item.id}`);
}
</script>

<style scoped></style>