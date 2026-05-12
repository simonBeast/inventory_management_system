<template>
  <ul class="menu w-72 h-screen sticky top-0 bg-white dark:bg-gray-900 text-base-content border-r border-gray-200 dark:border-gray-800 flex flex-col p-4 shadow-xl">
    <!-- Branding -->
    <div class="mb-3 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 px-3 py-4 shadow-sm ring-1 ring-slate-200/70 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 dark:ring-slate-700/60">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/30">
          <font-awesome-icon icon="boxes-stacked" class="text-xl" />
        </div>
        <div class="min-w-0 leading-tight">
          <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">
            Inventory
          </p>
          <p class="text-sm font-bold text-slate-800 dark:text-white">
            Management System
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
      <SidebarLink link="/categoryList" icon="list" :text="isLanguageTigrigna ? 'ምድብ' : 'Category'" />
      <SidebarLink link="/productCategoryList" icon="tags"
        :text="isLanguageTigrigna ? 'ምድብ ኣቕሓ' : 'Product Category'" />
      <SidebarLink link="/productSubCategoryList" icon="tag"
        :text="isLanguageTigrigna ? 'ንኡስ ምድብ ኣቕሓ' : 'Product Sub Category'" />
      <SidebarLink link="/productList" icon="box" :text="isLanguageTigrigna ? 'ኣቕሑ' : 'Products'" />
      <SidebarLink link="/productData" icon="database" :text="isLanguageTigrigna ? 'መረዳእታ ኣቕሑ' : 'Product Data'" />
      <SidebarLink link="/saleList" icon="dollar-sign" :text="isLanguageTigrigna ? 'መሸጣ' : 'Sales'" />
      <SidebarLink link="/returnList" icon="undo" :text="isLanguageTigrigna ? 'ተመላሲ' : 'Returns'" />
      <SidebarLink link="/reservationList" icon="bookmark"
        :text="isLanguageTigrigna ? 'ምዕዳግ ኣቕሓ' : 'Reservations'"
        :badge="pendingReservationsBadge" />
      <SidebarLink link="/transactionHistoryList" icon="history"
        :text="isLanguageTigrigna ? 'ታሪኽ ትራንዛክሽን' : 'Transaction History'" />
      <SidebarLink link="/salesAndProfit" icon="chart-line"
        :text="isLanguageTigrigna ? 'መሸጣን ትርፍን' : 'Sales And Profit'" />
      <SidebarLink link="/reports" icon="chart-bar" text="Reports" />
      <SidebarLink link="/userList" icon="users" :text="isLanguageTigrigna ? 'ተጠቀምቲ' : 'Users'" />
      <SidebarLink link="/salesReport" icon="file-alt" :text="isLanguageTigrigna ? 'ጸብጻብ መሸጣ' : 'Sales Report'" />
      
      <!-- Logout -->
      <div class="mt-8 mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
        <li @click="logout" class="mx-2">
          <a class="flex items-center px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group font-medium text-[15px]">
            <font-awesome-icon icon="sign-out-alt" class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            {{ isLanguageTigrigna ? 'ውፃእ' : 'Logout' }}
          </a>
        </li>
      </div>
    </div>
  </ul>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useLanguageStore } from '../store/languageStore';
import SidebarLink from './sideBarLink.vue';
import { usePendingReservationsCount } from '../store/useReservation';

const languageStore = useLanguageStore();
const authStore = useAuthStore();
const router = useRouter();

const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const { data: pendingReservations } = usePendingReservationsCount(authStore.token);
const pendingReservationsBadge = computed(() => {
  const count = pendingReservations.value?.count ?? 0;
  return count > 0 ? count : undefined;
});

async function logout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #374151;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}
</style>