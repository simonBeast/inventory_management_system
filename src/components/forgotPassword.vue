<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Abstract Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Back to Login -->
      <div class="flex justify-start">
        <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
          <font-awesome-icon icon="arrow-left" />
          {{ isLanguageTigrigna ? "ተመለስ" : "Back to Sign In" }}
        </router-link>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg mb-6">
            <font-awesome-icon icon="key" class="text-3xl" />
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ isLanguageTigrigna ? "መሕለፊ ቓል ረሲዕካ" : "Reset Password" }}
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ isLanguageTigrigna ? "ናብዚ ኢመይል ንመሕለፊ ቃል ዳግመ ምትዕርራይ ዝኸውን ሊንክ ክንልእከልካ ኢና" : "Enter your email and we'll send you a link to reset your password." }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 px-1">
              {{ isLanguageTigrigna ? "ኢመይል" : "Email Address" }}
            </label>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <font-awesome-icon icon="envelope" />
              </span>
              <input id="email" v-model="email" type="email" required
                :placeholder="isLanguageTigrigna ? 'ኢመይል' : 'example@email.com'"
                class="block w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
            </div>
          </div>

          <div v-if="forgotError" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <font-awesome-icon icon="circle-exclamation" />
            {{ forgotError }}
          </div>

          <div v-if="forgotSuccess" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-3">
            <font-awesome-icon icon="circle-check" class="text-xl" />
            <span>{{ isLanguageTigrigna ? "ናብዚ ኢመይል ንመሕለፊ ቃል ዳግመ ምትዕርራይ ዝኸውን ሊንክ ተላኢኹ" : "A reset link has been sent to your email address." }}</span>
          </div>

          <button type="submit" :disabled="loading || forgotSuccess"
            class="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-50">
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            {{ isLanguageTigrigna ? "ለኣኽ" : "Send Reset Link" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

const email = ref('');
const forgotError = ref('');
const forgotSuccess = ref(false);
const loading = ref(false);

const userAuth = useAuthStore();
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

async function handleSubmit() {
  loading.value = true;
  forgotSuccess.value = false;
  forgotError.value = '';

  try {
    const res = await userAuth.forgotPassword(email.value);
    forgotSuccess.value = true;
  } catch (e) {
    forgotError.value = e.message || "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
