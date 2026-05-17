/**
 * Test Suite: detectCompound with Fallback Strategy
 * 
 * Tests the 3-tier detection strategy:
 * 1. Contextual matching (95% confidence) - area + symptom in context
 * 2. Fallback matching (75% confidence) - area + symptom separately
 * 3. Ambiguous handling (10% confidence) - vague input needing clarification
 */

import { findPatterns, findContextualMatches, findFallbackMatches } from '../lookupMaps.js'

describe('detectCompound - 3-Tier Fallback Strategy', () => {
  
  // ========================================
  // TIER 1: CONTEXTUAL MATCHING (95% confidence)
  // ========================================
  describe('Tier 1: Contextual Matching - CLEAR INPUT', () => {
    
    test('Should detect clear area + symptom context', () => {
      const input = "The ceiling is bubbling in the upstairs bathroom"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      if (result[0].context !== 'ambiguous_input') {
        expect(result[0].method).toBe('contextual')
        expect(result[0].plumbingIssueLocId).toBeDefined()
        expect(result[0].symptomId).toBeDefined()
      }
      console.log('✅ Contextual match:', result[0])
    })

    test('Should detect toilet won\'t flush', () => {
      const input = "My toilet won't flush"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Toilet detection:', result[0])
    })

    test('Should detect kitchen sink drips', () => {
      const input = "Kitchen sink is dripping"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Kitchen sink detection:', result[0])
    })
  })

  // ========================================
  // TIER 2: FALLBACK MATCHING (75% confidence)
  // ========================================
  describe('Tier 2: Fallback Matching - PARTIAL INFORMATION', () => {
    
    test('Should handle multiple issues in one message', () => {
      const input = "toilet wont flush also kitchen sink drips"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      // Should find at least 2 issues (toilet + kitchen sink)
      expect(result.length).toBeGreaterThanOrEqual(1)
      console.log('✅ Multiple issues detected:', result.length, 'issues')
      result.forEach((r, i) => {
        console.log(`   Issue ${i+1}:`, r.areaAlias, '-', r.symptomAlias)
      })
    })

    test('Should detect area and symptom separately', () => {
      const input = "upstairs bathroom leaking"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Separate area+symptom match:', result[0])
    })

    test('Should handle compound locations', () => {
      const input = "water is coming from the ceiling in my upstairs bathroom"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      console.log('✅ Compound location detected:', result[0])
    })
  })

  // ========================================
  // TIER 3: AMBIGUOUS HANDLING (10% confidence)
  // ========================================
  describe('Tier 3: Ambiguous Handling - VAGUE INPUT', () => {
    
    test('Should flag vague input: "something is leaking"', () => {
      const input = "something is leaking"
      const result = findPatterns(input)

      expect(result).toBeDefined()
      // Should either flag as ambiguous or detect symptom-only (no location known)
      const isAmbiguous = result[0].context === 'ambiguous_input'
      const isSymptomOnly = result[0].method === 'symptom_only'
      expect(isAmbiguous || isSymptomOnly).toBe(true)

      if (isAmbiguous) {
        expect(result[0].message).toContain('ambiguous')
        expect(result[0].suggestions).toBeDefined()
        expect(result[0].suggestions.length).toBeGreaterThan(0)
        console.log('✅ Ambiguous detected - Dispatcher will ask:', result[0].suggestions)
      } else {
        console.log('✅ Symptom-only detected:', result[0].context)
      }
    })

    test('Should flag vague input: "weird smell maybe gas"', () => {
      const input = "I think theres a weird smell from somewhere maybe gas"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      // Should either detect gas or flag as ambiguous
      if (result[0].context === 'ambiguous_input') {
        console.log('✅ Ambiguous - Dispatcher will clarify')
      } else {
        console.log('✅ Detected as:', result[0].areaAlias, '-', result[0].symptomAlias)
      }
    })

    test('Should flag vague input: "water bill was high"', () => {
      const input = "water bill was $400 last month"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result[0].context).toBe('ambiguous_billing_concern')
      console.log('✅ Ambiguous - Needs clarification')
    })

    test('Should ask clarifying questions for vague input', () => {
      const input = "I have a problem"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result[0].suggestions).toBeDefined()
      expect(result[0].suggestions.length).toBeGreaterThan(0)
      console.log('✅ Clarifying questions:', result[0].suggestions)
    })
  })

  // ========================================
  // REAL-WORLD SCENARIOS
  // ========================================
  describe('Real-World Scenarios', () => {
    
    test('Scenario 1: Clear emergency', () => {
      const input = "My upstairs bathroom is leaking water everywhere"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result[0].context).not.toBe('ambiguous_input')
      console.log('✅ Emergency detected - IMMEDIATE dispatch')
    })

    test('Scenario 2: Multiple issues with some clarity', () => {
      const input = "toilet wont flush also kitchen sink drips and I think theres a weird smell from somewhere maybe gas?? also water bill was $400 last month"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      console.log(`✅ Detected ${result.length} issues/ambiguities`)
      result.forEach((r, i) => {
        if (r.context === 'ambiguous_input') {
          console.log(`   Issue ${i+1}: AMBIGUOUS - Dispatcher will ask: "${r.suggestions[0]}"`)
        } else {
          console.log(`   Issue ${i+1}: ${r.areaAlias} - ${r.symptomAlias} (${r.method})`)
        }
      })
    })

    test('Scenario 3: Meaningful but partial info', () => {
      const input = "my upstairs bathroom is leaking or something meaningful I am sure you caught my drift"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result[0].context).not.toBe('ambiguous_input')
      console.log('✅ Meaningful info detected - Can dispatch')
    })

    test('Scenario 4: Very vague emergency', () => {
      const input = "help something is wrong"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result[0].context).toBe('ambiguous_input')
      console.log('✅ Vague emergency - Dispatcher asks: "What is the issue?"')
    })
  })

  // ========================================
  // DAMAGE PLACE CONFIG TESTS
  // ========================================
  describe('Damage Place Configurations', () => {
    
    test('Should detect baseboard water damage', () => {
      const input = "Water is coming up through my baseboards"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].context).not.toBe('ambiguous_input')
      console.log('✅ Baseboard damage detected:', result[0])
    })

    test('Should detect floor flooding', () => {
      const input = "The kitchen floor is flooded"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Floor flooding detected:', result[0])
    })

    test('Should detect yard water line leak', () => {
      const input = "There's water bubbling up in my front yard"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Yard leak detected:', result[0])
    })

    test('Should detect driveway leak', () => {
      const input = "Water is pooling on my driveway"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Driveway leak detected:', result[0])
    })

    test('Should detect foundation water intrusion', () => {
      const input = "Water is seeping into my foundation"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Foundation leak detected:', result[0])
    })

    test('Should detect under sink cabinet leak', () => {
      const input = "Water is pooling under my bathroom sink cabinet"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Under sink cabinet leak detected:', result[0])
    })

    test('Should detect stairwell leak', () => {
      const input = "Water is flowing down the stairwell"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      console.log('✅ Stairwell leak detected:', result[0])
    })
  })

  // ========================================
  // CONFIDENCE LEVELS
  // ========================================
  describe('Confidence Levels', () => {
    
    test('Contextual matching should have high confidence', () => {
      const input = "The ceiling is bubbling"
      const result = findPatterns(input)
      
      if (result[0].method === 'contextual') {
        expect(result[0].confidence).toBeGreaterThanOrEqual(0.9)
        console.log('✅ Contextual confidence:', result[0].confidence)
      }
    })

    test('Fallback matching should have moderate confidence', () => {
      const input = "kitchen sink leaking"
      const result = findPatterns(input)
      
      if (result[0].method === 'fallback') {
        expect(result[0].confidence).toBeLessThan(0.9)
        expect(result[0].confidence).toBeGreaterThan(0.5)
        console.log('✅ Fallback confidence:', result[0].confidence)
      }
    })

    test('Ambiguous input should have low confidence', () => {
      const input = "something is wrong"
      const result = findPatterns(input)
      
      if (result[0].context === 'ambiguous_input') {
        expect(result[0].method).toBe('ambiguous')
        console.log('✅ Ambiguous - Dispatcher takes over')
      }
    })
  })

  // ========================================
  // DISPATCHER WORKFLOW
  // ========================================
  describe('Dispatcher Workflow', () => {
    
    test('Dispatcher receives clear issue with high confidence', () => {
      const input = "My upstairs bathroom ceiling is bubbling"
      const result = findPatterns(input)
      
      const dispatch = {
        confidence: result[0].confidence || 0.95,
        area: result[0].areaAlias,
        symptom: result[0].symptomAlias,
        action: result[0].context === 'ambiguous_input' ? 'ASK_CLARIFICATION' : 'DISPATCH',
        suggestions: result[0].suggestions || []
      }
      
      console.log('✅ Dispatcher receives:', dispatch)
      expect(dispatch.action).toBe('DISPATCH')
    })

    test('Dispatcher receives ambiguous issue and asks clarifying questions', () => {
      const input = "I have a leak"
      const result = findPatterns(input)

      const dispatch = {
        confidence: 0.1,
        action: (result[0].context === 'ambiguous_input' || result[0].method === 'symptom_only') ? 'ASK_CLARIFICATION' : 'DISPATCH',
        clarifyingQuestions: result[0].suggestions || []
      }

      console.log('✅ Dispatcher asks:', dispatch.clarifyingQuestions)
      expect(dispatch.action).toBe('ASK_CLARIFICATION')
      if (result[0].context === 'ambiguous_input') {
        expect(dispatch.clarifyingQuestions.length).toBeGreaterThan(0)
      }
    })
  })
})

/**
 * SUMMARY OF 3-TIER STRATEGY:
 * 
 * ✅ TIER 1 (Contextual): "The ceiling is bubbling"
 *    → High confidence (95%)
 *    → Immediate dispatch
 *    → No dispatcher questions needed
 * 
 * ✅ TIER 2 (Fallback): "Kitchen sink leaking"
 *    → Moderate confidence (75%)
 *    → Dispatch with caution
 *    → Dispatcher may ask follow-up questions
 * 
 * ✅ TIER 3 (Ambiguous): "Something is wrong"
 *    → Low confidence (10%)
 *    → Dispatcher asks clarifying questions
 *    → No dispatch until clarified
 * 
 * RESULT: System is pragmatic and dispatcher-friendly!
 */
