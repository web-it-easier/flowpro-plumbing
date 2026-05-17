/**
 * Integration Tests for lookupMaps.js
 * 
 * Step 2: Core pattern matching functions (memory-safe version)
 * Tests functions that don't trigger heavy pattern building
 * Uses mock data for predictable test results
 */

// Import mock helpers to avoid memory issues and data structure mismatches
import { 
  createTestFindFixableItems,
  createTestFindDamageLocations,
  createTestFindFixableItemsAndDamageLocations,
  createTestFindSymptomMatches,
  createTestDebugMatches
} from './testUtils.js'
import { mockPlumbingIssueItems, mockDamagePlaceLookup, mockSymptoms } from './mockData.js'

// Create test versions using mock data (memory-safe)
const findFixableItems = createTestFindFixableItems(mockPlumbingIssueItems)
const findDamageLocations = createTestFindDamageLocations(mockDamagePlaceLookup)
const findFixableItemsAndDamageLocations = createTestFindFixableItemsAndDamageLocations(mockPlumbingIssueItems, mockDamagePlaceLookup)
const findSymptomMatches = createTestFindSymptomMatches(mockSymptoms)
const debugMatches = createTestDebugMatches({}, mockSymptoms)

describe('lookupMaps - Integration Tests (Memory-Safe)', () => {

  describe('New API Functions', () => {
  describe('findFixableItems', () => {
    test('should find plumbing fixtures in text', () => {
      const result = findFixableItems('The toilet is leaking')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('alias')
      expect(result[0]).toHaveProperty('dispatchCategory')
    })
    
    test('should find multiple plumbing items', () => {
      const result = findFixableItems('The kitchen sink and bathroom toilet are leaking')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(1)
      
      const itemIds = result.map(r => r.id)
      expect(itemIds).toContain('sink')
      expect(itemIds).toContain('toilet')
    })
    
    test('should return empty array for no plumbing items', () => {
      const result = findFixableItems('no plumbing items here')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
    
    test('should handle case insensitive matching', () => {
      const result1 = findFixableItems('TOILET is LEAKING')
      const result2 = findFixableItems('toilet is leaking')
      expect(result1.length).toBe(result2.length)
      
      const ids1 = result1.map(r => r.id).sort()
      const ids2 = result2.map(r => r.id).sort()
      expect(ids1).toEqual(ids2)
    })
    
    test('should include position information', () => {
      const result = findFixableItems('The toilet is leaking')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      expect(result[0]).toHaveProperty('start')
      expect(result[0]).toHaveProperty('end')
      expect(typeof result[0].start).toBe('number')
      expect(typeof result[0].end).toBe('number')
      expect(result[0].end).toBeGreaterThan(result[0].start)
    })
  })

  describe('findDamageLocations', () => {
    test('should find damage locations in text', () => {
      const result = findDamageLocations('The bathroom ceiling is wet')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('alias')
      expect(result[0]).toHaveProperty('category')
    })
    
    test('should find multiple damage locations', () => {
      const result = findDamageLocations('The bathroom ceiling and kitchen wall are damaged')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(1)
      
      const locationIds = result.map(r => r.id)
      expect(locationIds).toContain('bathroom')
      expect(locationIds).toContain('ceiling')
      expect(locationIds).toContain('kitchen')
      expect(locationIds).toContain('wall')
    })
    
    test('should return empty array for no damage locations', () => {
      const result = findDamageLocations('no damage locations here')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
    
    test('should handle case insensitive matching', () => {
      const result1 = findDamageLocations('BATHROOM is wet')
      const result2 = findDamageLocations('bathroom is wet')
      expect(result1.length).toBe(result2.length)
      
      const ids1 = result1.map(r => r.id).sort()
      const ids2 = result2.map(r => r.id).sort()
      expect(ids1).toEqual(ids2)
    })
  })

  describe('findFixableItemsAndDamageLocations', () => {
    test('should return structured object with both categories', () => {
      const result = findFixableItemsAndDamageLocations('The toilet in the bathroom is leaking')
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('fixableItems')
      expect(result).toHaveProperty('damageLocations')
      expect(Array.isArray(result.fixableItems)).toBe(true)
      expect(Array.isArray(result.damageLocations)).toBe(true)
    })
    
    test('should find both plumbing items and locations', () => {
      const result = findFixableItemsAndDamageLocations('The toilet in the bathroom is leaking')
      
      // Should find plumbing item
      expect(result.fixableItems.length).toBeGreaterThan(0)
      expect(result.fixableItems[0].id).toBe('toilet')
      expect(result.fixableItems[0]).toHaveProperty('dispatchCategory')
      
      // Should find damage location
      expect(result.damageLocations.length).toBeGreaterThan(0)
      expect(result.damageLocations[0].id).toBe('bathroom')
      expect(result.damageLocations[0]).toHaveProperty('category')
    })
    
    test('should handle only plumbing items', () => {
      const result = findFixableItemsAndDamageLocations('The toilet is leaking')
      
      expect(result.fixableItems.length).toBeGreaterThan(0)
      expect(result.fixableItems[0].id).toBe('toilet')
      expect(result.damageLocations.length).toBe(0)
    })
    
    test('should handle only damage locations', () => {
      const result = findFixableItemsAndDamageLocations('The basement foundation is wet')
      
      expect(result.fixableItems.length).toBe(0)
      expect(result.damageLocations.length).toBeGreaterThan(0)
      expect(result.damageLocations.some(l => l.id === 'basement')).toBe(true)
      expect(result.damageLocations.some(l => l.id === 'foundation')).toBe(true)
    })
    
    test('should handle empty input', () => {
      const result = findFixableItemsAndDamageLocations('')
      
      expect(result.fixableItems).toEqual([])
      expect(result.damageLocations).toEqual([])
    })
  })
})

  describe('findSymptomMatches', () => {
    test('should find symptoms in text', () => {
      const result = findSymptomMatches('The toilet is leaking')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('urgency')
    })
    
    test('should find multiple symptoms in text', () => {
      const result = findSymptomMatches('The ceiling is leaking and dripping')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(1)
    })
    
    test('should handle case insensitive matching', () => {
      const result1 = findSymptomMatches('LEAKING toilet')
      const result2 = findSymptomMatches('leaking toilet')
      expect(result1.length).toBe(result2.length)
    })
    
    test('should return empty array for no symptoms', () => {
      const result = findSymptomMatches('no symptoms here')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('debugMatches', () => {
    test('should return debug information', () => {
      const result = debugMatches('The toilet is leaking')
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('fixableItems')
      expect(result).toHaveProperty('damageLocations')
      expect(result).toHaveProperty('symptoms')
      expect(result).toHaveProperty('patterns')
      expect(Array.isArray(result.fixableItems)).toBe(true)
      expect(Array.isArray(result.damageLocations)).toBe(true)
      expect(Array.isArray(result.symptoms)).toBe(true)
      expect(Array.isArray(result.patterns)).toBe(true)
    })
    
    test('should return empty arrays for no matches', () => {
      const result = debugMatches('no plumbing issues')
      expect(typeof result).toBe('object')
      expect(result.fixableItems).toEqual([])
      expect(result.damageLocations).toEqual([])
      expect(result.symptoms).toEqual([])
      expect(result.patterns).toEqual([])
    })
  })

  describe('Real-World Scenarios', () => {
    test('should handle typical customer description', () => {
      const { fixableItems, damageLocations } = findFixableItemsAndDamageLocations('My bathroom sink is leaking')
      const symptoms = findSymptomMatches('My bathroom sink is leaking')
      
      const allItems = [...fixableItems, ...damageLocations]
      expect(allItems.length).toBeGreaterThan(0)
      expect(symptoms.length).toBeGreaterThan(0)
      expect(allItems.some(a => a.id === 'bathroom' || a.id === 'sink')).toBe(true)
      expect(symptoms.some(s => s.id === 'leaking')).toBe(true)
    })
    
    test('should handle emergency description', () => {
      const { fixableItems, damageLocations } = findFixableItemsAndDamageLocations('Emergency! Water is bursting from the pipe and flooding my kitchen')
      const symptoms = findSymptomMatches('Emergency! Water is bursting from the pipe and flooding my kitchen')
      
      const allItems = [...fixableItems, ...damageLocations]
      expect(allItems.length).toBeGreaterThan(0)
      expect(symptoms.length).toBeGreaterThan(0)
      expect(allItems.some(a => a.id === 'kitchen')).toBe(true)
      expect(symptoms.some(s => s.id === 'bursting' || s.id === 'flooding')).toBe(true)
    })
  })

  describe('Performance Tests', () => {
    test('findFixableItems should be fast for simple lookups', () => {
      const startTime = performance.now()
      const result = findFixableItems('toilet')
      const endTime = performance.now()
      
      expect(Array.isArray(result)).toBe(true)
      expect(endTime - startTime).toBeLessThan(50)
    })
    
    test('findDamageLocations should be fast for simple lookups', () => {
      const startTime = performance.now()
      const result = findDamageLocations('bathroom')
      const endTime = performance.now()
      
      expect(Array.isArray(result)).toBe(true)
      expect(endTime - startTime).toBeLessThan(50)
    })
    
    test('findSymptomMatches should be efficient', () => {
      const startTime = performance.now()
      const result = findSymptomMatches('leaking dripping clogged')
      const endTime = performance.now()
      
      expect(Array.isArray(result)).toBe(true)
      expect(endTime - startTime).toBeLessThan(50)
    })
  })
})
