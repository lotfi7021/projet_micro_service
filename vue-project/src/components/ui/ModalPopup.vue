<!-- src/components/ui/ModalPopup.vue -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeOnOverlay && close()"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4 text-center">
      <div :class="[
        'relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all w-full',
        size === 'sm' ? 'max-w-sm' : 
        size === 'md' ? 'max-w-md' :
        size === 'lg' ? 'max-w-lg' :
        size === 'xl' ? 'max-w-xl' : 'max-w-2xl'
      ]">
        <!-- En-tête -->
        <div v-if="showHeader" class="px-6 py-4 border-b" :class="headerClass">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <slot name="icon">
                <div v-if="icon" class="mr-3 text-xl">{{ icon }}</div>
              </slot>
              <h3 class="text-lg font-semibold text-gray-900">
                <slot name="title">{{ title }}</slot>
              </h3>
            </div>
            <button 
              v-if="showCloseButton"
              @click="close()"
              class="text-gray-400 hover:text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>
          <div v-if="$slots.subtitle || subtitle" class="mt-1">
            <slot name="subtitle">
              <p class="text-sm text-gray-500">{{ subtitle }}</p>
            </slot>
          </div>
        </div>
        
        <!-- Contenu -->
        <div class="px-6 py-4">
          <slot></slot>
        </div>
        
        <!-- Pied de page -->
        <div v-if="showFooter" class="px-6 py-4 border-t bg-gray-50">
          <div class="flex justify-end gap-3">
            <slot name="footer">
              <button 
                v-if="showCancelButton"
                @click="close()"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="confirm()"
                type="button"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                  confirmButtonClass
                ]"
              >
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits(['close', 'confirm'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal'
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  headerClass: {
    type: String,
    default: 'bg-white'
  },
  confirmButtonClass: {
    type: String,
    default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
  }
})

function close() {
  emit('close')
}

function confirm() {
  emit('confirm')
}
</script>