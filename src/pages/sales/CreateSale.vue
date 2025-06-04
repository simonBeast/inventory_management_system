
<template>
  <span v-if="loading1 && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
  <div v-else-if="authStore.isLoggedIn" class="mt-10 mx-auto w-4/5 md:w-2/5  bg-white rounded-lg shadow-lg p-6 md:p-8">
    <h2 class="text-center text-2xl font-semibold text-gray-900 mb-6">
      {{ isLanguageTigrigna ? "ሓዱሽ መሸጣ ፍጠር" : "Create New Sale" }}
    </h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-900">{{ isLanguageTigrigna ? "ኣቕሓ" : "Product" }}</label>
        <CustomDropdown v-model="tempProduct.productId" :list="products" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900">{{ isLanguageTigrigna ? "በዝሒ" : "Quantity" }}</label>
        <input v-model.number="tempProduct.quantity" type="number"
          class="w-full rounded border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-900">{{ isLanguageTigrigna ? "ዋጋ ናይ ሓንቲ" : "Unit Price" }}</label>
        <input v-model.number="tempProduct.salePricePerUnit" type="number"
          class="w-full rounded border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300" />
      </div>

      <button @click="addProduct" type="button"
        class="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-500">
        {{ isLanguageTigrigna ? "ኣእትው" : "Add Product" }}
      </button>
    </div>

    <div v-if="formData.products.length > 0" class="mt-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">
        {{ isLanguageTigrigna ? "ዝተመረፁ ኣቕሓት" : "Selected Products" }}
      </h3>
      <ul class="space-y-2">
        <li v-for="(product, index) in formData.products" :key="index"
          class="flex justify-between items-center border rounded p-2">
          <span>
            {{ getProductLabel(product.productId) }} -
            Qty: {{ product.quantity }},
            Price: {{ product.salePricePerUnit }}
          </span>
          <button @click="removeProduct(index)" class="text-red-500 hover:text-red-700 text-sm">✕</button>
        </li>
      </ul>
    </div>

    <button @click="handleSubmit" :disabled="loading" class="w-full mt-6 py-2 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
      {{ loading ? (isLanguageTigrigna ? 'በጽሒ...' : 'Submitting...') : (isLanguageTigrigna ? 'መሸጣ ፍጠር' : 'Create Sale') }}
    </button>

    <div v-if="errorMessage" class="mt-4 text-red-600 font-semibold">{{ errorMessage }}</div>
    <div v-if="successMessage" class="mt-4 text-green-600 font-semibold">
      {{ isLanguageTigrigna ? 'መሸጣ ተፈጢሩ ኣሎ' : 'Sale created successfully!' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductsAlphaNoLimit } from '../../store/useProduct';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { useQueryClient } from '@tanstack/vue-query';
import CustomDropdown from '../../components/dropDownSale.vue';
import { useSaleStore } from '../../store/saleStore';


const authStore = useAuthStore();
const languageStore = useLanguageStore();
const queryClient = useQueryClient();
const saleStore = useSaleStore();

const isLanguageTigrigna = computed(() => languageStore.languagePreference === 'ti');

const tempProduct = ref({
  productId: null,
  quantity: null,
  salePricePerUnit: null
});

const {isLoading:loading1,data:products} = useProductsAlphaNoLimit(authStore.token);

const formData = ref({
  products: []
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');


function addProduct() {
  const { productId, quantity, salePricePerUnit } = tempProduct.value;

  if (!productId || !quantity || !salePricePerUnit) {
    errorMessage.value = isLanguageTigrigna.value ? "ኩሉ መረጃ ሙሉእ ክኸውን ኣለዎ" : "Please fill all product fields.";
    return;
  }

  formData.value.products.push({ ...tempProduct.value });
  tempProduct.value = { productId: null, quantity: null, salePricePerUnit: null };
  errorMessage.value = '';
}

function removeProduct(index) {
  formData.value.products.splice(index, 1);
}

function getProductLabel(productId) {
  const product = products.value.find(p => p.id === productId);
  return product ? product.productName : 'Unknown';
}

async function handleSubmit() {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  if (formData.value.products.length === 0) {
    errorMessage.value = isLanguageTigrigna.value ? "ኣብዚ መሸጣ ኣቕሓ የለን።" : "No products added.";
    loading.value = false;
    return;
  }

  const payload = {
    sellerId: authStore.user.id,
    products: formData.value.products
  };

  try {
    await saleStore.createSales(payload,authStore.token);
    successMessage.value = true;
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(["products_data"]);
    queryClient.invalidateQueries(['top_products_month']);
    queryClient.invalidateQueries(['top_products_quarter']);
    queryClient.invalidateQueries(['top_products_year']);
    queryClient.invalidateQueries(['transaction_history']);

    formData.value.products = [];
  } catch (e) {
    errorMessage.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>
