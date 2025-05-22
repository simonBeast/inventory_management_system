<template>
  <div v-if="authStore.isLoggedIn" class="drawer w-6 z-30 " :class="{ 'drawer-open': drawerOpen }">
    <div v-if="authStore.isLoggedIn" class="drawer z-30" :class="{ 'drawer-open': drawerOpen }">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

      <label for="my-drawer-2"
        class="btn btn-primary drawer-button bg-transparent md:hidden text-gray-700 border-none absolute hover:bg-gray-300 left-0 top-0 z-40"
        v-if="!drawerOpen" @click="toggleDrawer">
        <font-awesome-icon icon="bars" size="1x" />
      </label>


      <div
        class="drawer-side md:sticky md:top-0 md:h-screen p-1 md:p-3 md:pt-4 md:ml-2 md:mt-2 md:rounded-2xl md:shadow-md">
        <!-- :class="{ '-translate-x-full': !drawerOpen && isMobile }"> -->
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <!-- <label for="my-drawer-2" aria-label="close sidebar"></label> -->
        <ul class="menu w-56 min-h-full bg-base-200 text-base-content rounded-xl overflow-hidden">
          <div class="flex bg-gray-300 mb-4 -mx-2 -mt-2 p-2 rounded-t-xl">
            <img src="/images/bg.png" class="block" width="90" height="60" />
            <span class="ml-2 text-gray-800 text-lg font-semibold italic uppercase text-center pt-2">
              {{ isLanguageTigrigna ? "ምሕደራ ንብረትን መሽጣን" : "Digital Inventory" }}
            </span>
          </div>
          <SidebarLink link="/categoryList" icon="list" :text="isLanguageTigrigna ? 'ምድብ' : 'Category'" />
          <SidebarLink link="/productCategoryList" icon="tags"
            :text="isLanguageTigrigna ? 'ምድብ ኣቕሓ' : 'Product Category'" />
          <SidebarLink link="/productSubCategoryList" icon="tag"
            :text="isLanguageTigrigna ? 'ንኡስ ምድብ ኣቕሓ' : 'Product Sub Category'" />
          <SidebarLink link="/productList" icon="box" :text="isLanguageTigrigna ? 'ኣቕሑ' : 'Products'" />
          <SidebarLink link="/productData" icon="database" :text="isLanguageTigrigna ? 'መረዳእታ ኣቕሑ' : 'Product Data'" />
          <SidebarLink link="/saleList" icon="dollar-sign" :text="isLanguageTigrigna ? 'መሸጣ' : 'Sales'" />
          <SidebarLink link="/returnList" icon="undo" :text="isLanguageTigrigna ? 'ተመላሲ' : 'Returns'" />
          <SidebarLink link="/transactionHistoryList" icon="history"
            :text="isLanguageTigrigna ? 'ታሪኽ ትራንዛክሽን' : 'Transaction History'" />
          <SidebarLink link="/salesAndProfit" icon="chart-line"
            :text="isLanguageTigrigna ? 'መሸጣን ትርፍን' : 'Sales And Profit'" />
          <SidebarLink link="/userList" icon="users" :text="isLanguageTigrigna ? 'ተጠቀምቲ' : 'Users'" />
          <SidebarLink link="/salesReport" icon="file-alt" :text="isLanguageTigrigna ? 'ጸብጻብ መሸጣ' : 'Sales Report'" />
          <li @click="logout">
            <a>
              <font-awesome-icon icon="sign-out-alt" class="mr-2" />{{ isLanguageTigrigna ? 'ውፃእ' : 'Logout' }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { watch, onMounted, onUnmounted, computed, ref, defineEmits } from 'vue';
import { useLanguageStore } from '../store/languageStore';
import SidebarLink from './SidebarLink.vue';
const languageStore = useLanguageStore();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let drawerOpen = ref(true);
let authStore = useAuthStore();
let router = useRouter();

let emit = defineEmits(['drawer-toggle']);

function toggleDrawer() {

  drawerOpen.value = !drawerOpen.value;

}
const isMobile = ref(window.innerWidth < 768);

function handleResize() {
  if (window.innerWidth >= 768) {

    drawerOpen.value = true;

  } else {

    isMobile.value = true;

    drawerOpen.value = !isMobile.value;
  }
}
const overlay = computed(() => drawerOpen.value && window.innerWidth <= 768);
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(drawerOpen, (newValue) => {
  emit("drawer-toggle", newValue);

});
async function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
<style scoped>

.drawer-side.-translate-x-full {

  transform: translateX(-100%);

}
</style>