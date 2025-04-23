<template>
  <span
    v-if="loading && !errorMessage"
    class="block loading text-indigo-600 mt-10 mx-auto"
  ></span>

  <div
    v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin"
    :class="containerClass"
    class="overflow-x-auto mt-16 px-8 py-6 rounded-xl shadow-md w-full"
  >
    <table class="min-w-full table-zebra text-sm text-left text-gray-700">
      <thead class="bg-indigo-100 text-gray-800 uppercase text-xs tracking-wider">
        <tr>
          <th class="px-4 py-3">#</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "ምድብ":"Category"}}</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "ምድብ ኣቕሓ ":"Product Category"}}</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "ንኡስ ምድብ ኣቕሓ":"Sub Category"}}</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "ኣቕሓ" : "Product"}}</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "መዐቀኒ" : "Unit"}}</th>
          <th class="px-4 py-3">{{isLanguageTigrigna ? "ቕሩብ በዝሒ" :"Available Qty"}}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="(product, index) in productStore.productData"
          :key="index"
          class="hover:bg-indigo-50 transition-colors"
        >
          <td class="px-4 py-3 font-semibold">{{ index + 1 }}</td>
          <td class="px-4 py-3">{{ product.ProductSubCategory.ProductCategory.Category.name }}</td>
          <td class="px-4 py-3">{{ product.ProductSubCategory.ProductCategory.name }}</td>
          <td class="px-4 py-3">{{ product.ProductSubCategory.name }}</td>
          <td class="px-4 py-3">{{ product.productName }}</td>
          <td class="px-4 py-3">{{ product.measurementUnit }}</td>
          <td class="px-4 py-3 flex items-center gap-2">
            <span>{{ product.ProductDetail.availableQuantity }}</span>
            <font-awesome-icon
              v-if="Number(product.ProductDetail.availableQuantity) <= Number(product.ProductDetail.minimumStockLevel)"
              icon="exclamation-triangle"
              size="sm"
              class="text-red-600"
              title="Stock below minimum level"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p
    v-if="errorMessage"
    :class="containerClass"
    class="text-center text-red-600 font-medium text-lg mt-16"
  >
    {{ errorMessage }}
  </p>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { useLanguageStore } from '../../store/languageStore';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const authStore = useAuthStore();
const productStore = useProductStore();
const response = ref("");
const errorMessage = ref(false);
const loading = ref(true);

const props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
  'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
  'ml-8': !props.drawerOpen,
}));
onMounted(async () => {
  response.value = await productStore.getProductData(authStore.token);
  if (response.value.flag === 1) {
    errorMessage.value = false;
  } else {
    errorMessage.value = response.value.message;
  }
  loading.value = false;
});
</script>

<style scoped>

</style>
