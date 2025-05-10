<template>
  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

  <div
    v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="mx-auto mt-8 w-full max-w-7xl px-4"
  >

    <div class="flex justify-end mb-4">
      <router-link
        class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        to="/return"
      >
      + {{isLanguageTigrigna ? 'ተመላሲ ፍጠር':"Create Return"}}
      </router-link>
    </div>

    <div class="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-100">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-100 text-gray-8 text-sm ">
          <th class="px-4 py-3 text-left">#</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "መሸጣ ቑፅሪ":"Sale ID"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ኣቕሓ":"Product"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ልተመለሰ በዝሒ":"Qty Returned"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ምኽንያት":"Reason"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ኩነታት":"Status"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "መግለፂ":"Description"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ዕለት":"Date"}}</th>
            <th class="px-4 py-3 text-left">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr
            v-for="(item, index) in returns?.data"
            :key="index"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ item.saleId }}</td>
            <td class="px-4 py-2">{{ item.Product.productName }}</td>
            <td class="px-4 py-2">{{ item.quantityReturned }} {{ item.Product.measurementUnit }}</td>
            <td class="px-4 py-2 capitalize">{{ isLanguageTigrigna ?  convertReturnReasonToTigrigna(item.reason,item.reason ) : item.reason || " " }}</td>
            <td class="px-4 py-2 capitalize">{{ isLanguageTigrigna ? convertReturnStatusToTigrigna(item.returnStatus,item.returnStatus) : item.returnStatus || " "}}</td>
            <td class="px-4 py-2 truncate max-w-[200px]">{{ item.description }}</td>
            <td class="px-4 py-2">{{ item.createdAt.split('T')[0] }}</td>
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
      <pagination
        :total-pages="paginationData.totalPages"
        :current-page="paginationData.currentPage"
        @page-changed="handlePageChange"
      />
    </div>
  </div>

  <p v-if="errorMessage" class="text-center text-red-600 font-medium mt-6" :class="containerClass">
    {{ errorMessage }}
  </p>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800">{{isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ":"Confirm Deletion"}}</h3>
      <p class="mt-2 text-sm text-gray-600">{{isLanguageTigrigna ? "እቲ ተመላሲ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this return ?"}}</p>
      <div class="modal-action mt-4 flex justify-end space-x-2">
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
  import { ref, defineProps, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '../../store/authStore';
  import pagination from '../../components/pagination.vue';
  import { useReturnStore } from '../../store/returnStore';
  import { useLanguageStore } from '../../store/languageStore';
  import { convertReturnReasonToTigrigna, convertReturnStatusToTigrigna } from '../../util/utilFunctions';
  import { useDeleteReturn, useReturns } from '../../store/useReturn';
  import { useQueryClient } from '@tanstack/vue-query';
  const languageStore = useLanguageStore();
  const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

  const route = useRoute();
  const router = useRouter();
  let authStore = useAuthStore();
  let returnStore = useReturnStore();
  let page = ref(Number(route.query.page) || 1);
  let props = defineProps(['drawerOpen']);
  const errorMessage = ref(false);
  
  const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen 
  }));
  
  let returnIdToDelete = ref(null);

  const params = computed(() => ({
    page: page.value,
    limit: 10,
    token: authStore.token,
  }));

  const queryClient = useQueryClient();

  const {isLoading:loading,data: returns,isError,error} = useReturns(params);

  const paginationData = computed(() => returns.value?.pagination || null);

 
watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

  const deleteReturnMutation = useDeleteReturn(authStore.token); 
  
  function openConfirmationModal(id) {
    returnIdToDelete.value = id;
    document.getElementById('deleteModal').showModal();
  }
  
  async function confirmDelete() {
   
      await deleteReturnMutation.mutateAsync(returnIdToDelete.value,{
        onSuccess:()=>{
          queryClient.invalidateQueries(['returns']);
          queryClient.invalidateQueries(['products']);
          queryClient.invalidateQueries(["products_data"]);
        },
      }) 
    closeModal();
  }
  
  function closeModal() {
    document.getElementById('deleteModal').close();
  }
  
  async function handlePageChange(page1) {
    page.value = page1;
  }
  
  async function handleUpdate(item) {
    router.push(`/editReturn/${item.id}?page=${returnStore.pagination.currentPage}`);
  }
  </script>
  
  <style scoped></style>
  