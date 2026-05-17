import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminCalendar from '../admin/AdminCalendar.vue'

// Mock data for testing
const mockPlumbers = [
  {
    id: 'plumber-1',
    displayName: 'John Doe',
    level: 'master',
    rate: 150,
    specialties: ['water heater', 'repiping'],
    emergencyAvailable: true,
    avatar: '👨‍🔧'
  },
  {
    id: 'plumber-2',
    displayName: 'Mike Smith',
    level: 'journeyman',
    rate: 120,
    specialties: ['drains', 'fixtures'],
    emergencyAvailable: false,
    avatar: '🔧'
  },
  {
    id: 'plumber-3',
    displayName: 'Tom Wilson',
    level: 'apprentice',
    rate: 80,
    specialties: ['fixtures', 'basic repairs'],
    emergencyAvailable: false,
    avatar: '👤'
  }
]

const mockJobTypes = [
  {
    id: 'water_heater_installation',
    name: 'Water Heater Installation',
    requiredTeamSize: 2,
    requiredLevels: ['master', 'journeyman'],
    requiredSpecialties: ['water heater'],
    estimatedDuration: '4-6 hours',
    basePrice: 250
  },
  {
    id: 'drain_cleaning',
    name: 'Drain Cleaning',
    requiredTeamSize: 1,
    requiredLevels: ['journeyman', 'apprentice'],
    requiredSpecialties: ['drains'],
    estimatedDuration: '2-3 hours',
    basePrice: 150
  }
]

// Mock the imported modules
vi.mock('~/data/plumbers.json', () => ({
  default: mockPlumbers
}))

vi.mock('~/data/jobTypes.json', () => ({
  default: mockJobTypes
}))

vi.mock('~/utils/teamCalculations.js', () => ({
  getSingleJobTeamSize: vi.fn((jobType) => jobType?.requiredTeamSize || 0),
  getTotalTeamSize: vi.fn((jobTypes) => jobTypes?.reduce((sum, jt) => sum + (jt?.requiredTeamSize || 0), 0) || 0),
  getEstimatedDuration: vi.fn((jobType) => jobType?.estimatedDuration || null),
  getJobTypeDescription: vi.fn((jobType) => jobType?.description || null),
  getCombinedJobDescription: vi.fn((jobTypes) => jobTypes?.map(jt => jt.name).join(' + ') || ''),
  getCombinedDuration: vi.fn(() => '4-6 hours'),
  parseDurationToHours: vi.fn(() => 5),
  calculateEstimatedJobCost: vi.fn((jobTypes, rate) => rate * 5),
  getTeamEmoji: vi.fn(() => '👥')
}))

