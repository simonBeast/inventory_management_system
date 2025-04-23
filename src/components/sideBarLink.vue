<template>
    <li class="mb-1">
          <router-link :to="props.link" active-class="active-link" class="alink">
            <font-awesome-icon :icon="props.icon" class="mr-2" />{{ props.text }}
          </router-link>
        </li>
</template>
<script setup>
import { defineProps} from 'vue';

let props= defineProps(['link','icon','text']);

</script>
<style lang="css" scoped>
.active-link{
  @apply bg-indigo-700 text-gray-100;
}
.alink:active {
  background-color: #4f46e5 !important;
  color: white !important;
}
</style>