<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading" 
    :type="type" 
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner">⟳</span>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => {
      const validVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost']
      
      // Trim and split to check for multiple variants
      const variants = value.trim().split(' ')
      if (variants.length > 1) {
        console.warn(`❌ Multiple variants not allowed: "${value}". Use only one: ${validVariants.join(', ')}`)
        return false
      }
      
      // Check if single variant is valid
      const singleVariant = variants[0]
      if (!validVariants.includes(singleVariant)) {
        console.warn(`❌ Invalid variant: "${value}". Valid options: ${validVariants.join(', ')}`)
        return false
      }
      
      return true
    }
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => {
      const validSizes = ['small', 'medium', 'large']
      
      // Trim and split to check for multiple sizes
      const sizes = value.trim().split(' ')
      if (sizes.length > 1) {
        console.warn(`❌ Multiple sizes not allowed: "${value}". Use only one: ${validSizes.join(', ')}`)
        return false
      }
      
      // Check if single size is valid
      const singleSize = sizes[0]
      if (!validSizes.includes(singleSize)) {
        console.warn(`❌ Invalid size: "${value}". Valid options: ${validSizes.join(', ')}`)
        return false
      }
      
      return true
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = [
    'font-medium',
    'rounded-lg',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2'
  ]
  
  // Variant styles
  if (props.variant === 'primary') classes.push('bg-flowpro', 'text-white', 'hover:bg-flowpro-dark', 'focus:ring-flowpro')
  else if (props.variant === 'secondary') classes.push('bg-flowpro-light', 'text-flowpro-dark', 'hover:bg-flowpro-accent', 'focus:ring-flowpro')
  else if (props.variant === 'success') classes.push('bg-success', 'text-white', 'hover:bg-success-hover', 'focus:ring-success')
  else if (props.variant === 'warning') classes.push('bg-warning', 'text-white', 'hover:bg-warning-hover', 'focus:ring-warning')
  else if (props.variant === 'danger') classes.push('bg-danger', 'text-white', 'hover:bg-danger-hover', 'focus:ring-danger')
  else if (props.variant === 'ghost') classes.push('bg-transparent', 'text-flowpro', 'hover:bg-flowpro-light', 'focus:ring-flowpro')
  
  // Size styles
  if (props.size === 'small') classes.push('px-3', 'py-1.5', 'text-sm')
  else if (props.size === 'medium') classes.push('px-4', 'py-2', 'text-base')
  else if (props.size === 'large') classes.push('px-6', 'py-3', 'text-lg')
  
  // State styles
  if (props.disabled) classes.push('opacity-50', 'cursor-not-allowed')
  if (props.loading) classes.push('opacity-75')
  if (props.fullWidth) classes.push('w-full')
  
  return classes
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
