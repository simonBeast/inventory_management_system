<template>
    <div v-if="loading0 && !errorMessage" class="flex justify-center mt-10">
      <span class="loading loading-spinner text-indigo-600"></span>
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
            <CustomDropdown v-model="formData.categoryId" :list="categoryList" />
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
import { ref, onMounted, defineProps , computed , } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '../../store/categoryStore';
import { useProductCategoryStore } from '../../store/productCategoryStore';
import { useAuthStore } from '../../store/authStore';
import CustomDropdown from '../../components/dropDown.vue';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

let authStore = useAuthStore();
const categoryStore = useCategoryStore();
const productCategoryStore = useProductCategoryStore();
let route = useRoute();
let router = useRouter();
let categoryList = ref([]);
let formData = ref({
    name: null,
    categoryId: null,
    description: null,
    color: null,
    code: null,
})
let response = ref("");
let errorMessage = ref(false);
let successMessage = ref(false);
let props = defineProps(['drawerOpen','isEditing']);
let loading0 = ref(props.isEditing ? true: false);
let loading1 = ref(false);
let id = route.params.id;



const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen 
}));

onMounted(async () => {
    if(props.isEditing){
        await fetchProductCategory();
    }else{
        await fetchCategories();
    }
})

async function fetchProductCategory(){
    response.value = await productCategoryStore.getProductCategory(authStore.token, id);
    if (response.value.flag == 1) {
        errorMessage.value = false;
        formData.value = response.value.data.data;
        if (categoryStore.alphaNoLimit.length == 0) {
            response.value = await categoryStore.getCategoriesAlphaNoLimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
        }
        categoryList.value = categoryStore.alphaNoLimit;
    } else {
        errorMessage.value = response.value.message;
    }
    loading0.value = false;
}
async function fetchCategories(){
    if (categoryStore.alphaNoLimit.length == 0) {
            response.value = await categoryStore.getCategoriesAlphaNoLimit(authStore.token);
            if (response.value.flag == 1) {
                errorMessage.value = false;
            } else {
                errorMessage.value = response.value.message;
            }
        }
        categoryList.value = categoryStore.alphaNoLimit;
}
function closeModal() {
    router.push('/productCategoryList');
}
async function handleSubmit(){
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
        response.value = await productCategoryStore.createProductCategory(formData.value, authStore.token);
    if (response.value.flag == 1) {
        successMessage.value = true;
        errorMessage.value = false;
        loading1.value = false;
        router.push('/productCategoryList');
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
        response.value = await productCategoryStore.updateProductCategory(id, {
        color: formData.value.color,
        name: formData.value.name,
        description: formData.value.description,
        code: formData.value.code,
        categoryId: formData.value.categoryId
    }, authStore.token);
    if (response.value.flag == 1) {
        successMessage.value = true;
        errorMessage.value = "";
        loading1.value = false;
        router.push('/productCategoryList');
    } else {
        errorMessage.value = response.value.message;
        successMessage.value = false;
    }
    }
    loading1.value = false;
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