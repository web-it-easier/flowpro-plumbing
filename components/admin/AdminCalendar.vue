<template>
  <div class="booking-calendar">
    <!-- Calendar Header -->
    <div class="text-center mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl font-semibold mb-2">📅 Select Your Service Date</h3>
      <p class="text-sm sm:text-base text-gray-600">Choose when you'd like our plumbing service</p>
    </div>

    <!-- Month Navigation -->
    <div class="flex justify-between items-center mb-4 sm:mb-6">
      <button @click="previousMonth" data-nav="prev"
        class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="hidden sm:inline font-medium text-sm">Previous</span>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>

      <h4
        class="text-lg sm:text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {{ currentMonthDisplay }}</h4>

      <button @click="nextMonth" data-nav="next"
        class="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-x-1">
        <div class="flex items-center space-x-1 sm:space-x-2">
          <span class="hidden sm:inline font-medium text-sm">Next</span>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
    </div>

    <!-- Calendar Grid -->
    <CalendarGrid 
      :calendar-days="calendarDays"
      :selected-dates="selectedDateRange"
      :resource-bookings="resourceBookings"
      :plumbers="plumbers"
      :current-month="currentMonth"
      @selected-date="handleDateSelection"
    />

    <!-- 🎨 Calendar Legend Component -->
    <CalendarLegend />

    <!-- 🆕 Job Type Selection -->
    <JobTypeSelector @job-type-selected="handleJobTypeSelection" />

    <!-- Selected Date Display -->
    <div v-if="selectedDateRange.length > 0"
      class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-blue-800 flex items-center text-sm sm:text-base">
          📅 You Selected:
        </h4>
        <button @click="clearSelection"
          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors" title="Clear selection">
          ❌
        </button>
      </div>
      <p class="text-sm sm:text-base text-blue-700 font-medium">
        {{ formatDateRange(selectedDateRange) }}
      </p>
      <p class="text-xs sm:text-sm text-blue-600 mt-1">
        {{ selectedDateRange.length }} day{{ selectedDateRange.length > 1 ? 's' : '' }} selected
      </p>
    </div>

    <!-- Resource Selection Section -->
    <div v-if="selectedDateRange.length > 0 || selectedJobTypes.length > 0"
      class="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border-2 border-green-200 resource-ui">
      
      <!-- View Mode Toggle -->
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-green-800 text-sm sm:text-base">
          👥 Available Plumbers:
        </h4>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-600 font-medium">View:</span>
          <select 
            v-model="plumberViewMode"
            class="px-3 py-1.5 text-xs sm:text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer"
          >
            <option value="jobTypes">🔧 Filtered by Job Types</option>
            <option value="all">👥 All Plumbers</option>
            <option value="all-by-availability">👥 All Plumbers (Sorted by Availability)</option>
            <option value="available">👥 All Available Plumbers</option>
            <option value="unavailable">👥 All Unavailable Plumbers</option>
          </select>
        </div>
      </div>

      <!-- No plumbers available message -->
      <div v-if="displayedPlumbers.length === 0" class="text-center py-3 sm:py-4">
        <p class="text-red-600 font-medium text-sm sm:text-base">
          {{ plumbersListState.title }}
        </p>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">
          {{ plumbersListState.message }}
        </p>
      </div>

      <!-- Plumber list -->
      <div v-else class="space-y-2 sm:space-y-3">

        <label v-for="plumber in displayedPlumbers" :key="plumber.id"
          class="flex items-center p-2 sm:p-3 bg-white rounded-lg cursor-pointer hover:bg-green-100 transition-all duration-200 border-2 border-transparent hover:border-green-300">
          <input type="checkbox" :value="plumber.id" v-model="selectedPlumbers"
            class="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500">

          <div class="flex-1">
            <div class="flex items-center">
              <span class="text-xl sm:text-2xl mr-2">{{ plumber.avatar }}</span>
              <div>
                <span class="font-medium text-gray-800 text-sm sm:text-base">{{ plumber.displayName }}</span>
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ plumber.level.charAt(0).toUpperCase() + plumber.level.slice(1) }} • ${{ plumber.rate }}/hr
                </div>
                <div class="text-xs mt-1 hidden sm:block">
                  <span v-for="spec in plumber.specialties" :key="spec"
                    class="mr-1 inline-block px-2 py-0.5 rounded-full border" :class="isSpecialtyRequired(spec)
                      ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                      : 'bg-gray-100 text-gray-500 border-gray-200'">
                    {{ spec }}
                  </span>
                </div>

              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs sm:text-sm font-medium text-green-600" :class="plumberStatusColor(plumber)">
              {{ plumberStatusIcon(plumber) }} {{ plumberStatusText(plumber) }}
            </div>
          </div>
        </label>
      </div>

      <!-- Team size recommendation - now handles multiple job types -->
      <div v-if="selectedJobTypes.length > 0" class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center mb-2">
          <span class="text-lg mr-2"> team</span>
          <div>
            <p class="font-medium text-blue-900">Recommended Team Size</p>
            <p class="text-sm text-blue-700">{{ getTotalTeamSize(selectedJobTypes) }} plumbers for {{ selectedJobTypes.length }} job{{ selectedJobTypes.length > 1 ? 's' : '' }}</p>
          </div>
        </div>
        <div class="text-xs text-blue-600">
          <p>Industry standard: {{ getCombinedJobDescription(selectedJobTypes) }}</p>
        </div>
        <div v-if="selectedJobTypes.length > 1" class="mt-2 pt-2 border-t border-blue-200">
          <p class="text-xs text-blue-600 font-medium">Selected jobs:</p>
          <ul class="text-xs text-blue-600 mt-1">
            <li v-for="jobType in selectedJobTypes" :key="jobType.id">
              {{ jobType.name }}: {{ getSingleJobTeamSize(jobType) }} plumber{{ getSingleJobTeamSize(jobType) > 1 ? 's' : '' }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Selected plumbers summary with validation -->
      <div v-if="selectedPlumbers.length > 0" class="mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg" :class="teamValidationClass">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs sm:text-sm font-medium" :class="teamValidationTextColor">
              <strong>{{ selectedPlumbers.length }}</strong> plumber{{ selectedPlumbers.length > 1 ? 's' : '' }} selected
              <span v-if="teamValidationMessage" class="ml-2">({{ teamValidationMessage }})</span>
            </p>
            <p class="text-xs mt-1" :class="teamValidationSubTextColor">
              Team Rate: ${{ teamHourlyRate }}/hr
            </p>
            <p class="text-xs mt-1" :class="teamValidationSubTextColor">
              Estimated Job Cost: ${{ estimatedJobCost.toLocaleString() }}
              <span class="text-gray-500">({{ getCombinedDuration(selectedJobTypes) }})</span>
            </p>
            <div v-if="selectedDateRange.length > 0" class="text-xs mt-1" :class="teamValidationSubTextColor">
              Total for {{ selectedDateRange.length }} day{{ selectedDateRange.length > 1 ? 's' : '' }}: ${{ totalCost.toLocaleString() }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold" :class="teamValidationTextColor">
              {{ getTeamEmoji() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Actions -->
    <div v-if="selectedDateRange.length > 0" class="space-y-2 sm:space-y-3 resource-ui">
      <!-- Add to Booking Button -->
      <button @click="addBooking" :disabled="!canAddBooking"
        class="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:bg-gray-300 disabled:cursor-not-allowed">
        � Add to Booking
        <span v-if="canAddBooking" class="ml-2 text-xs sm:text-sm">
          ({{ selectedPlumbers.length }} plumber{{ selectedPlumbers.length > 1 ? 's' : '' }}, ${{ totalCost.toLocaleString() }})
        </span>
      </button>
    </div>
    <!-- Current Bookings Summary -->
    <div v-if="currentBookings.length > 0"
      class="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 booking-ui">
      <h4 class="font-semibold text-yellow-800 mb-2 sm:mb-3 flex items-center justify-between text-sm sm:text-base">
        <span>📋 Current Bookings : ({{ currentBookings.length }}) </span>
        <button @click="clearAllBookings" class="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium">
          Clear All
        </button>
      </h4>

      <div class="space-y-2">
        <div v-for="(booking, index) in currentBookings" :key="booking.id"
          class="p-2 sm:p-3 bg-white rounded-lg border border-yellow-200">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm sm:text-base">
                {{ formatDateRange(booking.dates) }} • 
                <span v-if="booking.jobTypes && booking.jobTypes.length > 0">
                  {{ booking.jobTypes.map(jt => jt.name).join(' + ') }}
                </span>
                <span v-else>General Work</span>
              </p>
              <p class="text-xs sm:text-sm text-gray-600">
                {{booking.plumberDetails.map(p => p.displayName).join(', ')}}
              </p>
            </div>
            <div class="text-right ml-2">
              <p class="font-medium text-green-600 text-sm sm:text-base">${{ booking.totalCost.toLocaleString() }}</p>
              <button @click="removeBooking(booking.id)" class="text-xs text-red-600 hover:text-red-800 mt-1">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <button @click="proceedToCheckout"
        class="w-full mt-3 sm:mt-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base">
        💳 Proceed to Checkout
        <span class="ml-1 sm:ml-2 text-xs sm:text-sm">
          ({{ currentBookings.length }} booking{{ currentBookings.length > 1 ? 's' : '' }},
          ${{currentBookings.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString()}})
        </span>
      </button>
    </div>

    <!-- Recent Activity Feed -->
    <div v-if="bookingResult"
      class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">📋</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-800 mb-1">Recent Activity</h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            Booking created for {{ formatDateRange(selectedDateRange) }}
          </p>
          <p class="text-xs text-gray-500 mt-2">{{ new Date().toLocaleTimeString() }}</p>
        </div>
        <button @click="bookingResult = null" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          title="Dismiss">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import CalendarGrid from './CalendarGrid.vue'
import CalendarLegend from './CalendarLegend.vue'
import { chatPromptSubmit } from '#build/ui'
import JOB_TYPES from '../../data/jobTypes.json'
import { 
  getSingleJobTeamSize, 
  getTotalTeamSize, 
  getEstimatedDuration, 
  getJobTypeDescription,
  getCombinedJobDescription,
  getCombinedDuration,
  parseDurationToHours,
  calculateEstimatedJobCost,
  getTeamEmoji
} from '../../utils/teamCalculations.js'

// Component Interface
const props = defineProps({
  availableDates: {
    type: Array,
    default: () => [] // Array of available Date objects
  },
  bookedSlots: {
    type: Array,
    default: () => [] // Array of already booked time slots
  },
  minDate: {
    type: Date,
    default: () => new Date() // Can't book before today
  }
})



// Events flow UP from child to parent
const emit = defineEmits([
  'date-selected',      // When user picks a date
  'time-slot-selected', // When user picks a time
  'booking-confirmed',  // When user confirms booking
  'date-range-selected', // When user drags to pick a range
  // 🆕 Multi-resource booking events
  'booking-added',      // When booking is added to accumulation
  'booking-removed',    // When booking is removed from accumulation
  'all-bookings-cleared', // When all bookings are cleared
  'proceed-to-checkout' // When user wants to checkout
])

// Reactive State
const selectedDate = ref(null)

// Recent activity state
const bookingResult = ref(null)

// User's selected time slot - starts as null
const selectedTimeSlot = ref(null)

// Current month being displayed in calendar
const currentMonth = ref(new Date())

// URL Sync State
const route = useRoute()
const router = useRouter()

// Selection State
const selectedDateRange = ref([])
const selectedJobTypes = ref([]) // Track selected job types (array for multiple)
const plumberViewMode = ref('all') // View modes: 'jobTypes', 'all', 'all-by-availability', 'available', 'unavailable'

// Multi-Resource Booking State
import PLUMBERS from '~/data/plumbers.json'

const plumbers = ref(PLUMBERS)
const availabilityStatuses = {
  SELECTED: {
    text: 'Selected',
    icon: '👉',
    color: 'blue'
  },
  FULL: {
    text: 'All dates',
    icon: '✅',
    color: 'green'
  },
  PARTIAL: {
    text: 'Limited',
    icon: '⚠️',
    color: 'yellow'
  },
  NONE: {
    text: 'Unavailable',
    icon: '❌',
    color: 'red'
  }
}

// Future enhancement: Consider showing ALL plumbers with status

// Helper: count available dates for plumber
const getAvailableCountForPlumber = (plumberId) => {
  if (selectedDateRange.value.length === 0) return 0
  
  // Get existing bookings for this plumber
  const plumberBookings = resourceBookings.value.filter(b => b.plumberId === plumberId)
  // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
  const plumberBookedDates = new Set(
    plumberBookings.flatMap(booking => {
      const dates = Array.isArray(booking?.dates) ? booking.dates : []
      return dates.map(date => date.toDateString())
    })
  )

  // Count dates where this plumber is NOT booked
  let availableCount = 0
  for (const selectedDate of selectedDateRange.value) {
    // ✅ O(1) lookup instead of O(n × m) nested loops
    const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
    const isAvailableOnDate = !isBookedOnDate  // Clearer: true if plumber is free
    if (isAvailableOnDate) availableCount++   // Much easier to understand!
  }
  return availableCount
}

// Derive plumber status: SELECTED, FULL, PARTIAL, NONE
const getPlumberStatus = (plumber) => {

  // If plumber is selected for current booking, show as selected
  if (selectedPlumbers.value.includes(plumber.id)) return 'SELECTED'
  
  const totalSelected = selectedDateRange.value.length
  if (totalSelected === 0) return 'FULL'  // No dates selected = all available
  const availableCount = getAvailableCountForPlumber(plumber.id)
  if (availableCount === 0) return 'NONE'
  if (availableCount < totalSelected) return 'PARTIAL'
  return 'FULL'
}

const plumberStatusIcon = (plumber) => availabilityStatuses[getPlumberStatus(plumber)].icon
const plumberStatusText = (plumber) => availabilityStatuses[getPlumberStatus(plumber)].text
const plumberStatusColor = (plumber) => `text-${availabilityStatuses[getPlumberStatus(plumber)].color}-600`
// Selected plumbers for current booking
const selectedPlumbers = ref([])

// Accumulated bookings in current session
const currentBookings = ref([])

// Resource availability tracking
const resourceBookings = ref([
  // Example: { plumberId: 'A', dates: [date1, date2], bookingId: 'booking1' }
])

// URL Sync: Read URL on component load
onMounted(() => {
  readUrlParams()
})

// URL Sync: Read URL parameters
const readUrlParams = () => {
  const { start, end } = route.query

  if (start && end) {
    // Parse dates from URL
    const startDate = new Date(start)
    const endDate = new Date(end)

    // Validate dates
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {

      selectedDateRange.value = []

      // Build date range
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        selectedDateRange.value.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Set current month to show the selected range
      currentMonth.value = new Date(startDate)
    }
  }
}

// Computed Properties



// Multi-Resource Computed Properties
const availablePlumbers = computed(() => {
// If no dates selected, no plumbers available
  if (selectedDateRange.value.length === 0) return []

// Show all plumbers who are available on ANY selected date
  const availablePlumbers = plumbers.value.filter(plumber => {
    // Get existing bookings for this plumber
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumber.id
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking =>
        booking.dates.map(date => date.toDateString())
      )
    )

// Check if plumber is available on at least one selected date
    const hasSomeAvailability = selectedDateRange.value.some(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available on this date
    })

    return hasSomeAvailability
  })

  return availablePlumbers
})

// Get plumbers who match selected job type requirements
const plumbersMatchingJobRequirements = computed(() => {
// If no job types selected, show all available plumbers
  if (selectedJobTypes.value.length === 0) return availablePlumbers.value

  // Use all plumbers for job type matching, not just available ones
  const plumbersToFilter = selectedDateRange.value.length > 0 
    ? availablePlumbers.value 
    : plumbers.value

  return plumbersToFilter.filter(plumber => {
    return selectedJobTypes.value.some(jobType => {
// Check if plumber has required level
      const hasRequiredLevel = !jobType.requiredLevels?.length ||
        jobType.requiredLevels.includes(plumber.level)

// Check if plumber can handle emergency (if needed)
      const canHandleEmergency = !jobType.emergencyRequired ||
        plumber.emergencyAvailable

// Specialty requirement: overlap between job and plumber specialties
      const hasRequiredSpecialty = (() => {
        const requiredSpecialties = jobType.requiredSpecialties.map(s => s.toLowerCase())
        const plumberSpecialties = plumber.specialties.map(s => s.toLowerCase())
        return requiredSpecialties.some(required => plumberSpecialties.includes(required))
      })()

      return hasRequiredLevel &&
        hasRequiredSpecialty &&
        (!jobType.emergencyRequired || canHandleEmergency)
    })
  })
})

// Display plumbers based on view mode
const displayedPlumbers = computed(() => {
// Safety checks
  if (!plumbers.value || !Array.isArray(plumbers.value)) {
    return []
  }
  
  // View mode configuration with early returns
  const viewModes = {
    'all': () => plumbers.value,
    'all-by-availability': () => {
      const sorted = [...plumbers.value]
      const availabilityOrder = { 'SELECTED': 0, 'FULL': 1, 'PARTIAL': 2, 'NONE': 3 }
      return sorted.sort((a, b) => 
        availabilityOrder[getPlumberStatus(a)] - availabilityOrder[getPlumberStatus(b)]
      )
    },
    'available': () => availablePlumbers.value || [],
    'unavailable': () => plumbers.value.filter(plumber => getPlumberStatus(plumber) === 'NONE'),
    'jobTypes': () => plumbersMatchingJobRequirements.value || []
  }
  
  return viewModes[plumberViewMode.value]?.() || plumbers.value
})

// Plumbers list state title and status message
const plumbersListState = computed(() => {
  // Determine which view mode is active and whether job types are selected
  const isJobTypeMode = plumberViewMode.value === 'jobTypes' && selectedJobTypes.value.length > 0
  const isJobTypeModeNoSelection = plumberViewMode.value === 'jobTypes' && selectedJobTypes.value.length === 0

  // Handle "All Available Plumbers" view mode - shows message when no plumbers are available
  if (plumberViewMode.value === 'available') {
    return {
      title: '😔 No available plumbers',
      message: 'All plumbers are booked for these dates'
    }
  }

  // Handle "All Unavailable Plumbers" view mode - shows message when no plumbers are unavailable
  if (plumberViewMode.value === 'unavailable') {
    return {
      title: '😔 No unavailable plumbers',
      message: 'No unavailable plumbers found'
    }
  }

  // Handle "Filtered by Job Types" view mode WITH job types selected - 
  // shows message when no plumbers qualify for selected job types
  if (isJobTypeMode) {
    return {
      title: `😔 No plumbers qualified for ${selectedJobTypes.value.map(jt => jt.name).join(' + ')}`,
      message: 'Try different job types or check "All Plumbers" view'
    }
  }

  // Handle "Filtered by Job Types" view mode WITHOUT job types selected - prompts user to select job types
  if (isJobTypeModeNoSelection) {
    return {
      title: '😔 No plumbers found',
      message: 'Select job types to see qualified plumbers'
    }
  }

  // Default fallback for any other view modes - generic message
  return {
    title: '😔 No plumbers found',
    message: 'Try selecting different filters'
  }
})

// Helper: check if specialty is required by any selected job type 
const isSpecialtyRequired = (spec) => {
  if (selectedJobTypes.value.length === 0) return false
  
  return selectedJobTypes.value.some(jobType => {
    if (!jobType.requiredSpecialties?.length) return false
    const req = jobType.requiredSpecialties.map(s => String(s).toLowerCase())
    return req.includes(String(spec).toLowerCase())
  })
}

// Validate if enough plumbers available for required team size
const canFormRequiredTeam = computed(() => {
// If no job types selected, no team size requirement
  if (selectedJobTypes.value.length === 0) return true

  const availableCount = plumbersMatchingJobRequirements.value.length
  const maxTeamSize = getTotalTeamSize(selectedJobTypes.value)

  return availableCount >= maxTeamSize
})


// Selected plumbers details
const selectedPlumbersDetails = computed(() => {
  return selectedPlumbers.value.map(plumberId => {
    return plumbers.value.find(p => p.id === plumberId)
  }).filter(Boolean)
})

// Total cost for selected plumbers and dates
const totalCost = computed(() => {
  if (selectedPlumbersDetails.value.length === 0 || selectedDateRange.value.length === 0) {
    return 0
  }

  const days = selectedDateRange.value.length
  const dailyRate = selectedPlumbersDetails.value.reduce((sum, plumber) => sum + plumber.rate, 0)

  return days * dailyRate
})

// Can proceed with booking - check availability AND team validation
const canAddBooking = computed(() => {
// Basic requirements
  if (selectedDateRange.value.length === 0 || selectedPlumbers.value.length === 0) {
    return false
  }

// Check team validation first (job type requirements)
  if (!teamValidation.value.isValid) {
    return false
  }

// Check if at least one plumber is available for at least one date
  const hasAnyAvailability = selectedPlumbers.value.some(plumberId => {
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumberId
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking =>
        booking.dates.map(date => date.toDateString())
      )
    )

    return selectedDateRange.value.some(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available on this date
    })
  })

  return hasAnyAvailability
})

