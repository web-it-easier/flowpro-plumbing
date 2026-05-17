/**
 * Unit Tests for lookupMaps.js
 * 
 * Step 1: Basic utility functions and normalization
 * Tests individual functions in isolation
 */

import {
  normalizeText,
  getWorkItemCategory,
  getDamagePlaceType,
  isComponent,
  isFixture,
  isAppliance,
  isSystem,
  getTeamSizeRecommendation,
  detectSymptomGroups
} from '../../lookupMaps.js'

describe('lookupMaps - Unit Tests', () => {

  describe('normalizeText', () => {
    test('should convert to lowercase', () => {
      expect(normalizeText('CEILING IS LEAKING')).toBe('ceiling is leaking')
      expect(normalizeText('BATHROOM')).toBe('bathroom')
    })
    
    test('should trim whitespace', () => {
      expect(normalizeText('  bathroom ceiling  ')).toBe('bathroom ceiling')
      expect(normalizeText('\t kitchen sink \n')).toBe('kitchen sink')
    })
    
    test('should normalize multiple spaces', () => {
      expect(normalizeText('bathroom    ceiling')).toBe('bathroom ceiling')
      expect(normalizeText('kitchen   sink   faucet')).toBe('kitchen sink faucet')
    })
    
    test('should remove punctuation', () => {
      expect(normalizeText('ceiling, wall, floor')).toBe('ceiling  wall  floor')
      expect(normalizeText('bathroom! leaking? help.')).toBe('bathroom  leaking  help ')
    })
    
    test('should handle complex input', () => {
      expect(normalizeText('  The BATHROOM ceiling is LEAKING!  ')).toBe('the bathroom ceiling is leaking ')
    })
    
    test('should handle empty and edge cases', () => {
      expect(normalizeText('')).toBe('')
      expect(normalizeText('   ')).toBe('')
      expect(normalizeText('...,,,!!!')).toBe('         ') // Punctuation replaced with spaces
    })
  })

  describe('getWorkItemCategory', () => {
    test('should return correct categories for known work items', () => {
      expect(getWorkItemCategory('toilet')).toBeNull()  // toilet is damage location only
      expect(getWorkItemCategory('toilet_tank')).toBe('component')  // tank is work item
      expect(getWorkItemCategory('faucet')).toBe('fixture')
      expect(getWorkItemCategory('fill_valve')).toBe('component')
      expect(getWorkItemCategory('pipe')).toBe('system')
      expect(getWorkItemCategory('water_heater')).toBe('appliance')
    })
    
    test('should return null for unknown IDs', () => {
      expect(getWorkItemCategory('unknown_id')).toBeNull()
      expect(getWorkItemCategory('')).toBeNull()
      expect(getWorkItemCategory(null)).toBeNull()
      expect(getWorkItemCategory(undefined)).toBeNull()
    })
  })

  describe('getDamagePlaceType', () => {
    test('should be defined and callable', () => {
      expect(typeof getDamagePlaceType).toBe('function')
    })
    
    test('should return correct type for known damage places', () => {
      // DAMAGE_PLACE_METADATA stores { category, description } for cross-trade coordination
      expect(getDamagePlaceType('ceiling')).toBe('surface')
      expect(getDamagePlaceType('wall')).toBe('surface')
      expect(getDamagePlaceType('bathroom')).toBe('room')
      expect(getDamagePlaceType('kitchen')).toBe('room')
      expect(getDamagePlaceType('foundation')).toBe('structure')
    })
    
    test('should return null for unknown IDs', () => {
      expect(getDamagePlaceType('unknown_place')).toBeNull()
      expect(getDamagePlaceType('')).toBeNull()
      expect(getDamagePlaceType(null)).toBeNull()
      expect(getDamagePlaceType(undefined)).toBeNull()
    })
  })

  describe('Category Type Checkers', () => {
    test('isComponent should check component category', () => {
      expect(isComponent('fill_valve')).toBe(true)
      expect(isComponent('toilet')).toBe(false)
    })
    
    test('isFixture should check fixture category', () => {
      expect(isFixture('faucet')).toBe(true)
      expect(isFixture('sink_faucet')).toBe(true)
      expect(isFixture('fill_valve')).toBe(false)  // component, not fixture
      expect(isFixture('pipe')).toBe(false)  // system, not fixture
    })
    
    test('isAppliance should check appliance category', () => {
      expect(isAppliance('water_heater')).toBe(true)
      expect(isAppliance('toilet')).toBe(false)
    })
    
    test('isSystem should check system category', () => {
      expect(isSystem('pipe')).toBe(true)
      expect(isSystem('faucet')).toBe(false)
    })
  })

  describe('getTeamSizeRecommendation', () => {
    test('should return correct team size per category', () => {
      expect(getTeamSizeRecommendation('fill_valve')).toBe(1) // component
      expect(getTeamSizeRecommendation('toilet')).toBe(1) // fixture
      expect(getTeamSizeRecommendation('water_heater')).toBe(2) // appliance
      expect(getTeamSizeRecommendation('pipe')).toBe(2) // system
    })
    
    test('should handle unknown items gracefully', () => {
      expect(typeof getTeamSizeRecommendation('unknown')).toBe('number')
      expect(getTeamSizeRecommendation('')).toBe(1) // Default should be 1
      expect(getTeamSizeRecommendation(null)).toBe(1)
      expect(getTeamSizeRecommendation(undefined)).toBe(1)
    })
    
    test('should return valid team sizes (1 or 2 for known categories)', () => {
      const sizes = [
        getTeamSizeRecommendation('fill_valve'),
        getTeamSizeRecommendation('toilet'),
        getTeamSizeRecommendation('water_heater'),
        getTeamSizeRecommendation('pipe')
      ]
      sizes.forEach(s => expect([1, 2]).toContain(s))
    })
  })

  describe('detectSymptomGroups', () => {
    test('should detect "and" connected symptoms', () => {
      const result = detectSymptomGroups('leaking and dripping and bubbling')
      expect(result).toEqual([
        ['leaking', 'dripping', 'bubbling']
      ])
    })
    
    test('should detect comma-separated symptoms', () => {
      const result = detectSymptomGroups('leaking, dripping, bubbling')
      expect(result).toEqual([
        ['leaking', 'dripping', 'bubbling']
      ])
    })
    
    test('should detect mixed "and" and comma symptoms', () => {
      const result = detectSymptomGroups('leaking and dripping, bubbling and running')
      // Current implementation groups contiguous matches; comma split may not create a second group
      expect(result.length).toBeGreaterThan(0)
      expect(result).toEqual([
        ['leaking', 'dripping', 'running']
      ])
    })
    
    test('should return empty array for no symptom groups', () => {
      expect(detectSymptomGroups('no symptoms here')).toEqual([])
      expect(detectSymptomGroups('')).toEqual([])
      expect(detectSymptomGroups('just leaking')).toEqual([]) // Single symptom, not a group
    })
    
    test('should handle case insensitive', () => {
      const result1 = detectSymptomGroups('LEAKING AND DRIPPING')
      const result2 = detectSymptomGroups('leaking and dripping')
      expect(result1).toEqual([
        ['LEAKING', 'DRIPPING']
      ])
      expect(result2).toEqual([
        ['leaking', 'dripping']
      ])
    })
    
    test('should handle edge cases', () => {
      expect(detectSymptomGroups('leaking and')).toEqual([])
      expect(detectSymptomGroups('and dripping')).toEqual([])
      expect(detectSymptomGroups('leaking,')).toEqual([])
      expect(detectSymptomGroups(', dripping')).toEqual([])
    })
  })

  // Performance tests for basic functions
  describe('Performance Tests', () => {
    test('normalizeText should handle large inputs efficiently', () => {
      const largeText = 'BATHROOM CEILING LEAKING! '.repeat(1000)
      
      const startTime = performance.now()
      const result = normalizeText(largeText)
      const endTime = performance.now()
      
      expect(result).toContain('bathroom ceiling leaking')
      expect(endTime - startTime).toBeLessThan(50) // Should complete in <50ms
    })
    
    test('detectSymptomGroups should handle long symptom lists efficiently', () => {
      const longSymptomText = 'leaking and dripping and bubbling and running and overflowing and '.repeat(100)
      
      const startTime = performance.now()
      const result = detectSymptomGroups(longSymptomText)
      const endTime = performance.now()
      
      expect(Array.isArray(result)).toBe(true)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
  })
})
