<template>
    <span v-if="loading0 && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
    
    <div v-else-if="authStore.isLoggedIn && authStore.isAdmin" :class="containerClass"
         class="ml-56 md:ml-60 lg:ml-72 mt-10 flex flex-col w-full max-w-lg mx-auto h-full justify-center bg-white rounded-lg shadow-xl p-6 md:px-8 lg:px-10">
      
      <div class="relative mb-6">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="text-center text-lg md:text-2xl font-semibold text-gray-900">
            {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ንኡስ ምድብ ኣቕሓ ፍጠር" : "Create New" }}
            {{ isLanguageTigrigna ? '' : 'Product Sub Category' }}
          </h2>
        </div>
        
        <div class="absolute top-0 right-0 p-3 cursor-pointer rounded-full hover:bg-gray-200" @click="closeModal">
          <font-awesome-icon icon="x" size="sm" />
        </div>
      </div>
      
      <form class="space-y-6" @submit.prevent="handleSubmit">
        
        <div>
          <label for="name" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "ስም":"Name"}}</label>
          <input id="name" name="name" type="text" v-model="formData.name" required
                 class="block w-full mt-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
        </div>
  
        <div>
          <label for="productCategory" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "ምድብ ኣቕሓ":"Product Category"}}</label>
          <CustomDropdown v-model="formData.productCategoryId" :list="productCategoryList" class="mt-1" />
        </div>
  
        <div>
          <label for="description" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "መግለፂ":"Description"}}</label>
          <textarea id="description" name="description" v-model="formData.description"
                    class="block w-full mt-2 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm">
          </textarea>
        </div>
  
        <div v-if="errorMessage" class="text-red-600 text-sm font-semibold">
          {{ errorMessage }}
        </div>
  
        <div v-if="successMessage" class="text-green-600 text-sm font-semibold">
            {{isLanguageTigrigna ? 'ንኡስ ምድብ ኣቕሓ':'Product Category'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
            {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
        </div>
        
        <div v-if="loading1 && !errorMessage && !successMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></div>
        
        <button type="submit" :disabled="loading1"
                class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                {{loading1
              ? props.isEditing
                ? isLanguageTigrigna
                  ? 'ኣብ ምዕራይ ...'
                  : 'Updating...'
                : isLanguageTigrigna
                  ? 'ይፈጥር ኣሎ..'
                  : 'Creating...'
              : props.isEditing
                ? isLanguageTigrigna
                  ? 'ንኡስ ምድብ ኣቕሓ ኣዐርይ'
                  : 'Update Category'
                : isLanguageTigrigna
                  ? 'ንኡስ ምድብ ኣቕሓ ፍጠር'
          : 'Create Product Category'}}
        </button>
      </form>
    </div>
  </template>
<script setup>
import { ref, onMounted, defineProps, computed, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductSubCategoryStore } from '../../store/productSubCategoryStore';
import { useProductCategoryStore } from '../../store/productCategoryStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
import CustomDropdown from '../../components/dropDown.vue';

let authStore = useAuthStore();
const productSubCategoryStore = useProductSubCategoryStore();
const productCategoryStore = useProductCategoryStore();
let route = useRoute();
let router = useRouter();
let productCategoryList = ref([]);
let formData = ref({
    name:null,
    productCategoryId: null,
    description: null,
})
let response = ref("");
let errorMessage = ref(false);
let successMessage = ref(false);
let props = defineProps(['drawerOpen','isEditing']);
let loading0 = ref(props.isEditing ? true : false);
let loading1 = ref(false);
let id = route.params.id;



const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen
}));

onMounted(async () => {
   if(props.isEditing){
    await fetchProductSubCategory();
   }else{
    await fetchProductCategories();
   }
})
async function fetchProductSubCategory(){
    response.value = await productSubCategoryStore.getProductSubCategory(authStore.token, id);
    if (response.value.flag == 1) {
        errorMessage.value = false;
        formData.value = response.value.data.data;
        if (productCategoryStore.alphaNoLimit.length == 0) {
            response.value = await productCategoryStore.getProductCategoriesAlphaNolimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
        }
        productCategoryList.value = productCategoryStore.alphaNoLimit;
    } else {
        errorMessage.value = response.value.message;
    }
    loading0.value = false;
}

async function fetchProductCategories(){
    if (productCategoryStore.alphaNoLimit.length == 0) {
            response.value = await productCategoryStore.getProductCategoriesAlphaNolimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
        }
        productCategoryList.value = productCategoryStore.alphaNoLimit;
}
function closeModal() {
    router.push('/productSubCategoryList');
}
async function handleSubmit(){
    if(props.isEditing){
        await handleUpdate()
    }
    else{
        await handleCreate();
    }

}
async function handleCreate(){
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if(!formData.value.description){
        formData.value.description = null
    }
    if (!formData.value.productCategoryId) {
        errorMessage.value = "product category can't be empty";
    } else {
        response.value = await productSubCategoryStore.createProductSubCategory(formData.value, authStore.token);
        if (response.value.flag == 1) {
            successMessage.value = true;
            errorMessage.value = false;
            router.push('/productSubCategoryList');
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
    if(!formData.value.description){
        formData.value.description = null
    }
    if (!formData.value.productCategoryId) {
        errorMessage.value = "product category can't be empty";
    } else {
        response.value = await productSubCategoryStore.updateProductSubCategory(id, {
            name: formData.value.name,
            description: formData.value.description,
            productCategoryId: formData.value.productCategoryId
        }, authStore.token);
        if (response.value.flag == 1) {
            successMessage.value = true;
            errorMessage.value = "";
            loading1.value = false;
            router.push('/productSubCategoryList');
        } else {
            errorMessage.value = response.value.message;
            successMessage.value = false;
        }
    }

    loading1.value = false;
}

</script>
<style scoped></style>