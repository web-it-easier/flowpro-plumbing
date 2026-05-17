<template>
  <header>
    <!-- Skip Navigation Link -->
    <a href="#main-content"
      class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 bg-white focus-visible:text-blue-500 focus-visible:px-2 focus-visible:py-2 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50 focus-visible:z-[9999]">
      Skip to main content
    </a>
   
    <!-- Navigation -->
    <nav class="fixed top-0 z-50 isolate w-full bg-flowpro border-b border-flowpro-dark/20 backdrop-blur-lg shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex h-20 items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="#hero" aria-label="FlowPro home" :aria-current="isSectionActive('hero') ? 'page' : undefined"
            :class="[
              'relative flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none transition-[transform,box-shadow,color,border,filter] duration-300',
              isSectionActive('hero')
                ? 'scale-110 shadow-2xl shadow-blue-500/60 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 border border-blue-400/50'
                : ''
            ]">
            <div :class="[
              'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg transition-all duration-500',
              isSectionActive('hero')
                ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white rotate-12 scale-110 shadow-xl'
                : 'bg-white text-flowpro'
            ]">
              FP
            </div>
            <span :class="[
              'text-2xl font-black transition-all duration-500',
              isSectionActive('hero')
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200'
                : 'text-white'
            ]">
              FlowPro
            </span>
            <span v-if="isSectionActive('hero')"
              class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-10">
            <NuxtLink to="/ai-test" 
              class="nav-link relative text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md"
              :class="[
                $route.path === '/ai-test'
                  ? 'text-orange-300 scale-105'
                  : 'text-white hover:text-orange-200'
              ]">
              <span class="relative">
                AI Test (Contextual)
                <span v-if="$route.path === '/ai-test'"
                  class="absolute -top-3 -right-5 text-lg animate-bounce"></span>
              </span>
            </NuxtLink>
            <NuxtLink to="#services" :class="[
              'nav-link relative pl-6 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md',
              isSectionActive('services')
                ? 'text-blue-300 scale-105'
                : 'text-white hover:text-blue-200'
            ]" :aria-current="isSectionActive('services') ? 'page' : undefined">
              <span class="relative">
                Services
                <span v-if="isSectionActive('services')"
                  class="absolute -top-3 -right-5 text-lg animate-bounce transition-transform duration-300">🔧</span>
              </span>
            </NuxtLink>
            <NuxtLink to="#about" :class="[
              'nav-link relative pl-6 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md',
              isSectionActive('about')
                ? 'text-purple-300 scale-105'
                : 'text-white hover:text-blue-200'
            ]" :aria-current="isSectionActive('about') ? 'page' : undefined">
              <span class="relative">
                About
                <span v-if="isSectionActive('about')" class="absolute -top-3 -right-5 text-lg animate-pulse">📋</span>
              </span>
            </NuxtLink>
            <NuxtLink to="#emergency" :class="[
              'nav-link relative pl-6 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md',
              isSectionActive('emergency')
                ? 'text-red-300 scale-105 animate-pulse'
                : 'text-white hover:text-red-200'
            ]" :aria-current="isSectionActive('emergency') ? 'page' : undefined">
              <span class="relative">
                Emergency
                <span v-if="isSectionActive('emergency')"
                  class="absolute -top-3 -right-5 text-lg animate-spin">🚨</span>
              </span>
            </NuxtLink>
            
            <!-- Admin Tools Dropdown -->
            <div class="relative">
              <button 
                @click="toggleAdminDropdown"
                class="nav-link relative pl-6 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md text-white hover:text-orange-200 flex items-center gap-2"
                aria-haspopup="true"
                :aria-expanded="isAdminDropdownOpen">
                Admin Tools
                <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isAdminDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <Transition name="fade">
                <div v-if="isAdminDropdownOpen" class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <NuxtLink 
                    to="/admin" 
                    @click="isAdminDropdownOpen = false"
                    class="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    🏢 Admin Dashboard
                  </NuxtLink>
                  <NuxtLink 
                    to="/admin/calendar" 
                    @click="isAdminDropdownOpen = false"
                    class="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    📅 Admin Calendar
                  </NuxtLink>
                  <NuxtLink 
                    to="/dispatch" 
                    @click="isAdminDropdownOpen = false"
                    class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    👨‍💼 Dispatcher Tools
                  </NuxtLink>
                  <NuxtLink 
                    to="/component-showcase" 
                    @click="isAdminDropdownOpen = false"
                    class="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    🎨 Component Showcase
                  </NuxtLink>
                </div>
              </Transition>
            </div>
            
            <NuxtLink to="#contact" :class="[
              'nav-link relative pl-6 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md',
              isSectionActive('contact')
                ? 'text-green-300 scale-105'
                : 'text-white hover:text-green-200'
            ]" :aria-current="isSectionActive('contact') ? 'page' : undefined">
              <span class="relative">
                Contact
                <span v-if="isSectionActive('contact')"
                  class="absolute -top-3 -right-5 text-lg animate-bounce">📞</span>
              </span>
            </NuxtLink>
            <NuxtLink to="#get-quote"
              class="nav-link relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 font-black text-white shadow-lg transition-transform duration-300 transition-colors duration-300 hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none"
              :aria-current="isSectionActive('get-quote') ? 'page' : undefined">
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-lg">💰</span>
                Get Quote
                <span v-if="isSectionActive('get-quote')"
                  class="absolute -top-3 -right-5 text-lg animate-pulse transition-transform duration-300">🎯</span>
              </span>
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden text-neutral-600 p-2 rounded-lg hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-flowpro focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="toggleMobileMenu" :aria-expanded="isMobileMenuOpen" aria-controls="mobile-menu"
            :aria-label="isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'">
            <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <Transition name="slide-down">
          <div v-if="isMobileMenuOpen" id="mobile-menu"
            class="md:hidden border-t border-flowpro-dark/20 bg-flowpro/95 backdrop-blur-lg" role="navigation"
            aria-label="Mobile navigation">
            <div class="px-4 py-6 space-y-2">
            <NuxtLink to="#services" :class="[
              'nav-link relative block pl-6 py-4 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md min-h-[44px]',
              isSectionActive('services')
                ? 'text-blue-300 scale-105'
                : 'text-white hover:text-blue-200'
            ]" :aria-current="isSectionActive('services') ? 'page' : undefined" @click="closeMobileMenu">
              <span class="relative">
                Services
                <span v-if="isSectionActive('services')"
                  class="absolute -top-3 -right-5 text-lg animate-bounce transition-all duration-300">🔧</span>
              </span>
            </NuxtLink>

            <NuxtLink to="#about" :class="[
              'nav-link relative block pl-6 py-4 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md min-h-[44px]',
              isSectionActive('about')
                ? 'text-purple-300 scale-105'
                : 'text-white hover:text-blue-200'
            ]" :aria-current="isSectionActive('about') ? 'page' : undefined" @click="closeMobileMenu">
              <span class="relative">
                About
                <span v-if="isSectionActive('about')"
                  class="absolute -top-3 -right-5 text-lg animate-pulse transition-transform duration-300">📋</span>
              </span>
            </NuxtLink>
            <NuxtLink to="#emergency" :class="[
              'nav-link relative block pl-6 py-4 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md min-h-[44px]',
              isSectionActive('emergency')
                ? 'text-red-300 scale-105 animate-pulse'
                : 'text-white hover:text-red-200'
            ]" :aria-current="isSectionActive('emergency') ? 'page' : undefined" @click="closeMobileMenu">
              <span class="relative">
                Emergency
                <span v-if="isSectionActive('emergency')"
                  class="absolute -top-3 -right-5 text-lg animate-spin transition-transform duration-300">🚨</span>
              </span>
            </NuxtLink>
            <NuxtLink to="#contact" :class="[
              'nav-link relative block pl-6 py-4 text-lg font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none rounded-md min-h-[44px]',
              isSectionActive('contact')
                ? 'text-green-300 scale-105'
                : 'text-white hover:text-green-200'
            ]" :aria-current="isSectionActive('contact') ? 'page' : undefined" @click="closeMobileMenu">
              <span class="relative">
                Contact
                <span v-if="isSectionActive('contact')"
                  class="absolute -top-3 -right-5 text-lg animate-bounce transition-transform duration-300">📞</span>
              </span>
            </NuxtLink>
            
            <!-- Admin Tools Section in Mobile Menu -->
            <div class="border-t border-flowpro-dark/20 pt-4 mt-4">
              <p class="text-white/60 text-sm font-semibold mb-3 pl-6">🔧 Admin Tools</p>
              <NuxtLink 
                to="/admin" 
                class="block pl-6 py-3 text-white hover:bg-blue-500/20 hover:text-blue-200 transition-colors rounded-md"
                @click="closeMobileMenu">
                🏢 Admin Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/admin/calendar" 
                class="block pl-6 py-3 text-white hover:bg-blue-500/20 hover:text-blue-200 transition-colors rounded-md"
                @click="closeMobileMenu">
                📅 Admin Calendar
              </NuxtLink>
              <NuxtLink 
                to="/dispatch" 
                class="block pl-6 py-3 text-white hover:bg-green-500/20 hover:text-green-200 transition-colors rounded-md"
                @click="closeMobileMenu">
                👨‍💼 Dispatcher Tools
              </NuxtLink>
              <NuxtLink 
                to="/component-showcase" 
                class="block pl-6 py-3 text-white hover:bg-purple-500/20 hover:text-purple-200 transition-colors rounded-md"
                @click="closeMobileMenu">
                🎨 Component Showcase
              </NuxtLink>
            </div>
            
            <NuxtLink to="#get-quote" :class="[
              'relative overflow-hidden block rounded-2xl px-8 py-4 font-black shadow-lg text-center transition-[transform,box-shadow,color] duration-300 focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-flowpro focus-visible:outline-none min-h-[44px]',
              isSectionActive('get-quote')
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white scale-105 shadow-xl'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-xl hover:from-green-600 hover:to-emerald-700'
            ]" :aria-current="isSectionActive('get-quote') ? 'page' : undefined"
             @click="closeMobileMenu">
              <span class="relative z-10 flex items-center justify-center gap-2">
                <span class="text-lg">💰</span>
                <span v-if="isSectionActive('get-quote')"
                  class="absolute -top-3 -right-5 text-lg animate-bounce transition-transform duration-300">🎯</span>
                Get Quote
              </span>
            </NuxtLink>
          </div>
          </div>
        </Transition>
      </div>
    </nav>
  </header>
