<template>
  <div class="h-full">
    <div v-if="isLoading && !errorMessage" class="flex items-center justify-center py-12">
      <span class="loading loading-spinner text-blue-600"></span>
    </div>

    <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
      class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
      
      <!-- Card Header -->
      <div class="px-6 py-5 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border-b border-gray-100 dark:border-gray-800">
        <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <font-awesome-icon icon="layer-group" class="text-blue-500" />
          {{ isLanguageTigrigna ? "ናይዚ ርብዒ ዓመት ኣዝዮም ተሸየጥቲ" : "Quarterly Top Sellers" }}
        </h3>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-semibold">
          {{ isLanguageTigrigna ? "ዝለዓለ ዓሰርተ ኣቑሑ" : "Top 10 performing items" }}
        </p>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
              <th class="px-6 py-3 font-bold">#</th>
              <th class="px-6 py-3 font-bold">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</th>
              <th class="px-6 py-3 font-bold text-right">{{ isLanguageTigrigna ? "በዝሒ" : "Sold" }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            <tr v-for="(item, index) in data" :key="index" class="group hover:bg-blue-50/30 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4">
                <span :class="index < 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {{ index + 1 }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 transition-colors">{{ item.Product.productName }}</div>
                <div class="text-[10px] text-gray-400 font-mono">#{{ item.productId.toString().slice(-6).toUpperCase() }}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="font-bold text-blue-600 dark:text-blue-400 font-mono">{{ item.totalQuantitySold }}</span>
              </td>
            </tr>
            <tr v-if="!data || data.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-gray-400 text-sm">
                {{ isLanguageTigrigna ? "ምንም መረዳእታ የለን" : "No data for this quarter." }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 dark:border-red-800/30">
      <font-awesome-icon icon="circle-exclamation" class="mr-1" /> {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../../../store/authStore';
import { useLanguageStore } from '../../../store/languageStore';
import { useTopSellingProductQuarter } from '../../../store/useSales';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
const authStore = useAuthStore();
const errorMessage = ref('');

const { isLoading, data, isError, error } = useTopSellingProductQuarter(authStore.token);

watch([isError, error], ([hasError, err]) => {
  errorMessage.value = hasError ? (err.message || "Something went wrong") : "";
});
</script>

<style scoped></style>