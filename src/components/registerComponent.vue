<template>
  <div :class="containerClass" class="w-full py-10 pr-4 md:pr-8 lg:py-12">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-6">
        <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {{ isLanguageTigrigna ? "ሸያጢ መዝግብ" : "Register Seller" }}
        </h1>
      </div>

      <div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="md:col-span-2">
              <label for="fullname" class="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {{ isLanguageTigrigna ? "መሉእ ስም" : "Full Name" }}
              </label>
              <div class="mt-2">
                <input id="fullname" name="fullname" type="text" v-model="fullName" required
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label for="email" class="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {{ isLanguageTigrigna ? "ኢመይል" : "Email" }}
              </label>
              <div class="mt-2">
                <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label for="password" class="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {{ isLanguageTigrigna ? "መሕለፊ ቃል" : "Password" }}
              </label>
              <div class="relative mt-2">
                <input id="password" name="password" :type="passwordVisible ? 'text' : 'password'" v-model="password" required
                  class="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                <button type="button" @click="passwordVisible = !passwordVisible" :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400">
                  <font-awesome-icon :icon="passwordVisible ? 'eye' : 'eye-slash'" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="registerError" class="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
            {{ registerError }}
          </div>
          <div v-if="registerSuccess" class="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
            {{ isLanguageTigrigna ? "ሸያጢ ብተኽከል ተመዝጊቡ" : "Seller was registered successfully" }}
          </div>

          <button type="submit" :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ isLanguageTigrigna ? "መዝግብ" : "Register" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useCreateUser } from '../store/useUser';
import { useQueryClient } from '@tanstack/vue-query';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");

let email = ref("");
let password = ref("");
let fullName = ref("");
let registerError = ref(false);
let registerSuccess = ref(false);
let loading = ref(false);
let passwordVisible = ref(false);
const userAuth = useAuthStore();
let props = defineProps(['drawerOpen']);
const containerClass = computed(() => ({
  'pl-56 md:pl-60 lg:pl-72': props.drawerOpen,
  'pl-4 md:pl-8': !props.drawerOpen
}));

const registerUserMutation = useCreateUser(userAuth.token);
const queryClient = useQueryClient();
async function handleSubmit() {
  loading.value = true;
  registerSuccess.value = false;
  registerError.value = false;
  await registerUserMutation.mutateAsync({
    email: email.value,
    fullName: fullName.value,
    password: password.value
  },{
    onSuccess:()=>{
      queryClient.invalidateQueries(["users"]);
      registerSuccess.value = "true";
    },
    onError:(e)=>{
      registerError.value = e.message;
    },
    onSettled:()=>{
      loading.value = false;
    }
  })
  
}
</script>
<style scoped></style>