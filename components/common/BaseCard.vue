<template>
  <div :class="cardClasses">
    <header v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </header>
    
    <div class="card-body" :class="contentClasses">
      <slot />
    </div>
    
    <footer v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'flat'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'tight', 'normal', 'loose'].includes(value)
  }
})

const cardClasses = computed(() => {
  const classes = [
    'bg-white',
    'rounded-lg'
  ]
  
  // Variant styles
  if (props.variant === 'default') classes.push('border', 'border-neutral-200', 'shadow-sm')
  else if (props.variant === 'elevated') classes.push('border-0', 'shadow-card')
  else if (props.variant === 'outlined') classes.push('border-2', 'border-flowpro', 'shadow-none')
  else if (props.variant === 'flat') classes.push('border-0', 'shadow-none', 'bg-neutral-50')
  
  // Hover effect
  if (props.hover) classes.push('hover:shadow-md', 'hover:-translate-y-1', 'transition-[transform,box-shadow]', 'duration-200')
  
  // Padding - apply directly to card
  if (props.padding === 'none') classes.push('p-0')
  else if (props.padding === 'tight') classes.push('p-4')
  else if (props.padding === 'normal') classes.push('p-6')
  else if (props.padding === 'loose') classes.push('p-8')
  
  return classes
})
// Dynamic classes for card sections
const headerClasses = computed(() => {
  const classes = ['border-b', 'border-neutral-200']
  
  if (props.padding === 'none') classes.push('px-0', 'py-0')
  else if (props.padding === 'tight') classes.push('px-4', 'py-3')
  else if (props.padding === 'normal') classes.push('px-6', 'py-4')
  else if (props.padding === 'loose') classes.push('px-8', 'py-6')
  
  return classes
})

const contentClasses = computed(() => {
  const classes = []
  
  if (props.padding === 'none') classes.push('px-0', 'py-0')
  else if (props.padding === 'tight') classes.push('px-4', 'py-3')
  else if (props.padding === 'normal') classes.push('px-6', 'py-4')
  else if (props.padding === 'loose') classes.push('px-8', 'py-6')
  
  return classes
})

const footerClasses = computed(() => {
  const classes = ['border-t', 'border-neutral-200', 'bg-neutral-50']
  
  if (props.padding === 'none') classes.push('px-0', 'py-0')
  else if (props.padding === 'tight') classes.push('px-4', 'py-3')
  else if (props.padding === 'normal') classes.push('px-6', 'py-4')
  else if (props.padding === 'loose') classes.push('px-8', 'py-6')
  
  return classes
})
</script>

<style scoped>
</style>
