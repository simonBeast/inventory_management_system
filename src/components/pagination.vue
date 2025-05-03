<template>
    <div class="flex justify-center items-center space-x-4 mt-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-2 py-1 bg-blue-500 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{isLanguageTigrigna ? "ተመለስ" : "Previous"}}
        </button>
        <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-2 py-1 bg-blue-500 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{isLanguageTigrigna ? "ቐፅል" : "Next"}}
        </button>
    </div>
</template>

<script setup>
import { defineProps} from 'vue';
import { useLanguageStore } from '../store/languageStore';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const languageStore = useLanguageStore();
const isLanguageTigrigna = computed(()=>languageStore.languagePreference == "ti");
const router = useRouter();
const route = useRoute();
const props = defineProps({
    totalPages: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    }
});

console.log("pagination data",props.currentPage,props.totalPages);

const emit = defineEmits(['page-changed']);

function changePage(page){
    if (page > 0 && page <= props.totalPages) {
        router.replace({query:{
            ...route.query,
            page: page
        }});

        emit('page-changed', page);

    }
};
</script>
<style scoped></style>