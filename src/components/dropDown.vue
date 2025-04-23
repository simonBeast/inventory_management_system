<template>
    <div class="dropdown">
      <div class="dropdown-toggle" @click="toggleDropdown">
        {{ selectedItemName || "Please select " }}
        <span class="absolute right-2 top-2"><font-awesome-icon :icon="['fas', 'arrow-down']" /></span>
      </div>
      <div v-if="isOpen" class="dropdown-menu">
        <div
          class="dropdown-item"
          v-for="item in list"
          :key="item.id"
          @click="selectItem(item)"
        >
          {{  item.name}}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = ref(false);
  const selectedItemName = ref('');
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const selectItem = (item) => {
    selectedItemName.value = item.name;
    emit('update:modelValue', item.id);
    isOpen.value = false;
  };
  
  watch(
    () => props.modelValue,
    (newValue) => {
      const selectedItem = props.list.find((item) => item.id === newValue);
      selectedItemName.value = selectedItem ? selectedItem.name : '';
    },
    { immediate: true }
  );
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .dropdown-toggle {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-menu {
    position: absolute;
    width: 100%;
    max-height: 580px; /* Limit the height for scrolling */
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure it appears above other elements */
  }
  
  .dropdown-item {
    padding: 6px 10px;
    cursor: pointer;
  }
  
  .dropdown-item:hover {
    background-color: #f0f0f0;
  }
  </style>
  