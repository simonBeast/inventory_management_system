<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-primary mt-10 mx-auto"></span>


  <div
    v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="['transition-all duration-300 ease-in-out mt-10', containerClass, 'overflow-x-auto mx-auto w-full px-4 sm:px-6 lg:px-8']"
  >
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex flex-1 gap-2 w-full sm:w-auto">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search products..."
          class="w-full sm:w-64 px-3 py-2 rounded-md border border-gray-300 outline-none"
        />
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          {{ isLanguageTigrigna ? 'ኣልሽ' :'Search'}}
        </button>
      </div>
      <router-link
        to="/product"
        class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-600 transition duration-200 shadow-sm"
      >
         + {{isLanguageTigrigna ? ' ምድብ ኣቕሓ ፍጠር':" Create Product"}}
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-md">
      <table class="min-w-full divide-gray-200 table-auto">
        <thead class="bg-gray-100 h-auto">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "ስም ኣቕሓ":"Product Name"}}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "ቑፅሪ":"Code"}}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "ንኡስ ምድብ ኣቕሓ":"Sub Category"}}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "መዐቀኒ": "Unit"}}Unit</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "ተወሳኺ":"More"}}</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in products?.data" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ item.productName }}</td>
            <td class="px-4 py-2">{{ item.productCode }}</td>
            <td class="px-4 py-2">{{ item.ProductSubCategory.name }}</td>
            <td class="px-4 py-2">{{ item.measurementUnit }}</td>
            <td class="px-4 py-2">
              <span @click="displayProduct(item.id)" class="text-indigo-600 hover:underline cursor-pointer font-medium">
                {{isLanguageTigrigna ? "ኣርእይ...":"More..."}}
              </span>
            </td>
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

    <div class="mt-6">
      <pagination :total-pages="paginationData.totalPages" :current-page="paginationData.currentPage" @page-changed="handlePageChange" />
    </div>
  </div>

  <p v-if="errorMessage" :class="containerClass" class="text-center text-red-600 font-semibold mt-6">
    {{ errorMessage }}
  </p>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-red-600">{{isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ":"Confirm Deletion"}}</h3>
      <p class="py-4">{{isLanguageTigrigna ? "እቲ ኣቕሓ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this item ?"}}</p>
      <div class="modal-action">
        <button @click="confirmDelete" class="btn btn-sm bg-red-600 text-white hover:bg-red-700">
          {{isLanguageTigrigna ? "እወ" : "Yes"}}
        </button>
        <button @click="closeModal" class="btn btn-sm bg-gray-300 text-gray-800 hover:bg-gray-400">
          {{isLanguageTigrigna ? "ኣይኮንኩን" : "No"}}
        </button>
      </div>
    </div>
  </dialog>
</template>


<script setup>

import { ref, defineProps, computed, watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useQueryClient } from '@tanstack/vue-query';
import { useDeleteProduct, useProducts } from '../../store/useProduct';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const route = useRoute();
const router = useRouter();
let authStore = useAuthStore();
let searchInput = ref("");
let errorMessage = ref("");

let page = ref(Number(route.query.page) || 1);

const searchTerm = ref(route.query.search || '');

let props = defineProps(['drawerOpen']);


const queryClient = useQueryClient();

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
  'ml-8': !props.drawerOpen
}));

let productIdToDelete = ref(null);

const {isLoading:loading, data:products ,isError,error} = useProducts(params);

const paginationData = computed(() => products.value?.pagination || null);

watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

const deleteProductMutation = useDeleteProduct(authStore.token);
function openConfirmationModal(id) {
  productIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  
    await deleteProductMutation.mutateAsync(productIdToDelete.value,{
      onSuccess:()=>{
        queryClient.invalidateQueries(['products']);
        queryClient.invalidateQueries(['returns']);
        queryClient.invalidateQueries(['top_products_month']);
        queryClient.invalidateQueries(['top_products_quarter']);
        queryClient.invalidateQueries(['top_products_year']);
        queryClient.invalidateQueries(["products_alpha_no_limit"]);
        queryClient.invalidateQueries(["products_data"]);
        queryClient.invalidateQueries(["transaction_history"]);
        queryClient.invalidateQueries(['products', productIdToDelete.value]);
      },
      onError:(e)=>{
        errorMessage.value = e.message;
      }
    })
    productIdToDelete.value = null;
    closeModal();
  
}

function closeModal() {
  document.getElementById('deleteModal').close();
}

async function handlePageChange(page1) {
 page.value = page1;
}

async function handleSearch() {
  if (searchInput.value.trim()) {
   searchTerm.value = searchInput.value.trim();
   page.value = 1; 
   router.replace({
    query: {
      ...route.query,
      search: searchTerm.value,
      page: page.value,
    }
  })
  }

}

async function handleUpdate(item) {
  //?page=${route.query?.page
  router.push(`/editProduct/${item.id}`);
}

async function displayProduct(id) {
  router.push(`/productList/${id}`);
}
</script>

<style scoped></style>