// Has accumulated bookings ready for checkout
const canCheckout = computed(() => {
  return currentBookings.value.length > 0
})

// Calendar Logic
const currentMonthDisplay = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
// TODO: Use International Temporal API when available
// Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

// Get starting weekday (0 = Sunday)
  const startDay = firstDay.getDay()

// Create array of calendar days
  const days = []

// Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push({
      day: '',
      date: null
    })
  }

// Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day: day,
      date: new Date(year, month, day)
    })
  }

  return days
})

// Calendar methods
const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
  clearSelection()
}

// Date selection handler from CalendarGrid
const handleDateSelection = (dateRange) => {
// CalendarGrid handles logic and gives final date range
  selectedDateRange.value = dateRange
// Keep single-day highlight and dependent UIs in sync
  selectedDate.value = dateRange[0] || null

// Update URL if we have dates selected
  if (dateRange.length > 0) {
    const start = dateRange[0].toISOString().split('T')[0]
    const end = dateRange[dateRange.length - 1].toISOString().split('T')[0]

    router.push({
      query: { start, end }
    })
  }

  emit('date-range-selected', dateRange)
}

// Handle job type selection from JobTypeSelector
const handleJobTypeSelection = (jobTypes) => {
  selectedJobTypes.value = jobTypes || []
// TODO: Use for team validation or AI suggestions
}

