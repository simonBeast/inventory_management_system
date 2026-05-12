<template>
    <div :class="containerClass" class="m-4 flex flex-col gap-2">
        <topSellingProductsOfMonth/>
        <topSellingProductsOfQuarter />
        <topSellingProductsOfYear />
    </div>
    
</template>
<script setup>
import { defineProps, computed, } from 'vue';
import topSellingProductsOfMonth from './topSellingProductsOfMonth.vue';
import topSellingProductsOfQuarter from './topSellingProductsOfQuarter.vue';
import topSellingProductsOfYear from './topSellingProductsOfYear.vue';

let props = defineProps(['drawerOpen']);

</script>
<style scoped>
</style>
