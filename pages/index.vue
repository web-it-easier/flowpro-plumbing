<template>
  <!-- Navbar -->
  <NavbarSection />
  
  <!-- Main Content-->
  <main id="main-content" class="w-full" tabindex="-1">
    <!-- Hero Section - Full Width -->
    <section class="w-full">
      <HeroSection 
        :greeting-message="currentMessage"
      />
    </section>
    
    <!-- Services Section - Container Inside -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <ServicesSection 
          :services="features"
          section-id="services"
        />
      </div>
    </section>
    
    <!-- About Section - Container Inside -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <AboutSection section-id="about" />
      </div>
    </section>
    
    <!-- Emergency Section - Container Inside -->
    <section class="py-20 bg-red-50">
      <div class="container mx-auto px-4">
        <EmergencySection 
          :phone-number="'(555) 123-4567'"
          section-id="emergency"
        />
      </div>
    </section>
    
    <!-- Component Showcase Section - Container Inside -->
    <section class="py-20 bg-blue-50">
      <div class="container mx-auto px-4">
        <ComponentShowcaseSection 
          @showcase-click="handleShowcaseClick"
          section-id="component-showcase"
        />
      </div>
    </section>
    
    <!-- Contact Section - Container Inside -->
    <section class="py-20 bg-green-50">
      <div class="container mx-auto px-4">
        <ContactSection section-id="contact" />
      </div>
    </section>
    
    <!-- Get Quote Section - Container Inside -->
    <section class="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
      <div class="container mx-auto px-4">
        <GetQuoteSection section-id="get-quote" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavbarSection from '~/components/common/NavbarSection.vue'
import HeroSection from '~/components/customer/HeroSection.vue'
import ServicesSection from '~/components/customer/ServicesSection.vue'
import AboutSection from '~/components/customer/AboutSection.vue'
import EmergencySection from '~/components/customer/EmergencySection.vue'
import ContactSection from '~/components/customer/ContactSection.vue'
import GetQuoteSection from '~/components/customer/GetQuoteSection.vue'

const currentMessage = computed(() => {
  // Get current hour once - no need for updates
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Your day starts right with reliable plumbing.'
  if (hour < 17) return 'Good afternoon! Perfect time to tackle those plumbing projects.'
  return 'Good evening! Emergency services available when you need us most.'
})

// No timers needed - greeting is computed once

// Event handler for ComponentShowcaseSection
const handleShowcaseClick = (event) => {
  // Navigate to component showcase page
  navigateTo('/component-showcase')
}

const features = ref([
  {
    icon: '🔧',
    title: 'Expert Repairs',
    description: 'Licensed professionals with 10+ years experience using state-of-the-art diagnostic equipment for permanent, reliable fixes.'
  },
  {
    icon: '⚡',
    title: 'Fast Response',
    description: '24/7 emergency service within 60 minutes. We arrive fully equipped to handle most repairs in a single visit, saving you time and money.'
  },
  {
    icon: '💰',
    title: 'Fair Pricing',
    description: 'Transparent quotes with no hidden fees. We provide detailed up-front pricing so you know exactly what to expect before we begin work.'
  },
  {
    icon: '🔍',
    title: 'Inspections',
    description: 'Comprehensive plumbing inspections to identify potential issues before they become costly problems. Perfect for homebuyers and maintenance.'
  },
  {
    icon: '�',
    title: 'Installation',
    description: 'Professional installation of fixtures, water heaters, pipes, and complete plumbing systems. All work meets local codes and standards.'
  },
  {
    icon: '�️',
    title: 'Maintenance',
    description: 'Preventive maintenance plans to keep your plumbing system running efficiently and avoid unexpected breakdowns.'
  }
])
</script>

<style scoped>
/* Component-specific styles only */
/* Smooth scrolling is now in assets/css/style.css */
</style>