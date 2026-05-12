<template>
  <div
    v-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="mx-auto p-4 w-full max-w-6xl"
  >

    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">{{isLanguageTigrigna ? "መጠቓለሊ መሸጣን ትርፍን":"Sales & Profit Summary"}}</h1>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <form @submit.prevent="fetchSalesAndProfit">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{isLanguageTigrigna ? "መጀመሪ መዓልቲ":"Start Date"}}</label>
              <input
                type="date"
                v-model="startDate"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{{isLanguageTigrigna ? "መወዳእታ መዓልቲ":"End Date"}}</label>
              <input
                type="date"
                v-model="endDate"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          <div class="md:col-span-12 flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              {{isLanguageTigrigna ? "ኣምፅእ":"Fetch Data"}}
            </button>
          </div>
        </div>
      </form>
    </div>

    <span v-if="loading" class="block loading loading-spinner text-blue-600 mt-6 mx-auto"></span>

    <div v-else-if="salesAndProfitsOfInterval && !errorMessage" class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold text-left border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4">{{isLanguageTigrigna ? "ኣቕሓ":"Product Name"}}</th>
              <th class="px-6 py-4 text-center">{{isLanguageTigrigna ? "ጠቕላላ በዝሒ":"Total Quantity Sold"}}</th>
              <th class="px-6 py-4">{{isLanguageTigrigna ? "ጠቕላላ መሸጣ":"Total Sales (Birr)"}}</th>
              <th class="px-6 py-4">{{isLanguageTigrigna ? "ጠቕላላ ወፃኢ":"Total Cost (Birr)"}}</th>
              <th class="px-6 py-4">{{isLanguageTigrigna ? "ትርፊ":"Profit (Birr)"}}</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 dark:text-gray-200 text-sm divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="sale in salesAndProfitsOfInterval.productSales"
              :key="sale.productId"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-800/80 transition-colors group"
            >
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ sale.Product.productName }}</td>
              <td class="px-6 py-4 text-center">{{ sale.totalQuantitySold || 0 }}</td>
              <td class="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{{ (sale.totalSales || 0).toLocaleString() + ' Birr' }}</td>
              <td class="px-6 py-4 font-mono">{{ (sale.totalCost || 0).toLocaleString() + ' Birr' }}</td>
              <td :class="'px-6 py-4 font-mono font-bold ' + (sale.profit >= 0 ? 'text-green-600' : 'text-red-600')">{{ (sale.profit || 0).toLocaleString() + ' Birr' }}</td>
            </tr>
            <tr class="bg-gray-50/50 dark:bg-gray-800/50 font-bold text-blue-700 dark:text-blue-400">
              <td class="px-6 py-4">{{isLanguageTigrigna ? "ጠቕላላ":"Total"}}</td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4 font-mono">{{ (salesAndProfitsOfInterval.totalAggregatedData.totalSales || 0).toLocaleString() + ' Birr' }}</td>
              <td class="px-6 py-4 font-mono">{{ (salesAndProfitsOfInterval.totalAggregatedData.totalCost || 0).toLocaleString() + ' Birr' }}</td>
              <td :class="'px-6 py-4 font-mono ' + (salesAndProfitsOfInterval.totalAggregatedData.profit >= 0 ? 'text-green-600' : 'text-red-600')">{{ (salesAndProfitsOfInterval.totalAggregatedData.profit || 0).toLocaleString() + ' Birr' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="errorMessage" class="mt-4 text-center text-red-600 font-semibold">
      {{ errorMessage }}
    </p>
  </div>
</template>


<script setup>
import { ref,defineProps, computed, } from 'vue';
import { useAuthStore } from '../../../store/authStore';
import { useSaleStore } from '../../../store/saleStore';
import { useLanguageStore } from '../../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
let authStore = useAuthStore();
let saleStore = useSaleStore();
let response = ref("");
let salesAndProfitsOfInterval = ref(null);
let startDate = ref(null);
let endDate = ref(null);
let errorMessage = ref(false);
let loading = ref(false);

let props = defineProps(['drawerOpen']);


async function fetchSalesAndProfit() {
  loading.value = true;
  try{
    response.value = await saleStore.getTotalSalesAndProfitInterval(authStore.token, startDate.value, endDate.value);
      errorMessage.value = false;
      salesAndProfitsOfInterval.value = response.value.data.data;
  }catch(e){
    errorMessage.value = response.value.message;
  }finally{
    loading.value = false;
  } 
}

</script>

<style scoped></style>

