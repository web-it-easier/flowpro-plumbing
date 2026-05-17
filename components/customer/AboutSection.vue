<template>
  <!-- About Section -->
  <section :id="sectionId" class="py-24 lg:py-32 bg-white">
    <div>
      <div class="mb-20 text-center">
        <h2 class="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">{{ title }}</h2>
        <div class="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-flowpro to-flowpro-accent"></div>
        <p class="text-body mx-auto mt-8 max-w-3xl text-lg">
          {{ description }}
        </p>
      </div>
      
      <div class="grid gap-16 lg:grid-cols-2">
        <!-- Company Story -->
        <div class="space-y-8">
          <div class="rounded-3xl bg-gradient-to-br from-flowpro/5 to-flowpro/10 p-8 border border-flowpro/20">
            <h3 class="mb-6 text-2xl font-bold text-neutral-900">{{ storyTitle }}</h3>
            <div class="space-y-4 text-neutral-700 leading-relaxed">
              <p>{{ storyParagraph1 }}</p>
              <p>{{ storyParagraph2 }}</p>
              <p>{{ storyParagraph3 }}</p>
            </div>
          </div>
          
          <!-- Mission & Values -->
          <div class="rounded-3xl bg-neutral-50 p-8">
            <h3 class="mb-6 text-2xl font-bold text-neutral-900">{{ missionTitle }}</h3>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-flowpro text-white text-xl font-bold">
                  💧
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ value1Title }}</div>
                  <div class="text-neutral-600">{{ value1Description }}</div>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-flowpro text-white text-xl font-bold">
                  🔧
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ value2Title }}</div>
                  <div class="text-neutral-600">{{ value2Description }}</div>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-flowpro text-white text-xl font-bold">
                  🤝
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ value3Title }}</div>
                  <div class="text-neutral-600">{{ value3Description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Team & Credentials -->
        <div class="space-y-8">
          <!-- Stats -->
          <div class="rounded-3xl bg-gradient-to-br from-flowpro to-flowpro-dark p-8 text-white">
            <h3 class="mb-8 text-2xl font-bold">{{ statsTitle }}</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-4xl font-black">{{ yearsExperience }}</div>
                <div class="text-white/80">{{ yearsLabel }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-black">{{ happyCustomers }}</div>
                <div class="text-white/80">{{ customersLabel }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-black">{{ jobsCompleted }}</div>
                <div class="text-white/80">{{ jobsLabel }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-black">{{ emergencyResponse }}</div>
                <div class="text-white/80">{{ responseLabel }}</div>
              </div>
            </div>
          </div>
          
          <!-- Team -->
          <div class="rounded-3xl bg-neutral-50 p-8">
            <h3 class="mb-8 text-2xl font-bold text-neutral-900">{{ teamTitle }}</h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-gradient-to-br from-flowpro to-flowpro-dark flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ founderName }}</div>
                  <div class="text-neutral-600">{{ founderTitle }}</div>
                  <div class="text-sm text-neutral-500">{{ founderExperience }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-gradient-to-br from-flowpro to-flowpro-dark flex items-center justify-center text-white text-2xl font-bold">
                  MT
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ teamMemberName }}</div>
                  <div class="text-neutral-600">{{ teamMemberTitle }}</div>
                  <div class="text-sm text-neutral-500">{{ teamMemberExperience }}</div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 text-center">
              <p class="text-neutral-600 mb-4">{{ teamDescription }}</p>
              <div class="flex flex-wrap justify-center gap-2">
                <span class="rounded-full bg-flowpro/10 px-3 py-1 text-sm font-medium text-flowpro">{{ certification1 }}</span>
                <span class="rounded-full bg-flowpro/10 px-3 py-1 text-sm font-medium text-flowpro">{{ certification2 }}</span>
                <span class="rounded-full bg-flowpro/10 px-3 py-1 text-sm font-medium text-flowpro">{{ certification3 }}</span>
              </div>
            </div>
          </div>
          
          <!-- Trust Badges -->
          <div class="rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-8 text-center">
            <h4 class="mb-6 text-xl font-bold text-neutral-900">{{ trustTitle }}</h4>
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col items-center">
                <div class="mb-2 text-3xl">✅</div>
                <div class="text-sm font-medium text-neutral-700">{{ badge1 }}</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="mb-2 text-3xl">🛡️</div>
                <div class="text-sm font-medium text-neutral-700">{{ badge2 }}</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="mb-2 text-3xl">⭐</div>
                <div class="text-sm font-medium text-neutral-700">{{ badge3 }}</div>
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
 * AboutSection - Company story, team, and credentials section
 * 
 * @component
 * @description A glamorous about section showcasing company story, team, stats, and trust indicators
 * 
 * @example
 * <AboutSection />
 */

/**
 * Component props
 * @typedef {Object} AboutSectionProps
 * @property {string} [sectionId='about'] - Section ID for navigation
 * @property {string} [title='About FlowPro'] - Section title
 * @property {string} [description=''] - Section description
 * @property {string} [storyTitle='Our Story'] - Story section title
 * @property {string} [storyParagraph1=''] - First story paragraph
 * @property {string} [storyParagraph2=''] - Second story paragraph
 * @property {string} [storyParagraph3=''] - Third story paragraph
 * @property {string} [missionTitle='Our Mission & Values'] - Mission section title
 * @property {string} [value1Title='Quality Workmanship'] - First value title
 * @property {string} [value1Description=''] - First value description
 * @property {string} [value2Title='Customer Service'] - Second value title
 * @property {string} [value2Description=''] - Second value description
 * @property {string} [value3Title='Integrity'] - Third value title
 * @property {string} [value3Description=''] - Third value description
 * @property {string} [statsTitle='Our Impact'] - Stats section title
 * @property {number} [yearsExperience=15] - Years of experience
 * @property {string} [yearsLabel='Years Experience'] - Years label
 * @property {number} [happyCustomers=5000] - Happy customers count
 * @property {string} [customersLabel='Happy Customers'] - Customers label
 * @property {number} [jobsCompleted=10000] - Jobs completed count
 * @property {string} [jobsLabel='Jobs Completed'] - Jobs label
 * @property {number} [emergencyResponse=60] - Emergency response time
 * @property {string} [responseLabel='Min Response'] - Response label
 * @property {string} [teamTitle='Our Team'] - Team section title
 * @property {string} [founderName='John Davis'] - Founder name
 * @property {string} [founderTitle='Founder & Master Plumber'] - Founder title
 * @property {string} [founderExperience='15+ years experience'] - Founder experience
 * @property {string} [teamMemberName='Mike Thompson'] - Team member name
 * @property {string} [teamMemberTitle='Lead Technician'] - Team member title
 * @property {string} [teamMemberExperience='10+ years experience'] - Team member experience
 * @property {string} [teamDescription=''] - Team description
 * @property {string} [certification1='Licensed'] - First certification
 * @property {string} [certification2='Insured'] - Second certification
 * @property {string} [certification3='Certified'] - Third certification
 * @property {string} [trustTitle='Why Choose Us'] - Trust section title
 * @property {string} [badge1='Licensed'] - First trust badge
 * @property {string} [badge2='Insured'] - Second trust badge
 * @property {string} [badge3='5-Star Rated'] - Third trust badge
 */
const props = defineProps({
  sectionId: {
    type: String,
    default: 'about'
  },
  title: {
    type: String,
    default: 'About FlowPro'
  },
  description: {
    type: String,
    default: "Your trusted local plumbing experts. We're committed to delivering exceptional service with integrity, quality, and customer satisfaction at the heart of everything we do."
  },
  storyTitle: {
    type: String,
    default: 'Our Story'
  },
  storyParagraph1: {
    type: String,
    default: "FlowPro Plumbing began with a simple mission: to provide homeowners and businesses with reliable, professional plumbing services they could trust. Founded in 2008 by Master Plumber John Davis, we started as a small family-owned operation with just one truck and a commitment to quality."
  },
  storyParagraph2: {
    type: String,
    default: "Over the years, we've grown from that single truck to a fleet of fully equipped service vehicles, but our core values remain unchanged. We believe in doing the job right the first time, treating every customer like family, and standing behind our work with comprehensive warranties."
  },
  storyParagraph3: {
    type: String,
    default: "Today, FlowPro is proud to be the most trusted plumbing service in the area, serving thousands of residential and commercial customers with the same dedication to excellence that started our journey over a decade ago."
  },
  missionTitle: {
    type: String,
    default: 'Our Mission & Values'
  },
  value1Title: {
    type: String,
    default: 'Quality Workmanship'
  },
  value1Description: {
    type: String,
    default: 'We never compromise on quality. Every job is completed to the highest standards using premium materials and proven techniques.'
  },
  value2Title: {
    type: String,
    default: 'Customer Service'
  },
  value2Description: {
    type: String,
    default: 'Your satisfaction is our priority. We listen, communicate clearly, and go above and beyond to exceed your expectations.'
  },
  value3Title: {
    type: String,
    default: 'Integrity'
  },
  value3Description: {
    type: String,
    default: 'We believe in honest pricing, transparent communication, and standing behind our work with complete accountability.'
  },
  statsTitle: {
    type: String,
    default: 'Our Impact'
  },
  yearsExperience: {
    type: Number,
    default: 15
  },
  yearsLabel: {
    type: String,
    default: 'Years Experience'
  },
  happyCustomers: {
    type: Number,
    default: 5000
  },
  customersLabel: {
    type: String,
    default: 'Happy Customers'
  },
  jobsCompleted: {
    type: Number,
    default: 10000
  },
  jobsLabel: {
    type: String,
    default: 'Jobs Completed'
  },
  emergencyResponse: {
    type: Number,
    default: 60
  },
  responseLabel: {
    type: String,
    default: 'Min Response'
  },
  teamTitle: {
    type: String,
    default: 'Our Team'
  },
  founderName: {
    type: String,
    default: 'John Davis'
  },
  founderTitle: {
    type: String,
    default: 'Founder & Master Plumber'
  },
  founderExperience: {
    type: String,
    default: '15+ years experience'
  },
  teamMemberName: {
    type: String,
    default: 'Mike Thompson'
  },
  teamMemberTitle: {
    type: String,
    default: 'Lead Technician'
  },
  teamMemberExperience: {
    type: String,
    default: '10+ years experience'
  },
  teamDescription: {
    type: String,
    default: 'Our team of licensed, insured, and certified plumbers brings decades of combined experience to every job.'
  },
  certification1: {
    type: String,
    default: 'Licensed'
  },
  certification2: {
    type: String,
    default: 'Insured'
  },
  certification3: {
    type: String,
    default: 'Certified'
  },
  trustTitle: {
    type: String,
    default: 'Why Choose Us'
  },
  badge1: {
    type: String,
    default: 'Licensed'
  },
  badge2: {
    type: String,
    default: 'Insured'
  },
  badge3: {
    type: String,
    default: '5-Star Rated'
  }
})
</script>

<style scoped>
/* Component-specific styles */
/* All styling is handled by Tailwind classes and props */
</style>