// Clear current selection (dates and plumbers)
const clearSelection = () => {
  selectedDateRange.value = []
  selectedPlumbers.value = []
  selectedDate.value = null
}

// Multi-Resource Booking Methods
// Add current selection to accumulated bookings
const addBooking = () => {
  if (!canAddBooking.value) return

  const booking = {
    id: `booking_${Date.now()}`,
    dates: [...selectedDateRange.value],
    plumbers: [...selectedPlumbers.value],
    plumberDetails: [...selectedPlumbersDetails.value],
    jobTypes: selectedJobTypes.value,
    totalCost: totalCost.value,
    createdAt: new Date()
  }

  currentBookings.value.push(booking)

// Update resource availability tracking - only book available dates
  selectedPlumbers.value.forEach(plumberId => {
    // Get existing bookings for this plumber
    const plumberBookings = resourceBookings.value.filter(booking =>
      booking.plumberId === plumberId
    )

    // 🚀 OPTIMIZATION: Use Set for O(1) date lookups instead of nested some() loops
    const plumberBookedDates = new Set(
      plumberBookings.flatMap(booking => {
        const dates = Array.isArray(booking?.dates) ? booking.dates : []
        return dates.map(date => date.toDateString())
      })
    )

// Find which dates are actually available for this plumber
    const availableDates = selectedDateRange.value.filter(selectedDate => {
      // ✅ O(1) lookup instead of O(n × m) nested loops
      const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
      return !isBookedOnDate  // Available if not booked
    })

// Only book if there are available dates
    if (availableDates.length > 0) {
      resourceBookings.value.push({
        plumberId: plumberId,
        dates: [...availableDates],
        bookingId: booking.id
      })
    }
  })

// Clear current selection for next booking
  selectedDateRange.value = []
  selectedPlumbers.value = []
  selectedDate.value = null

// Emit booking added event
  emit('booking-added', booking)
}

