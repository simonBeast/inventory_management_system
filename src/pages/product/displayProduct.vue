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
        <h2 class="text-2xl font-semibold text-gray-800 mb-1">{{ product.productName }}</h2>
        <p class="text-gray-600 text-sm italic">{{ product.productDescription }}</p>
      </div>

      <div class="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2 text-gray-800 text-sm">
          <p><span class="font-medium">📦 {{isLanguageTigrigna ? "ኣቕሓ ቑፅሪ:" : "Product Code:"}}</span> {{ product.productCode }}</p>
          <p><span class="font-medium">🗂 {{isLanguageTigrigna ? "ንኡስ ምድብ ኣቕሓ:" : "Sub Category:"}}</span> {{ product.ProductSubCategory.name }}</p>
          <p><span class="font-medium">📏 {{isLanguageTigrigna ?  "መዐቀኒ:" : "Unit:"}}</span> {{ product.measurementUnit }}</p>
          <p><span class="font-medium">💰 {{isLanguageTigrigna ? "ዋጋ:" : "Price:"}}</span> {{ product.pricePerUnit }} Birr</p>
        </div>

        <div class="space-y-2 text-gray-800 text-sm">
          <p>
            <span class="font-medium">📊 {{isLanguageTigrigna ? "ቅሩብ:":"Available:"}}</span>
            {{ product.ProductDetail.availableQuantity }} {{ product.measurementUnit }}
          </p>
          <p>
            <span class="font-medium">⚠️ {{isLanguageTigrigna ? "ዝተሓተ ስቶክ:" : "Min Stock:"}}</span>
            {{ product.ProductDetail.minimumStockLevel }} {{ product.measurementUnit }}
          </p>
          <p>
            <span class="font-medium">🗓 {{isLanguageTigrigna ? "ተመዝገበሉ ዕለት:" : "Registered:"}}</span>
            {{ formatDate(product.createdAt) }}
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
import { ref, onMounted, defineProps, computed } from 'vue';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';
import { useRoute } from 'vue-router';
import { useLanguageStore } from '../../store/languageStore';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const productStore = useProductStore();
const route = useRoute();
const authStore = useAuthStore();
const product = ref(null);
const loading = ref(true);
const response = ref(null);
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

onMounted(async () => {
  response.value = await productStore.getProduct(authStore.token, productId);
  if (response.value.flag === 1) {
    product.value = productStore.singleProduct || response.value.data.data;
    errorMessage.value = false;
  } else {
    errorMessage.value = response.value.message || 'Something went wrong.';
  }
  loading.value = false;
});
</script>

<style scoped>

</style>
