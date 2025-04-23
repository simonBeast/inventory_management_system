<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-primary mt-10 mx-auto"></span>


  <div
    v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="['transition-all duration-300 ease-in-out mt-10', containerClass, 'overflow-x-auto mx-auto w-full px-4 sm:px-6 lg:px-8']"
  >
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex flex-1 gap-2 w-full sm:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search products..."
          class="w-full sm:w-64 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          Search
        </button>
      </div>
      <router-link
        to="/product"
        class="inline-block px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 shadow-sm"
      >
        + Create Product
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-md">
      <table class="min-w-full divide-y divide-gray-200 table-auto">
        <thead class="bg-gray-100">
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
          <tr v-for="(item, index) in productStore.result" :key="item.id" class="hover:bg-gray-50 transition">
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
      <pagination :total-pages="pagination2.totalPages" :current-page="pagination2.currentPage" @page-changed="handlePageChange" />
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
import { ref, onMounted, defineProps, computed } from 'vue';
import { useProductStore } from '../../store/productStore';
import { useRouter,useRoute } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");


const route = useRoute();
const router = useRouter();
let authStore = useAuthStore();
let productStore = useProductStore();
let response = ref("");
let errorMessage = ref(false);
let searchTerm = ref("");
let isSearch = ref(false)
let pagination2 = ref(productStore.pagination);
let loading = ref(true);

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
  'ml-8': !props.drawerOpen
}));

let productIdToDelete = ref(null);

onMounted(async () => {
  response.value = await productStore.getProducts(authStore.token);
  console.log(productStore.pagination);
  if (response.value.flag == 1) {
    errorMessage.value = false;
    productStore.pagination.currentPage = Number(route.query.page) || 1;
    if(! productStore.pagination.currentPage !== 1){
         await productStore.changePage(authStore.token,  productStore.pagination.currentPage);
      }
  } else {
    errorMessage.value = response.value.message;
  }
  loading.value = false;
});

function openConfirmationModal(id) {
  productIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
  if (productIdToDelete.value !== null) {
    response.value = await productStore.deleteProduct(productIdToDelete.value, authStore.token);
    if (response.value.flag == 1) {
      errorMessage.value = '';
      productStore.result = productStore.result.filter(item => item.id !== productIdToDelete.value);
    } else {
      errorMessage.value = response.value.message;
    }
    productIdToDelete.value = null;
  }
  closeModal();
}

function closeModal() {
  document.getElementById('deleteModal').close();
}

async function handlePageChange(page) {
  if(!isSearch.value){
    await productStore.changePage(authStore.token, page);
  }else{
    await productStore.changePageBySearch(authStore.token, searchTerm.value, page);
  }
}

async function handleSearch() {
  if (searchTerm.value.trim()) {
    loading.value = true;
    response.value = await productStore.searchProducts(authStore.token, searchTerm.value);
    if (response.value.flag == 1) {
      errorMessage.value = false;
      isSearch.value = true;
    } else {
      errorMessage.value = response.value.message;
    }
    loading.value = false;
  } else {
    if (isSearch.value) {
      response.value = await productStore.getProducts(authStore.token);
      if (response.value.flag == 1) {
        errorMessage.value = false;
        isSearch.value = false;
      } else {
        errorMessage.value = response.value.message;
      }
      loading.value = false;
    }
  }

}

async function handleUpdate(item) {
  router.push(`/editProduct/${item.id}?page=${productStore.pagination.currentPage}`);
}

async function displayProduct(id) {
  router.push(`/productList/${id}`);
}
</script>

<style scoped></style>