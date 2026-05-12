<template class="w-full flex">
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="relative w-full max-w-2xl mx-auto my-6 z-50 p-4" :class="panelClass">
        <!-- Content -->
        <div class="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden transition-all transform dark:bg-gray-800">
          
          <!-- Header -->
          <div class="flex items-start justify-between p-5 border-b border-solid rounded-t-2xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600 transition-colors"
              @click="closeModal"
            >
              <span class="block h-6 w-6 text-2xl outline-none focus:outline-none">&times;</span>
            </button>
          </div>
          
          <!-- Body slot -->
          <div class="relative p-6 flex-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
            <slot name="body">
              Default Body Content
            </slot>
          </div>
          
          <!-- Footer slot (optional) -->
          <div v-if="$slots.footer" class="flex items-center justify-end p-5 border-t border-solid border-gray-200 dark:border-gray-700 rounded-b-2xl bg-gray-50 dark:bg-gray-900/50">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, useAttrs, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal Title'
  }
});

const emit = defineEmits(['close']);
const attrs = useAttrs();
const panelClass = computed(() => attrs.class);

const closeModal = () => {
  emit('close');
};

// Prevent background scrolling when modal is open
watch(() => props.isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: all 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
