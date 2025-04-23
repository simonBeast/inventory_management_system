<template>
    <span v-if="loading && !errorMessage" class="block loading loading-spinner text-primary mt-6 mx-auto"></span>
    <div v-else-if="!errorMessage && authStore.isLoggedIn && authStore.isAdmin" :class="containerClass"
        class="overflow-x-auto mx-auto mt-5 mr-2 w-4/5 mb-16">
        <h3
            class="block mt-2 text-center text-md sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-300 font-bold text-2xl p-3 rounded-md bg-indigo-500">
            {{isLanguageTigrigna ? "ዓሰርተ ናይዚ ርብዒ ዓመት ኣዝዮም ተሸየጥቲ ኣቑሑ ":"Top 10 selling Products of the Quarter"}}</h3>
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
                <tr v-for="(item, index) in saleStore.topSellingProductsOfQuarter" :key="index">
                    <th>{{ index + 1 }}</th>
                    <td>{{ item.productId }}</td>
                    <td>{{ item.Product.productName }}</td>
                    <td>{{  item.totalQuantitySold}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <p v-if="errorMessage" :class="containerClass" class="ml-56 md:ml-60 lg:ml-72 font-semibold text-red-600 text-center">
        {{ errorMessage }}
    </p>
</template>
<script setup>

import { ref, onMounted,defineProps, computed, } from 'vue';
import { useAuthStore } from '../../../store/authStore';
import { useSaleStore } from '../../../store/saleStore';
import { useLanguageStore } from '../../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
let authStore = useAuthStore();
let saleStore = useSaleStore();
let response = ref("");
let topSellingProductsOfQuarter = ref([]);
let loading = ref(true);
let errorMessage = ref(false);

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72': props.drawerOpen,
    'ml-8': !props.drawerOpen 
}));

onMounted(async () => {
    if (saleStore.topSellingProductsOfQuarter.length == 0) {
        response.value = await saleStore.getTopSellingProductsOfQuarter(authStore.token);
        if (response.value.flag == 1) {
            errorMessage.value = false;
            topSellingProductsOfQuarter.value = response.value.data.data;
        } else {
            errorMessage.value = response.value.message;
        }
    }
    else {
        topSellingProductsOfQuarter.value = saleStore.topSellingProductsOfQuarter;
    }
    loading.value = false;
})



</script>
<style scoped></style>