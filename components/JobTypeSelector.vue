<!-- JobTypeSelector.vue -->
<template>
  <div class="job-type-selector">
    <div class="flex items-center space-x-2 mb-3">
      <label for="job-type-selector" class="text-sm font-medium text-gray-700 cursor-pointer">🔧 Job Type:</label>
      <span class="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">Required</span>
    </div>
    
    <!-- Selected Job Types Chips -->
    <div v-if="selectedJobTypes.length > 0" class="mb-3">
      <JobTypeChips 
        :job-types="selectedJobTypes" 
        @remove="removeJobType" 
      />
    </div>

    <!-- Add Job Type Dropdown -->
    <div class="relative">
      <select 
        v-model="selectedJobTypeId" 
        @change="addJobType"
        id="job-type-selector"
        name="job-type-selector"
        class="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">+ Add job type...</option>
        <option 
          v-for="jobType in availableJobTypes" 
          :key="jobType.id" 
          :value="jobType.id"
        >
          {{ jobType.icon }} {{ jobType.name }}
        </option>
      </select>
    </div>
    
    <!-- Helper text -->
    <p class="text-sm text-gray-500 mt-2">
      💡 Add multiple job types for complex work, or select one for specific jobs
    </p>
    
    <!-- Combined Job Details -->
    <div v-if="selectedJobTypes.length > 0" class="job-details mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <h4 class="text-base font-semibold text-blue-800 mb-3">
        Selected Services ({{ selectedJobTypes.length }})
      </h4>
      
      <JobReport 
        :job-types="selectedJobTypes" 
        @remove="removeJobType" 
      />
      
      <JobEstimateReport 
        :total-cost="totalEstimatedCost"
        :total-duration="totalDuration"
      />
      
      <!-- Team Size Info -->
      <div class="mt-2 pt-2 border-t border-blue-100">
        <div class="text-xs text-gray-600">
          👥 Required Team Size: {{ maxTeamSize }} plumber{{ maxTeamSize > 1 ? 's' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JOB_TYPES from '~/data/jobTypes.json'

// 🎯 No props needed - component manages its own data
// 🎯 Emit event when job type is selected
const emit = defineEmits(['job-type-selected'])

// 🎯 Job type data - imported from constants
const jobTypes = ref(JOB_TYPES)

// 🎯 Selected job types (array for multiple selection)
const selectedJobTypes = ref([])
const selectedJobTypeId = ref('') // For dropdown

// 🎯 Available job types (exclude already selected)
const availableJobTypes = computed(() => {
  const selectedIds = selectedJobTypes.value.map(jt => jt.id)
  return jobTypes.value.filter(jt => !selectedIds.includes(jt.id))
})

// 🎯 Combined requirements calculations
const totalEstimatedCost = computed(() => {
  return selectedJobTypes.value.reduce((total, jobType) => total + jobType.basePrice, 0)
})

const maxTeamSize = computed(() => {
  return Math.max(...selectedJobTypes.value.map(jt => jt.requiredTeamSize), 1)
})

const totalDuration = computed(() => {
  if (selectedJobTypes.value.length === 0) return 'N/A'
  if (selectedJobTypes.value.length === 1) return selectedJobTypes.value[0].estimatedDuration
  return 'Multiple durations - see details above'
})

// 🎯 Add job type from dropdown
const addJobType = () => {
  if (!selectedJobTypeId.value) return
  
  const jobType = jobTypes.value.find(jt => jt.id === selectedJobTypeId.value)
  if (jobType && !selectedJobTypes.value.find(jt => jt.id === jobType.id)) {
    selectedJobTypes.value.push(jobType)
  }
  
  // Reset dropdown
  selectedJobTypeId.value = ''
  
  // Emit updated selection
  emit('job-type-selected', selectedJobTypes.value)
}

// 🎯 Remove job type
const removeJobType = (jobTypeId) => {
  selectedJobTypes.value = selectedJobTypes.value.filter(jt => jt.id !== jobTypeId)
  emit('job-type-selected', selectedJobTypes.value)
}

</script>

<style scoped>
/* Component container styling */
.job-type-selector {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}
</style>