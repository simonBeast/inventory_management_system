<template>
    <div v-if="!userAuth.isLoggedIn" class="flex min-h-full flex-col mx-auto justify-center w-2/3 px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <div
                class="mt-10 w-2/3 md:w-full text-center text-md md:text-lg lg:text-2xl font-bold leading-6  tracking-tight text-gray-900">
                {{isLanguageTigrigna ? "መሕለፊ ቃል ዳግማይ ስራዕ": "Reset Password"}}
            </div>
        </div>
        <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST">
                <div>
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">{{ isLanguageTigrigna ? 
                    "ሓዱሽ መሕለፊ ቃል": "New Password"}}</label>
                    <div class="mt-2 relative">
                        <input id="password" name="password" :type="text" v-model="formData.password" required
                            placeholder="*********"
                            class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        <font-awesome-icon :icon="eye" class="cursor-pointer absolute right-2 top-2.5"
                            @click="togglePasswordVisibility" />
                    </div>
                    <label for="passwordConfirm" class="block text-sm font-medium leading-6 text-gray-900">
                        {{ isLanguageTigrigna ? "መሕለፊ ቃል ኣረጋግፅ" : "Confirm Password"}}</label>
                    <div class="mt-2 relative">
                        <input id="passwordConfirm" name="passwordConfirm" :type="text"
                            v-model="formData.confirmPassword" required placeholder="*********"
                            class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        <font-awesome-icon :icon="eye" class="cursor-pointer absolute right-2 top-2.5"
                            @click="togglePasswordVisibility" />
                    </div>
                </div>
                <div v-if="resetError" class="text-red-500 text-sm mt-2 font-semibold">
                    {{ resetError }}
                </div>
                <div v-if="resetSuccess" class="text-green-500 text-sm mt-2">
                    {{ isLanguageTigrigna ? "መሕለፊ ቃል በ ትኽክል ዳግማይ ተሰሪዑ" : "Password has been sucessfully reset" }}
                </div>
                <span v-if="loading && !resetError && !resetSuccess"
                    class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
                <div>
                    <button @click.prevent="handleSubmit" type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {{isLanguageTigrigna ? "ዳግማይ ስራዕ" : "Reset"}}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from '../store/authStore';
import { ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useLanguageStore } from '../store/languageStore';
import { computed } from 'vue';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");


let resetError = ref(false);
let resetSuccess = ref(false);
let response = ref("");
let userAuth = useAuthStore();
let loading = ref(false);
let route = useRoute();
let router = useRouter();
let resetToken = route.params.resetToken;
let eye = ref("eye-slash");
let visible = ref(false);
let text = ref("password");
let formData = ref({
    password: "",
    confirmPassword: ""
});

async function handleSubmit() {
    loading.value = true;
    resetSuccess.value = false;
    resetError.value = false;
    try{
        response.value = await userAuth.resetPassword(formData.value, resetToken);
        resetSuccess.value = true;
        resetError.value = false;
        
    setTimeout(() => {
        router.push('/categoryList');
    },2000)
    }catch(e){
        resetError.value = e.message;
        resetSuccess.value = false;
    }finally{
        loading.value = false;
    }   
}
function togglePasswordVisibility() {
    visible.value = !visible.value;
    eye.value = visible.value ? "eye" : "eye-slash";
    text.value = visible.value ? "text" : "password";
}
</script>
<style scoped></style>