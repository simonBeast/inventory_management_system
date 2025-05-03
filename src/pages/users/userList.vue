<template>

  <span v-if="loading && !errorMessage" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

  <div
    v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="mx-auto ml-56 md:ml-60 lg:ml-72 w-4/5 mr-2 overflow-x-auto mt-10"
  >
    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
   
      <div class="flex w-full md:w-2/3 mb-2 md:mb-0">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search users..."
          class="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none "
        />
        <button
          @click="handleSearch"
          class="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
        >
          {{isLanguageTigrigna ? "ኣልሽ" : "Search"}}
        </button>
      </div>

    
      <router-link
        to="/register"
        class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
      >
        + {{isLanguageTigrigna ? "ሸያጢ መዝግብ":"Register Seller"}}
      </router-link>
    </div>


    <div class="bg-white shadow-md rounded-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100 text-gray-800 uppercase text-left text-xs">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ምሉእ ስም":"Full Name"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ኢመይል":"Email"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ግደ":"Role"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ተግባራት":"Actions"}}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-gray-700">
          <tr
            v-for="(user, index) in users?.data"
            :key="index"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 font-medium">{{ index + 1 }}</td>
            <td class="px-6 py-3">{{ user.fullName }}</td>
            <td class="px-6 py-3">{{ user.email }}</td>
            <td class="px-6 py-3 capitalize">{{ user.role }}</td>
            <td class="px-4 py-3 space-x-2 whitespace-nowrap">
              <button @click="openConfirmationModal(user.id)"
                class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                {{isLanguageTigrigna ? "ኣጥፍእ":"Delete"}}
              </button>
              <button @click="handleUpdate(user)"
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
      class="mt-4"
    />
  </div>

  <p
    v-if="errorMessage"
    :class="containerClass"
    class="ml-56 md:ml-60 lg:ml-72 text-center text-red-600 font-semibold mt-4"
  >
    {{ errorMessage }}
  </p>

  <dialog id="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ isLanguageTigrigna ? "ምጥፋእ ኣረጋግፅ":"Confirm Deletion" }}</h3>
      <p class="py-4">{{isLanguageTigrigna ? "እቲ ተጠቃሚ ክተጥፈኦ ምድላይካ እርግጠኛ ዲኻ ?":"Are you sure you want to delete this return ?"}}</p>
      <div class="modal-action">
        <button @click="confirmDelete" class="btn bg-red-600 text-white hover:bg-red-500">{{isLanguageTigrigna ? "እወ" : "Yes"}}</button>
        <button @click="closeModal" class="btn">{{ isLanguageTigrigna ? "ኣይኮንኩን" : "No" }}</button>
      </div>
    </div>
  </dialog>
</template>
<script setup>

import { ref,defineProps, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import pagination from '../../components/pagination.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useDeleteUser,useUsers } from '../../store/useUser';
import { useQueryClient } from '@tanstack/vue-query';

const languageStore = useLanguageStore();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const router = useRouter();
const route = useRoute();
let authStore = useAuthStore();
const errorMessage = ref(false);
let searchInput = ref("");

let page = ref(Number(route.query.page) || 1);

const searchTerm = ref(route.query.search || '');

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen
}));

let userIdToDelete = ref(null);

const params = computed(() => ({
  page: page.value,
  limit: 10,
  token: authStore.token,
  searchTerm: searchTerm.value,
}));

const { isLoading:loading , data:users , isError, error} = useUsers(params);

const paginationData = computed(() => users.value?.pagination || null);

watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

function openConfirmationModal(id) {
  userIdToDelete.value = id;
  document.getElementById('deleteModal').showModal();
}

const deleteUserMutation = useDeleteUser(authStore.token);

const queryClient = useQueryClient();

async function confirmDelete() {
 
   await deleteUserMutation.mutateAsync(userIdToDelete.value,{
    onSuccess:()=>{
      queryClient.invalidateQueries(['users']);
    },
    onError:(e)=>{
      errorMessage.value = e.message;
    },
   })
    userIdToDelete.value = null;

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

async function handleUpdate(user) {
  console.log(user);
  router.push(`/editUser/${user.id}`);
}
</script>

<style scoped></style>