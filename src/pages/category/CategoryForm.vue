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
          {{isLanguageTigrigna ? 'ምድብ':'Category'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
          {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
        </p>
        <span v-if="loading1 && !errorMessage && !successMessage"
          class="block loading loading-spinner text-indigo-600 mx-auto mt-4"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '../../store/categoryStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const name = ref(null);
const response = ref('');
const props = defineProps(['drawerOpen', 'isEditing']);
const errorMessage = ref(false);
const successMessage = ref(false);
const loading1 = ref(false);
const loading0 = ref(props.isEditing ? true : false);
const id = route.params.id;

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen
}));
onMounted(async () => {
  if (props.isEditing) {
    await fetchCategory();
  } else {

  }
});


async function fetchCategory() {
  response.value = await categoryStore.getCategory(id, authStore.token);
  if (response.value.flag === 1) {
    name.value = response.value.data.data.name;
    errorMessage.value = false;
  } else {
    errorMessage.value = response.value.message;
  }
  loading0.value = false;
}

async function handleUpdate() {
  loading1.value = true;
  successMessage.value = false;
  errorMessage.value = false;

  response.value = await categoryStore.updateCategory(id, { name: name.value }, authStore.token);

  if (response.value.flag === 1) {
    successMessage.value = true;
    errorMessage.value = false;
    router.push('/categoryList');
  } else {
    errorMessage.value = response.value.message;
    successMessage.value = false;
  }

  loading1.value = false;
}

async function handleSubmit() {
  if (props.isEditing) {

    await handleUpdate();

  } else {

    await handleCreate();

  }
}

async function handleCreate() {
  loading1.value = true;
  successMessage.value = false;
  errorMessage.value = false;
  response.value = await categoryStore.createCategory(name.value, authStore.token);
  if (response.value.flag == 1) {
    successMessage.value = true;
    errorMessage.value = false;
    router.push('/categoryList');
  } else {
    errorMessage.value = response.value.message;
    successMessage.value = false;

  }
  loading1.value = false;
}

function closeModal() {
  router.push('/categoryList');
}
</script>

<style scoped></style>