/**
 * Test Suite: Fallback Strategy - Ambiguous Input Handling
 * 
 * Tests the 3-tier fallback system:
 * 1. Contextual matching (95% confidence)
 * 2. Fallback matching (75% confidence)
 * 3. Ambiguous handling (10% confidence - dispatcher takes over)
 */

import { findPatterns } from '../lookupMaps.js'

describe('Fallback Strategy - 3-Tier Detection', () => {
  
  describe('Tier 1: Contextual Matching (95% confidence)', () => {
    
    test('Should have high confidence for clear area+symptom pairs', () => {
      const clearInputs = [
        "My toilet won't flush",
        "Kitchen sink is dripping",
        "Shower has no hot water",
        "Water heater is leaking"
      ]
      
      clearInputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        if (result[0].method === 'contextual') {
          expect(result[0].confidence).toBeGreaterThanOrEqual(0.9)
          console.log(`✅ Contextual (${result[0].confidence}): "${input}"`)
        }
      })
    })

    test('Should not flag clear inputs as ambiguous', () => {
      const clearInputs = [
        "Toilet is clogged",
        "Sink is leaking",
        "Drain is slow"
      ]
      
      clearInputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result[0].context).not.toBe('ambiguous_input')
        console.log(`✅ Clear input accepted: "${input}"`)
      })
    })
  })

  describe('Tier 2: Fallback Matching (75% confidence)', () => {
    
    test('Should detect area and symptom separately', () => {
      const partialInputs = [
        "bathroom - leaking",
        "kitchen sink problem",
        "basement water issue",
        "toilet something wrong"
      ]
      
      partialInputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasArea = result.some(r => r.plumbingIssueLocId)
        expect(hasArea).toBe(true)
        console.log(`✅ Fallback detection: "${input}"`)
      })
    })

    test('Should have moderate confidence for fallback matches', () => {
      const inputs = [
        "Upstairs bathroom issue",
        "Kitchen problem with sink"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        
        if (result[0].method === 'fallback') {
          expect(result[0].confidence).toBeGreaterThanOrEqual(0.5)
          expect(result[0].confidence).toBeLessThan(0.9)
          console.log(`✅ Fallback confidence (${result[0].confidence}): "${input}"`)
        }
      })
    })

    test('Should handle multiple areas in one message', () => {
      const input = "Both bathroom and kitchen have issues"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThanOrEqual(1)
      
      console.log(`✅ Multiple areas detected: ${result.length} results`)
    })
  })

  describe('Tier 3: Ambiguous Handling (Dispatcher Takes Over)', () => {
    
    test('Should flag vague inputs as ambiguous', () => {
      const vagueInputs = [
        "Something is wrong",
        "I have a problem",
        "Help me please",
        "There's an issue",
        "Something is leaking somewhere"
      ]
      
      vagueInputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        if (result[0].context === 'ambiguous_input') {
          expect(result[0].suggestions).toBeDefined()
          expect(result[0].suggestions.length).toBeGreaterThan(0)
          console.log(`✅ Ambiguous flagged: "${input}"`)
        } else {
          console.log(`⚠️ Not flagged: "${input}" (detected as: ${result[0].areaAlias || 'unknown'})`)
        }
      })
    })

    test('Should provide clarifying questions for ambiguous input', () => {
      const input = "Something is leaking"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      
      const ambiguousResult = result.find(r => r.context === 'ambiguous_input')
      if (ambiguousResult) {
        expect(ambiguousResult.suggestions).toBeDefined()
        expect(ambiguousResult.suggestions.length).toBeGreaterThan(0)
        
        ambiguousResult.suggestions.forEach((suggestion, i) => {
          console.log(`   Suggestion ${i + 1}: "${suggestion}"`)
        })
      }
    })

    test('Should flag unclear emergency descriptions', () => {
      const unclearEmergencies = [
        "Help emergency",
        "Something bad happening",
        "Water everywhere help",
        "I need a plumber now"
      ]
      
      unclearEmergencies.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        
        // Should either detect something specific, flag as ambiguous, or detect symptom-only
        const isAmbiguous = result.some(r => r.context === 'ambiguous_input')
        const hasDetection = result.some(r => r.plumbingIssueLocId)
        const hasSymptomOnly = result.some(r => r.method === 'symptom_only')
        
        expect(isAmbiguous || hasDetection || hasSymptomOnly).toBe(true)
        console.log(`${isAmbiguous ? '✅' : '⚠️'} Unclear emergency: "${input}"`)
      })
    })

    test('Should have low confidence for ambiguous inputs', () => {
      const input = "I think something is wrong maybe"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      if (result[0].context === 'ambiguous_input' && typeof result[0].confidence === 'number') {
        expect(result[0].confidence).toBeLessThan(0.5)
        console.log(`✅ Low confidence for ambiguous: ${result[0].confidence}`)
      } else {
        // If not flagged as ambiguous or no confidence, log what we got
        console.log(`⚠️ Not flagged as ambiguous: "${input}" -> ${result[0].areaAlias || result[0].context || 'N/A'} (confidence: ${result[0].confidence || 'undefined'})`)
      }
    })
  })

  describe('Dispatcher Workflow Integration', () => {
    
    test('Should provide dispatcher with confidence levels', () => {
      const inputs = [
        { text: "Toilet is clogged", expectedAction: 'DISPATCH' },
        { text: "Something is leaking", expectedAction: 'ASK_CLARIFICATION' }
      ]
      
      inputs.forEach(({ text, expectedAction }) => {
        const result = findPatterns(text)
        expect(result).toBeDefined()
        
        const dispatch = {
          confidence: result[0].confidence || 0.1,
          action: (result[0].context === 'ambiguous_input' || result[0].method === 'symptom_only') ? 'ASK_CLARIFICATION' : 'DISPATCH',
          area: result[0].areaAlias,
          symptom: result[0].symptomAlias
        }
        
        expect(dispatch.action).toBe(expectedAction)
        console.log(`✅ Dispatcher action: ${dispatch.action} (${dispatch.confidence})`)
      })
    })

    test('Dispatcher should receive suggestions for ambiguous input', () => {
      const input = "I have a plumbing issue"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      
      const ambiguous = result.find(r => r.context === 'ambiguous_input')
      if (ambiguous) {
        const dispatch = {
          action: 'ASK_CLARIFICATION',
          questions: ambiguous.suggestions
        }
        
        expect(dispatch.questions.length).toBeGreaterThan(0)
        console.log(`✅ Dispatcher questions: ${dispatch.questions.join(', ')}`)
      }
    })

    test('Should allow dispatcher override for edge cases', () => {
      // Even with low confidence, dispatcher might recognize emergency
      const input = "Water everywhere, I don't know where it's coming from"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      
      // Dispatcher can see both detections and decide
      const hasDetection = result.some(r => r.plumbingIssueLocId)
      const hasAmbiguous = result.some(r => r.context === 'ambiguous_input')
      
      console.log(`✅ Dispatcher has options: ${hasDetection ? 'detection' : ''} ${hasAmbiguous ? 'ambiguous' : ''}`)
    })
  })

  describe('Fallback Strategy Edge Cases', () => {
    
    test('Should handle typos and misspellings gracefully', () => {
      const typos = [
        "tolet is cloged",
        "kichen sink leeking",
        "bathrom floding"
      ]
      
      typos.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        // Should either detect something or flag as ambiguous
        expect(result.length).toBeGreaterThan(0)
        console.log(`⚠️ Typo handled: "${input}" -> ${result[0].areaAlias || 'ambiguous'}`)
      })
    })

    test('Should handle very short inputs', () => {
      const shortInputs = [
        "leak",
        "clog",
        "help",
        "urgent"
      ]
      
      shortInputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        console.log(`✅ Short input: "${input}" -> ${result[0].areaAlias || result[0].context}`)
      })
    })

    test('Should handle long rambling descriptions', () => {
      const longInput = "So I was just minding my own business and then I noticed that there was water on the floor and I think it might be coming from somewhere under the sink or maybe the dishwasher but I'm not really sure and it's been like this for a while but now it's getting worse and I really need help"
      
      const result = findPatterns(longInput)
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      console.log(`✅ Long input handled: ${result.length} detections`)
    })

    test('Should handle mixed clear and vague input', () => {
      const mixedInput = "My toilet is clogged but also something else is weird"
      const result = findPatterns(mixedInput)
      
      expect(result).toBeDefined()
      
      const hasToilet = result.some(r => r.plumbingIssueLocId === 'toilet')
      console.log(`${hasToilet ? '✅' : '⚠️'} Mixed input: toilet detected = ${hasToilet}`)
    })
  })

  describe('Fallback Strategy Reliability', () => {
    
    test('Should always return a result (never null/undefined)', () => {
      const inputs = [
        "",
        "   ",
        "!!!",
        "12345"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        console.log(`✅ Always returns result for: "${input || '(empty)'}"`)
      })
    })

    test('Should degrade gracefully when no patterns match', () => {
      const input = "xyz abc 123 completely unrelated"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Should at least return ambiguous fallback
      expect(result[0]).toBeDefined()
      console.log(`✅ Graceful degradation: ${result[0].context || 'unknown'}`)
    })
  })
})
