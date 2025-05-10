<template>
  <div
    v-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="mx-auto p-4 w-full max-w-6xl"
  >

    <h1 class="text-center text-2xl font-bold text-indigo-700 mb-6">{{isLanguageTigrigna ? "መጠቓለሊ መሸጣን ትርፍን":"Sales & Profit Summary"}}</h1>

    <form @submit.prevent="fetchSalesAndProfit" class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መጀመሪ መዓልቲ":"Start Date"}}</label>
          <input
            type="date"
            v-model="startDate"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            required
          />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መወዳእታ መዓልቲ":"End Date"}}</label>
          <input
            type="date"
            v-model="endDate"
            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            required
          />
        </div>
      </div>
      <div class="mt-4 text-right">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 transition"
        >
          {{isLanguageTigrigna ? "ኣምፅእ":"Fetch Data"}}
        </button>
      </div>
    </form>

    <span v-if="loading" class="block loading loading-spinner text-indigo-600 mt-6 mx-auto"></span>

    <div v-else-if="salesAndProfitsOfInterval && !errorMessage" class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100 text-gray-800 uppercase text-left text-xs tracking-wider">
          <tr>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ኣቕሓ":"Product Name"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ጠቕላላ በዝሒ":"Total Quantity Sold"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ጠቕላላ መሸጣ":"Total Sales (Birr)"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ጠቕላላ ወፃኢ":"Total Cost (Birr)"}}</th>
            <th class="px-6 py-3">{{isLanguageTigrigna ? "ትርፊ":"Profit (Birr)"}}</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 divide-y divide-gray-200">
          <tr
            v-for="sale in salesAndProfitsOfInterval.productSales"
            :key="sale.productId"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 font-medium">{{ sale.Product.productName }}</td>
            <td class="px-6 py-3">{{ sale.totalQuantitySold || 0 }}</td>
            <td class="px-6 py-3">{{ (sale.totalSales || 0) + ' Birr' }}</td>
            <td class="px-6 py-3">{{ (sale.totalCost || 0) + ' Birr' }}</td>
            <td class="px-6 py-3 font-semibold text-green-600">{{ (sale.profit || 0) + ' Birr' }}</td>
          </tr>
          <tr class="bg-gray-100 font-semibold text-indigo-700">
            <td class="px-6 py-3">{{isLanguageTigrigna ? "":"Total"}}</td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3">{{ (salesAndProfitsOfInterval.totalAggregatedData.totalSales || 0) + ' Birr' }}</td>
            <td class="px-6 py-3">{{ (salesAndProfitsOfInterval.totalAggregatedData.totalCost || 0) + ' Birr' }}</td>
            <td class="px-6 py-3">{{ (salesAndProfitsOfInterval.totalAggregatedData.profit || 0) + ' Birr' }}</td>
          </tr>
        </tbody>
      </table>
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

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
  'ml-8 w-full': !props.drawerOpen 
}));

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