// Remove booking from accumulated bookings
const removeBooking = (bookingId) => {
  const bookingIndex = currentBookings.value.findIndex(b => b.id === bookingId)
  if (bookingIndex === -1) return

  const booking = currentBookings.value[bookingIndex]

// Remove from resource availability tracking
  resourceBookings.value = resourceBookings.value.filter(
    rb => rb.bookingId !== bookingId
  )

// Remove from accumulated bookings
  currentBookings.value.splice(bookingIndex, 1)

// Emit booking removed event
  emit('booking-removed', bookingId)
}

// Clear all accumulated bookings
const clearAllBookings = () => {
  currentBookings.value = []
  resourceBookings.value = []
  emit('all-bookings-cleared')
}

// Proceed to checkout with accumulated bookings
const proceedToCheckout = () => {
  if (!canCheckout.value) return

  const checkoutData = {
    bookings: [...currentBookings.value],
    totalCost: currentBookings.value.reduce((sum, booking) => sum + booking.totalCost, 0),
    checkoutDate: new Date()
  }

  emit('proceed-to-checkout', checkoutData)
}

// Format date range for display
const formatDateRange = (dates) => {
  if (!dates || dates.length === 0) return 'No dates selected'

  const start = dates[0].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  const end = dates[dates.length - 1].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (dates.length === 1) {
    return start
  }

  return `${start} - ${end} (${dates.length} days)`
}

