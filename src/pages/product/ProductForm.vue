<template>
   
    <span v-if="loading0 && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
  
    <div
      v-else-if="authStore.isLoggedIn && authStore.isAdmin"
      :class="containerClass"
      class="ml-56 md:ml-60 lg:ml-72 mt-6 w-full max-w-3xl mx-auto px-4 py-6 bg-white rounded-lg shadow-lg transition-all"
    >
     
      <div class="relative flex justify-between items-center mb-6">
        <h2 class="text-xl md:text-2xl font-semibold text-center w-full text-gray-800">

          {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ኣቕሓ ፍጠር" : "Create New" }}
          {{ isLanguageTigrigna ? '' : 'Product' }}
        </h2>
        <button
          class="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          @click="closeModal"
          title="Close"
        >
          <font-awesome-icon icon="x" />
        </button>
      </div>
  
      
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         
          <div>
            <label for="productName" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ስም ኣቕሓ":"Product Name"}}</label>
            <input
              id="productName"
              v-model="formData.productName"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label for="productCode" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna? "ቑፅሪ ኣቕሓ ":"Product Code"}}</label>
            <input
              id="productCode"
              v-model="formData.productCode"
              type="text"
              class="input input-bordered w-full mt-1"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ንኡስ ምድብ ኣቕሓ":"Product Sub Category"}}</label>
            <CustomDropdown v-model="formData.productSubCategoryId" :list="productSubCategoryList" required class="mt-1"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መዐቀኒ" : "Measurement Unit"}}</label>
            <select v-model="formData.measurementUnit" required class="select select-bordered w-full mt-1">
              <option disabled selected value="">Select unit</option>
              <option value="pieces">{{isLanguageTigrigna ? "ንፅል":"Pieces"}}</option>
              <option value="kilo">{{isLanguageTigrigna ? "ኪሎ":"Kilo"}}</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ዋጋ ብ መዐቀኒ":"Price Per Unit"}}</label>
            <input
              v-model="formData.pricePerUnit"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ቕሩብ በዝሒ":"Available Quantity"}}</label>
            <input
              v-model="formData.availableQuantity"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ዝነኣሰ ናይ ስቶክ መጠን":"Minimum Stock Level"}}</label>
            <input
              v-model="formData.minimumStockLevel"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>
     <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መግለፂ ኣቕሓ":"Product Description"}}</label>
            <textarea
              v-model="formData.productDescription"
              class="textarea textarea-bordered w-full mt-1"
              rows="3"
            ></textarea>
          </div>
        </div>
  

        <button
          type="submit"
          :disabled="loading1"
          class="btn btn-primary w-full mt-4"
        >
          {{  loading1
              ? props.isEditing
                ? isLanguageTigrigna
                  ? 'ኣብ ምዕራይ ...'
                  : 'Updating...'
                : isLanguageTigrigna
                  ? 'ይፈጥር ኣሎ..'
                  : 'Creating...'
              : props.isEditing
                ? isLanguageTigrigna
                  ? 'ኣቕሓ ኣዐርይ'
                  : 'Update Product'
                : isLanguageTigrigna
                  ? 'ኣቕሓ ፍጠር'
          : 'Create Product'}}
        </button>
      </form>

      <form
        v-if="props.isEditing"
        class="mt-6 border-t border-gray-200 pt-4 space-y-4"
        @submit.prevent="handleAddNewStock"
      >
        <h3 class="text-md font-semibold text-gray-800">{{ isLanguageTigrigna ? "ሓዱሽ ስቶክ ኣእትው": "Add New Stock"}}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ዋጋ ብ መዐቀኒ" :"Price Per Unit"}}</label>
            <input
              v-model="newStock.pricePerUnit"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "በዝሒ":"Quantity"}}</label>
            <input
              v-model="newStock.quantity"
              type="text"
              required
              class="input input-bordered w-full mt-1"
            />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-accent w-full md:w-1/3"
          :disabled="loading1"
        >
          {{isLanguageTigrigna ? "ሓዱሽ ስቶክ ኣእትው" : "Add New Stock"}}
        </button>
      </form>
  
      <div v-if="errorMessage" class="mt-4 text-sm text-red-600 font-medium">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mt-4 text-sm text-green-600 font-medium">
        {{isLanguageTigrigna ? 'ኣቕሓ':'Product'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
        {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
      </div>

      <span
        v-if="loading1 && !errorMessage && !successMessage"
        class="block loading loading-spinner text-primary mt-6 mx-auto"
      ></span>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, defineProps, computed, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../../store/productStore';
import { useProductSubCategoryStore } from '../../store/productSubCategoryStore';
import { useAuthStore } from '../../store/authStore';
import CustomDropdown from '../../components/dropDown.vue';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let authStore = useAuthStore();
const productStore = useProductStore();
const productSubCategoryStore = useProductSubCategoryStore();
let route = useRoute();
let router = useRouter();
let productSubCategoryList = ref([]);
let formData = ref({
    productName: null,
    productCode: null,
    productSubCategoryId: null,
    measurementUnit: null,
    pricePerUnit: null,
    productDescription: null,
    availableQuantity: null,
    minimumStockLevel: null,
});
let newStock = ref({
    pricePerUnit: null,
    quantity: null,
});
let response = ref("");
let errorMessage = ref(false);
let successMessage = ref(false);
let props = defineProps(['drawerOpen','isEditing']);
let loading0 = ref( props.isEditing ? true : false );
let loading1 = ref(false);
let id = route.params.id;



const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
    'ml-8': !props.drawerOpen
}));

