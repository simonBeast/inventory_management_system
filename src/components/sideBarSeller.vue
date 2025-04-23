<template>
  <div v-if="authStore.isLoggedIn" class="drawer relative w-6 z-30" :class="{'drawer-open': drawerOpen}">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle"/>
    <label for="my-drawer-2"
      class="btn btn-primary drawer-button bg-transparent md:hidden hover:bg-gray-300 text-gray-700 border-none absolute left-0 top-0 z-10" v-if="!drawerOpen" @click="toggleDrawer"><font-awesome-icon icon="bars"
        size="1x" /></label>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" ></label>
      <ul class="menu p-4 w-56 min-h-full bg-base-200 text-base-content">
        <SidebarLink link="/product" icon="box" :text="isLanguageTigrigna ? 'ኣቕሓ ኣእትው ' :'Insert Product'"/>
        <SidebarLink link="/sale" icon="dollar-sign" :text="isLanguageTigrigna ? 'ኣቕሓ ሽጥ':'Insert Sales'"/>
        <li @click="logout">
          <a>
            <font-awesome-icon icon="sign-out-alt" class="mr-2" />{{isLanguageTigrigna ? 'ውፃእ':'Logout'}}
          </a>
        </li>
      </ul>

    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { watch , onMounted , onUnmounted , computed ,ref, defineEmits} from 'vue';
import { useLanguageStore } from '../store/languageStore';
import SidebarLink from './SidebarLink.vue';
const languageStore = useLanguageStore();

const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");

let drawerOpen = ref(true);
let authStore = useAuthStore();
let router = useRouter();
let emit = defineEmits(['drawer-toggle']);
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}


function handleResize() {
  if (window.innerWidth >= 768) {
    drawerOpen.value = true;
  } else {
    drawerOpen.value = false;
  }
}
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(drawerOpen, (newValue) => {
  emit("drawer-toggle",newValue);
  
});
async function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
<style scoped>
.active-link{
  .active-link{
  @apply bg-indigo-700 text-gray-100;
}
}
</style>