<template>
  <div class="dispatcher-interface">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Left: Customer Request Queue -->
        <div class="md:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6">📋 Customer Requests</h2>
          
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="(request, idx) in customerRequests"
              :key="idx"
              @click="selectRequest(idx)"
              :class="[
                'p-4 rounded-lg cursor-pointer border-2 transition',
                selectedRequestIdx === idx
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-400'
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <p class="font-semibold text-sm">{{ request.customerName }}</p>
                <span :class="getPriorityBadgeClass(request.category)" class="text-xs px-2 py-1 rounded text-white font-bold">
                  {{ getPriorityLabel(request.category) }}
                </span>
              </div>
              <p class="text-xs text-gray-600">{{ request.customerPhone }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ request.description.substring(0, 50) }}...</p>
            </div>
          </div>
        </div>

        <!-- Right: Request Details & Actions -->
        <div v-if="selectedRequest" class="md:col-span-2 bg-white rounded-lg shadow-lg p-8">
          <div class="mb-8">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-3xl font-bold mb-2">{{ selectedRequest.customerName }}</h2>
                <p class="text-gray-600">{{ selectedRequest.customerPhone }}</p>
              </div>
              <span :class="getPriorityBadgeClass(selectedRequest.category)" class="px-4 py-2 rounded-full text-white font-bold">
                {{ getPriorityLabel(selectedRequest.category) }}
              </span>
            </div>
          </div>

          <!-- Issue Details -->
          <div class="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 class="text-xl font-bold mb-4">🎯 Detected Issue</h3>
            <div class="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h4 class="text-lg font-bold mb-2">{{ getCategoryName(selectedRequest.category) }}</h4>
              <p class="text-gray-700 mb-4">{{ getCategoryDescription(selectedRequest.category) }}</p>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Confidence</p>
                  <p class="font-bold">{{ Math.round(selectedRequest.confidence * 100) }}%</p>
                </div>
                <div>
                  <p class="text-gray-600">Response Time</p>
                  <p class="font-bold">{{ getResponseTime(selectedRequest.category) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Description -->
          <div class="mb-8 pb-8 border-b-2 border-gray-200">
            <h3 class="text-xl font-bold mb-4">📝 Customer Description</h3>
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-gray-700">{{ selectedRequest.description }}</p>
            </div>
          </div>

          <!-- Recommended Actions -->
          <div class="mb-8">
            <h3 class="text-xl font-bold mb-4">📋 Recommended Actions</h3>
            <div class="space-y-3">
              <div
                v-for="(action, idx) in getRecommendedActions(selectedRequest.category)"
                :key="idx"
                class="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500"
              >
                <span class="text-green-600 font-bold text-lg">✓</span>
                <span class="text-gray-700">{{ action }}</span>
              </div>
            </div>
          </div>

          <!-- Dispatcher Actions -->
          <div class="flex gap-4">
            <button
              @click="callCustomer"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              📞 Call Customer
            </button>
            <button
              @click="scheduleAppointment"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              📅 Schedule Appointment
            </button>
            <button
              @click="markCompleted"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              ✓ Mark Complete
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="md:col-span-2 bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-96">
          <p class="text-gray-500 text-lg">Select a customer request to view details</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedRequestIdx = ref(null)

const customerRequests = ref([
  {
    customerName: 'John Smith',
    customerPhone: '(555) 123-4567',
    description: 'I smell gas in my living room and I am feeling dizzy. Please help!',
    category: 'gas_line_services',
    confidence: 0.95
  },
  {
    customerName: 'Sarah Johnson',
    customerPhone: '(555) 234-5678',
    description: 'The pipe burst in my basement and water is everywhere. I already shut off the main valve.',
    category: 'emergency_plumbing',
    confidence: 0.92
  },
  {
    customerName: 'Mike Davis',
    customerPhone: '(555) 345-6789',
    description: 'My water heater is not working and there is no hot water in the house.',
    category: 'water_heater_services',
    confidence: 0.88
  },
  {
    customerName: 'Emily Wilson',
    customerPhone: '(555) 456-7890',
    description: 'Sewage is backing up into my shower and multiple drains are clogged.',
    category: 'drain_cleaning_sewer',
    confidence: 0.85
  }
])

const selectedRequest = ref(null)

const CATEGORY_INFO = {
  gas_line_services: {
    name: 'Gas Line Services',
    description: 'Gas leak detected - this is a safety emergency',
    priority: 'IMMEDIATE',
    responseTime: 'Within 15 minutes',
    actions: [
      'Call customer immediately to confirm evacuation',
      'Dispatch emergency gas technician to location',
      'Notify fire department if needed',
      'Provide customer with safety instructions',
      'Follow up after service completion'
    ]
  },
  emergency_plumbing: {
    name: 'Emergency Plumbing',
    description: 'Burst pipe or major water emergency',
    priority: 'IMMEDIATE',
    responseTime: 'Within 30 minutes',
    actions: [
      'Call customer to confirm water shut-off',
      'Dispatch emergency plumber immediately',
      'Assess water damage severity',
      'Arrange water extraction if needed',
      'Notify customer of arrival time'
    ]
  },
  water_heater_services: {
    name: 'Water Heater Services',
    description: 'Water heater malfunction or failure',
    priority: 'SAME_DAY',
    responseTime: 'Within 24 hours',
    actions: [
      'Schedule same-day appointment if possible',
      'Assess if replacement or repair needed',
      'Check warranty status',
      'Prepare customer for cost estimate',
      'Arrange installation if needed'
    ]
  },
  drain_cleaning_sewer: {
    name: 'Drain Cleaning & Sewer',
    description: 'Clogged drains or sewer backup',
    priority: 'SAME_DAY',
    responseTime: 'Within 24 hours',
    actions: [
      'Schedule same-day or next-day service',
      'Determine if main line or branch line',
      'Prepare hydro-jetting equipment',
      'Advise customer to avoid using drains',
      'Estimate service time and cost'
    ]
  },
  bathroom_kitchen_fixtures: {
    name: 'Bathroom & Kitchen Fixtures',
    description: 'Faucet, toilet, or fixture repair',
    priority: 'SCHEDULE',
    responseTime: 'Within 3-5 days',
    actions: [
      'Schedule appointment within 3-5 days',
      'Identify fixture type and issue',
      'Prepare replacement parts',
      'Provide cost estimate',
      'Confirm appointment with customer'
    ]
  },
  plumbing_repairs: {
    name: 'Plumbing Repairs',
    description: 'General plumbing repair needed',
    priority: 'SCHEDULE',
    responseTime: 'Within 3-5 days',
    actions: [
      'Schedule appointment within 3-5 days',
      'Assess repair scope',
      'Prepare tools and materials',
      'Provide cost estimate',
      'Confirm appointment details'
    ]
  },
  maintenance_inspection: {
    name: 'Maintenance & Inspection',
    description: 'Preventive maintenance or inspection',
    priority: 'SCHEDULE',
    responseTime: 'Within 5-7 days',
    actions: [
      'Schedule routine inspection',
      'Prepare inspection checklist',
      'Identify potential issues',
      'Provide maintenance recommendations',
      'Schedule follow-up if needed'
    ]
  },
  outdoor_drainage: {
    name: 'Outdoor Drainage',
    description: 'Outdoor drainage or grading issue',
    priority: 'SCHEDULE',
    responseTime: 'Within 5-7 days',
    actions: [
      'Schedule site assessment',
      'Evaluate drainage patterns',
      'Prepare drainage solution options',
      'Provide cost estimate',
      'Schedule installation if approved'
    ]
  }
}

const selectRequest = (idx) => {
  selectedRequestIdx.value = idx
  selectedRequest.value = customerRequests.value[idx]
}

const getCategoryName = (category) => {
  return CATEGORY_INFO[category]?.name || category
}

const getCategoryDescription = (category) => {
  return CATEGORY_INFO[category]?.description || 'Plumbing service needed'
}

const getPriorityLabel = (category) => {
  return CATEGORY_INFO[category]?.priority || 'UNKNOWN'
}

const getPriorityBadgeClass = (category) => {
  const priority = getPriorityLabel(category)
  const classes = {
    'IMMEDIATE': 'bg-red-600',
    'SAME_DAY': 'bg-amber-600',
    'SCHEDULE': 'bg-blue-600'
  }
  return classes[priority] || 'bg-gray-600'
}

const getResponseTime = (category) => {
  return CATEGORY_INFO[category]?.responseTime || 'Within 24 hours'
}

const getRecommendedActions = (category) => {
  return CATEGORY_INFO[category]?.actions || []
}

const callCustomer = () => {
  alert(`Calling ${selectedRequest.value.customerName} at ${selectedRequest.value.customerPhone}`)
}

const scheduleAppointment = () => {
  alert(`Scheduling appointment for ${selectedRequest.value.customerName}`)
}

const markCompleted = () => {
  customerRequests.value.splice(selectedRequestIdx.value, 1)
  selectedRequest.value = null
  selectedRequestIdx.value = null
  alert('Request marked as completed')
}
</script>

<style scoped>
.dispatcher-interface {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
}
</style>
