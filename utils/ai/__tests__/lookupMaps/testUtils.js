/**
 * Test utilities for lookupMaps tests
 * Creates test versions of functions using mock data
 * 
 * Now integrates compoundLocationHelpers for proper semantic separation:
 * - Work locations: where plumber goes (fixtures, components)
 * - Context locations: where damage is visible (rooms, surfaces, fixtures as damage points)
 */

// Import compound location helpers for semantic logic
import { 
  findAreaConnectionsInText, 
  findReverseDirectionConnections,
  buildAreaRelationshipPatterns,
  buildReverseDirectionPatterns,
  detectPatternStrategy
} from '../../compoundLocationHelpers.js'

/**
 * Create mock matcher that simulates real lookupMaps behavior
 * MockData keys ARE the search terms (already flattened lookup format)
 */
function createMockMatcher(mockData) {
  return function mockMatcher(text) {
    const raw = []
    const normalizedText = text.toLowerCase()
    const seenIds = new Set()
    
    // Build expanded search map: for each key, also try space variant
    const searchEntries = []
    for (const [key, value] of Object.entries(mockData)) {
      searchEntries.push(
        { key, variant: key },                   // Original: "washing_machine"
        { key, variant: key.replace(/_/g, ' ') }  // Space version: "washing machine"
      )
    }
    
    for (const { key, variant } of searchEntries) {
      if (seenIds.has(key)) continue
      
      const idx = normalizedText.indexOf(variant.toLowerCase())
      if (idx !== -1) {
        raw.push({
          id: key,
          alias: variant,
          start: idx,
          end: idx + variant.length,
          len: variant.length,
          ...mockData[key]
        })
        seenIds.add(key)
      }
    }
    
    // Prefer longer phrases and avoid overlapping spans (same as real matcher)
    // This prevents redundant matches like "machine" when "washing machine" is found
    raw.sort((a, b) => b.len - a.len)
    const accepted = []
    
    /**
     * Check if two matches overlap in the text
     * Returns true if matches overlap, false if they're separate
     * 
     * Example:
     * "washing machine" (0-14) and "machine" (8-14) → overlap = true
     * "washing machine" (0-14) and "hose" (15-19) → overlap = false
     */
    const overlaps = (a, b) => !(a.end <= b.start || b.end <= a.start)
    
    /**
     * Accept matches in order of length (longest first)
     * Skip any match that overlaps with an already accepted match
     * This ensures we get the most specific, non-redundant matches
     */
    for (const cand of raw) {
      // If this candidate overlaps with any already accepted match, skip it
      if (accepted.some(x => overlaps(x, cand))) continue
      accepted.push(cand)
    }
    
    // Drop helper len before returning
    return accepted.map(({ len: _len, ...rest }) => rest)
  }
}

/**
 * Create test version of findFixableItems using mock data
 */
export function createTestFindFixableItems(mockPlumbingItems) {
  return createMockMatcher(mockPlumbingItems)
}

/**
 * Create test version of findDamageLocations using mock data
 */
export function createTestFindDamageLocations(mockDamagePlaces) {
  return createMockMatcher(mockDamagePlaces)
}

/**
 * Create test version of findFixableItemsAndDamageLocations using mock data
 */
export function createTestFindFixableItemsAndDamageLocations(mockPlumbingItems, mockDamagePlaces) {
  const findFixableItems = createTestFindFixableItems(mockPlumbingItems)
  const findDamageLocations = createTestFindDamageLocations(mockDamagePlaces)
  
  return function mockFindFixableItemsAndDamageLocations(text) {
    return {
      fixableItems: findFixableItems(text),
      damageLocations: findDamageLocations(text)
    }
  }
}

/**
 * Create test version of findSymptomMatches using mock data
 */
export function createTestFindSymptomMatches(mockData) {
  return createMockMatcher(mockData)
}

/**
 * Create test version of debugMatches using mock data
 * Backward compatible: supports both (mockPlumbingItems, mockDamagePlaces, mockSymptoms)
 * and old (mockAreaData, mockSymptomData) signatures
 */
export function createTestDebugMatches(mockPlumbingItems, mockDamagePlaces, mockSymptoms) {
  // Handle old 2-arg call: createTestDebugMatches({}, mockSymptoms)
  if (!mockSymptoms && mockDamagePlaces && !mockDamagePlaces.category && Object.values(mockDamagePlaces).some(v => v.urgency)) {
    mockSymptoms = mockDamagePlaces
    mockDamagePlaces = mockPlumbingItems // {} or area data
    mockPlumbingItems = {}
  }
  
  const findFixableItems = createTestFindFixableItems(mockPlumbingItems || {})
  const findDamageLocations = createTestFindDamageLocations(mockDamagePlaces || {})
  const findSymptomMatches = createTestFindSymptomMatches(mockSymptoms || {})
  
  return function debugMatches(text) {
    const fixableItems = findFixableItems(text)
    const damageLocations = findDamageLocations(text)
    const symptoms = findSymptomMatches(text)
    
    // Simple pattern matching: area + symptom in same text
    const patterns = []
    const allAreas = [...fixableItems, ...damageLocations]
    
    for (const area of allAreas) {
      for (const symptom of symptoms) {
        patterns.push({
          plumbingIssueLocId: area.id,
          symptomId: symptom.id,
          areaAlias: area.alias,
          symptomAlias: symptom.alias,
          method: 'test_debug',
          confidence: 0.6
        })
      }
    }
    
    return {
      fixableItems,
      damageLocations,
      symptoms,
      patterns
    }
  }
}

