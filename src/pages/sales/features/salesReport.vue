<template>
    <div :class="containerClass" class="ml-56 md:ml-60 lg:ml-72 flex-col w-full">
        <topSellingProductsOfMonth/>
        <topSellingProductsOfQuarter />
        <topSellingProductsOfYear />
    </div>
    
</template>
<script setup>
import { ref, onMounted,defineProps, computed, } from 'vue';
import topSellingProductsOfMonth from './topSellingProductsOfMonth.vue';
import topSellingProductsOfQuarter from './topSellingProductsOfQuarter.vue';
import topSellingProductsOfYear from './topSellingProductsOfYear.vue';

let props = defineProps(['drawerOpen']);

const containerClass = computed(() => ({
    'ml-56 md:ml-60 lg:ml-72 w-1/2': props.drawerOpen,
    'ml-8 w-full': !props.drawerOpen 
}));
</script>
<style scoped>
</style>
