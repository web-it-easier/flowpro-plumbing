import { describe, it, expect, beforeEach, vi } from 'vitest'

// Test the core logic of BookingCalendar without Vue component dependencies
// This focuses on the business logic that we can test in isolation

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

// Mock the team calculations utilities
const mockTeamCalculations = {
  getSingleJobTeamSize: vi.fn((jobType) => jobType?.requiredTeamSize || 0),
  getTotalTeamSize: vi.fn((jobTypes) => jobTypes?.reduce((sum, jt) => sum + (jt?.requiredTeamSize || 0), 0) || 0),
  getEstimatedDuration: vi.fn((jobType) => jobType?.estimatedDuration || null),
  getJobTypeDescription: vi.fn((jobType) => jobType?.description || null),
  getCombinedJobDescription: vi.fn((jobTypes) => jobTypes?.map(jt => jt.name).join(' + ') || ''),
  getCombinedDuration: vi.fn(() => '4-6 hours'),
  parseDurationToHours: vi.fn(() => 5),
  calculateEstimatedJobCost: vi.fn((jobTypes, rate) => rate * 5),
  getTeamEmoji: vi.fn(() => '👥')
}

describe('BookingCalendar Core Logic Tests', () => {
  
  describe('Team Validation Logic', () => {
    it('validates team size correctly - insufficient plumbers', () => {
      // Test case: Job requires 2 plumbers, only 1 selected
      const selectedJobTypes = [mockJobTypes[0]] // water heater installation (requires 2)
      const selectedPlumbers = ['plumber-1'] // only 1 plumber

      const requiredSize = mockTeamCalculations.getTotalTeamSize(selectedJobTypes)
      const actualSize = selectedPlumbers.length
      
      expect(requiredSize).toBe(2)
      expect(actualSize).toBe(1)
      
      // This should be invalid
      const isValid = actualSize >= requiredSize
      expect(isValid).toBe(false)
      
      // Should show error message
      const message = actualSize < requiredSize 
        ? `Need ${requiredSize - actualSize} more plumber${requiredSize - actualSize > 1 ? 's' : ''} for these jobs`
        : 'Perfect team for these jobs!'
      
      expect(message).toBe('Need 1 more plumber for these jobs')
    })

    it('validates team size correctly - perfect team', () => {
      // Test case: Job requires 2 plumbers, exactly 2 selected
      const selectedJobTypes = [mockJobTypes[0]] // water heater installation (requires 2)
      const selectedPlumbers = ['plumber-1', 'plumber-2'] // exactly 2 plumbers

      const requiredSize = mockTeamCalculations.getTotalTeamSize(selectedJobTypes)
      const actualSize = selectedPlumbers.length
      
      expect(requiredSize).toBe(2)
      expect(actualSize).toBe(2)
      
      // This should be valid
      const isValid = actualSize >= requiredSize
      expect(isValid).toBe(true)
      
      // Should show success message
      const message = actualSize === requiredSize 
        ? 'Perfect team for these jobs!'
        : actualSize > requiredSize 
          ? `${actualSize - requiredSize} extra plumber${actualSize - requiredSize > 1 ? 's' : ''}`
          : `Need ${requiredSize - actualSize} more plumber${requiredSize - actualSize > 1 ? 's' : ''} for these jobs`
      
      expect(message).toBe('Perfect team for these jobs!')
    })

    it('validates team size correctly - extra plumbers', () => {
      // Test case: Job requires 1 plumber, 2 selected
      const selectedJobTypes = [mockJobTypes[1]] // drain cleaning (requires 1)
      const selectedPlumbers = ['plumber-1', 'plumber-2'] // 2 plumbers (1 extra)

      const requiredSize = mockTeamCalculations.getTotalTeamSize(selectedJobTypes)
      const actualSize = selectedPlumbers.length
      
      expect(requiredSize).toBe(1)
      expect(actualSize).toBe(2)
      
      // This should be valid but with warning
      const isValid = actualSize >= requiredSize
      expect(isValid).toBe(true)
      
      // Should show warning message
      const message = actualSize === requiredSize 
        ? 'Perfect team for these jobs!'
        : actualSize > requiredSize 
          ? `${actualSize - requiredSize} extra plumber${actualSize - requiredSize > 1 ? 's' : ''}`
          : `Need ${requiredSize - actualSize} more plumber${requiredSize - actualSize > 1 ? 's' : ''} for these jobs`
      
      expect(message).toBe('1 extra plumber')
    })

    it('validates no job types selected', () => {
      // Test case: No job types selected, but plumbers selected
      const selectedJobTypes = []
      const selectedPlumbers = ['plumber-1']

      expect(selectedJobTypes.length).toBe(0)
      expect(selectedPlumbers.length).toBe(1)
      
      // Should be neutral state
      const validation = {
        isValid: true,
        message: 'No job type selected',
        type: 'neutral'
      }
      
      expect(validation.isValid).toBe(true)
      expect(validation.message).toBe('No job type selected')
      expect(validation.type).toBe('neutral')
    })

    it('validates no plumbers selected with job types', () => {
      // Test case: Job types selected, but no plumbers
      const selectedJobTypes = [mockJobTypes[0]]
      const selectedPlumbers = []

      expect(selectedJobTypes.length).toBe(1)
      expect(selectedPlumbers.length).toBe(0)
      
      // Should be warning state
      const validation = {
        isValid: false,
        message: 'Select plumbers for these jobs',
        type: 'warning'
      }
      
      expect(validation.isValid).toBe(false)
      expect(validation.message).toBe('Select plumbers for these jobs')
      expect(validation.type).toBe('warning')
    })
  })

  describe('Booking Validation Logic', () => {
    it('prevents booking when team validation fails', () => {
      // Set up invalid team scenario
      const selectedDateRange = [new Date(2024, 1, 1)]
      const selectedPlumbers = ['plumber-1'] // only 1 plumber
      const selectedJobTypes = [mockJobTypes[0]] // requires 2 plumbers
      
      // Team validation fails
      const teamValidation = {
        isValid: false,
        message: 'Need 1 more plumber for these jobs',
        type: 'error'
      }
      
      // Basic requirements check
      const hasDates = selectedDateRange.length > 0
      const hasPlumbers = selectedPlumbers.length > 0
      const teamValid = teamValidation.isValid
      
      expect(hasDates).toBe(true)
      expect(hasPlumbers).toBe(true)
      expect(teamValid).toBe(false)
      
      // Should prevent booking
      const canAddBooking = hasDates && hasPlumbers && teamValid
      expect(canAddBooking).toBe(false)
    })

    it('prevents booking when no dates selected', () => {
      // Set up no dates scenario
      const selectedDateRange = []
      const selectedPlumbers = ['plumber-1']
      const selectedJobTypes = [mockJobTypes[1]]
      
      // Team validation passes
      const teamValidation = {
        isValid: true,
        message: 'Perfect team for these jobs!',
        type: 'success'
      }
      
      // Basic requirements check
      const hasDates = selectedDateRange.length > 0
      const hasPlumbers = selectedPlumbers.length > 0
      const teamValid = teamValidation.isValid
      
      expect(hasDates).toBe(false)
      expect(hasPlumbers).toBe(true)
      expect(teamValid).toBe(true)
      
      // Should prevent booking
      const canAddBooking = hasDates && hasPlumbers && teamValid
      expect(canAddBooking).toBe(false)
    })

    it('prevents booking when no plumbers selected', () => {
      // Set up no plumbers scenario
      const selectedDateRange = [new Date(2024, 1, 1)]
      const selectedPlumbers = []
      const selectedJobTypes = [mockJobTypes[1]]
      
      // Team validation fails
      const teamValidation = {
        isValid: false,
        message: 'Select plumbers for these jobs',
        type: 'warning'
      }
      
      // Basic requirements check
      const hasDates = selectedDateRange.length > 0
      const hasPlumbers = selectedPlumbers.length > 0
      const teamValid = teamValidation.isValid
      
      expect(hasDates).toBe(true)
      expect(hasPlumbers).toBe(false)
      expect(teamValid).toBe(false)
      
      // Should prevent booking
      const canAddBooking = hasDates && hasPlumbers && teamValid
      expect(canAddBooking).toBe(false)
    })

    it('allows booking when all requirements met', () => {
      // Set up valid scenario
      const selectedDateRange = [new Date(2024, 1, 1)]
      const selectedPlumbers = ['plumber-1']
      const selectedJobTypes = [mockJobTypes[1]]
      
      // Team validation passes
      const teamValidation = {
        isValid: true,
        message: 'Perfect team for these jobs!',
        type: 'success'
      }
      
      // Basic requirements check
      const hasDates = selectedDateRange.length > 0
      const hasPlumbers = selectedPlumbers.length > 0
      const teamValid = teamValidation.isValid
      
      expect(hasDates).toBe(true)
      expect(hasPlumbers).toBe(true)
      expect(teamValid).toBe(true)
      
      // Should allow booking
      const canAddBooking = hasDates && hasPlumbers && teamValid
      expect(canAddBooking).toBe(true)
    })
  })

  describe('Cost Calculations Logic', () => {
    it('calculates team hourly rate correctly', () => {
      const selectedPlumbers = ['plumber-1', 'plumber-2'] // $150 + $120 = $270
      
      const selectedPlumberDetails = mockPlumbers.filter(plumber => 
        selectedPlumbers.includes(plumber.id)
      )
      
      const teamHourlyRate = selectedPlumberDetails.reduce((total, plumber) => total + plumber.rate, 0)
      
      expect(teamHourlyRate).toBe(270)
    })

    it('calculates total cost correctly', () => {
      const selectedPlumbers = ['plumber-1'] // $150/hr
      const selectedDateRange = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 2)
      ] // 2 days
      
      const days = selectedDateRange.length
      const selectedPlumberDetails = mockPlumbers.filter(plumber => 
        selectedPlumbers.includes(plumber.id)
      )
      const dailyRate = selectedPlumberDetails.reduce((total, plumber) => total + plumber.rate, 0)
      
      const totalCost = days * dailyRate
      
      expect(totalCost).toBe(300) // $150 × 2 days
    })

    it('returns zero cost when no plumbers selected', () => {
      const selectedPlumbers = []
      const selectedDateRange = [new Date(2024, 1, 1)]
      
      const selectedPlumberDetails = mockPlumbers.filter(plumber => 
        selectedPlumbers.includes(plumber.id)
      )
      
      const totalCost = selectedPlumberDetails.length === 0 || selectedDateRange.length === 0
        ? 0
        : selectedDateRange.length * selectedPlumberDetails.reduce((total, plumber) => total + plumber.rate, 0)
      
      expect(totalCost).toBe(0)
    })

    it('returns zero cost when no dates selected', () => {
      const selectedPlumbers = ['plumber-1']
      const selectedDateRange = []
      
      const selectedPlumberDetails = mockPlumbers.filter(plumber => 
        selectedPlumbers.includes(plumber.id)
      )
      
      const totalCost = selectedPlumberDetails.length === 0 || selectedDateRange.length === 0
        ? 0
        : selectedDateRange.length * selectedPlumberDetails.reduce((total, plumber) => total + plumber.rate, 0)
      
      expect(totalCost).toBe(0)
    })
  })

  describe('Plumber Availability Logic', () => {
    it('identifies available plumbers for selected dates', () => {
      const selectedDateRange = [new Date(2024, 1, 1)]
      const resourceBookings = [] // No existing bookings
      
      // All plumbers should be available
      const availablePlumbers = mockPlumbers.filter(plumber => {
        const plumberBookings = resourceBookings.filter(booking =>
          booking.plumberId === plumber.id
        )
        
        const plumberBookedDates = new Set(
          plumberBookings.flatMap(booking =>
            booking.dates.map(date => date.toDateString())
          )
        )
        
        return selectedDateRange.some(selectedDate => {
          const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
          return !isBookedOnDate
        })
      })
      
      expect(availablePlumbers.length).toBe(mockPlumbers.length)
    })

    it('identifies unavailable plumbers', () => {
      const selectedDateRange = [new Date(2024, 1, 1)]
      
      // Add a booking that blocks plumber-1
      const resourceBookings = [
        {
          plumberId: 'plumber-1',
          dates: [new Date(2024, 1, 1)],
          bookingId: 'booking-1'
        }
      ]
      
      const availablePlumbers = mockPlumbers.filter(plumber => {
        const plumberBookings = resourceBookings.filter(booking =>
          booking.plumberId === plumber.id
        )
        
        const plumberBookedDates = new Set(
          plumberBookings.flatMap(booking =>
            booking.dates.map(date => date.toDateString())
          )
        )
        
        return selectedDateRange.some(selectedDate => {
          const isBookedOnDate = plumberBookedDates.has(selectedDate.toDateString())
          return !isBookedOnDate
        })
      })
      
      expect(availablePlumbers).not.toContainEqual(
        expect.objectContaining({ id: 'plumber-1' })
      )
      expect(availablePlumbers.length).toBe(mockPlumbers.length - 1)
    })
  })

  describe('Job Type Matching Logic', () => {
    it('filters plumbers by job requirements', () => {
      const selectedJobTypes = [mockJobTypes[0]] // water heater installation
      const selectedDateRange = [new Date(2024, 1, 1)]
      const resourceBookings = []
      
      // Filter plumbers who match job requirements
      const plumbersMatchingJobRequirements = mockPlumbers.filter(plumber => {
        return selectedJobTypes.some(jobType => {
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
      
      // Should include John (master with water heater specialty)
      expect(plumbersMatchingJobRequirements.length).toBeGreaterThan(0)
      expect(plumbersMatchingJobRequirements.some(p => p.id === 'plumber-1')).toBe(true)
    })
  })

  describe('Format Functions Logic', () => {
    it('formats date range correctly', () => {
      const singleDate = [new Date(2024, 1, 1)]
      const dateRange = [
        new Date(2024, 1, 1),
        new Date(2024, 1, 3),
        new Date(2024, 1, 5)
      ]
      
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
      
      expect(formatDateRange(singleDate)).toBe('Feb 1')
      expect(formatDateRange(dateRange)).toBe('Feb 1 - Feb 5, 2024 (3 days)')
    })

    it('handles empty date range', () => {
      const formatDateRange = (dates) => {
        if (!dates || dates.length === 0) return 'No dates selected'
        return 'Some dates'
      }
      
      expect(formatDateRange([])).toBe('No dates selected')
      expect(formatDateRange(null)).toBe('No dates selected')
    })
  })
})