describe('AdminCalendar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(AdminCalendar, {
      props: {
        availableDates: [],
        bookedSlots: [],
        minDate: new Date()
      }
    })
  })

  describe('Initial State', () => {
    it('renders without crashing', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('has empty initial state', () => {
      expect(wrapper.vm.selectedDateRange).toEqual([])
      expect(wrapper.vm.selectedPlumbers).toEqual([])
      expect(wrapper.vm.selectedJobTypes).toEqual([])
      expect(wrapper.vm.currentBookings).toEqual([])
      expect(wrapper.vm.resourceBookings).toEqual([])
    })
  })

  describe('Date Selection', () => {
    it('handles date range selection', async () => {
      const testDates = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 2),
        new Date(2024, 1, 3)
      ]

      await wrapper.vm.handleDateSelection(testDates)

      expect(wrapper.vm.selectedDateRange).toEqual(testDates)
      expect(wrapper.emitted('date-range-selected')).toBeTruthy()
      expect(wrapper.emitted('date-range-selected')[0]).toEqual([testDates])
    })

    it('clears selection when navigating to next month', async () => {
      // Set some initial state
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']

      // Navigate to next month
      await wrapper.vm.nextMonth()

      expect(wrapper.vm.selectedDateRange).toEqual([])
      expect(wrapper.vm.selectedPlumbers).toEqual([])
    })
  })

  describe('Job Type Selection', () => {
    it('handles job type selection', async () => {
      const selectedJobTypes = [mockJobTypes[0]]

      await wrapper.vm.handleJobTypeSelection(selectedJobTypes)

      expect(wrapper.vm.selectedJobTypes).toEqual(selectedJobTypes)
    })
  })

  describe('Plumber Selection', () => {
    it('updates selected plumbers when checkboxes change', async () => {
      const plumberCheckboxes = wrapper.findAll('input[type="checkbox"]')
      
      if (plumberCheckboxes.length > 0) {
        await plumberCheckboxes[0].setValue(true)
        expect(wrapper.vm.selectedPlumbers).toContain('plumber-1')
      }
    })
  })

  describe('Team Validation', () => {
    it('validates team size correctly - insufficient plumbers', async () => {
      // Select job type requiring 2 plumbers
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[0]])
      
      // Select only 1 plumber
      wrapper.vm.selectedPlumbers = ['plumber-1']

      const validation = wrapper.vm.teamValidation
      
      expect(validation.isValid).toBe(false)
      expect(validation.message).toContain('Need 1 more plumber')
      expect(validation.type).toBe('error')
    })

    it('validates team size correctly - perfect team', async () => {
      // Select job type requiring 2 plumbers
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[0]])
      
      // Select exactly 2 plumbers
      wrapper.vm.selectedPlumbers = ['plumber-1', 'plumber-2']

      const validation = wrapper.vm.teamValidation
      
      expect(validation.isValid).toBe(true)
      expect(validation.message).toBe('Perfect team for these jobs!')
      expect(validation.type).toBe('success')
    })

    it('validates team size correctly - extra plumbers', async () => {
      // Select job type requiring 1 plumber
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      
      // Select 2 plumbers (1 extra)
      wrapper.vm.selectedPlumbers = ['plumber-1', 'plumber-2']

      const validation = wrapper.vm.teamValidation
      
      expect(validation.isValid).toBe(true)
      expect(validation.message).toContain('1 extra plumber')
      expect(validation.type).toBe('warning')
    })

    it('validates no job types selected', () => {
      // No job types selected
      wrapper.vm.selectedJobTypes = []
      wrapper.vm.selectedPlumbers = ['plumber-1']

      const validation = wrapper.vm.teamValidation
      
      expect(validation.isValid).toBe(true)
      expect(validation.message).toBe('No job type selected')
      expect(validation.type).toBe('neutral')
    })

    it('validates no plumbers selected with job types', async () => {
      // Select job type but no plumbers
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[0]])
      wrapper.vm.selectedPlumbers = []

      const validation = wrapper.vm.teamValidation
      
      expect(validation.isValid).toBe(false)
      expect(validation.message).toBe('Select plumbers for these jobs')
      expect(validation.type).toBe('warning')
    })
  })

  describe('Booking Validation', () => {
    it('prevents booking when team validation fails', async () => {
      // Set up invalid team
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[0]]) // requires 2 plumbers
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1'] // only 1 plumber

      expect(wrapper.vm.canAddBooking).toBe(false)
    })

    it('prevents booking when no dates selected', async () => {
      // Set up valid team but no dates
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]]) // requires 1 plumber
      wrapper.vm.selectedDateRange = []
      wrapper.vm.selectedPlumbers = ['plumber-1']

      expect(wrapper.vm.canAddBooking).toBe(false)
    })

    it('prevents booking when no plumbers selected', async () => {
      // Set up dates and job types but no plumbers
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = []

      expect(wrapper.vm.canAddBooking).toBe(false)
    })

    it('allows booking when all requirements met', async () => {
      // Set up valid team, dates, and job types
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']

      expect(wrapper.vm.canAddBooking).toBe(true)
    })
  })

  describe('Booking Accumulation', () => {
    it('adds booking to accumulation', async () => {
      // Set up valid booking data
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']

      const initialBookingsCount = wrapper.vm.currentBookings.length

      await wrapper.vm.addBooking()

      expect(wrapper.vm.currentBookings.length).toBe(initialBookingsCount + 1)
      expect(wrapper.emitted('booking-added')).toBeTruthy()
    })

    it('clears selection after adding booking', async () => {
      // Set up valid booking data
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']

      await wrapper.vm.addBooking()

      expect(wrapper.vm.selectedDateRange).toEqual([])
      expect(wrapper.vm.selectedPlumbers).toEqual([])
    })

    it('removes booking from accumulation', async () => {
      // Add a booking first
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']
      await wrapper.vm.addBooking()

      const bookingId = wrapper.vm.currentBookings[0].id
      const initialBookingsCount = wrapper.vm.currentBookings.length

      await wrapper.vm.removeBooking(bookingId)

      expect(wrapper.vm.currentBookings.length).toBe(initialBookingsCount - 1)
      expect(wrapper.emitted('booking-removed')).toBeTruthy()
    })

    it('clears all bookings', async () => {
      // Add multiple bookings
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[1]])
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      wrapper.vm.selectedPlumbers = ['plumber-1']
      await wrapper.vm.addBooking()

      await wrapper.vm.clearAllBookings()

      expect(wrapper.vm.currentBookings).toEqual([])
      expect(wrapper.vm.resourceBookings).toEqual([])
      expect(wrapper.emitted('all-bookings-cleared')).toBeTruthy()
    })
  })

  describe('Cost Calculations', () => {
    it('calculates team hourly rate correctly', () => {
      wrapper.vm.selectedPlumbers = ['plumber-1', 'plumber-2'] // $150 + $120 = $270

      expect(wrapper.vm.teamHourlyRate).toBe(270)
    })

    it('calculates total cost correctly', () => {
      wrapper.vm.selectedPlumbers = ['plumber-1'] // $150/hr
      wrapper.vm.selectedDateRange = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 2)
      ] // 2 days

      expect(wrapper.vm.totalCost).toBe(300) // $150 × 2 days
    })

    it('returns zero cost when no plumbers selected', () => {
      wrapper.vm.selectedPlumbers = []
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]

      expect(wrapper.vm.totalCost).toBe(0)
    })

    it('returns zero cost when no dates selected', () => {
      wrapper.vm.selectedPlumbers = ['plumber-1']
      wrapper.vm.selectedDateRange = []

      expect(wrapper.vm.totalCost).toBe(0)
    })
  })

  describe('Checkout Flow', () => {
    it('prevents checkout when no bookings', () => {
      wrapper.vm.currentBookings = []

      expect(wrapper.vm.canCheckout).toBe(false)
    })

    it('allows checkout when bookings exist', () => {
      wrapper.vm.currentBookings = [
        { id: 'booking-1', totalCost: 300 }
      ]

      expect(wrapper.vm.canCheckout).toBe(true)
    })

    it('emits checkout event with correct data', async () => {
      const testBookings = [
        { id: 'booking-1', totalCost: 300 },
        { id: 'booking-2', totalCost: 200 }
      ]
      wrapper.vm.currentBookings = testBookings

      await wrapper.vm.proceedToCheckout()

      expect(wrapper.emitted('proceed-to-checkout')).toBeTruthy()
      expect(wrapper.emitted('proceed-to-checkout')[0][0]).toEqual({
        bookings: testBookings,
        totalCost: 500,
        checkoutDate: expect.any(Date)
      })
    })
  })

  describe('Calendar Navigation', () => {
    it('navigates to previous month', async () => {
      const initialMonth = new Date(wrapper.vm.currentMonth)
      const expectedPreviousMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() - 1)

      await wrapper.vm.previousMonth()

      expect(wrapper.vm.currentMonth.getMonth()).toBe(expectedPreviousMonth.getMonth())
    })

    it('navigates to next month', async () => {
      const initialMonth = new Date(wrapper.vm.currentMonth)
      const expectedNextMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() + 1)

      await wrapper.vm.nextMonth()

      expect(wrapper.vm.currentMonth.getMonth()).toBe(expectedNextMonth.getMonth())
    })

    it('displays current month correctly', () => {
      wrapper.vm.currentMonth = new Date(2024, 1, 1) // February 2024

      expect(wrapper.vm.currentMonthDisplay).toBe('February 2024')
    })
  })

  describe('URL Sync', () => {
    it('updates URL when dates are selected', async () => {
      const testDates = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 3)
      ]

      // Mock router
      const mockPush = vi.fn()
      wrapper.vm.$router = { push: mockPush }

      await wrapper.vm.handleDateSelection(testDates)

      expect(mockPush).toHaveBeenCalledWith({
        query: {
          start: '2024-02-01',
          end: '2024-02-03'
        }
      })
    })
  })

  describe('Plumber Availability', () => {
    it('identifies available plumbers for selected dates', () => {
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      
      // No existing bookings, so all plumbers should be available
      const availablePlumbers = wrapper.vm.availablePlumbers
      
      expect(availablePlumbers.length).toBe(mockPlumbers.length)
    })

    it('identifies unavailable plumbers', () => {
      wrapper.vm.selectedDateRange = [new Date(2024, 1, 1)]
      
      // Add a booking that blocks plumber-1
      wrapper.vm.resourceBookings = [
        {
          plumberId: 'plumber-1',
          dates: [new Date(2024, 1, 1)],
          bookingId: 'booking-1'
        }
      ]

      const availablePlumbers = wrapper.vm.availablePlumbers
      
      expect(availablePlumbers).not.toContainEqual(
        expect.objectContaining({ id: 'plumber-1' })
      )
    })
  })

  describe('Job Type Matching', () => {
    it('filters plumbers by job requirements', async () => {
      // Select water heater job (requires master/journeyman + water heater specialty)
      await wrapper.vm.handleJobTypeSelection([mockJobTypes[0]])
      wrapper.vm.plumberViewMode = 'jobTypes'

      const matchingPlumbers = wrapper.vm.displayedPlumbers
      
      // Should include John (master with water heater specialty) and Mike (journeyman)
      expect(matchingPlumbers.length).toBeGreaterThan(0)
      expect(matchingPlumbers.some(p => p.id === 'plumber-1')).toBe(true)
    })
  })

  describe('Format Functions', () => {
    it('formats date range correctly', () => {
      const singleDate = [new Date(2024, 1, 1)]
      const dateRange = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 3),
        new Date(2024, 1, 5)
      ]

      expect(wrapper.vm.formatDateRange(singleDate)).toBe('Feb 1')
      expect(wrapper.vm.formatDateRange(dateRange)).toBe('Feb 1 - Feb 5, 2024 (3 days)')
    })

    it('handles empty date range', () => {
      expect(wrapper.vm.formatDateRange([])).toBe('No dates selected')
      expect(wrapper.vm.formatDateRange(null)).toBe('No dates selected')
    })
  })
})
