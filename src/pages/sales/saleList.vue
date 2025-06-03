<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>

  <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin" 
    class="overflow-x-auto mx-auto w-4/5 mr-2 transition-all mt-10" :class="containerClass">
    <div class="flex justify-end mb-4">
      <router-link
        class="btn-submit mt-2 md:mt-0"
        to="/sale">
        + {{isLanguageTigrigna ? "መሸጣ ፍጠር":"Create Sale"}}
      </router-link>
    </div>

   
    <div class="flex flex-col lg:flex-row gap-4  items-center mb-6">
    
      <div class="flex flex-col  justify-between space-y-2 p-4 border border-gray-300 rounded-lg shadow-sm">
        <label class="block text-xs font-medium text-gray-900">{{isLanguageTigrigna ? "ብዕለት ፍለ":"Filter By Date"}}</label>
        <form class="flex flex-col md:flex-row space-x-2">
          <div class="flex items-center space-x-2 mt-2 md:mt-0">
            <label for="from" class="text-xs font-medium text-gray-900">{{isLanguageTigrigna ? "ካብ":"From"}}</label>
            <input type="date" id="from" class="input-field" v-model="from" required />
          </div>
          <div class="flex items-center space-x-2 mt-2 md:mt-0">
            <label for="to" class="text-xs font-medium text-gray-900">{{isLanguageTigrigna ? "ክሳብ" : "To"}}</label>
            <input type="date" id="to" class="input-field" v-model="to" required />
          </div>
          <input
            class="btn-submit mt-2 md:mt-0"
            type="submit" 
            :value="isLanguageTigrigna ? 'ብዕለት ፍለ':'Filter by Date'" 
            @click.prevent="filterByDate" />
        </form>
      </div>
      <div class="flex flex-col space-y-2">
        <label for="seller" class="block text-xs font-medium text-gray-900">{{isLanguageTigrigna ? "ብ ሸያጢ ፍለ":"Filter By Seller"}}</label>
        <select 
          @change="handleSeller" 
          id="seller" 
          v-model="sellerId" 
          class="input-field"
          required>
          <option disabled selected>Select Seller</option>
          <option v-for="item in sellerList" :key="item.id" :value="item.id">{{ item.fullName }}</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto shadow-lg rounded-lg bg-white w-full">
      <table class="table-auto w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">#</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "መለለዪ መሸጣ":"Sale Id"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ኣቕሓ":"Product"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ሸያጢ":"Seller"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "በዝሒ":"Quantity"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ዋጋ" : "Sale Price"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ጠቕላላ ዋጋ":"Total Price"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ዕለት":"Date"}}</th>
            <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in saleStore.result" :key="index" class="hover:bg-gray-50">
            <td class="py-3 px-4">{{ index + 1 }}</td>
            <td class="py-3 px-4">{{ sale.id }}</td>
            <td class="py-3 px-4">{{ sale.Product.productName }}</td>
            <td class="py-3 px-4">{{ sale.User.fullName }}</td>
            <td class="py-3 px-4">{{ sale.quantity }} {{ sale.Product.measurementUnit }}</td>
            <td class="py-3 px-4">{{ sale.salePricePerUnit }} Birr</td>
            <td class="py-3 px-4">{{ (sale.quantity * sale.salePricePerUnit) }} Birr</td>
            <td class="py-3 px-4">{{ sale.createdAt.substring(0, sale.createdAt.indexOf("T")) }}</td>
            <td class="px-4 py-3 space-x-2 whitespace-nowrap">
              <button @click="handleDelete(sale.id)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                {{isLanguageTigrigna ? "ኣጥፍእ":"Delete"}}
              </button>
              <button @click="handleUpdate(sale)"
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
      :total-pages="pagination2.totalPages" 
      :current-page="pagination2.currentPage" 
      @page-changed="handlePageChange" 
      class="mt-4" />

  </div>

  <p v-if="errorMessage" class="text-center text-red-600 font-semibold mt-6" :class="containerClass">
    {{ errorMessage }}
  </p>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ":"Confirm Deletion" }}</h3>
      <p class="py-4">{{isLanguageTigrigna ? "እቲ መሸጣ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this return ?"}}</p>
      <div class="modal-action">
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
        >
        {{isLanguageTigrigna ? "እወ" : "Yes"}}
        </button>
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
        >
        {{isLanguageTigrigna ? "ኣይኮንኩን" : "No"}}
        </button>
      </div>
    </div>
  </dialog>
