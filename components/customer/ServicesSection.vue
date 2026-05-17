<template>
  <!-- Services Section -->
  <section :id="sectionId" class="py-24 lg:py-32">
    <div>
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
        <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="service in services" :key="service.title"
          class="group relative overflow-hidden rounded-3xl bg-gradient-card p-8 shadow-card transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-2xl">
          <div
            class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-flowpro/10 to-flowpro/5 transition-transform duration-500 group-hover:scale-150">
          </div>
          <div
            class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-flowpro to-flowpro-dark text-4xl shadow-lg transition-[transform,box-shadow] duration-500 group-hover:scale-110 group-hover:shadow-xl">
            {{ service.icon }}
          </div>
          <h3 class="mb-4 text-2xl font-bold text-neutral-900">{{ service.title }}</h3>
          <p class="text-neutral-600 leading-relaxed">{{ service.description }}</p>

          <div
            class="mt-8 flex items-center gap-2 font-bold text-flowpro transition-colors group-hover:text-flowpro-dark">
            <span>{{ ctaText }}</span>
            <span class="text-lg transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * ServicesSection - Reusable services grid component
 * 
 * @component
 * @description A flexible services section with animated cards and customizable content
 * 
 * @example
 * <ServicesSection 
 *   :services="servicesData"
 *   title="Our Services"
 *   description="Comprehensive plumbing solutions..."
 *   @service-click="handleServiceClick"
 * />
 */

/**
 * Component props
 * @typedef {Object} ServicesSectionProps
 * @property {Array} services - Array of service objects with icon, title, description
 * @property {string} [sectionId='services'] - Section ID for navigation
 * @property {string} [title='Our Services'] - Section title
 * @property {string} [description=''] - Section description
 * @property {string} [ctaText='Learn more'] - CTA text for service cards
 */
const props = defineProps({
  services: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(service =>
        service.icon &&
        service.title &&
        service.description
      )
    }
  },
  sectionId: {
    type: String,
    default: 'services'
  },
  title: {
    type: String,
    default: 'Our Services'
  },
  description: {
    type: String,
    default: 'Comprehensive plumbing solutions for residential and commercial properties. No job is too big or too small.'
  },
  ctaText: {
    type: String,
    default: 'Learn more'
  }
})
</script>

<style scoped>
/* Component-specific styles */
.bg-gradient-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.shadow-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.bg-flowpro {
  background-color: #3b82f6;
}

.bg-flowpro-dark {
  background-color: #1e40af;
}

.text-flowpro {
  color: #3b82f6;
}

.group:hover .text-flowpro {
  color: #1e40af;
}

/* Animation utilities are handled by Tailwind classes */
</style>
