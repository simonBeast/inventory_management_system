<template>
   <div v-if="authStore.isCheckingAuth">
    <span class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
  </div>
   <div v-else class="flex">
      <side-bar v-if="authStore.isAdmin" @drawer-toggle="handleDrawerToggle"/>
      <sideBarSeller v-else-if="authStore.isLoggedIn && !authStore.isAdmin" @drawer-toggle="handleDrawerToggle"/>
      <router-view :drawer-open="drawerOpen" />
   </div>
</template>
<script setup>
import sideBar from '../components/sideBar.vue';
import sideBarSeller from '../components/sideBarSeller.vue';
import { useAuthStore } from '../store/authStore';
import { ref,onMounted } from 'vue';
let authStore = useAuthStore();
let drawerOpen = ref(true);
onMounted(()=>{

})
function handleDrawerToggle(isOpen) {
  drawerOpen.value = isOpen;
  
}
</script>
<style scoped></style>