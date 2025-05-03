<template>
    <div v-if="(isLoadingProductCategory && !errorMessage) || isLoadingAlpha  " class="flex justify-center mt-10">
      <span class="block loading loading-spinner text-indigo-600"></span>
    </div>
  
    <transition v-else-if="authStore.isLoggedIn && authStore.isAdmin" name="fade-slide" appear>
      <div 
        :class="containerClass"
        class="mt-10 px-4 py-6 bg-white rounded-xl shadow-lg transition-all max-w-xl w-full mx-auto animate-fade-in"
      >

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl md:text-2xl font-semibold text-gray-800 w-full text-center">
            {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ምድብ ኣቕሓ ፍጠር" : "Create New" }}
            {{ isLanguageTigrigna ? '' : 'Product Category' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-red-500 transition duration-200"
          >
            <font-awesome-icon icon="x" size="lg" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">

          <div>
            <label for="name" class="form-label">{{isLanguageTigrigna ? "ስም" : "Name"}}</label>
            <input
              id="name"
              type="text"
              v-model="formData.name"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">{{isLanguageTigrigna? "ምድብ":"Category"}}</label>
            <CustomDropdown v-model="formData.categoryId" :list="categoriesAlphaNoLimit" />
          </div>
  
          <div>
            <label for="color" class="form-label">{{isLanguageTigrigna ? "ሕብሪ":"Color"}}</label>
            <input id="color" type="text" v-model="formData.color" class="form-input" />
          </div>

          <div>
            <label for="code" class="form-label">{{isLanguageTigrigna ? "ቑፅሪ ምድብ ኣቕሓ":"Code"}}</label>
            <input id="code" type="text" v-model="formData.code" class="form-input" />
          </div>
  
          <div>
            <label for="description" class="form-label">{{isLanguageTigrigna ? "መግለፂ ምድብ ኣቕሓ":"Description"}}</label>
            <textarea
              id="description"
              maxlength="35"
              v-model="formData.description"
              class="form-input resize-none"
            ></textarea>
          </div>
  
     
          <button
            type="submit"
            :disabled="loading1"
            class="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition duration-200"
          >
            <span v-if="loading1" class="loading loading-spinner text-white mr-2"></span>
            {{
            loading1
              ? props.isEditing
                ? isLanguageTigrigna
                  ? 'ኣብ ምዕራይ ...'
                  : 'Updating...'
                : isLanguageTigrigna
                  ? 'ይፈጥር ኣሎ..'
                  : 'Creating...'
              : props.isEditing
                ? isLanguageTigrigna
                  ? 'ምድብ ኣቕሓ ኣዐርይ'
                  : 'Update Category'
                : isLanguageTigrigna
                  ? 'ምድብ ኣቕሓ ፍጠር'
          : 'Create Product Category'
          }}
          </button>

          <p v-if="errorMessage" class="text-sm text-red-600 font-medium transition-all">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-sm text-green-600 font-medium transition-all">
            {{isLanguageTigrigna ? 'ምድብ ኣቕሓ':'Product Category'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
            {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
          </p>
        </form>
      </div>
    </transition>
  </template>
  
<script setup>
import { ref,defineProps , computed, watch , } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import CustomDropdown from '../../components/dropDown.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useCategoryAlphaNoLimit } from '../../store/useCategory';
import { useCreateProductCategory, useProductCategory, useUpdateProductCategory } from '../../store/useProductCategory';
import { useQueryClient } from '@tanstack/vue-query';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let authStore = useAuthStore();
let route = useRoute();
let router = useRouter();
let formData = ref({
    name: null,
    categoryId: null,
    description: null,
    color: null,
    code: null,
});
let errorMessage = ref(false);
let successMessage = ref(false);
let props = defineProps(['drawerOpen','isEditing']);
let loading1 = ref(false);
let id = route.params.id;

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen 
}));


const {isLoading: isLoadingAlpha,data: categoriesAlphaNoLimit,isError: isAlphaError, error: alphaError} = useCategoryAlphaNoLimit(authStore.token);


const {isLoading: isLoadingProductCategory, data: productCategory,isError: isErrorProductCategory, error: productCategoryError} = useProductCategory(id,authStore.token);

watch(productCategory,()=>{
  if(productCategory.value && props.isEditing){
    formData.value =  {
      name: productCategory.value.name,
      categoryId: productCategory.value.categoryId,
      description: productCategory.value.description,
      color: productCategory.value.color,
      code: productCategory.value.code,
    }
  }
  
},{immediate:true});

const updateProductCategoryMutation = useUpdateProductCategory(authStore.token);

const createProductCategoryMutation = useCreateProductCategory(authStore.token);

const queryClient = useQueryClient();

function closeModal() {
    router.push('/productCategoryList');
}
async function handleSubmit(){
  console.log("value of formdata",formData.value);
    if(props.isEditing){

        await handleUpdate()

    }else{

        await handleCreate();
    }
}
async function handleCreate(){
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if(!formData.value.code){
        formData.value.code = null
    }
    if(!formData.value.color){
        formData.value.color = null
    }
    if(!formData.value.description){
        formData.value.description = null
    }
    if (!formData.value.categoryId) {
        errorMessage.value = "category can't be empty";
        successMessage.value = false;
    }
    else{
        await createProductCategoryMutation.mutateAsync(formData.value,{
          onSuccess:()=>{
            queryClient.invalidateQueries(['product_categories']);
            queryClient.invalidateQueries(['product_sub_categories']);
            queryClient.invalidateQueries(['product_categories_alpha_no_limit']);
            queryClient.invalidateQueries(["products_data"]);

            successMessage.value = true;
            router.push('/productCategoryList');
          },
          onError:(e)=>{
            errorMessage = e.message;
        },
        onSettled:()=>{
          loading1.value = false;
        }
      });
    }
   
}
async function handleUpdate() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if(!formData.value.code){
        formData.value.code = null
    }
    if(!formData.value.color){
        formData.value.color = null
    }
    if(!formData.value.description){
        formData.value.description = null
    }
    if (!formData.value.categoryId) {
        errorMessage.value = "category can't be empty";
    }else{
      await updateProductCategoryMutation.mutateAsync({id:id,data:
        {
          color: formData.value.color,
          name: formData.value.name,
          description: formData.value.description,
          code: formData.value.code,
          categoryId: formData.value.categoryId
        }
    },{
      onSuccess:()=>{
        queryClient.invalidateQueries(['product_categories']);
        queryClient.invalidateQueries(['product_sub_categories']);
        queryClient.invalidateQueries(['product_categories_alpha_no_limit']);
        queryClient.invalidateQueries(["products_data"]);
        successMessage.value = true;
      },
      onError:(e)=>{
        errorMessage.value = e.message;
      },
      onSettled:()=>{
        loading1.value = false;
      }
    });
  }
}

</script>
<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply block w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>