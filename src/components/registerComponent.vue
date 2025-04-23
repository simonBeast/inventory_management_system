<template>
  <div  :class="containerClass" class="ml-56 md:ml-60 lg:ml-72 flex min-h-full w-2/3 flex-col mx-auto justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div
        class="mt-10 w-2/3 md:w-full text-center text-md md:text-lg lg:text-2xl font-bold leading-5 tracking-tight text-gray-900">
        {{ isLanguageTigrigna ? "ሸያጢ መዝግብ" :"Register Seller" }}
      </div>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="fullname" class="block text-sm font-medium leading-6 text-gray-900">{{isLanguageTigrigna ? "መሉእ ስም" : "Full Name"}}</label>
          <div class="mt-2">
            <input id="fullname" name="fullname" type="text" v-model="fullName" required
              class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">{{ isLanguageTigrigna ?  "ኢመይል" : "Email"}}</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
              class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>
        <div>
          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">{{isLanguageTigrigna ? "መሕለፊ ቃል" :"Password"}}</label>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" v-model="password" required
              class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />

          </div>
        </div>
        <span v-if="loading && !registerError && !registerSuccess"
          class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
        <div>
          <button @click.prevent="handleSubmit" type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ isLanguageTigrigna ? "መዝግብ" : "Register"}}
          </button>
          <div v-if="registerError" class="text-red-600 font-semibold mt-1">
          {{ registerError }}
        </div>
        <div v-if="registerSuccess" class="text-green-600 font-semibold mt-1">
          {{ isLanguageTigrigna ?  "ሸያጢ ብተኽከል ተመዝጊቡ" : "Seller was registered successfully"}}
        </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '../store/languageStore';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");



let email = ref("");
let password = ref("");
let fullName = ref("");
let registerError = ref(false);
let registerSuccess = ref(false);
let response = ref("");
let loading = ref(false);
const userAuth = useAuthStore();
let router = useRouter(); 

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
    'ml-8': !props.drawerOpen 
}));

async function handleSubmit() {
  loading.value = true;
  registerSuccess.value = false;
  registerError.value = false;
  response.value = await userAuth.register(email.value, password.value, fullName.value);
  if (response.value.flag == 1) {
    registerSuccess.value = true;
    registerError.value = false;
    loading.value = false;
    router.push('/userList');
  } else {
    registerError.value = response.value.message;
    registerSuccess.value = false;
  }
  loading.value = false;
}
</script>
<style scoped></style>