<template>
  <dash-board-layout />
</template>

<script setup>
import dashBoardLayout from './pages/dashboardLayout.vue'
import { onMounted, ref } from 'vue';
import { useAuthStore } from './store/authStore';
import { useLanguageStore } from './store/languageStore';
import { useRouter } from 'vue-router';
let languageStore = useLanguageStore();
let authStore = useAuthStore();
let response = ref("");
let router = useRouter();
onMounted(async () => {
  if(localStorage.getItem('language_pref')){
    languageStore.setLanguagePreference(localStorage.getItem('language_pref') == 'ti' ? 'ti' : 'en');
  }
  if (localStorage.getItem('auth_token')){
    try{
      response.value = await authStore.checkTokenValidity(localStorage.getItem('auth_token'));
    }catch(e){
      console.log("error checking token validity",e.message
      );
      authStore.isCheckingAuth = false;
      authStore.logout();
      router.push('/login');
    }
    
    
  } 
  if (response.value.flag == 1) {
    authStore.user = response.value.data.user;
    authStore.isLoggedIn = true;
    if(authStore.user.role == "ADMIN"){
      authStore.isAdmin = true;
    }else{
      authStore.isAdmin = false;
    }
  }
  else {
    authStore.isCheckingAuth = false;
    authStore.logout();
    router.push('/login');
  }
  authStore.isCheckingAuth = false;
})
</script>
<style scoped></style>
