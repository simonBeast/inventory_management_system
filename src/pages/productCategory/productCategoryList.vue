<template>

<span v-if="loading && !isError" class="block loading loading-spinner text-indigo-600 mt-8 mx-auto"></span>
  <transition  v-else-if="!loading && !errorMessage && authStore.isLoggedIn && authStore.isAdmin" name="fade-slide" appear>
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
          to="/ProductCategory"
          class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 rounded-md transition whitespace-nowrap"
        >
        + {{isLanguageTigrigna ? 'ምድብ ኣቕሓ ፍጠር':"Create Product Category"}}
        </router-link>
      </div>

      <div class="overflow-x-auto rounded-md">
        <table class="min-w-full text-sm border border-gray-200">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="py-3 px-4 text-left">#</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ስም":"Name"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ምድብ":"Category"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ሕብሪ":"Color"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ቑፅሪ ምድብ ኣቕሓ":"Code"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "መግለፂ":"Description"}}</th>
              <th class="py-3 px-4 text-left">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(item, index) in productCategories?.data"
              :key="index"
              class="hover:bg-gray-50 transition"
            >
              <td class="py-2 px-4">{{ index + 1 }}</td>
              <td class="py-2 px-4">{{ item.name }}</td>
              <td class="py-2 px-4">{{ item.Category.name }}</td>
              <td class="py-2 px-4">{{ item.color }}</td>
              <td class="py-2 px-4">{{ item.code }}</td>
              <td class="py-2 px-4">{{ item.description }}</td>
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
      <p class="mb-4 text-gray-700">{{isLanguageTigrigna ? "እቲ ምድብ ኣቕሓ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this item ?"}}</p>
      <div class="flex justify-end gap-2">
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
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import  pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useDeleteProductCategory, useProductCategories } from '../../store/useProductCategory';
import { useQueryClient } from '@tanstack/vue-query';

const languageStore = useLanguageStore();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const route = useRoute();

const router = useRouter();

let authStore = useAuthStore();

let searchInput = ref("");

const errorMessage = ref(false);

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

const deleteProductCategoryMutation = useDeleteProductCategory(authStore.token);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen
}));

let productIdToDelete = ref(null);

const {data:productCategories,isLoading:loading,isError,error} = useProductCategories(params);

const paginationData = computed(() => productCategories.value?.pagination || null);


watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});


function openConfirmationModal(id) {
  productIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

async function confirmDelete() {
    await deleteProductCategoryMutation.mutateAsync(productIdToDelete.value,{
      onError:(e)=>{
        errorMessage.value = e.message;
        closeModal();
      },
      onSuccess:()=>{
        queryClient.invalidateQueries(['product_categories']);
        queryClient.invalidateQueries(['product_sub_categories']);
        queryClient.invalidateQueries(['product_categories_alpha_no_limit']);
        queryClient.invalidateQueries(["products_data"]);
        closeModal();
      }
    });
    
    productIdToDelete.value = null;
    
}

function closeModal() {
  document.getElementById('deleteModal').close();
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

async function handlePageChange(page1) {
 page.value = page1;
  
}

async function handleUpdate(item) {
  router.push(`/editProductCategory/${item.id}`);
}
</script>

<style scoped></style>