<template>
  <div :class="containerClass" class="flex min-h-screen justify-center items-center bg-gray-50 px-6 py-12 sm:px-6 lg:px-8">
    <div class="sm:w-full sm:max-w-sm w-full bg-white shadow-lg rounded-lg p-8">
      <div class="text-center mb-6">
        <div class="flex justify-end mb-4">
          <select
            v-model="selectedLanguage"
            @change="changeLanguage"
            class="border border-gray-300 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
            <option selected>Language</option>
            <option value="en">English</option>
            <option value="ti">ትግርኛ</option>
          </select>
      </div>
        <h2 class="text-2xl font-bold text-gray-900">{{ selectedLanguage == "ti" ? "ናብ ኣካውንትካ እቶ" : "Sign in to your account"}} </h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
      
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900">{{selectedLanguage == "ti" ? "ኢመይል" : "Email"}}</label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              v-model="email"
              required
              :placeholder='selectedLanguage == "ti" ? "ኢመይል" : "Email"'
              class="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900">{{selectedLanguage == "ti" ? "መሕለፊ ቓል" : "Password"}}</label>
          <div class="mt-2 relative">
            <input
              id="password"
              name="password"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="*******"
              class="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
            <font-awesome-icon
              :icon="eye"
              class="cursor-pointer absolute right-3 top-3.5 text-gray-500"
              @click="togglePasswordVisibility"
            />
          </div>
          <div class="text-sm mt-2">
            <router-link to="/forgotPassword" class="font-semibold text-indigo-600 hover:text-indigo-500">
              {{selectedLanguage == "ti" ? "መሕለፊ ቓል ረሲዕካ ?" : "Forgot Password ?"}}
            </router-link>
          </div>
        </div>

     
        <div v-if="loginError" class="text-red-500 text-sm font-semibold mt-2">
          {{ loginError }}
        </div>
        <div v-if="loginSuccess" class="text-green-500 text-sm mt-2">
          {{ selectedLanguage == "ti" ? "ምእታው ዕዉት ኮይኑ" : "Login successful"}} 
        </div>

        <div v-if="loading && !loginError && !loginSuccess" class="mt-6 flex justify-center">
          <div class="w-6 h-6 border-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
          {{ selectedLanguage == "ti" ? "እተው" : "Login"}} 
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { ref, onMounted,defineProps, computed, } from 'vue';
import { useRouter,useRoute } from 'vue-router';

let email = ref('');
let password = ref('');
let loginError = ref(false);
let loginSuccess = ref(false);
let response = ref("");
let router = useRouter();
const userAuth = useAuthStore();
const languageStore = useLanguageStore();
const selectedLanguage = ref(languageStore.languagePreference);
let loading = ref(false);
let eye = ref("eye-slash");
let visible = ref(false);
let text = ref('password');
let route = useRoute();
let props = ref(false);

const containerClass = computed(() => ({
    'ml-40 md:ml-48 lg:ml-60 w-2/3': props.value,
    'w-full': !props.value
}));

function changeLanguage(){
  languageStore.setLanguagePreference(selectedLanguage.value);
}

async function handleSubmit() {
  loading.value = true;
  loginSuccess.value = false;
    loginError.value = false;
  response.value = await userAuth.login(email.value, password.value);
  if (response.value.flag == 1) {
    loginSuccess.value = true;
    loginError.value = false;
    userAuth.token = response.value.data.token;
    userAuth.user = response.value.data.user;
    userAuth.isLoggedIn = true;
    if(userAuth.user.role == "ADMIN") {
      userAuth.isAdmin = true;
      router.push('/categoryList');
    } else {
      userAuth.isAdmin = false;
      router.push('/sale');
    }
  } else {
    loginError.value = response.value.message;
    loginSuccess.value = false;
  }
  loading.value = false;
}


function togglePasswordVisibility(){
  visible.value = !visible.value;
  eye.value = visible.value ? "eye" : "eye-slash";
  text.value = visible.value ? "text" : "password";
}
onMounted(()=>{
  if(userAuth.isLoggedIn){
    router.push("/sale");
  }
})
</script>
<style scoped></style>
