<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Abstract Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
    
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg mb-6">
            <font-awesome-icon icon="boxes-stacked" class="text-3xl" />
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ selectedLanguage == "ti" ? "ናብ ኣካውንትካ እቶ" : "Welcome Back" }}
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ selectedLanguage == "ti" ? "ምልእቲ መረዳእታኻ ብምጥቃም እቶ" : "Sign in to manage your inventory" }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
                {{ selectedLanguage == "ti" ? "ኢመይል" : "Email Address" }}
              </label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <font-awesome-icon icon="envelope" />
                </span>
                <input id="email" v-model="email" type="email" required
                  :placeholder='selectedLanguage == "ti" ? "example@email.com" : "example@email.com"'
                  class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2 px-1">
                <label for="password" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {{ selectedLanguage == "ti" ? "መሕለፊ ቓል" : "Password" }}
                </label>
                <router-link to="/forgotPassword" class="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
                  {{ selectedLanguage == "ti" ? "መሕለፊ ቓል ረሲዕካ ?" : "Forgot?" }}
                </router-link>
              </div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <font-awesome-icon icon="lock" />
                </span>
                <input id="password" v-model="password" :type="passwordVisible ? 'text' : 'password'" required placeholder="••••••••"
                  class="block w-full pl-11 pr-11 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
                <button type="button" @click="passwordVisible = !passwordVisible"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
                  <font-awesome-icon :icon="passwordVisible ? 'eye' : 'eye-slash'" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="loginError" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <font-awesome-icon icon="circle-exclamation" />
            {{ loginError }}
          </div>

          <button type="submit" :disabled="loading"
            class="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-50">
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            {{ selectedLanguage == "ti" ? "እተው" : "Sign In" }}
          </button>
        </form>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-gray-500 dark:text-gray-400 text-xs font-medium">
        &copy; 2026 Inventory Management System. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

const router = useRouter();
const userAuth = useAuthStore();
const languageStore = useLanguageStore();

const email = ref('');
const password = ref('');
const loginError = ref('');
const loginSuccess = ref(false);
const loading = ref(false);
const passwordVisible = ref(false);
const selectedLanguage = ref(languageStore.languagePreference);

function changeLanguage() {
  languageStore.setLanguagePreference(selectedLanguage.value);
}

async function handleSubmit() {
  loading.value = true;
  loginError.value = '';
  loginSuccess.value = false;
  try {
    const res = await userAuth.login(email.value, password.value);
    userAuth.token = res.data.token;
    userAuth.user = res.data.user;
    userAuth.isLoggedIn = true;
    
    if (userAuth.user.role === "ADMIN") {
      userAuth.isAdmin = true;
      router.push('/categoryList');
    } else {
      userAuth.isAdmin = false;
      router.push('/saleList'); // Updated from '/sale'
    }
    loginSuccess.value = true;
  } catch (e) {
    loginError.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (userAuth.isLoggedIn) {
    router.push(userAuth.isAdmin ? "/categoryList" : "/saleList");
  }
});
</script>

<style scoped>
/* Glassmorphism effects if needed */
</style>