</template>

<script setup>
/**
 * NavbarSection - Main navigation component with mobile menu and active states
 * 
 * @component
 * @description A responsive navigation bar with desktop links, mobile hamburger menu, and scroll-based active section highlighting
 * 
 * @example
 * <NavbarSection />
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useActiveSection } from '~/composables/useActiveSection'

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Admin dropdown state
const isAdminDropdownOpen = ref(false)

// Active section detection
const { isSectionActive, observeSection } = useActiveSection()

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Admin dropdown functions
const toggleAdminDropdown = () => {
  isAdminDropdownOpen.value = !isAdminDropdownOpen.value
}

// Close mobile menu on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscape)

  // Observe sections for active state detection
  nextTick(() => {
    const sections = {
      hero: document.getElementById('hero'),
      services: document.getElementById('services'),
      about: document.getElementById('about'),
      emergency: document.getElementById('emergency'),
      contact: document.getElementById('contact'),
      'get-quote': document.getElementById('get-quote')
    }

    Object.entries(sections).forEach(([id, element]) => {
      observeSection(id, element)
    })
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // No cleanup needed - navbar never unmounts
})
</script>

<style scoped>
/* Component-specific styles */
/* All styling is handled by Tailwind classes and props */

/* Dropdown transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@scope {

  /* 
   * Respect user's motion preferences
   * 
   * When user prefers reduced motion, disable animations
   * This is an accessibility feature
   * 
   * @media (prefers-reduced-motion: reduce)
   * 
   * Scope selector ensures these styles only apply to this component
   * - Example: :scope .animate-bounce targets .animate-bounce within this component only
   */
  @media (prefers-reduced-motion: reduce) {

    :scope .animate-bounce,
    :scope .animate-pulse,
    :scope .animate-spin {
      animation: none;
    }

    :scope .transition-colors,
    :scope .transition-transform {
      transition: none;
    }
  }
}

/* Slide down transition for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}

.slide-down-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
