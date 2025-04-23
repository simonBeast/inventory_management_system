<template>

    <span v-if="loading0 && !errorMessage" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

    <div
      v-else-if="authStore.isLoggedIn && authStore.isAdmin"
      :class="containerClass"
      class="ml-56 md:ml-60 lg:ml-72 mt-4 w-full md:w-3/4 lg:w-1/2 mx-auto px-6 py-4  rounded shadow-md relative"
    >

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl lg:text-2xl font-bold text-gray-800 w-full text-center">{{isLanguageTigrigna ? "መረዳእታ ተጠቃማይ ኣዐርይ" : "Edit User"}}</h2>
        <button @click="closeModal" class="bg-gray-100 hover:bg-gray-200 rounded-full p-2">
          <font-awesome-icon icon="x" size="sm" />
        </button>
      </div>

      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ምሉእ ስም":"Full Name"}}</label>
          <input
            id="fullName"
            v-model="formData.fullName"
            type="text"
            required
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
  
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ኢመይል": "Email"}}</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
  
        <button
          type="submit"
          :disabled="loading1"
          class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {{ isLanguageTigrigna ? "መረዳእታ ተጠቃሚ ኣዐርይ" : "Update User Info" }}
        </button>
      </form>
  
      
      <hr class="my-6 border-t border-gray-300" />
  
    
      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label for="oldPassword" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ነባር መሕለፊ ቃል" :"Old Password"}}</label>
          <div class="relative mt-1">
            <input
              id="oldPassword"
              v-model="formDataP.oldPassword"
              :type="text"
              required
              placeholder="********"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <font-awesome-icon
              :icon="eye"
              class="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
              @click="togglePasswordVisibility"
            />
          </div>
        </div>
  
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700">{{ isLanguageTigrigna ? "ሓዱሽ መሕለፊ ቃል" : "New Password"}}</label>
          <div class="relative mt-1">
            <input
              id="newPassword"
              v-model="formDataP.newPassword"
              :type="text"
              required
              placeholder="********"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <font-awesome-icon
              :icon="eye"
              class="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
              @click="togglePasswordVisibility"
            />
          </div>
        </div>
  
        <div>
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መሕለፊ ቃል ኣረጋግፅ":"Confirm Password"}}</label>
          <div class="relative mt-1">
            <input
              id="passwordConfirm"
              v-model="formDataP.confirmPassword"
              :type="text"
              required
              placeholder="********"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <font-awesome-icon
              :icon="eye"
              class="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
              @click="togglePasswordVisibility"
            />
          </div>
        </div>
  
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading1"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {{isLanguageTigrigna ? "መሕለፊ ቃል ዳግማይ ስራዕ" : "Reset Password"}}
          </button>
        </div>
      </form>

      <div class="mt-4">
        <p v-if="errorMessage" class="text-red-600 font-semibold text-sm">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-600 font-semibold text-sm">{{isLanguageTigrigna ? "ዝተሳኽዐ ምዕራይ":"Update Successful"}}</p>
        <span
          v-if="loading1 && !errorMessage && !successMessage"
          class="block loading loading-spinner text-indigo-600 mt-4 mx-auto"
        ></span>
      </div>
    </div>
  </template>
  

<script setup>
import { ref, onMounted,defineProps, computed, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

let eye = ref("eye-slash");
let visible = ref(false);
let text = ref("password");
let formData = ref({
    fullName: null,
    email: null
});
let formDataP = ref({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
});
let errorMessage = ref("");
let successMessage = ref("");
let loading0 = ref(true);
let loading1 = ref(false);

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen 
}));

function togglePasswordVisibility() {
    visible.value = !visible.value;
    eye.value = visible.value ? "eye" : "eye-slash";
    text.value = visible.value ? "text" : "password";
}
onMounted(async () => {
    let userId = route.params.id;
    let response = await userStore.getUser( userId, authStore.token);
    if (response.flag == 1) {
        formData.value = response.data.data;
    } else {
        errorMessage.value = response.message;
    }
    loading0.value = false;
});

async function handleUpdate() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    let userId = route.params.id;
    let response = await userStore.updateUser(userId, {
        fullName: formData.value.fullName,
        email: formData.value.email
    }, authStore.token);
    if (response.flag == 1) {
        successMessage.value = true;
        errorMessage.value = "";
        loading1.value = false;
        router.push('/userList');
    } else {
        errorMessage.value = response.message;
        successMessage.value = false;
    }
    loading1.value = false;
}
async function handleReset() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    let userId = route.params.id;
    let response = await userStore.changeUserPassword(userId,{
        oldPassword: formDataP.value.oldPassword,
        newPassword: formDataP.value.newPassword,
        confirmPassword : formDataP.value.confirmPassword
    }, authStore.token);
    if (response.flag == 1) {
        successMessage.value = true;
        errorMessage.value = "";
        loading1.value = false;
        router.push('/userList');
    } else {
        errorMessage.value = response.message;
        successMessage.value = false;
    }
    loading1.value = false;
}
function closeModal(){
    router.push('/userList');
}
</script>

<style scoped></style>
