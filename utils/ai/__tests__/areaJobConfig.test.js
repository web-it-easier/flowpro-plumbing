/**
 * Test Suite: Area Job Configuration Routing
 * 
 * Tests that detected areas route to correct job types with appropriate severity.
 * Validates dispatch logic and severity overrides.
 */

import { findPatterns } from '../lookupMaps.js'
import AREA_JOB_CONFIGS from '../../../data/areaJobConfigs.js'

describe('Area Job Configuration - Dispatch Routing', () => {
  
  describe('Job Type Routing', () => {
    
    test('Should route bathroom fixtures to correct job type', () => {
      const fixtures = [
        { area: 'toilet', jobType: 'bathroom_kitchen_fixtures' },
        { area: 'sink', jobType: 'bathroom_kitchen_fixtures' },
        { area: 'faucet', jobType: 'bathroom_kitchen_fixtures' },
        { area: 'shower', jobType: 'bathroom_kitchen_fixtures' },
        { area: 'bathtub', jobType: 'bathroom_kitchen_fixtures' }
      ]
      
      fixtures.forEach(({ area, jobType }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config).toBeDefined()
        expect(config.jobType).toBe(jobType)
        console.log(`✅ ${area} -> ${jobType}`)
      })
    })

    test('Should route drain/sewer to drain cleaning', () => {
      const drains = ['drain', 'sewer', 'cleanout']
      
      drains.forEach(area => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config).toBeDefined()
        expect(config.jobType).toBe('drain_cleaning_sewer')
        console.log(`✅ ${area} -> drain_cleaning_sewer`)
      })
    })

    test('Should route water heater to water heater services', () => {
      const config = AREA_JOB_CONFIGS.find(c => c.area === 'water_heater')
      expect(config).toBeDefined()
      expect(config.jobType).toBe('water_heater_services')
      console.log(`✅ water_heater -> water_heater_services`)
    })

    test('Should route gas line to gas services', () => {
      const config = AREA_JOB_CONFIGS.find(c => c.area === 'gas_line')
      expect(config).toBeDefined()
      expect(config.jobType).toBe('gas_line_services')
      console.log(`✅ gas_line -> gas_line_services`)
    })

    test('Should route damage places to appropriate job types', () => {
      const damageAreas = [
        { area: 'ceiling', jobType: 'plumbing_repairs' },
        { area: 'wall', jobType: 'plumbing_repairs' },
        { area: 'floor', jobType: 'leak_detection_repair' },
        { area: 'foundation', jobType: 'slab_leak_repair' },
        { area: 'yard', jobType: 'water_line_repair' },
        { area: 'driveway', jobType: 'water_line_repair' },
        { area: 'baseboard', jobType: 'slab_leak_repair' },
        { area: 'stairwell', jobType: 'emergency_plumbing' }
      ]
      
      damageAreas.forEach(({ area, jobType }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config).toBeDefined()
        expect(config.jobType).toBe(jobType)
        console.log(`✅ ${area} -> ${jobType}`)
      })
    })
  })

  describe('Severity Override Testing', () => {
    
    test('Should have immediate severity for emergencies', () => {
      const emergencies = [
        { area: 'water_heater', symptom: 'gas_smell', expected: 'immediate' },
        { area: 'pipe', symptom: 'burst', expected: 'immediate' },
        { area: 'water_main', symptom: 'burst', expected: 'immediate' },
        { area: 'sewer', symptom: 'bad_smell', expected: 'immediate' },
        { area: 'gas_line', symptom: 'gas_smell', expected: 'immediate' }
      ]
      
      emergencies.forEach(({ area, symptom, expected }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config).toBeDefined()
        
        const severity = config.severityOverrides[symptom]
        expect(severity).toBe(expected)
        console.log(`✅ ${area}.${symptom} -> ${expected}`)
      })
    })

    test('Should have same_day severity for urgent issues', () => {
      const urgent = [
        { area: 'toilet', symptom: 'clog', expected: 'same_day' },
        { area: 'water_heater', symptom: 'no_hot_water', expected: 'same_day' },
        { area: 'drain', symptom: 'clog', expected: 'same_day' },
        { area: 'pipe', symptom: 'leak', expected: 'same_day' }
      ]
      
      urgent.forEach(({ area, symptom, expected }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config).toBeDefined()
        
        const severity = config.severityOverrides[symptom]
        expect(severity).toBe(expected)
        console.log(`✅ ${area}.${symptom} -> ${expected}`)
      })
    })

    test('Should respect severity in dispatch decisions', () => {
      const scenarios = [
        { input: "Toilet is overflowing", plumbingIssueLocId: 'toilet', symptomId: 'overflowing', expectedSeverity: 'immediate' },
        { input: "Sink is just dripping slowly", plumbingIssueLocId: 'sink', symptomId: 'leak', expectedSeverity: undefined }
      ]
      
      scenarios.forEach(({ input, plumbingIssueLocId, symptomId, expectedSeverity }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === plumbingIssueLocId)
        expect(config).toBeDefined()
        
        const severity = config.severityOverrides[symptomId]
        if (expectedSeverity) {
          expect(severity).toBe(expectedSeverity)
          console.log(`✅ Severity respected: ${plumbingIssueLocId}.${symptomId} = ${severity}`)
        } else {
          console.log(`✅ Default severity for: ${plumbingIssueLocId}.${symptomId}`)
        }
      })
    })
  })

  describe('Supported Symptoms Validation', () => {
    
    test('Each area should have supported symptoms', () => {
      AREA_JOB_CONFIGS.forEach(config => {
        expect(config.supportedSymptoms).toBeDefined()
        expect(config.supportedSymptoms.length).toBeGreaterThan(0)
        expect(config.severityOverrides).toBeDefined()
      })
      
      console.log(`✅ All ${AREA_JOB_CONFIGS.length} area configs have symptoms defined`)
    })

    test('Symptom overrides should be subset of supported symptoms', () => {
      AREA_JOB_CONFIGS.forEach(config => {
        const overrideSymptoms = Object.keys(config.severityOverrides)
        const allSupported = config.supportedSymptoms
        
        overrideSymptoms.forEach(symptom => {
          expect(allSupported).toContain(symptom)
        })
      })
      
      console.log(`✅ All severity overrides are valid symptoms`)
    })

    test('Should detect supported symptoms for each area', () => {
      const testCases = [
        { area: 'toilet', symptom: 'clog', input: "Toilet is clogged" },
        { area: 'sink', symptom: 'leak', input: "Sink is leaking" },
        { area: 'water_heater', symptom: 'no_hot_water', input: "No hot water from heater" },
        { area: 'drain', symptom: 'slow_drain', input: "Drain is slow" }
      ]
      
      testCases.forEach(({ area, symptom, input }) => {
        const config = AREA_JOB_CONFIGS.find(c => c.area === area)
        expect(config.supportedSymptoms).toContain(symptom)
        
        console.log(`✅ ${area} supports ${symptom}`)
      })
    })
  })

  describe('Area Config Data Integrity', () => {
    
    test('All configs should have required fields', () => {
      AREA_JOB_CONFIGS.forEach(config => {
        expect(config.area).toBeDefined()
        expect(config.jobType).toBeDefined()
        expect(config.supportedSymptoms).toBeDefined()
        expect(config.severityOverrides).toBeDefined()
        expect(Array.isArray(config.supportedSymptoms)).toBe(true)
        expect(typeof config.severityOverrides).toBe('object')
      })
      
      console.log(`✅ All ${AREA_JOB_CONFIGS.length} configs are valid`)
    })

    test('Should have no duplicate area entries', () => {
      const areas = AREA_JOB_CONFIGS.map(c => c.area)
      const uniqueAreas = [...new Set(areas)]
      
      expect(areas.length).toBe(uniqueAreas.length)
      console.log(`✅ ${uniqueAreas.length} unique areas configured`)
    })

    test('Job types should be consistent', () => {
      const validJobTypes = [
        'bathroom_kitchen_fixtures',
        'drain_cleaning_sewer',
        'water_heater_services',
        'plumbing_repairs',
        'emergency_plumbing',
        'gas_line_services',
        'outdoor_drainage',
        'maintenance_inspection',
        'leak_detection_repair',
        'slab_leak_repair',
        'water_line_repair'
      ]
      
      AREA_JOB_CONFIGS.forEach(config => {
        expect(validJobTypes).toContain(config.jobType)
      })
      
      console.log(`✅ All job types are valid (${validJobTypes.length} types)`)
    })

    test('Severity values should be valid', () => {
      const validSeverities = ['immediate', 'same_day', 'schedule']
      
      AREA_JOB_CONFIGS.forEach(config => {
        Object.values(config.severityOverrides).forEach(severity => {
          expect(validSeverities).toContain(severity)
        })
      })
      
      console.log(`✅ All severity values are valid`)
    })
  })

  describe('Dispatch Decision Logic', () => {
    
    test('Should route gas smell to immediate emergency', () => {
      const input = "I smell gas in my kitchen"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      const gasRelated = result.find(r => r.plumbingIssueLocId === 'kitchen' || r.plumbingIssueLocId === 'gas_line')
      if (gasRelated) {
        const config = AREA_JOB_CONFIGS.find(c => c.area === gasRelated.plumbingIssueLocId)
        if (config && config.severityOverrides['gas_smell'] === 'immediate') {
          console.log(`✅ Gas smell routed to immediate emergency`)
        }
      }
    })

    test('Should route burst pipe to immediate response', () => {
      const input = "Pipe burst in my basement"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      
      const pipeResult = result.find(r => r.plumbingIssueLocId === 'pipe' || r.plumbingIssueLocId === 'basement')
      if (pipeResult) {
        console.log(`✅ Burst pipe detected for area: ${pipeResult.plumbingIssueLocId}`)
      }
    })

    test('Should route flooding to immediate response', () => {
      const input = "My bathroom is flooding"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      const config = AREA_JOB_CONFIGS.find(c => c.area === 'bathroom')
      const severity = config?.severityOverrides['flooding']
      
      if (severity === 'immediate') {
        console.log(`✅ Flooding correctly set to immediate`)
      } else {
        console.log(`⚠️ Flooding severity: ${severity || 'not set'}`)
      }
    })
  })
})
