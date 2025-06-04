<template>
    <span v-if="loading0 && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
    <div v-else-if="authStore.isLoggedIn" :class="containerClass"
      class="mt-10 inline-flex flex-col w-full max-w-2xl mx-auto h-full justify-center bg-white rounded-lg shadow-lg p-6 md:p-8 pb-8">
      
    
      <div class="relative mb-4">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="text-center text-lg md:text-2xl font-semibold text-gray-900">
            {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ መሸጣ ፍጠር" : "Create New" }}
          {{ isLanguageTigrigna ? '' : 'Sale' }}
          </h2>
        </div>
        <div v-if="authStore.isAdmin" class="absolute top-0 right-0 p-3 cursor-pointer" @click="closeModal">
          <font-awesome-icon icon="x" size="lg" class="text-gray-500 hover:text-gray-700" />
        </div>
      </div>
  

      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="handleSubmit">
         
          <div>
            <label for="product" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "ኣቕሓ":"Product"}}</label>
            <div class="mt-2">
              <CustomDropdown v-model="formData.productId" :list="productList" />
            </div>
          </div>
  
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "በዝሒ":"Quantity"}}</label>
            <div class="mt-2">
              <input id="quantity" name="quantity" type="text" v-model="formData.quantity" required
                class="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
            </div>
          </div>
  
      
          <div>
            <label for="salePricePerUnit" class="block text-sm font-medium text-gray-900">{{isLanguageTigrigna ? "መሸጢ ዋጋ ናይ ሓንቲ":"Sale Price Per Unit"}}</label>
            <div class="mt-2">
              <input id="salePricePerUnit" name="salePricePerUnit" type="text" v-model="formData.salePricePerUnit" required
                class="block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
            </div>
          </div>
  
      
          <button type="submit" :disabled="loading1"
            class="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
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
                  ? 'መሸጣ ኣዐርይ'
                  : 'Update Sale'
                : isLanguageTigrigna
                  ? 'መሸጣ ፍጠር'
          : 'Create Sale'
          }}
          </button>
        </form>
  
      
        <div v-if="errorMessage" class="mt-4 text-red-600 font-semibold">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mt-4 text-green-600 font-semibold">
          {{isLanguageTigrigna ? 'መሸጣ':'Sale'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
          {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
        </div>
  
        <span v-if="loading1 && !errorMessage && !successMessage"
          class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
      </div>
    </div>
</template>  
<script setup>
import { ref, onMounted, defineProps, computed, } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { useSaleStore } from '../../store/saleStore';
import { useRouter, useRoute } from 'vue-router';
import CustomDropdown from '../../components/dropDownSale.vue';
import { useLanguageStore } from '../../store/languageStore';
import { useQueryClient } from '@tanstack/vue-query';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");

const router = useRouter();
const route = useRoute();
let authStore = useAuthStore();
let productStore = useProductStore();
const saleStore = useSaleStore();
let productList = ref([]);
let formData = ref({
    productId: null,
    quantity: null,
    salePricePerUnit: null
});
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

    await fetchSales();

   }else{

    await fetchProducts();
    
   }
});

async function fetchSales(){
  try{
    let response = await saleStore.getSale(authStore.token, id);
        errorMessage.value = false;
        formData.value = response.data.data;
        response = await productStore.getProductsAlphaNolimit(authStore.token);
        errorMessage.value = false;
        productList.value = productStore.alphaNoLimit;

  }catch(e){
    errorMessage.value = e.message;
  }finally{
    loading0.value = false;
  } 
}

async function fetchProducts(){

    try{
      await productStore.getProductsAlphaNolimit(authStore.token);
      errorMessage.value = false;
      productList.value = productStore.alphaNoLimit;
    }catch(e){
      errorMessage.value = e.message;
    } 
}

async function handleSubmit(){
    if(props.isEditing){
        
        await handleUpdate(); 

    }else{

        await handleCreate();
        
    }
}
const queryClient = useQueryClient();
async function handleCreate(){

    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if (!formData.value.productId) {
        errorMessage.value = "product can't be empty";
    } else {
        formData.value.sellerId = authStore.user.id;
        try{
          await saleStore.createSale(formData.value, authStore.token);
          queryClient.invalidateQueries(['products']);
          queryClient.invalidateQueries(["products_data"]);
          queryClient.invalidateQueries(['top_products_month']);
          queryClient.invalidateQueries(['top_products_quarter']);
          queryClient.invalidateQueries(['top_products_year']);
            successMessage.value = true;
            errorMessage.value = false;
            if(authStore.isAdmin){
              router.push(`/saleList?page=${saleStore.pagination.currentPage}`);
            }
            
        }catch(e){
          errorMessage.value = e.message;
          successMessage.value = false;
        }finally{
          loading1.value = false;
        }

    }

    
}


async function handleUpdate() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if (!formData.value.productId) {
        errorMessage.value = "product can't be empty";
    } else {
        formData.value.sellerId = authStore.id;

        try{
          await saleStore.updateSale(id, {
            productId: formData.value.productId,
            quantity: formData.value.quantity,
            salePricePerUnit: formData.value.salePricePerUnit
        }, authStore.token)
       
          queryClient.invalidateQueries(['products']);
          queryClient.invalidateQueries(["products_data"]);
          queryClient.invalidateQueries(['top_products_month']);
          queryClient.invalidateQueries(['top_products_quarter']);
          queryClient.invalidateQueries(['top_products_year']);
            successMessage.value = true;
            errorMessage.value = false;
            loading1.value = false;
            router.push(`/saleList?page=${saleStore.pagination.currentPage}`);
        }catch(e){
          errorMessage.value = e.message;
          successMessage.value = false;
        }finally{
          loading1.value = false;
        }      
    }

    
}

function closeModal() {
    router.push(`/saleList?page=${saleStore.pagination.currentPage}`);
}
</script>
<style scoped></style>