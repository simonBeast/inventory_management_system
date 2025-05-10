<template>
    <span v-if="(isLoadingProductSubCategory && !errorMessage) || isLoadingAlpha  " class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
    
    <div v-else-if="authStore.isLoggedIn && authStore.isAdmin" :class="containerClass"
         class="ml-56 md:ml-60 lg:ml-72 mt-10 flex flex-col w-full max-w-lg mx-auto h-full justify-center bg-white rounded-lg shadow-xl p-6 md:px-8 lg:px-10">
      
      <div class="relative mb-6">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="text-center text-lg md:text-2xl font-semibold text-gray-900">
            {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ንኡስ ምድብ ኣቕሓ ፍጠር" : "Create " }}
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
          <CustomDropdown v-model="formData.productCategoryId" :list="productCategoriesAlphaNoLimit" class="mt-1" />
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
import { ref, defineProps, computed, watch, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
import CustomDropdown from '../../components/dropDown.vue';
import { useProductCategoryAlphaNoLimit } from '../../store/useProductCategory';
import { useCreateProductSubCategory, useProductSubCategory, useUpdateProductSubCategory } from '../../store/useProductSubCategory';
import { useQueryClient } from '@tanstack/vue-query';

let authStore = useAuthStore();
let route = useRoute();
let router = useRouter();
let formData = ref({
    name:null,
    productCategoryId: null,
    description: null,
})
let errorMessage = ref(false);
let successMessage = ref(false);
let props = defineProps(['drawerOpen','isEditing']);
let loading1 = ref(false);
let id = route.params.id;

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen
}));

const {isLoading: isLoadingAlpha,data: productCategoriesAlphaNoLimit,isError: isAlphaError, error: alphaError} = useProductCategoryAlphaNoLimit(authStore.token);

const {isLoading: isLoadingProductSubCategory, data: productSubCategory,isError: isErrorProductSubCategory, error: productSubCategoryError} = useProductSubCategory(id,authStore.token);


watch(productSubCategory,()=>{

  if(productSubCategory.value && props.isEditing){
    formData.value =  {
      name: productSubCategory.value.name,
      productCategoryId: productSubCategory.value.productCategoryId,
      description: productSubCategory.value.description,
    }
  }

},{immediate:true});

const updateProductSubCategoryMutation = useUpdateProductSubCategory(authStore.token);

const createProductSubCategoryMutation = useCreateProductSubCategory(authStore.token);

const queryClient = useQueryClient();

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
       await createProductSubCategoryMutation.mutateAsync(formData.value,{
        onSuccess:()=>{
          successMessage.value = true;
          queryClient.invalidateQueries(["product_sub_categories"]);
          queryClient.invalidateQueries(['products']);
          queryClient.invalidateQueries(['product_sub_categories_alpha_no_limit']);
          queryClient.invalidateQueries(["products_data"]);
        },
        onError: (e)=>{
          errorMessage.value = e.message;
        },
        onSettled:()=>{
         loading1.value = false; 
        }
       })
    }
    
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
      await updateProductSubCategoryMutation.mutateAsync({ id:id , data:formData.value },{
        onSuccess:()=>{
          successMessage.value = true;
          queryClient.invalidateQueries(["product_sub_categories"]);
          queryClient.invalidateQueries(['products']);
          queryClient.invalidateQueries(['product_sub_categories_alpha_no_limit']);
          queryClient.invalidateQueries(["products_data"]);
        },
        onError: (e)=>{
          errorMessage.value = e.message;
        },
        onSettled:()=>{
         loading1.value = false; 
        }
       })
    }
}

</script>
<style scoped></style>