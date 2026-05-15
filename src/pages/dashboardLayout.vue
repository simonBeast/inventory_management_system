<template>
  <div v-if="authStore.isCheckingAuth">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <span class="loading loading-spinner loading-lg text-blue-600"></span>
    </div>
  </div>
  <div v-else-if="authStore.isLoggedIn" :class="['drawer h-[100dvh] overflow-hidden', isLargeScreen ? 'lg:drawer-open' : '']">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />
    
    <div class="drawer-content flex flex-col h-full min-h-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Mobile Navbar Toggle -->
      <div class="lg:hidden fixed top-0 inset-x-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <label for="main-drawer" class="btn btn-ghost btn-circle text-blue-600">
          <font-awesome-icon icon="bars" size="lg" />
        </label>
      </div>

      <!-- Main Page Content -->
      <main class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-[calc(5rem+env(safe-area-inset-top))] lg:pt-0">
        <router-view :drawer-open="drawerOpen" />
      </main>
    </div>

    <!-- Sidebar Menu Area -->
    <div class="drawer-side z-40">
      <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <sideBar v-if="authStore.isAdmin" />
      <sideBarSeller v-else />
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <router-view />
  </div>
</template>

<script setup>
import sideBar from '../components/sideBar.vue';
import sideBarSeller from '../components/sideBarSeller.vue';
import { useAuthStore } from '../store/authStore';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const drawerOpen = ref(false);
const isLargeScreen = ref(window.innerWidth >= 1024);

function handleResize() {
  isLargeScreen.value = window.innerWidth >= 1024;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (!isLoggedIn) {
    drawerOpen.value = false;
  }
});

// Close drawer on route change (for mobile)
watch(() => route.path, () => {
  if (!isLargeScreen.value) {
    drawerOpen.value = false;
  }
});
</script>

<style scoped>
.drawer-content {
  transition: padding 0.3s ease;
}
</style>