<template>
    <div v-if="!errorMessage && authStore.isLoggedIn" class="overflow-x-auto mx-auto mt-5 mr-10 w-2/3 mb-16">
        <h3 class="inline-block mt-2 mb-8 pt-2  text-gray-600  font-bold text-2xl">{{isLanguageTigrigna ? "ርብዒ ዓመታዊ ጠቕላላ መሸጣን ትርፍን":"Quarterly Total Sales and Profits Of Products"}}</h3>
        <table class="table table-zebra">
            <thead>
                <tr>
                    <th></th>
                    <th>{{isLanguageTigrigna ? "ስም ኣቕሓ": "Product Name"}}</th>
                    <th>{{isLanguageTigrigna ? "ጠቕላላ ዝተሸጠ በዝሒ": "Total Quantity Sold"}}</th>
                    <th>{{isLanguageTigrigna ? "ጠቕላላ ዝተሸጠ": "Total Sales"}}</th>
                    <th>{{isLanguageTigrigna ? "ጠቕላላ ወፃኢ": "Total Cost"}}</th>
                    <th>{{isLanguageTigrigna ? "ትርፊ": "Profit"}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in saleStore.totalSalesAndProfitsOfQuarter" :key="index">
                    <th>{{ index + 1}}</th>
                    <td>{{ item.Product.productName }}</td>
                    <td>{{ item.totalQuantitySold}}</td>
                    <td>{{ item.totalSales }}</td>
                    <td>{{ item.totalCost }}</td>
                    <td>{{ item.profit }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <p v-if="errorMessage" class="font-semibold text-red-600 text-center">
        {{ errorMessage }}
    </p>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../store/authStore';
import { useSaleStore } from '../../../store/saleStore';
import { useLanguageStore } from '../../../store/languageStore';
const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(() => languageStore.languagePreference == "ti");
let authStore = useAuthStore();
let saleStore = useSaleStore();
let response = ref("");
let totalSalesAndProfitsOfQuarter = ref([]);

let errorMessage = ref(false);


onMounted(async () => {
    if (saleStore.totalSalesAndProfitsOfQuarter.length == 0) {
        response.value = await saleStore.getTotalSalesAndProfitsOfQuarter(authStore.token,1,20);
        if (response.value.flag == 1) {
            errorMessage.value = false;
            totalSalesAndProfitsOfQuarter.value = response.value.data.data;
        } else {
            errorMessage.value = response.value.message;
        }
    }
    else{
        totalSalesAndProfitsOfQuarter.value = saleStore.totalSalesAndProfitsOfQuarter;
    }

})

</script>
<style scoped></style>