</template>


<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import { useSaleStore } from '../../store/saleStore';
import { useProductStore } from '../../store/productStore';
import { useUserStore } from '../../store/userStore';
import { useLanguageStore } from '../../store/languageStore';
import { useQueryClient } from '@tanstack/vue-query';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const router = useRouter();
let authStore = useAuthStore();
let productStore = useProductStore();
let userStore = useUserStore();
let saleStore = useSaleStore();
let productId = ref("");
let sellerId = ref("");
let isSalesByDate = ref(false);
let sellerList = ref([]);
let response = ref("");
let errorMessage = ref(false);
let pagination2 = ref(saleStore.pagination);
let from = ref("");
let to = ref("");
let loading = ref(true);
let props = defineProps(['drawerOpen']);
let route = useRoute();
let saleIdToDelete = ref(null);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen
}));

onMounted(async () => {
  try{
    response.value = await saleStore.getSales(authStore.token);
  
      response.value = await userStore.getUsers(authStore.token);
      
        errorMessage.value = false;
        saleStore.pagination.currentPage = Number(route.query.page) || 1;
        if (!saleStore.pagination.currentPage !== 1) {
          await saleStore.changePage(authStore.token,  saleStore.pagination.currentPage);
        }
        isSalesByDate.value = false;
      
    
    sellerList.value = userStore.result;
    errorMessage.value = false;
  }catch(e){
    errorMessage.value = e.message;
  }finally{
    loading.value = false;
  }
  
 
  
});

async function handleDelete(id) {
  saleIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

const queryClient = useQueryClient();

async function confirmDelete() {
  if (saleIdToDelete.value !== null) {

    try{
      await saleStore.deleteSale(saleIdToDelete.value, authStore.token);
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(["products_data"]);
      queryClient.invalidateQueries(['top_products_month']);
      queryClient.invalidateQueries(['top_products_quarter']);
      queryClient.invalidateQueries(['top_products_year']);
      errorMessage.value = '';
      saleStore.result = saleStore.result.filter(item => item.id !== saleIdToDelete.value);
   
    saleIdToDelete.value = null;
    }catch(e){
      errorMessage.value = e.message;
    }finally{
      closeModal();
    }
  }
  
}

function closeModal() {
  document.getElementById('deleteModal').close();
}
async function handlePageChange(page) {
  if (isSalesByDate.value) {
    await saleStore.changePageByDate(authStore.token, from.value, to.value, page);
  } else {
    await saleStore.changePage(authStore.token, page);
  }
}
async function filterByDate() {
 
    loading.value = true;
    try{
      response.value = await saleStore.getSalesByDate(authStore.token, from.value == false ? "0" : from.value, to.value == false ? "0" : to.value );
      errorMessage.value = false;
      isSalesByDate.value = true;
    }catch(e){
      errorMessage = e.message;
    }finally{
      loading.value = false;
    }
}

async function handleSeller() {
  loading.value = true;
  if (sellerId.value) {
    try{
      response.value = await saleStore.getSalesBySeller(authStore.token, sellerId.value);
      errorMessage.value = false;
      isSalesByDate.value = false;
    }catch(e){
      errorMessage = e.message;
    }finally{
      loading.value = false;
    }
  }
  
}

async function handleUpdate(item) {
  router.push(`/editSale/${item.id}?page=${saleStore.pagination.currentPage}`);
}
</script>

<style scoped>
/* Custom styles for the form inputs */
.input-field {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #6366f1;
}

.btn-submit {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #4338ca;
}

.btn-action {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-align: center;
  transition: background-color 0.3s ease;
}

.btn-action:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-box {
  width: 300px;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
}

.modal-action button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>