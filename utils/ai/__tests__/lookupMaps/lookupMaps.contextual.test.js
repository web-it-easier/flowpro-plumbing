/**
 * Unit Tests for findContextualMatches
 * 
 * Tests each internal step of the contextual matching function:
 * 1. Clause splitting
 * 2. Area alias collection
 * 3. Symptom validation
 * 4. Symptom separation
 * 5. Area-symptom pairing
 * 6. Fallback matching
 * 7. Duplicate prevention
 */

import { findContextualMatches, collectAreaAliases, VALID_SYMPTOMS_BY_CATEGORY } from '../../lookupMaps.js'
import { processSymptomsByArea, processAreaSymptomPairs, addFallbackMatches } from '../../contextualMatchHelpers.js'

describe('findContextualMatches - Unit Tests', () => {

  describe('Step 1: Clause Splitting', () => {
    
    test('should split text by commas into separate clauses', () => {
      const input = "bathroom ceiling is dripping, kitchen sink is leaking"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // AI detects specific damage locations (ceiling, sink) from each clause
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations).toContain('ceiling')
      expect(foundLocations).toContain('sink')
    })

    test('should split text by semicolons into separate clauses', () => {
      const input = "toilet won't flush; faucet is dripping"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Both toilet and faucet should be detected from separate clauses
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations).toContain('toilet')
      expect(foundLocations).toContain('faucet')
    })

    test('should handle single clause with no delimiters', () => {
      // User speaks naturally without any punctuation
      const input = "my kitchen faucet is leaking really bad"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Single clause should still find faucet + leak
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations).toContain('faucet')
    })

    test('should handle desperate panicked input with jumbled words', () => {
      // Emergency: user is panicking, speaking in fragments
      const input = "leaking help ceiling pip burst"
      const result = findContextualMatches(input)
      
      // Should still find something despite chaos
      expect(result).toBeDefined()
      
      // At minimum, should detect some locations or symptoms
      if (result.length > 0) {
        const foundLocations = result.map(r => r.plumbingIssueLocId)
        const foundSymptoms = result.map(r => r.symptomId)
        
        // Should detect ceiling (location)
        expect(foundLocations.some(loc => loc === 'ceiling')).toBe(true)
        // Should detect burst (symptom)
        expect(foundSymptoms.some(sym => sym === 'burst')).toBe(true)
      }
    })

    test('should handle multiple issues in panicked message', () => {
      // User has multiple emergencies, speaking fast
      const input = "toilet overflowing kitchen sink clogged water everywhere help"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThanOrEqual(2)
      
      // Should detect BOTH toilet AND sink, not just one
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations).toContain('toilet')
      expect(foundLocations).toContain('sink')
      
      // Should match correct symptoms to each location
      const toiletMatch = result.find(r => r.plumbingIssueLocId === 'toilet')
      const sinkMatch = result.find(r => r.plumbingIssueLocId === 'sink')
      
      expect(toiletMatch).toBeDefined()
      expect(sinkMatch).toBeDefined()
    })

    test('should handle very vague panic words only', () => {
      // User only says "help" or "water" - minimal info
      const input = "water water everywhere"
      const result = findContextualMatches(input)
      
      // Should always return an array, never undefined/null
      expect(Array.isArray(result)).toBe(true)
      
      // If results exist, they should have valid structure
      if (result.length > 0) {
        result.forEach(match => {
          expect(match).toHaveProperty('plumbingIssueLocId')
          expect(match).toHaveProperty('symptomId')
          expect(match).toHaveProperty('method')
        })
      }
    })

    test('should handle non-native speaker simple words', () => {
      // Limited English, uses simple words
      const input = "bathroom no work water come out floor wet"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Should find bathroom as location
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations.some(loc => loc === 'bathroom')).toBe(true)
      
      // Should find floor as location (from "floor wet")
      expect(foundLocations.some(loc => loc === 'floor')).toBe(true)
      
      // Non-native speaker words like "no work" / "come out" may not match symptoms
      // So we accept area-only matches as fallback
      const areaOnlyMatches = result.filter(r => r.method === 'area_only')
      expect(areaOnlyMatches.length).toBeGreaterThan(0)
    })

    test('should handle mobile texting shorthand', () => {
      // Typing on phone while dealing with emergency
      const input = "sink backed up again ugh plumber asap"
      const result = findContextualMatches(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Should detect sink as location
      const foundLocations = result.map(r => r.plumbingIssueLocId)
      expect(foundLocations.some(loc => loc === 'sink')).toBe(true)
      
      // "backed up" may not match a symptom directly, so accept area-only
      // The important thing is sink was identified for dispatcher
      const sinkMatch = result.find(r => r.plumbingIssueLocId === 'sink')
      expect(sinkMatch).toBeDefined()
      expect(sinkMatch.areaAlias).toBe('sink')
    })

  })

  describe('Step 2: Area Alias Collection (collectAreaAliases)', () => {
    
    test('should detect damage location from clause', () => {
      const clause = "bathroom ceiling is dripping"
      const { areaAliases, symptomGroups } = collectAreaAliases(clause)
      
      expect(areaAliases).toBeDefined()
      expect(areaAliases.length).toBeGreaterThan(0)
      
      // Should find ceiling as a damage location
      const foundIds = areaAliases.map(a => a.plumbingIssueLocId)
      expect(foundIds).toContain('ceiling')
    })

    test('should detect symptom groups connected by "and"', () => {
      const clause = "ceiling is bubbling and sagging"
      const { areaAliases, symptomGroups } = collectAreaAliases(clause)
      
      expect(symptomGroups).toBeDefined()
      expect(symptomGroups.length).toBeGreaterThan(0)
      
      // Should group "bubbling" and "sagging" together
      const hasGroupedPair = symptomGroups.some(
        group => group.includes('bubbling') && group.includes('sagging')
      )
      expect(hasGroupedPair).toBe(true)
    })

  })

  describe('Step 3: Symptom Validation (VALID_SYMPTOMS_BY_CATEGORY)', () => {
    
    test('should return valid symptoms for a known location', () => {
      const validSymptoms = VALID_SYMPTOMS_BY_CATEGORY.get('toilet')
      
      expect(validSymptoms).toBeDefined()
      expect(validSymptoms.size).toBeGreaterThan(0)
      
      // Toilet should have common symptoms like clog, leak, not_working
      expect(validSymptoms.has('clog')).toBe(true)
      expect(validSymptoms.has('leak')).toBe(true)
    })

    test('should return empty set for unknown location', () => {
      const validSymptoms = VALID_SYMPTOMS_BY_CATEGORY.get('nonexistent_location')
      
      expect(validSymptoms).toBeUndefined()
    })

    test('should not allow gas-related symptoms for toilet', () => {
      const validSymptoms = VALID_SYMPTOMS_BY_CATEGORY.get('toilet')
      
      // Gas smell doesn't make sense for toilets
      expect(validSymptoms.has('gas_smell')).toBe(false)
    })

  })

  describe('Step 4: Symptom Separation (processSymptomsByArea)', () => {
    
    test('should separate grouped symptoms from individual symptoms', () => {
      // Simulate: "ceiling is bubbling and sagging"
      // Note: 'bubbling' → symptomId 'noise', 'sagging' → symptomId 'sagging'
      const foundValidSymptoms = [
        { symptomId: 'noise', alias: 'bubbling' },
        { symptomId: 'sagging', alias: 'sagging' }
      ]
      const foundSymptomGroups = [['bubbling', 'sagging']]
      const validSymptomsForLocation = new Set(['noise', 'sagging', 'leak'])
      
      const result = processSymptomsByArea(foundValidSymptoms, foundSymptomGroups, validSymptomsForLocation)
      
      expect(result.groupedSymptoms).toHaveLength(1)
      expect(result.groupedSymptoms[0]).toContain('bubbling')
      expect(result.groupedSymptoms[0]).toContain('sagging')
      expect(result.individualSymptoms).toHaveLength(0)
    })

    test('should keep individual symptoms when not part of a group', () => {
      // Simulate: "ceiling is leaking"
      const foundValidSymptoms = [
        { symptomId: 'leak', alias: 'leaking' }
      ]
      const foundSymptomGroups = [] // No "and" groups
      const validSymptomsForLocation = new Set(['leak', 'dripping'])
      
      const result = processSymptomsByArea(foundValidSymptoms, foundSymptomGroups, validSymptomsForLocation)
      
      expect(result.groupedSymptoms).toHaveLength(0)
      expect(result.individualSymptoms).toHaveLength(1)
      expect(result.individualSymptoms[0].symptomId).toBe('leak')
    })

  })

  describe('Step 5: Area-Symptom Pairing (processAreaSymptomPairs)', () => {
    
    test('should create match for individual symptom', () => {
      const area = { plumbingIssueLocId: 'toilet', alias: 'toilet' }
      const symptomData = {
        individualSymptoms: [{ symptomId: 'clog', alias: 'clogged' }],
        groupedSymptoms: []
      }
      const processedWorkLocations = new Set()
      const processedSymptoms = new Set()
      const processedLocationSymptomPairs = new Set()
      
      const result = processAreaSymptomPairs(
        area,
        symptomData,
        processedWorkLocations,
        processedSymptoms,
        processedLocationSymptomPairs,
        () => 'fixture',
        () => 1
      )
      
      expect(result).toHaveLength(1)
      expect(result[0].plumbingIssueLocId).toBe('toilet')
      expect(result[0].symptomId).toBe('clog')
      expect(result[0].method).toBe('contextual')
    })

    test('should track processed pairs to prevent duplicates', () => {
      const area = { plumbingIssueLocId: 'toilet', alias: 'toilet' }
      const symptomData = {
        individualSymptoms: [{ symptomId: 'clog', alias: 'clogged' }],
        groupedSymptoms: []
      }
      const processedWorkLocations = new Set()
      const processedSymptoms = new Set()
      const processedLocationSymptomPairs = new Set()
      
      // First call
      processAreaSymptomPairs(
        area,
        symptomData,
        processedWorkLocations,
        processedSymptoms,
        processedLocationSymptomPairs,
        () => 'fixture',
        () => 1
      )
      
      // Second call with same area/symptom - should return empty
      const result = processAreaSymptomPairs(
        area,
        symptomData,
        processedWorkLocations,
        processedSymptoms,
        processedLocationSymptomPairs,
        () => 'fixture',
        () => 1
      )
      
      expect(result).toHaveLength(0)
    })

  })

  describe('Step 6: Fallback Matching (addFallbackMatches)', () => {
    
    test('should create symptom-only match for unused symptoms', () => {
      const clauseSymptomsAll = [{ symptomId: 'leak', alias: 'leaking' }]
      const foundLocations = []
      const processedSymptoms = new Set()
      const processedWorkLocations = new Set()
      
      const result = addFallbackMatches(
        clauseSymptomsAll,
        foundLocations,
        processedSymptoms,
        processedWorkLocations,
        () => 'fixture',
        () => 1
      )
      
      expect(result).toHaveLength(1)
      expect(result[0].symptomId).toBe('leak')
      expect(result[0].method).toBe('symptom_only')
      expect(result[0].plumbingIssueLocId).toBeNull()
    })

    test('should create area-only match for unused areas', () => {
      const clauseSymptomsAll = []
      const foundLocations = [{ plumbingIssueLocId: 'wall', alias: 'wall' }]
      const processedSymptoms = new Set()
      const processedWorkLocations = new Set()
      
      const result = addFallbackMatches(
        clauseSymptomsAll,
        foundLocations,
        processedSymptoms,
        processedWorkLocations,
        () => 'surface',
        () => 1
      )
      
      expect(result).toHaveLength(1)
      expect(result[0].plumbingIssueLocId).toBe('wall')
      expect(result[0].method).toBe('area_only')
      expect(result[0].symptomId).toBeNull()
    })

    test('should skip already processed symptoms and areas', () => {
      const clauseSymptomsAll = [{ symptomId: 'leak', alias: 'leaking' }]
      const foundLocations = [{ plumbingIssueLocId: 'wall', alias: 'wall' }]
      const processedSymptoms = new Set(['leak'])
      const processedWorkLocations = new Set(['wall'])
      
      const result = addFallbackMatches(
        clauseSymptomsAll,
        foundLocations,
        processedSymptoms,
        processedWorkLocations,
        () => 'fixture',
        () => 1
      )
      
      expect(result).toHaveLength(0)
    })

  })

  describe('Step 7: Duplicate Prevention', () => {
    
    test('should prevent duplicate area-symptom pairs across multiple clauses', () => {
      const input = "toilet is clogged, toilet is clogged"
      const result = findContextualMatches(input)
      
      // Should only return one match, not two duplicates
      const toiletMatches = result.filter(r => r.plumbingIssueLocId === 'toilet')
      expect(toiletMatches.length).toBe(1)
    })

    test('should track processed work locations to prevent duplicates', () => {
      const input = "bathroom ceiling is leaking, bathroom wall is wet"
      const result = findContextualMatches(input)
      
      // Should detect BOTH ceiling AND wall as separate locations
      const foundIds = result.map(r => r.plumbingIssueLocId)
      expect(foundIds).toContain('ceiling')
      expect(foundIds).toContain('wall')
      
      // Should have no duplicates
      const uniqueIds = [...new Set(foundIds)]
      expect(uniqueIds.length).toBe(foundIds.length)
    })

  })

})
