<template>
  <!-- Component Showcase Section -->
  <section :id="sectionId" :class="sectionClasses">
    <div>
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
        <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>
      
      <div class="text-center">
        <BaseButton 
          :variant="buttonVariant" 
          :size="buttonSize" 
          @click="handleButtonClick"
        >
          {{ buttonText }}
        </BaseButton>
        <p class="mt-4 text-neutral-600">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseButton from '~/components/common/BaseButton.vue'

/**
 * ComponentShowcaseSection - Component library showcase section
 * 
 * @component
 * @description A section that showcases the component library with a CTA button
 * 
 * @example
 * <ComponentShowcaseSection 
 *   @showcase-click="handleShowcaseClick"
 * />
 */

/**
 * Component props
 * @typedef {Object} ComponentShowcaseSectionProps
 * @property {string} [sectionId='component-showcase'] - Section ID for navigation
 * @property {string} [sectionClasses='py-24 lg:py-32 bg-neutral-50'] - Section CSS classes
 * @property {string} [title='Component Library'] - Section title
 * @property {string} [description=''] - Section description
 * @property {string} [buttonText='View Component Library'] - Button text
 * @property {string} [buttonVariant='primary'] - Button variant
 * @property {string} [buttonSize='large'] - Button size
 * @property {string} [subtitle=''] - Subtitle text
 */
const props = defineProps({
  sectionId: {
    type: String,
    default: 'component-showcase'
  },
  sectionClasses: {
    type: String,
    default: 'py-24 lg:py-32 bg-neutral-50'
  },
  title: {
    type: String,
    default: 'Component Library'
  },
  description: {
    type: String,
    default: 'Our reusable Vue components built with Nuxt 3 and Tailwind CSS. Clean, consistent, and ready for production.'
  },
  buttonText: {
    type: String,
    default: 'View Component Library'
  },
  buttonVariant: {
    type: String,
    default: 'primary'
  },
  buttonSize: {
    type: String,
    default: 'large'
  },
  subtitle: {
    type: String,
    default: 'See our reusable Vue components in action with interactive demos'
  }
})

/**
 * Emit events for button interactions
 */
const emit = defineEmits(['showcase-click'])

/**
 * Handle showcase button click
 * @param {Event} event - Click event
 */
const handleButtonClick = (event) => {
  emit('showcase-click', event)
}
</script>

<style scoped>
/* Component-specific styles */
/* All styling is handled by Tailwind classes and props */
</style>
