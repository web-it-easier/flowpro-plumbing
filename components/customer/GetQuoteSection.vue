<template>
  <!-- Get Quote Section -->
  <section id="get-quote" class="py-24 lg:py-32 bg-gradient-to-br from-flowpro to-flowpro-dark">
    <div class="min-w-0">
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-white sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-white/30"></div>
        <p class="text-white/90 mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <div class="rounded-3xl bg-white p-8 shadow-2xl overflow-hidden">
          <h3 class="mb-8 text-2xl font-bold text-neutral-900">{{ formTitle }}</h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid gap-6 md:grid-cols-2">
              <BaseInput
                v-model="formData.name"
                label="Full Name"
                placeholder="John Doe"
                required
                name="name"
                autocomplete="name"
                data-testid="quote-name"
              >
                <template #prefix>
                  <span class="text-lg">👤</span>
                </template>
              </BaseInput>
              
              <BaseInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                name="email"
                autocomplete="email"
                data-testid="quote-email"
              >
                <template #prefix>
                  <span class="text-lg">📧</span>
                </template>
              </BaseInput>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2">
              <BaseInput
                v-model="formData.phone"
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                required
                name="phone"
                autocomplete="tel"
                data-testid="quote-phone"
              >
                <template #prefix>
                  <span class="text-lg">📞</span>
                </template>
              </BaseInput>
              
              <BaseInput
                v-model="formData.service"
                label="Service Needed"
                placeholder="e.g., Emergency Repair, Installation"
                name="service"
                autocomplete="off"
                data-testid="quote-service"
              >
                <template #prefix>
                  <span class="text-lg">🔧</span>
                </template>
              </BaseInput>
            </div>
            
            <div>
              <label for="project-details" class="input-label">Project Details</label>
              <textarea
                id="project-details"
                v-model="formData.projectDetails"
                rows="4"
                class="input-field w-full resize-none"
                placeholder="Describe your plumbing project in detail..."
                name="project-details"
                data-testid="quote-project-details"
              ></textarea>
            </div>
            
            <div>
              <label for="budget" class="input-label">Estimated Budget</label>
              <select
                id="budget"
                v-model="formData.budget"
                class="input-field w-full"
                name="budget"
                data-testid="quote-budget"
              >
                <option value="">Select budget range</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000+">$5,000+</option>
              </select>
            </div>
            
            <div>
              <label for="timeline" class="input-label">Project Timeline</label>
              <select
                id="timeline"
                v-model="formData.timeline"
                class="input-field w-full"
                name="timeline"
                data-testid="quote-timeline"
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP - Emergency</option>
                <option value="1-week">Within 1 week</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div class="flex gap-4">
              <BaseButton 
                type="submit" 
                variant="primary" 
                size="large"
                :disabled="isSubmitting"
                class="flex-1"
              >
                <span v-if="isSubmitting">Sending Quote Request...</span>
                <span v-else>{{ submitButtonText }}</span>
              </BaseButton>
              
              <BaseButton 
                type="button" 
                variant="secondary" 
                size="large"
                @click="resetForm"
              >
                Clear
              </BaseButton>
            </div>
          </form>
        </div>
        
        <!-- Quote Information -->
        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <div class="text-center text-white">
            <div class="mb-4 text-3xl">⏱️</div>
            <h4 class="mb-2 text-lg font-semibold">Quick Response</h4>
            <p class="text-white/80 text-sm">Get a quote within 24 hours</p>
          </div>
          
          <div class="text-center text-white">
            <div class="mb-4 text-3xl">💰</div>
            <h4 class="mb-2 text-lg font-semibold">Competitive Pricing</h4>
            <p class="text-white/80 text-sm">Fair and transparent pricing</p>
          </div>
          
          <div class="text-center text-white">
            <div class="mb-4 text-3xl">🔧</div>
            <h4 class="mb-2 text-lg font-semibold">Expert Service</h4>
            <p class="text-white/80 text-sm">Licensed and insured professionals</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'

/**
 * GetQuoteSection - Dedicated quote request section
 * 
 * @component
 * @description A comprehensive quote request section with detailed form for project estimates
 * 
 * @example
 * <GetQuoteSection 
 *   @form-submit="handleQuoteSubmit"
 * />
 */

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Get a Free Quote'
  },
  description: {
    type: String,
    default: 'Tell us about your plumbing project and we\'ll provide a detailed, no-obligation quote tailored to your needs.'
  },
  formTitle: {
    type: String,
    default: 'Request Your Free Quote'
  },
  submitButtonText: {
    type: String,
    default: 'Get Free Quote'
  }
})

// Emits
const emit = defineEmits(['form-submit'])

// Form state
const formData = ref({
  name: '',
  email: '',
  phone: '',
  service: '',
  projectDetails: '',
  budget: '',
  timeline: ''
})

const isSubmitting = ref(false)

// Methods
const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Emit form data
    emit('form-submit', {
      type: 'quote',
      data: { ...formData.value },
      timestamp: new Date().toISOString()
    })
    
    // Reset form
    resetForm()
  } catch (error) {
    console.error('Quote submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    service: '',
    projectDetails: '',
    budget: '',
    timeline: ''
  }
}
</script>
