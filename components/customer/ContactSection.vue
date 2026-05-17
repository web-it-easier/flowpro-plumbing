<template>
  <!-- Contact Section -->
  <section id="contact" class="py-24 lg:py-32 bg-neutral-50 overflow-x-hidden">
    <div class="min-w-0">
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
        <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <div class="grid gap-16 lg:grid-cols-2 min-w-0">
          <!-- Contact Information -->
          <div class="space-y-8 min-w-0">
            <div class="rounded-3xl bg-gradient-to-br from-flowpro to-flowpro-dark p-8 text-white overflow-hidden">
              <h3 class="mb-8 text-2xl font-bold">{{ contactTitle }}</h3>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-xl">📞</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Phone</div>
                    <div class="text-white/90">{{ phoneNumber }}</div>
                    <div class="text-white/70 text-sm">24/7 Emergency Service</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-xl">📧</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Email</div>
                    <div class="text-white/90">{{ emailAddress }}</div>
                    <div class="text-white/70 text-sm">Quick response guaranteed</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-xl">📍</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Address</div>
                    <div class="text-white/90">{{ address }}</div>
                    <div class="text-white/70 text-sm">Service area: {{ serviceArea }}</div>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span class="text-xl">🕐</span>
                  </div>
                  <div>
                    <div class="font-semibold text-white">Hours</div>
                    <div class="text-white/90">{{ businessHours }}</div>
                    <div class="text-white/70 text-sm">Emergency service available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Emergency CTA -->
            <div class="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-8 text-white text-center overflow-hidden">
              <div class="mb-4 text-4xl">🚨</div>
              <h4 class="mb-4 text-xl font-bold">Plumbing Emergency?</h4>
              <p class="mb-6 text-white/90">Don't wait! Call us now for immediate assistance.</p>
              <a 
                :href="`tel:${emergencyPhone}`" 
                class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-red-600 transition-transform hover:scale-105"
              >
                <span>📞 Call Now: {{ emergencyPhone }}</span>
              </a>
            </div>
          </div>
          
          <!-- Map/Location Info -->
          <div class="space-y-8 min-w-0">
            <div class="rounded-3xl bg-white p-8 shadow-card overflow-hidden">
              <h3 class="mb-8 text-2xl font-bold text-neutral-900">Service Area</h3>
              
              <div class="aspect-video rounded-2xl bg-neutral-100 flex items-center justify-center mb-6">
                <div class="text-center">
                  <div class="mb-4 text-4xl">🗺️</div>
                  <p class="text-neutral-600">Interactive Map</p>
                  <p class="text-neutral-500 text-sm">Service area coverage</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <h4 class="font-semibold text-neutral-900">Areas We Serve:</h4>
                <div class="grid gap-2 text-sm text-neutral-600">
                  <div class="flex items-center gap-2">
                    <span class="text-green-500">✓</span>
                    <span>Downtown Metro Area</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-green-500">✓</span>
                    <span>North Suburbs</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-green-500">✓</span>
                    <span>South District</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-green-500">✓</span>
                    <span>East County</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-green-500">✓</span>
                    <span>West Region</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="rounded-3xl bg-neutral-100 p-8 overflow-hidden">
              <h3 class="mb-6 text-xl font-bold text-neutral-900">Quick Actions</h3>
              
              <div class="space-y-4">
                <a 
                  href="#get-quote" 
                  class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-[transform,box-shadow] hover:shadow-md hover:scale-105"
                >
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-flowpro text-white">
                    <span class="text-xl">💰</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-neutral-900">Get a Quote</div>
                    <div class="text-sm text-neutral-600">Request a free estimate</div>
                  </div>
                  <div class="text-neutral-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="#emergency" 
                  class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-[transform,box-shadow] hover:shadow-md hover:scale-105"
                >
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                    <span class="text-xl">🚨</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-neutral-900">Emergency Service</div>
                    <div class="text-sm text-neutral-600">24/7 emergency plumbing</div>
                  </div>
                  <div class="text-neutral-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
                
                <a 
                  href="mailto:info@flowpro.com" 
                  class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-[transform,box-shadow] hover:shadow-md hover:scale-105"
                >
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span class="text-xl">📧</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-neutral-900">Email Us</div>
                    <div class="text-sm text-neutral-600">Send a message</div>
                  </div>
                  <div class="text-neutral-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
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
 * ContactSection - Contact information and business details section
 * 
 * @component
 * @description A contact section with business information, service area, and quick actions
 * 
 * @example
 * <ContactSection />
 */

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Contact Us'
  },
  description: {
    type: String,
    default: 'Get in touch with FlowPro Plumbing for all your plumbing needs. We\'re here to help with expert service and reliable solutions.'
  },
  contactTitle: {
    type: String,
    default: 'Get in Touch'
  },
  phoneNumber: {
    type: String,
    default: '(555) 123-4567'
  },
  emailAddress: {
    type: String,
    default: 'info@flowpro.com'
  },
  address: {
    type: String,
    default: '123 Plumbing Street, Suite 100'
  },
  serviceArea: {
    type: String,
    default: 'Metro Area & Surrounding Suburbs'
  },
  businessHours: {
    type: String,
    default: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'
  },
  emergencyPhone: {
    type: String,
    default: '(555) 911-HELP'
  }
})

/**
 * Emit events for form interactions
 */
const emit = defineEmits(['form-submit'])

/**
 * Form data and state
 */
const formData = ref({
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
})

const isSubmitting = ref(false)

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
const handleSubmit = async (event) => {
  isSubmitting.value = true
  
  try {
    // Emit form data to parent
    emit('form-submit', { ...formData.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form on success
    resetForm()
    
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Reset form data
 */
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  }
}
</script>

<style scoped>
/* Component-specific styles */
.shadow-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Animation utilities are handled by Tailwind classes */
</style>
