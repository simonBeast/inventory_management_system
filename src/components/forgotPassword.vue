<template>
  <div v-if="!userAuth.isLoggedIn" class="flex min-h-full flex-col mx-auto justify-center w-2/3 px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div
        class="mt-10 w-2/3 md:w-full text-center text-md md:text-lg lg:text-2xl font-bold leading-6  tracking-tight text-gray-900">
        {{ isLanguageTigrigna ? "መሕለፊ ቓል ረሲዕካ" : "Forgot Password" }}
      </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">{{ isLanguageTigrigna ? "ኢመይል"  : "Email:" }}</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
              :placeholder="isLanguageTigrigna ? 'ኢመይል' :'Email'"
              class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div v-if="forgotError" class="text-red-500 text-sm mt-2 font-semibold">
          {{ forgotError }}
        </div>
        <div v-if="forgotSuccess" class="text-green-500 text-sm mt-2">
          {{ isLanguageTigrigna ? " " : "ናብዚ ኢመይል ንመሕለፊ ቃል ዳግመ ምትዕርራይ ዝኸውን ሊንክ ተላኢኹ" }}
        </div>
        <span v-if="loading && !forgotError && !forgotSuccess"
          class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
        <div>
          <button @click.prevent="handleSubmit" type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ isLanguageTigrigna ? "ለኣኽ" : "Submit" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { ref } from 'vue';

let email = ref('');
let forgotError = ref(false);
let forgotSuccess = ref(false);
let response = ref("");
let userAuth = useAuthStore();
let languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");
let loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  forgotSuccess.value = false;
  forgotError.value = false;
  response.value = await userAuth.forgotPassword(email.value);
  if (response.value.flag == 1) {
    forgotSuccess.value = true;
    forgotError.value = false;
  } else {
    forgotError.value = response.value.message;
    forgotSuccess.value = false;
  }
  loading.value = false;
}

</script>
<style scoped></style>
