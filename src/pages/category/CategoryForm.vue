<template>
  <div v-if="authStore.isLoggedIn && authStore.isAdmin" :class="containerClass"
    class="mt-12 px-4 sm:px-6 lg:px-8 w-full max-w-2xl mx-auto">
    <span v-if="loading0 && !errorMessage"
      class="block loading loading-spinner text-primary mt-6 mx-auto transition"></span>

    <div
      class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div class="relative mb-8">
        <h2 class="text-center text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white tracking-wide">
          {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ምድብ ፍጠር" : "Create New" }}
          {{ isLanguageTigrigna ? '' : 'Category' }}
        </h2>
        <button @click="closeModal"
          class="absolute top-0 right-0 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Close">
          <font-awesome-icon icon="x" size="sm" />
        </button>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ isLanguageTigrigna ? 'ስም ምድብ' : 'Category' }}
          </label>
          <input id="name" name="name" type="text" v-model="name" required
            :placeholder="isLanguageTigrigna ? 'ስም ምድብ' : 'Enter category name...'" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white 
                dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 
                focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
        </div>

        <button type="submit" :disabled="loading1"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
          {{
            loading1
              ? props.isEditing
                ? isLanguageTigrigna
                  ? 'ኣብ ምዕራይ ...'
                  : 'Updating...'
                : isLanguageTigrigna
                  ? 'ይፈጥር ኣሎ..'
                  : 'Creating...'
              : props.isEditing
                ? isLanguageTigrigna
                  ? 'ምድብ ኣዐርይ'
                  : 'Update Category'
                : isLanguageTigrigna
                  ? 'ምድብ ፍጠር'
                  : 'Create Category'
          }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p v-if="errorMessage" class="text-sm text-red-600 font-medium">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="text-sm text-green-600 font-medium">
          {{ isLanguageTigrigna ? 'ምድብ' : 'Category' }}
          {{ props.isEditing ? (isLanguageTigrigna ? 'ተዓርዩ' : 'updated') : (isLanguageTigrigna ? 'ተፈጢሩ' : 'created') }}
          {{ isLanguageTigrigna ? 'ኣሎ' : 'successfully!' }}
        </p>
        <span v-if="loading1 && !errorMessage && !successMessage"
          class="block loading loading-spinner text-indigo-600 mx-auto mt-4"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {useQueryClient } from '@tanstack/vue-query';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useCategory, useCreateCategory, useUpdateCategory } from '../../store/useCategory';

const props = defineProps(['drawerOpen', 'isEditing']);
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const name = ref('');
const response = ref(null);
const errorMessage = ref(null);
const successMessage = ref(null);
const queryClient = useQueryClient();
const authStore = useAuthStore();
const languageStore = useLanguageStore();
const loading1 = ref(false);

const isLanguageTigrigna = computed(() => languageStore.languagePreference === 'ti');

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen,
}));

const { data: category, isLoading: loading0 } = useCategory(id, authStore.token);

watch(category, (value) => {
  if (value && props.isEditing) name.value = value.name;
}, { immediate: true });


const createMutation = useCreateCategory(authStore.token);

const updateMutation = useUpdateCategory(authStore.token);

const handleSubmit = async () => {

  if (!name.value) return;

  if (props.isEditing) {
    loading1.value = true;
    response.value = await updateMutation.mutateAsync({id: id,data: {name:name.value}},{
      onSuccess:()=>{
        queryClient.invalidateQueries(['categories',id]);
        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['product_categories']);
        queryClient.invalidateQueries(['categories_alpha_no_limit']);
        successMessage.value = "Category Created Successfully";
        loading1.value = false;
        router.push('/categoryList');
    },
    onError:(e)=>{
      errorMessage.value =  e.message;
      loading1.value = false;
    }
  });
  } else {
    response.value = await createMutation.mutateAsync(name.value,{
      onSuccess:()=>{
        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['product_categories']);
        queryClient.invalidateQueries(['categories_alpha_no_limit']);
        queryClient.invalidateQueries(["products_data"]);
        successMessage.value = "Category Updated Successfully";
        loading1.value = false;
        router.push('/categoryList');
    },
    onError:(e)=>{
      errorMessage.value =  e.message;
      loading1.value = false;
    }
  });
  }
};


function closeModal() {
  router.push('/categoryList');
}
</script>

<style scoped></style>