// Team Assignment Functions (Industry Standard Implementation)
// All team calculation utilities are now imported from ../utils/teamCalculations.js

// Calculate team hourly rate
const teamHourlyRate = computed(() => {
  if (selectedPlumbers.value.length === 0) return 0
  
  const selectedPlumberDetails = plumbers.value.filter(plumber => 
    selectedPlumbers.value.includes(plumber.id)
  )
  
  return selectedPlumberDetails.reduce((total, plumber) => total + plumber.rate, 0)
})

// Calculate estimated job cost (team rate × estimated hours) - now handles multiple job types
const estimatedJobCost = computed(() => {
  return calculateEstimatedJobCost(selectedJobTypes.value, teamHourlyRate.value)
})

// parseDurationToHours is now imported from utils/teamCalculations.js

// Team validation logic - now handles multiple job types
const teamValidation = computed(() => {
  if (!selectedJobTypes.value || selectedJobTypes.value.length === 0) {
    return {
      isValid: true,
      message: 'No job type selected',
      type: 'neutral'
    }
  }
  
  if (selectedPlumbers.value.length === 0) {
    return {
      isValid: false,
      message: 'Select plumbers for these jobs',
      type: 'warning'
    }
  }
  
  const requiredSize = getTotalTeamSize(selectedJobTypes.value)
  const actualSize = selectedPlumbers.value.length
  
  if (actualSize < requiredSize) {
    return {
      isValid: false,
      message: `Need ${requiredSize - actualSize} more plumber${requiredSize - actualSize > 1 ? 's' : ''} for these jobs`,
      type: 'error'
    }
  }
  
  if (actualSize > requiredSize) {
    return {
      isValid: true,
      message: `${actualSize - requiredSize} extra plumber${actualSize - requiredSize > 1 ? 's' : ''}`,
      type: 'warning'
    }
  }
  
  return {
    isValid: true,
    message: 'Perfect team for these jobs!',
    type: 'success'
  }
})

