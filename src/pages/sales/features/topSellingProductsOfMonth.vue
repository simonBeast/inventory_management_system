<template>
    <span v-if="isLoading && !errorMessage" class="block loading loading-spinner text-primary mt-10 mx-auto"></span>
    <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin" :class="containerClass" class="overflow-x-auto mx-auto mt-10 mr-2 w-4/5 mb-16">
        <h3 class="block mt-2 text-center text-md sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-100 font-bold text-2xl p-3 rounded-md bg-indigo-300">{{isLanguageTigrigna ? "ዓሰርተ ናይዚ ወርሒ ኣዝዮም ተሸየጥቲ ኣቑሑ ":"Top 10 selling Products of the Month"}}</h3>
        <table class="table table-zebra">
            <thead>
                <tr>
                    <th></th>
                    <th>{{isLanguageTigrigna ? "መለለዪ ኣቕሓ":"Product Id"}}</th>
                    <th>{{isLanguageTigrigna ? "ስም ኣቕሓ":"Product Name"}}</th>
                    <th>{{isLanguageTigrigna ? "ጠቕላላ በዝሒ ዝተሸጠ":"Total Quantity Sold"}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                    <th>{{ index + 1}}</th>
                    <td>{{ item.productId }}</td>
                    <td>{{ item.Product.productName }}</td>
                    <td>{{ item.totalQuantitySold}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <p v-if="errorMessage" :class="containerClass" class="ml-56 md:ml-60 lg:ml-72 font-semibold text-red-600 text-center">
        {{ errorMessage }}
    </p>
</template>
<script setup>

import { ref, defineProps, computed, watch, } from 'vue';
import { useAuthStore } from '../../../store/authStore';
import { useLanguageStore } from '../../../store/languageStore';
import { useTopSellingProductMonth } from '../../../store/useSales';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
let authStore = useAuthStore();
let errorMessage = ref(false);

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
    'ml-8': !props.drawerOpen 
}));

const { isLoading, data, isError,error } = useTopSellingProductMonth(authStore.token);


watch([isError, error], ([hasError,err]) => {
  if (hasError) {
    errorMessage.value = err.message || "Something went wrong";
  } else {
    errorMessage.value = "";
  }
});

</script>
<style scoped></style>