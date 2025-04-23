<template>
    <div class="ml-80 lg:ml-96 mt-10">
     <p class="text-5xl"> {{ isLanguageTigrigna ? "404 ገጽ ኣይተረኽበን" : "404 Page Not Found"}}</p>   
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLanguageStore } from '../store/languageStore';
import { computed } from 'vue';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");

</script>
<style>
    
</style>