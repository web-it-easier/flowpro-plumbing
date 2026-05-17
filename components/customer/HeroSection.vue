<template>
  <!-- Hero Section -->
  <section id="hero" ref="heroEl" class="relative min-h-screen 
  flex items-center justify-center overflow-hidden
   bg-gradient-hero px-4 sm:px-6 lg:px-8">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-flowpro/20 blur-3xl"></div>
    <div
      class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl">
    </div>

    <!-- Obvious Parallax Icons -->
    <div class="pointer-events-none absolute inset-0">
      <!-- Big Wrench - Slow Background -->
      <div class="absolute left-[10%] top-[20%] text-white z-40"
        :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)` : undefined }">
        <span class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl will-change-transform drop-shadow-2xl">🔧</span>
      </div>

      <!-- Faucet - Medium Speed -->
      <div class="absolute right-[15%] top-[30%] text-white/90 z-20"
        :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 0.5}px)` : undefined }">
        <div class="relative">
          <span
            class="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl will-change-transform drop-shadow-lg"
            :style="{ transform: parallaxEnabled ? `rotate(-${scrollY * 0.2}deg)` : undefined }"
          >🚰</span>

          <div v-if="shouldSplash" class="absolute inset-0 pointer-events-none">
            <div class="water-drip" :key="splashTrigger" :style="{ '--drip-fall': `${heroHeight}px` }">
              <div class="droplet droplet-1"></div>
              <div class="droplet droplet-2"></div>
              <div class="droplet droplet-3"></div>
              <div class="droplet droplet-4"></div>
              <div class="droplet droplet-5"></div>
              <div class="droplet droplet-6"></div>
              <div class="droplet droplet-7"></div>
              <div class="droplet droplet-8"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Water Drops - Fast Foreground -->
      <div class="absolute left-[20%] bottom-[25%] text-blue-200/90 z-30"
        :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 0.8}px) rotate(${scrollY * 0.3}deg)` : undefined }">
        <span class="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl will-change-transform drop-shadow-xl">💧</span>
      </div>

      <!-- Pipe - Extra Fast -->
      <div class="absolute right-[25%] bottom-[20%] text-white/90 z-40"
        :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 1.2}px) rotate(-${scrollY * 0.4}deg)` : undefined }">
        <span class="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl will-change-transform drop-shadow-md">🔩</span>
      </div>
    </div>

    <div class="relative z-10 text-center">
      <div class="max-w-5xl mx-auto">
        <!-- Status Badge -->
        <div
          class="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg">
          <span class="relative flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          {{ statusBadge }}
        </div>

        <!-- Main Heading -->
        <h1 class="mb-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          <span :class="headingContainerClass">
            <span v-if="isSticky" class="text-blue-400 text-2xl animate-pulse">⚙️</span>
            <span :class="headingTitleClass">
              <span v-if="!isSticky" class="inline-block will-change-transform" :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 0.8}px)` : undefined }">{{ mainHeading }}</span>
              <span v-if="!isSticky" class="inline-block text-blue-200 will-change-transform" :style="{ transform: parallaxEnabled ? `translateY(${scrollY * 1.2}px)` : undefined }">{{ subHeading }}</span>
              <span v-if="isSticky" :class="subHeadingClass">
                {{ mainHeading }} {{ subHeading }}
              </span>
            </span>
            <span v-if="isSticky" class="text-blue-400 text-2xl animate-pulse">⚙️</span>
          </span>
        </h1>

        <!-- Subheading -->
        <p class="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 sm:text-2xl">
          {{ greetingMessage }} {{ description }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <a :href="primaryCtaLink"
            class="group relative overflow-hidden rounded-2xl bg-white px-8 py-5 text-lg font-bold text-flowpro shadow-hero transition-[transform,box-shadow] hover:scale-105 hover:shadow-2xl">
            <span class="relative z-10 flex items-center gap-3">
              <span>{{ primaryCtaText }}</span>
              <span class="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
          </a>
          <a :href="secondaryCtaLink"
            class="glass-card flex items-center gap-3 rounded-2xl px-8 py-5 text-lg font-semibold text-white transition-[transform,background-color] hover:bg-white/30 hover:scale-105">
            <span>{{ secondaryCtaText }}</span>
            <span class="text-blue-200">{{ secondaryCtaSubtext }}</span>
          </a>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          <div v-for="indicator in trustIndicators" :key="indicator.label" class="text-center">
            <div class="text-3xl font-black text-white">{{ indicator.value }}</div>
            <div class="text-base font-medium text-blue-100">{{ indicator.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * HeroSection - Main hero banner component
 * 
 * @component
 * @description A full-screen hero section with animated background, CTAs, and trust indicators
 * 
 * @example
 * <HeroSection 
 *   greeting-message="Good morning!"
 *   primary-cta-link="#contact"
 *   primary-cta-text="Get Started"
 *   secondary-cta-link="tel:5551234567"
 *   secondary-cta-text="Call Now"
 *   secondary-cta-subtext="(555) 123-4567"
 * />
 */

/**
 * Component props
 * @typedef {Object} HeroSectionProps
 * @property {string} [statusBadge='Available 24/7 • Licensed & Insured'] - Status badge text
 * @property {string} [mainHeading='Professional Plumbing'] - Main heading text
 * @property {string} [subHeading='You Can Trust'] - Sub heading text
 * @property {string} [greetingMessage] - Dynamic greeting message (e.g., "Good morning!")
 * @property {string} [description='Expert solutions for all your plumbing needs with transparent pricing and guaranteed satisfaction.'] - Description text
 * @property {string} [primaryCtaLink='#contact'] - Primary CTA link
 * @property {string} [primaryCtaText='🚀 Get Started'] - Primary CTA button text
 * @property {string} [secondaryCtaLink='tel:5551234567'] - Secondary CTA link
 * @property {string} [secondaryCtaText='📞 Call Now'] - Secondary CTA button text
 * @property {string} [secondaryCtaSubtext='(555) 123-4567'] - Secondary CTA subtext
 * @property {Array} [trustIndicators] - Array of trust indicator objects
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  statusBadge: {
    type: String,
    default: 'Available 24/7 • Licensed & Insured'
  },
  mainHeading: {
    type: String,
    default: 'Professional Plumbing'
  },
  subHeading: {
    type: String,
    default: 'You Can Trust'
  },
  greetingMessage: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'Expert solutions for all your plumbing needs with transparent pricing and guaranteed satisfaction.'
  },
  primaryCtaLink: {
    type: String,
    default: '#services'
  },
  primaryCtaText: {
    type: String,
    default: '🚀 Get Started'
  },
  secondaryCtaLink: {
    type: String,
    default: 'tel:5551234567'
  },
  secondaryCtaText: {
    type: String,
    default: '📞 Call Now'
  },
  secondaryCtaSubtext: {
    type: String,
    default: '(555) 123-4567'
  },
  trustIndicators: {
    type: Array,
    default: () => [
      { value: '500+', label: 'Happy Customers' },
      { value: '4.9', label: 'Star Rating' },
      { value: '24/7', label: 'Emergency Service' }
    ]
  }
})

const heroEl = ref(null)
const parallaxEnabled = ref(true)
const scrollY = ref(0)
const heroHeight = ref(0)

let onScroll
let resizeObserver

// ResizeObserver for accurate hero height
const setupResizeObserver = () => {
  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      heroHeight.value = entry.contentRect.height
    }
  })

  const el = heroEl.value
  if (el) {
    resizeObserver.observe(el)
  }
}

// Check if scrolled past hero with buffer for smooth transition
const scrolledPastHero = computed(() => {
  if (!heroHeight.value) return false
  return scrollY.value > (heroHeight.value - 100)
})

const isSticky = computed(() => scrolledPastHero.value)

const headingContainerClass = computed(() => (
  isSticky.value
    ? 'fixed top-20 left-0 right-0 z-[110] bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-700/50 py-6 px-8 shadow-2xl flex items-center justify-center gap-3'
    : ''
))

const headingTitleClass = computed(() => (
  isSticky.value
    ? 'text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200'
    : ''
))

const subHeadingClass = computed(() => (
  isSticky.value ? '' : 'block text-blue-200'
))

const shouldSplash = computed(() => {
  if (!parallaxEnabled.value) return false
  // Splash continuously while in hero section, regardless of rotation
  return scrollY.value > 50 && !scrolledPastHero.value
})

// Create multiple splash triggers for continuous effect
const splashTrigger = ref(0)

const updateScroll = () => {
  // Simple direct scroll calculation
  scrollY.value = window.scrollY
  
  // Trigger splash every 50px of scroll when in hero section
  if (shouldSplash.value) {
    splashTrigger.value = Math.floor(scrollY.value / 50)
  }
}

onMounted(() => {
  // Disable for reduced motion
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  if (reduce?.matches) {
    parallaxEnabled.value = false
    return
  }

  // Setup ResizeObserver for accurate height detection
  setupResizeObserver()

  updateScroll()

  onScroll = () => {
    updateScroll()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
/* Component-specific styles */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bg-gradient-hero {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
}

.shadow-hero {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.bg-flowpro {
  background-color: #3b82f6;
}

/* Water Drip Effect */
.water-drip {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  pointer-events: none;
}

.droplet {
  position: absolute;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 30%, rgba(147, 197, 253, 0.85) 60%, rgba(96, 165, 250, 0.75) 100%);
  border-radius: 50%;
  opacity: 0;
  animation: drip-fall var(--duration, 1.4s) var(--ease, cubic-bezier(0.25, 0.46, 0.45, 0.94)) forwards;
  filter: blur(0.2px);
  will-change: transform, opacity;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.droplet-1 {
  left: 42px;
  top: -6px;
  width: 6px;
  height: 12px;
  border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
  background: radial-gradient(ellipse at 35% 25%, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 30%, rgba(147, 197, 253, 0.85) 60%, rgba(96, 165, 250, 0.75) 100%);
  --duration: 3.0s;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-delay: 0s;
}

.droplet-2 {
  left: 52px;
  top: -10px;
  width: 4px;
  height: 10px;
  border-radius: 40% 60% 60% 40% / 20% 30% 70% 80%;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.92) 0%, rgba(219, 234, 254, 0.88) 25%, rgba(147, 197, 253, 0.82) 55%, rgba(96, 165, 250, 0.72) 100%);
  --duration: 3.2s;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-delay: 0.12s;
}

.droplet-3 {
  left: 58px;
  top: -8px;
  width: 8px;
  height: 16px;
  border-radius: 50% 50% 50% 50% / 25% 25% 75% 75%;
  background: radial-gradient(ellipse at 40% 30%, rgba(255, 255, 255, 0.96) 0%, rgba(219, 234, 254, 0.91) 28%, rgba(147, 197, 253, 0.86) 58%, rgba(96, 165, 250, 0.76) 100%);
  --duration: 2.8s;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-delay: 0.24s;
}

.droplet-4 {
  left: 46px;
  top: -12px;
  width: 5px;
  height: 11px;
  border-radius: 30% 70% 70% 30% / 15% 25% 75% 85%;
  background: radial-gradient(ellipse at 25% 20%, rgba(255, 255, 255, 0.94) 0%, rgba(219, 234, 254, 0.89) 32%, rgba(147, 197, 253, 0.84) 62%, rgba(96, 165, 250, 0.74) 100%);
  --duration: 3.1s;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-delay: 0.08s;
}

.droplet-5 {
  left: 62px;
  top: -14px;
  width: 7px;
  height: 9px;
  border-radius: 60% 40% 40% 60% / 35% 25% 75% 65%;
  background: radial-gradient(ellipse at 45% 25%, rgba(255, 255, 255, 0.93) 0%, rgba(219, 234, 254, 0.87) 35%, rgba(147, 197, 253, 0.83) 65%, rgba(96, 165, 250, 0.73) 100%);
  --duration: 2.7s;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-delay: 0.18s;
}

.droplet-6 {
  left: 48px;
  top: -4px;
  width: 3px;
  height: 8px;
  border-radius: 50% 50% 50% 50% / 20% 20% 80% 80%;
  background: radial-gradient(ellipse at 35% 15%, rgba(255, 255, 255, 0.91) 0%, rgba(219, 234, 254, 0.85) 40%, rgba(147, 197, 253, 0.80) 70%, rgba(96, 165, 250, 0.70) 100%);
  --duration: 3.4s;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-delay: 0.3s;
}

.droplet-7 {
  left: 54px;
  top: -16px;
  width: 10px;
  height: 18px;
  border-radius: 50% 50% 50% 50% / 28% 28% 72% 72%;
  background: radial-gradient(ellipse at 38% 25%, rgba(255, 255, 255, 0.97) 0%, rgba(219, 234, 254, 0.92) 26%, rgba(147, 197, 253, 0.87) 56%, rgba(96, 165, 250, 0.77) 100%);
  --duration: 2.5s;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-delay: 0.36s;
}

.droplet-8 {
  left: 44px;
  top: -6px;
  width: 4px;
  height: 7px;
  border-radius: 70% 30% 30% 70% / 25% 15% 85% 75%;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.90) 0%, rgba(219, 234, 254, 0.84) 38%, rgba(147, 197, 253, 0.79) 68%, rgba(96, 165, 250, 0.69) 100%);
  --duration: 3.0s;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-delay: 0.42s;
}

@keyframes drip-fall {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  3% {
    opacity: 1;
    transform: translateY(1px) scale(1.05);
  }
  8% {
    transform: translateY(3px) scale(0.95);
  }
  95% {
    opacity: 0.7;
    transform: translateY(calc(var(--drip-fall, 100vh) - 10px)) scale(0.9);
  }
  100% {
    transform: translateY(var(--drip-fall, 100vh)) scale(0.85);
    opacity: 0;
  }
}
</style>
