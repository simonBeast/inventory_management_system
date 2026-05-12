<template>
    <div class="mt-6 flex items-center justify-center">
        <div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-3 py-2 shadow-sm">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
                {{isLanguageTigrigna ? "ተመለስ" : "Previous"}}
            </button>
            <span class="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
                {{isLanguageTigrigna ? "ቐፅል" : "Next"}}
            </button>
        </div>
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