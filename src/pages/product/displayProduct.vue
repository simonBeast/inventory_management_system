<template>
  <div
    v-if="!errorMessage && authStore.isAdmin"
    :class="containerClass"
    class="p-4 max-h-full mt-16 rounded-md mr-2 px-3 py-4 pb-5 lg:px-6 shadow-sm"
  >
    <span
      v-if="loading && !errorMessage"
      class="block loading  text-indigo-600 mt-10 mx-auto"
    ></span>

    <div
      v-else
      class="w-full mx-auto max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
    >
      <div class="px-6 py-5 border-b border-gray-200 bg-indigo-50">
        <h2 class="text-2xl font-semibold text-gray-800 mb-1">{{ productData.productName }}</h2>
        <p class="text-gray-600 text-sm italic">{{ productData.productDescription }}</p>
      </div>

      <div class="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2 text-gray-800 text-sm">
          <p><span class="font-medium">📦 {{isLanguageTigrigna ? "ኣቕሓ ቑፅሪ:" : "Product Code:"}}</span> {{ productData.productCode }}</p>
          <p><span class="font-medium">🗂 {{isLanguageTigrigna ? "ንኡስ ምድብ ኣቕሓ:" : "Sub Category:"}}</span> {{ productData.ProductSubCategory.name }}</p>
          <p><span class="font-medium">📏 {{isLanguageTigrigna ?  "መዐቀኒ:" : "Unit:"}}</span> {{ productData.measurementUnit }}</p>
          <p><span class="font-medium">💰 {{isLanguageTigrigna ? "ዋጋ:" : "Price:"}}</span> {{ productData.pricePerUnit }} Birr</p>
        </div>

        <div class="space-y-2 text-gray-800 text-sm">
          <p>
            <span class="font-medium">📊 {{isLanguageTigrigna ? "ቅሩብ:":"Available:"}}</span>
            {{ productData.ProductDetail.availableQuantity }} {{ productData.measurementUnit }}
          </p>
          <p>
            <span class="font-medium">⚠️ {{isLanguageTigrigna ? "ዝተሓተ ስቶክ:" : "Min Stock:"}}</span>
            {{ productData.ProductDetail.minimumStockLevel }} {{ productData.measurementUnit }}
          </p>
          <p>
            <span class="font-medium">🗓 {{isLanguageTigrigna ? "ተመዝገበሉ ዕለት:" : "Registered:"}}</span>
            {{ formatDate(productData.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="errorMessage"
    :class="containerClass"
    class="text-red-600 font-semibold text-center mt-16 text-lg"
  >
    {{ errorMessage }}
  </div>
</template>

<script setup>
import {defineProps, computed, watch,ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useRoute } from 'vue-router';
import { useLanguageStore } from '../../store/languageStore'; 
import { useProduct } from '../../store/useProduct';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
const route = useRoute();
const authStore = useAuthStore();
const productId = route.params.id;
const errorMessage = ref(false);
const props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
  'ml-4': !props.drawerOpen
}));

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const [date] = isoString.split('T');
  return date;
};

const {isLoading:loading,data:productData,isError,error} = useProduct(productId,authStore.token);

watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

</script>

<style scoped>

</style>
