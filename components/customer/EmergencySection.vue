<template>
  <!-- Emergency Section -->
  <section :id="sectionId" class="py-24 lg:py-32">
    <div>
      <div class="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-600 to-red-800 p-12 shadow-2xl md:p-20">
        <!-- Background Effects -->
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
        
        <div class="relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div class="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-4xl">
              {{ emergencyIcon }}
            </div>
            <h2 class="mb-6 text-4xl font-black text-white sm:text-5xl">{{ title }}</h2>
            <p class="mb-8 text-xl text-white/90 leading-relaxed">
              {{ description }}
            </p>
            
            <div class="flex flex-col gap-4 sm:flex-row">
              <a :href="`tel:${phoneNumber}`" class="group relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-black text-red-600 shadow-lg transition-[transform,box-shadow] hover:scale-105 hover:shadow-xl">
                <span class="relative z-10 flex items-center gap-3">
                  <span>{{ ctaText }}: {{ phoneNumber }}</span>
                </span>
              </a>
            </div>
          </div>
          
          <div class="glass-blue rounded-3xl p-8 backdrop-blur-lg">
            <h4 class="mb-8 text-2xl font-bold text-white">{{ featuresTitle }}</h4>
            <div class="space-y-6">
              <div 
                v-for="feature in features" 
                :key="feature.title"
                class="flex items-start gap-4"
              >
                <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span class="text-sm font-bold">{{ feature.icon }}</span>
                </div>
                <div>
                  <div class="font-semibold text-white">{{ feature.title }}</div>
                  <div class="text-white/80">{{ feature.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * EmergencySection - Emergency call-to-action component
 * 
 * @component
 * @description A high-impact emergency section with phone CTA and service features
 * 
 * @example
 * <EmergencySection 
 *   phone-number="5551234567"
 *   :features="emergencyFeatures"
 * />
 */

/**
 * Component props
 * @typedef {Object} EmergencySectionProps
 * @property {string} [sectionId='emergency'] - Section ID for navigation
 * @property {string} [emergencyIcon='🚨'] - Emergency icon
 * @property {string} [title='Plumbing Emergency?'] - Section title
 * @property {string} [description=''] - Section description
 * @property {string} [phoneNumber='5551234567'] - Emergency phone number
 * @property {string} [ctaText='📞 Emergency'] - CTA button text
 * @property {string} [featuresTitle='Why Choose Our Emergency Service?'] - Features section title
 * @property {Array} [features] - Array of feature objects
 */
const props = defineProps({
  sectionId: {
    type: String,
    default: 'emergency'
  },
  emergencyIcon: {
    type: String,
    default: '🚨'
  },
  title: {
    type: String,
    default: 'Plumbing Emergency?'
  },
  description: {
    type: String,
    default: "Don't wait for disaster to strike. Our rapid-response team is on standby 24/7 to handle your most urgent plumbing crises."
  },
  phoneNumber: {
    type: String,
    default: '5551234567'
  },
  ctaText: {
    type: String,
    default: '📞 Emergency'
  },
  featuresTitle: {
    type: String,
    default: 'Why Choose Our Emergency Service?'
  },
  features: {
    type: Array,
    default: () => [
      {
        icon: '✓',
        title: '60-Minute Response',
        description: 'Average arrival time in your area'
      },
      {
        icon: '✓',
        title: 'Fully Equipped',
        description: 'We arrive ready to fix most issues on-site'
      },
      {
        icon: '✓',
        title: 'Upfront Pricing',
        description: 'No surprise fees, transparent costs'
      },
      {
        icon: '✓',
        title: 'Licensed & Insured',
        description: 'Fully certified professionals'
      }
    ]
  }
})
</script>

<style scoped>
/* Component-specific styles */
.glass-blue {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Animation utilities are handled by Tailwind classes */
</style>
