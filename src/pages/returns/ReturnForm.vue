<template>

    <span
      v-if="loading0 && !errorMessage"
      class="block loading loading-spinner text-primary mt-6 mx-auto"
    ></span>

    <div
      v-else-if="authStore.isLoggedIn && authStore.isAdmin"
      :class="containerClass"
      class="ml-56 md:ml-60 lg:ml-72 mt-6 w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200"
    >

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-800">
          {{ props.isEditing ? isLanguageTigrigna ? "ኣዐርይ" : "Edit" : isLanguageTigrigna ? "ሓዱሽ ተመላሲ ፍጠር" : "Create New" }}
          {{ isLanguageTigrigna ? '' : 'Return' }}
        </h2>
        <button
          @click="closeModal"
          class="p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
        >
          <font-awesome-icon icon="x" size="lg" />
        </button>
      </div>
  
      <form @submit.prevent="handleSubmit" class="space-y-5 animate-fadeIn">
     
        <div>
          <label for="saleId" class="block text-sm font-medium text-gray-700">{{ isLanguageTigrigna ? "ሽያጥ ቑፅሪ":"Sale ID" }}</label>
          <input
            id="saleId"
            type="text"
            v-model="formData.saleId"
            required
            class="input input-bordered w-full mt-1"
          />
        </div>

        <div>
          <label for="quantityReturned" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna? "በዝሒ ልተመለሰ":"Quantity Returned"}}</label>
          <input
            id="quantityReturned"
            type="number"
            min="1"
            v-model="formData.quantityReturned"
            required
            class="input input-bordered w-full mt-1"
          />
        </div>
  
        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ምኽንያት":"Reason"}}</label>
          <select
            id="reason"
            v-model="formData.reason"
            required
            class="select select-bordered w-full mt-1"
          >
            <option disabled selected value="">Select reason</option>
            <option value="damagedProduct">{{isLanguageTigrigna ? "ዝተጎድአ ኣቅሓ":"Damaged Product"}}</option>
            <option value="unwantedItem">{{isLanguageTigrigna ? "ዘይተደለየ ኣቕሓ":"Unwanted Item"}}</option>
            <option value="wrongSize">{{isLanguageTigrigna ? "ዝተጋገየ ዓቐን":"Wrong Size"}}</option>
          </select>
        </div>

        <div>
          <label for="returnStatus" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "ናይ ምምላስ ኩነታት":"Return Status"}}</label>
          <select
            id="returnStatus"
            v-model="formData.returnStatus"
            required
            class="select select-bordered w-full mt-1"
          >
            <option disabled selected value="">Select status</option>
            <option value="received">{{isLanguageTigrigna ? "ተቐቢሉ":"Received"}}</option>
            <option value="inspected">{{isLanguageTigrigna ? "ተመርሚሩ":"Inspected"}}</option>
            <option value="restocked">{{ isLanguageTigrigna ? "ዳግማይ ተቐሚጡ" : "Restocked"}}</option>
            <option value="refunded">{{isLanguageTigrigna ? "ሒሳብ ተመሊሱ":"Refunded"}}</option>
          </select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">{{isLanguageTigrigna ? "መግለፂ":"Description"}}</label>
          <textarea
            id="description"
            rows="3"
            v-model="formData.description"
            class="textarea textarea-bordered w-full mt-1"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading1"
          class="btn btn-primary w-full mt-3"
        >
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
                  ? 'ተመላሲ ኣዐርይ'
                  : 'Update Return'
                : isLanguageTigrigna
                  ? 'ተመላሲ ፍጠር'
          : 'Create Return'
          }}
        </button>
  
        <div v-if="errorMessage" class="text-red-600 mt-2 flex items-center gap-2">
          <font-awesome-icon icon="exclamation-triangle" />
          <span>{{ errorMessage }}</span>
        </div>
  
        <div v-if="successMessage" class="text-green-600 mt-2 flex items-center gap-2">
          <font-awesome-icon icon="check-circle" />
          {{isLanguageTigrigna ? 'ተመላሲ':'Return'}} {{ props.isEditing ? isLanguageTigrigna ? 'ተዓርዩ': "updated" : isLanguageTigrigna ? 'ተፈጢሩ' : "created" }} 
          {{isLanguageTigrigna? 'ኣሎ':'successfully!'}}
        </div>
  
        <span
          v-if="loading1 && !errorMessage && !successMessage"
          class="block loading loading-spinner text-primary mt-4 mx-auto"
        ></span>
      </form>
    </div>
  </template>
  

<script setup>

import { ref, onMounted, defineProps, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReturnStore } from '../../store/returnStore';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");


const authStore = useAuthStore();
const returnStore = useReturnStore();
const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const productList = ref([]);
const formData = ref({
    saleId: null,
    quantityReturned: 0,
    reason: null,
    returnStatus: null,
    description: null,
});
const response = ref("");
const errorMessage = ref(false);
const successMessage = ref(false);
const returnId = route.params.id;
let props = defineProps(['drawerOpen',"isEditing"]);
let loading0 = ref(props.isEditing ? true : false);
let loading1 = ref(false);



const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen
}));
onMounted(async () => {

    if(props.isEditing){
        await fetchReturns();
    }

});

async function fetchReturns(){
    response.value = await returnStore.getReturn(authStore.token, returnId);
    if (response.value.flag == 1) {
        formData.value = response.value.data.data;
    } else {
        errorMessage.value = response.value.message;
    }
    loading0.value = false;
}
async function handleSubmit(){

    if(props.isEditing){
        await handleUpdate();
    }else{
        await handleCreate();
    }
}
async function handleCreate(){
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;

    if(!formData.value.reason){
        formData.value.reason = null; 
    }
    if(!formData.value.returnStatus){
        formData.value.returnStatus = null; 
    }
    if(!formData.value.description){
        formData.value.description = null; 
    }
    
    response.value = await returnStore.createReturn(formData.value, authStore.token);
    if (response.value.flag == 1) {
        successMessage.value = true;
        errorMessage.value = false;
        router.push(`/returnList?page=${returnStore.pagination.currentPage}`);
    } else {
        errorMessage.value = response.value.message;
        successMessage.value = false;
    }
    loading1.value = false;
}
async function handleUpdate() {
    loading1.value = true;
    successMessage.value = false;
    errorMessage.value = false;
    if(!formData.value.reason){
        formData.value.reason = null; 
    }
    if(!formData.value.returnStatus){
        formData.value.returnStatus = null; 
    }
    if(!formData.value.description){
        formData.value.description = null; 
    }
    response.value = await returnStore.updateReturn(returnId, {
        saleId: formData.value.saleId,
        quantityReturned: formData.value.quantityReturned,
        reason: formData.value.reason,
        returnStatus: formData.value.returnStatus,
        description: formData.value.description
    }, authStore.token);
    if (response.value.flag == 1) {
        successMessage.value = true;
        errorMessage.value = false;
        loading1.value = false;
        router.push(`/returnList?page=${returnStore.pagination.currentPage}`);
    } else {
        errorMessage.value = response.value.message;
        successMessage.value = false;
    }
    loading1.value = false;
}

function closeModal() {
    router.push(`/returnList?page=${returnStore.pagination.currentPage}`);
}
</script>

<style scoped></style>