onMounted(async () => {
   if(props.isEditing){

    await fetchProducts();

   }else{

    await fetchProductSubCategoriesOnCreate();

   }
});

async function fetchProducts(){
    response.value = await productStore.getProduct(authStore.token, id);
    if (response.value.flag == 1) {
        errorMessage.value = false;
        formData.value = response.value.data.data;
        if (response.value.data.data.ProductDetail) {
            formData.value.availableQuantity = response.value.data.data.ProductDetail.availableQuantity;
            formData.value.minimumStockLevel = response.value.data.data.ProductDetail.minimumStockLevel;
        }
        if (productSubCategoryStore.alphaNoLimit.length == 0) {
            response.value = await productSubCategoryStore.getProductSubCategoriesAlphaNoLimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
        }
       
        productSubCategoryList.value = productSubCategoryStore.alphaNoLimit;
    } else {
        errorMessage.value = response.value.message;
    }
    loading0.value = false;
}
async function fetchProductSubCategoriesOnCreate(){
    if (productSubCategoryStore.alphaNoLimit.length == 0) {
            response.value = await productSubCategoryStore.getProductSubCategoriesAlphaNoLimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
            productSubCategoryList.value = productSubCategoryStore.alphaNoLimit;
        }
}
async function handleSubmit(){

    if(props.isEditing){

        handleUpdate();

    }else{

        handleCreate();

    }


}
async function handleCreate(){
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if(!formData.value.productDescription){
        formData.value.productDescription = null
    }
    if(!formData.value.productCode){
        formData.value.productCode = null
    }
    if (!formData.value.productSubCategoryId) {
        errorMessage.value = "product sub category can't be empty";
    } else {
        response.value = await productStore.createProduct(formData.value, authStore.token);
        if (response.value.flag == 1) {
            successMessage.value = true;
            errorMessage.value = false;
           
            router.push(`/productList?page=${productStore.pagination.currentPage}`);
        } else {
            errorMessage.value = response.value.message;
            successMessage.value = false;
        }
    }
    loading1.value = false;
}
async function handleUpdate() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if (!formData.value.productDescription) {
        formData.value.productDescription = null
    }
    if (!formData.value.productCode) {
        formData.value.productCode = null
    }
    if (!formData.value.productSubCategoryId) {
        errorMessage.value = "product sub category can't be empty";
    } else {
        response.value = await productStore.updateProduct(id, {
            productName: formData.value.productName,
            productCode: formData.value.productCode,
            productSubCategoryId: formData.value.productSubCategoryId,
            measurementUnit: formData.value.measurementUnit,
            pricePerUnit: formData.value.pricePerUnit,
            productDescription: formData.value.productDescription,
            availableQuantity: formData.value.availableQuantity,
            minimumStockLevel: formData.value.minimumStockLevel,
        }, authStore.token);
        if (response.value.flag == 1) {
            successMessage.value = true;
            errorMessage.value = false;
            loading1.value = false;
            router.push(`/productList?page=${route.query.page}`);
        } else {
            errorMessage.value = response.value.message;
            successMessage.value = false;

        }

        loading1.value = false;
    }
    loading1.value = false;
}
async function handleAddNewStock() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if (!newStock.value.pricePerUnit) {
        newStock.value.pricePerUnit = null
    }
    if (!newStock.value.availableQuantity) {
        newStock.value.availableQuantity = null
    }
    if (!newStock.value.pricePerUnit && !newStock.value.availableQuantity) {
        errorMessage.value = "quantity and price per unit can't be empty";
    } else {
        response.value = await productStore.addNewStock(id, {
            pricePerUnit: newStock.value.pricePerUnit,
            quantity: newStock.value.quantity,

        }, authStore.token);
        if (response.value.flag == 1) {
            errorMessage.value = false;
            loading1.value = false;
            router.push(`/productList?page=${productStore.pagination.currentPage}`);
        } else {
            errorMessage.value = response.value.message;
            successMessage.value = false;
        }

        loading1.value = false;
    }
    loading1.value = false;
}
function closeModal() {
    router.push(`/productList?page=${productStore.pagination.currentPage}`);
}
</script>
<style scoped></style>