<template>
  <li class="mb-1 mx-2">
    <router-link :to="props.link" active-class="active-link" class="alink flex items-center justify-between px-4 py-2 rounded-xl transition-all duration-300 group hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:-translate-y-px">
      <span class="flex items-center min-w-0">
        <span :class="['icon-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-all duration-300', iconTone.chip]">
          <font-awesome-icon :icon="props.icon" class="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" :class="iconTone.icon" />
        </span>
        <span class="ml-3 text-[15px] font-medium truncate">
          {{ props.text }}
        </span>
      </span>
      <span v-if="props.badge !== undefined" class="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[11px] font-bold px-1.5 shadow-sm transform group-hover:scale-105 transition-transform">
        {{ props.badge }}
      </span>
    </router-link>
  </li>
</template>

<script setup>
import { computed, defineProps } from 'vue';

let props = defineProps(['link', 'icon', 'text', 'badge']);

const toneMap = {
  list: {
    chip: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300',
    icon: 'text-sky-600 dark:text-sky-300',
  },
  tags: {
    chip: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    icon: 'text-amber-600 dark:text-amber-300',
  },
  tag: {
    chip: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    icon: 'text-emerald-600 dark:text-emerald-300',
  },
  box: {
    chip: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    icon: 'text-blue-600 dark:text-blue-300',
  },
  database: {
    chip: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300',
    icon: 'text-cyan-600 dark:text-cyan-300',
  },
  'dollar-sign': {
    chip: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    icon: 'text-green-600 dark:text-green-300',
  },
  undo: {
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
    icon: 'text-rose-600 dark:text-rose-300',
  },
  bookmark: {
    chip: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    icon: 'text-violet-600 dark:text-violet-300',
  },
  history: {
    chip: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    icon: 'text-slate-600 dark:text-slate-300',
  },
  'chart-line': {
    chip: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
    icon: 'text-fuchsia-600 dark:text-fuchsia-300',
  },
  users: {
    chip: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    icon: 'text-orange-600 dark:text-orange-300',
  },
  'file-alt': {
    chip: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
    icon: 'text-teal-600 dark:text-teal-300',
  },
  'sign-out-alt': {
    chip: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    icon: 'text-red-600 dark:text-red-300',
  },
  default: {
    chip: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300',
    icon: 'text-gray-500 dark:text-gray-300',
  },
};

const iconTone = computed(() => toneMap[props.icon] || toneMap.default);
</script>

<style lang="css" scoped>
.active-link {
  @apply bg-gradient-to-r from-blue-50 via-blue-50 to-white dark:from-blue-900/40 dark:via-gray-800 dark:to-gray-900 text-blue-700 dark:text-blue-300 shadow-md font-semibold ring-1 ring-blue-100 dark:ring-blue-900/30;
}

.active-link .icon-chip {
  @apply shadow-sm scale-105;
}

.alink:active {
  @apply bg-blue-100 dark:bg-blue-900/60 scale-[0.98];
}
</style>