/**
 * Create test version of findPatterns using mock data
 * Integrates compoundLocationHelpers for proper semantic separation
 */
export function createTestFindPatterns(mockPlumbingItems, mockDamagePlaces, mockSymptoms) {
  const findFixableItems = createMockMatcher(mockPlumbingItems)
  const findDamageLocations = createMockMatcher(mockDamagePlaces)
  const findSymptomMatches = createTestFindSymptomMatches(mockSymptoms)
  
  return function testFindPatterns(text) {
    const patterns = []
    const seenPairs = new Set()
    
    // First try compound location detection (semantic approach)
    const strategy = detectPatternStrategy(text)
    
    if (strategy === 'forward' || strategy === 'reverse') {
      // Use compound location logic for proper semantic separation
      try {
        const forwardPatterns = buildAreaRelationshipPatterns(mockDamagePlaces)
        const reversePatterns = buildReverseDirectionPatterns(mockDamagePlaces)
        
        // Try forward patterns: "ceiling from bathroom"
        const forwardConnections = findAreaConnectionsInText(text, forwardPatterns, mockDamagePlaces)
        
        // Try reverse patterns: "bathroom has ceiling leak"  
        const reverseConnections = findReverseDirectionConnections(text, reversePatterns, mockDamagePlaces)
        
        // Convert compound connections to pattern format
        const compoundPatterns = [...forwardConnections, ...reverseConnections].map(conn => ({
          plumbingIssueLocId: conn.workLocation.plumbingIssueLocId,
          symptomId: findSymptomMatches(text)[0]?.id || null, // Find first matching symptom
          areaAlias: conn.workLocation.alias,
          symptomAlias: findSymptomMatches(text)[0]?.alias || null,
          dispatchCategory: mockPlumbingItems[conn.workLocation.plumbingIssueLocId]?.dispatchCategory || 
                          mockDamagePlaces[conn.workLocation.plumbingIssueLocId]?.category,
          pattern: conn,
          method: `test_compound_${strategy}`,
          confidence: conn.confidence * 0.8 // Slightly lower for test version
        }))
        
        patterns.push(...compoundPatterns)
      } catch (error) {
        console.warn('Compound pattern detection failed, falling back to simple logic:', error.message)
      }
    }
    
    // Fallback to simple clause-based detection if no compound patterns found
    if (patterns.length === 0) {
      const clauses = text.split(/[,;.]/).map(c => c.trim()).filter(Boolean)
      
      for (const clause of clauses) {
        const fixableItems = findFixableItems(clause)
        const damageLocations = findDamageLocations(clause)
        const symptomMatches = findSymptomMatches(clause)
        
        // Semantic separation: prioritize work locations over context locations
        const workLocations = fixableItems.filter(item => 
          mockPlumbingItems[item.id]?.dispatchCategory !== 'room'
        )
        const contextLocations = [...damageLocations, ...fixableItems.filter(item => 
          mockDamagePlaces[item.id] || mockPlumbingItems[item.id]?.dispatchCategory === 'room'
        )]
        
        // Pair work locations with symptoms (what plumber fixes)
        if (workLocations.length > 0 && symptomMatches.length > 0) {
          const clausePatterns = workLocations.flatMap(area =>
            symptomMatches
              .filter(symptom => !seenPairs.has(`${area.id}-${symptom.id}`))
              .map(symptom => {
                const pairKey = `${area.id}-${symptom.id}`
                seenPairs.add(pairKey)
                
                return {
                  plumbingIssueLocId: area.id,
                  symptomId: symptom.id,
                  areaAlias: area.alias,
                  symptomAlias: symptom.alias,
                  dispatchCategory: area.dispatchCategory || area.category,
                  pattern: null,
                  method: 'test_semantic_fallback',
                  confidence: 0.75
                }
              })
          )
          
          patterns.push(...clausePatterns)
        }
        
        // Fallback: work locations without symptoms (area-only patterns)
        if (workLocations.length > 0 && symptomMatches.length === 0) {
          for (const workLocation of workLocations) {
            if (seenPairs.has(workLocation.id)) continue
            patterns.push({
              plumbingIssueLocId: workLocation.id,
              symptomId: null,
              areaAlias: workLocation.alias,
              symptomAlias: null,
              dispatchCategory: workLocation.dispatchCategory || workLocation.category,
              pattern: null,
              method: 'test_work_area_only',
              confidence: 0.6
            })
            seenPairs.add(workLocation.id)
          }
        }
        
        // Add context locations as area-only patterns (for dispatcher context)
        for (const context of contextLocations) {
          if (seenPairs.has(context.id)) continue
          patterns.push({
            plumbingIssueLocId: context.id,
            symptomId: null,
            areaAlias: context.alias,
            symptomAlias: null,
            dispatchCategory: context.category || 'context',
            pattern: null,
            method: 'test_context_only',
            confidence: 0.4
          })
          seenPairs.add(context.id)
        }
      }
    }
    
    return patterns.length > 0 ? patterns : [{
      plumbingIssueLocId: null,
      symptomId: null,
      areaAlias: null,
      symptomAlias: null,
      context: 'no_matches',
      pattern: null,
      method: 'test_empty',
      confidence: 0.1
    }]
  }
}