// Computed properties for validation display
const teamValidationMessage = computed(() => teamValidation.value.message)
const teamValidationClass = computed(() => {
  const type = teamValidation.value.type
  return {
    'bg-green-100 border-green-300': type === 'success',
    'bg-yellow-100 border-yellow-300': type === 'warning',
    'bg-red-100 border-red-300': type === 'error',
    'bg-gray-100 border-gray-300': type === 'neutral'
  }
})
const teamValidationTextColor = computed(() => {
  const type = teamValidation.value.type
  return {
    'text-green-800': type === 'success',
    'text-yellow-800': type === 'warning',
    'text-red-800': type === 'error',
    'text-gray-800': type === 'neutral'
  }
})
const teamValidationSubTextColor = computed(() => {
  const type = teamValidation.value.type
  return {
    'text-green-600': type === 'success',
    'text-yellow-600': type === 'warning',
    'text-red-600': type === 'error',
    'text-gray-600': type === 'neutral'
  }
})

// getTeamEmoji is now imported from utils/teamCalculations.js

// Get selected job type (helper) - now handles multiple job types
const selectedJobType = computed(() => {
  return selectedJobTypes.value.length > 0 ? selectedJobTypes.value[0] : null
})

// All team calculation utilities are now imported from ../utils/teamCalculations.js


// Template and Methods (TODO sections removed)
</script>
