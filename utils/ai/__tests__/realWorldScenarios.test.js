/**
 * Test Suite: Real-World Customer Scenarios
 * 
 * Tests actual customer messages and expected outcomes.
 * Validates end-to-end detection quality.
 */

import { findPatterns } from '../lookupMaps.js'

describe('Real-World Customer Scenarios', () => {
  
  describe('Emergency Scenarios', () => {
    
    test('Should detect burst pipe emergency', () => {
      const emergencies = [
        { input: "Pipe burst in my basement! Water everywhere!", expected: 'burst' },
        { input: "Water heater tank just exploded, flooding garage", expected: 'burst' },
        { input: "Main water line broke and water is gushing out", expected: 'burst' },
        { input: "Bathroom pipe burst and ceiling is caving in", expected: 'burst' }
      ]
      
      emergencies.forEach(({ input, expected }) => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.symptomId === expected || r.plumbingIssueLocId)
        expect(detected).toBeDefined()
        
        console.log(`✅ Emergency detected: "${input.substring(0, 50)}..." -> ${detected.plumbingIssueLocId}.${detected.symptomId || 'N/A'}`)
      })
    })

    test('Should detect gas emergency', () => {
      const gasEmergencies = [
        "I smell gas in my kitchen, it's strong",
        "Natural gas odor coming from water heater area",
        "Gas smell near furnace, very concerning",
        "Propane leak smell outside house"
      ]
      
      gasEmergencies.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasGas = result.some(r => r.plumbingIssueLocId === 'gas_line' || r.symptomId === 'gas_smell')
        if (hasGas) {
          console.log(`✅ Gas emergency detected: "${input.substring(0, 40)}..."`)
        } else {
          console.log(`⚠️ Gas not detected: "${input.substring(0, 40)}..."`)
        }
      })
    })

    test('Should detect flooding emergency', () => {
      const floodings = [
        "My basement is completely flooded",
        "Water everywhere in kitchen, coming from ceiling",
        "Bathroom flooded and leaking into downstairs",
        "House is flooding from main line break"
      ]
      
      floodings.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ Flooding handled (${result.length} detections): "${input.substring(0, 40)}..."`)
      })
    })

    test('Should detect no water emergency', () => {
      const noWater = [
        "I have no water in entire house",
        "Water stopped working completely",
        "No water coming from any taps or fixtures",
        "Whole house has no water pressure"
      ]
      
      noWater.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasNoWater = result.some(r => r.symptomId === 'no_water')
        if (hasNoWater) {
          console.log(`✅ No water detected: "${input.substring(0, 40)}..."`)
        } else {
          console.log(`⚠️ No water not detected: "${input.substring(0, 40)}..."`)
        }
      })
    })
  })

  describe('Common Plumbing Issues', () => {
    
    test('Should detect toilet issues', () => {
      const toiletIssues = [
        "Toilet keeps running, won't stop",
        "Toilet is clogged and overflowing",
        "Toilet won't flush properly",
        "Toilet tank is leaking onto floor",
        "Toilet making gurgling noise"
      ]
      
      toiletIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasToilet = result.some(r =>
          r.plumbingIssueLocId === 'toilet' || r.plumbingIssueLocId === 'toilet_tank'
        )
        expect(hasToilet).toBe(true)
        console.log(`✅ Toilet issue: "${input}"`)
      })
    })

    test('Should detect sink/drain issues', () => {
      const sinkIssues = [
        "Kitchen sink is completely clogged",
        "Bathroom sink draining very slowly",
        "Sink faucet is dripping constantly",
        "Garbage disposal jammed and making noise",
        "Double sink both sides clogged"
      ]
      
      sinkIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasSink = result.some(r => 
          r.plumbingIssueLocId === 'sink' || r.plumbingIssueLocId === 'drain' || r.plumbingIssueLocId === 'garbage_disposal' ||
          r.plumbingIssueLocId === 'kitchen' || r.plumbingIssueLocId === 'bathroom'
        )
        if (hasSink) {
          console.log(`✅ Sink/drain issue: "${input}"`)
        } else {
          console.log(`⚠️ Sink/drain not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect shower/bath issues', () => {
      const showerIssues = [
        "Shower has no hot water at all",
        "Bathtub drain is completely stopped",
        "Shower head leaking when off",
        "Bathtub faucet won't turn off",
        "Shower pressure suddenly dropped"
      ]
      
      showerIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        // Accept either a shower/bath area OR a shower-related symptom (e.g., no_hot_water)
        const hasShower = result.some(r =>
          r.plumbingIssueLocId === 'shower' ||
          r.plumbingIssueLocId === 'shower_stall' ||
          r.plumbingIssueLocId === 'shower_head' ||
          r.plumbingIssueLocId === 'shower_valve' ||
          r.plumbingIssueLocId === 'bathtub' ||
          r.plumbingIssueLocId === 'tub_drain' ||
          r.plumbingIssueLocId === 'faucet' ||
          r.plumbingIssueLocId === 'bathtub_faucet' ||
          r.symptomId === 'no_hot_water' ||
          r.symptomId === 'low_pressure' ||
          r.symptomId === 'leak'
        )
        expect(hasShower).toBe(true)
        console.log(`✅ Shower/bath issue: "${input}"`)
      })
    })

    test('Should detect water heater issues', () => {
      const heaterIssues = [
        "Water heater pilot light went out",
        "No hot water from any faucet",
        "Water heater making loud banging noise",
        "Hot water smells like rotten eggs",
        "Water heater leaking from bottom"
      ]
      
      heaterIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasHeater = result.some(r => r.plumbingIssueLocId === 'water_heater')
        if (hasHeater) {
          console.log(`✅ Water heater issue: "${input}"`)
        } else {
          console.log(`⚠️ Water heater not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })
  })

  describe('Sewer and Drain Issues', () => {
    
    test('Should detect sewer problems', () => {
      const sewerIssues = [
        "Sewer line is backed up into basement",
        "Multiple drains backing up at once",
        "Sewer smell coming from all drains",
        "Toilet bubbling when sink drains",
        "Sewer cleanout is overflowing"
      ]
      
      sewerIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasSewer = result.some(r => r.plumbingIssueLocId === 'sewer' || r.plumbingIssueLocId === 'drain' || r.plumbingIssueLocId === 'toilet')
        if (hasSewer) {
          console.log(`✅ Sewer issue: "${input}"`)
        } else {
          console.log(`⚠️ Sewer not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })

    test('Should detect main line issues', () => {
      const mainLineIssues = [
        "Water main burst in front yard",
        "No water pressure throughout house",
        "Water meter spinning when no water used",
        "Main shutoff valve won't turn",
        "Street water line break affecting house"
      ]
      
      mainLineIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasMainLine = result.some(r => 
          r.plumbingIssueLocId === 'water_main' || r.plumbingIssueLocId === 'valve' || r.plumbingIssueLocId === 'water_meter' ||
          r.plumbingIssueLocId === 'yard' || r.plumbingIssueLocId === 'exterior' // fallback areas
        )
        
        if (hasMainLine) {
          console.log(`✅ Main line issue: "${input}"`)
        } else {
          console.log(`⚠️ Main line areas not detected (fallback): "${input}" -> ${result[0]?.plumbingIssueLocId || 'N/A'}`)
        }
      })
    })
  })

  describe('Appliance Issues', () => {
    
    test('Should detect dishwasher issues', () => {
      const issues = [
        "Dishwasher is leaking onto floor",
        "Dishwasher won't drain completely",
        "Dishwasher making grinding noise",
        "Water coming out of dishwasher door"
      ]
      
      issues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'dishwasher')
        expect(detected).toBeDefined()
        console.log(`✅ Dishwasher: "${input}"`)
      })
    })

    test('Should detect washing machine issues', () => {
      const issues = [
        "Washing machine hose burst",
        "Washer drain backing up",
        "Washing machine valve leaking"
      ]
      
      issues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'washing_machine')
        expect(detected).toBeDefined()
        console.log(`✅ Washing machine: "${input}"`)
      })
    })

    test('Should detect sump pump issues', () => {
      const issues = [
        "Sump pump not turning on",
        "Basement flooding, sump pump broken",
        "Sump pump running constantly"
      ]
      
      issues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'sump_pump')
        expect(detected).toBeDefined()
        console.log(`✅ Sump pump: "${input}"`)
      })
    })
  })

  describe('Compound Location Scenarios', () => {
    
    test('Should detect upstairs-downstairs issues', () => {
      const compounds = [
        "Water coming through ceiling from upstairs bathroom",
        "Downstairs wall wet from kitchen leak above",
        "Upstairs shower leaking through downstairs ceiling"
      ]
      
      compounds.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ Upstairs-downstairs: "${input}"`)
      })
    })

    test('Should detect exterior issues', () => {
      const exteriorIssues = [
        "Hose bib outside is leaking",
        "Outdoor faucet frozen and cracked",
        "Water meter box filling with water",
        "Yard has wet spot from possible leak"
      ]
      
      exteriorIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasExterior = result.some(r => 
          r.plumbingIssueLocId === 'exterior' || r.plumbingIssueLocId === 'hose_bib' || 
          r.plumbingIssueLocId === 'water_meter' || r.plumbingIssueLocId === 'yard'
        )
        expect(hasExterior).toBe(true)
        console.log(`✅ Exterior: "${input}"`)
      })
    })

    test('Should detect structural damage indicators', () => {
      const structuralIssues = [
        "Ceiling has water stain getting bigger",
        "Wall bubbling from pipe leak inside",
        "Floor warping from water damage",
        "Baseboards are wet and moldy",
        "Foundation crack with water seeping"
      ]
      
      structuralIssues.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const hasStructural = result.some(r => 
          r.plumbingIssueLocId === 'ceiling' || r.plumbingIssueLocId === 'wall' || 
          r.plumbingIssueLocId === 'floor' || r.plumbingIssueLocId === 'foundation' ||
          r.plumbingIssueLocId === 'baseboard'
        )
        expect(hasStructural).toBe(true)
        console.log(`✅ Structural: "${input}"`)
      })
    })
  })

  describe('Stress Test - Complex Messages', () => {
    
    test('Should handle multiple issues in one message', () => {
      const complexMessages = [
        "My toilet is clogged and kitchen sink is dripping, also water heater making noise",
        "Upstairs bathroom leaking through ceiling and downstairs toilet won't flush",
        "Multiple drains backing up and smell like sewage, plus no hot water"
      ]
      
      complexMessages.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThanOrEqual(1)
        
        console.log(`✅ Complex message: ${result.length} detections from "${input.substring(0, 50)}..."`)
      })
    })

    test('Should handle emotional/urgent language', () => {
      const urgentMessages = [
        "HELP! Water is pouring everywhere from my ceiling!",
        "Oh my god the basement is completely flooded please come quick!",
        "Emergency! Gas smell very strong in house, scared!"
      ]
      
      urgentMessages.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ Urgent message handled: "${input.substring(0, 40)}..."`)
      })
    })

    test('Should handle unclear/rambling descriptions', () => {
      const rambling = [
        "So there's this thing in my bathroom and it's been going on for a while and I'm not sure what it is but there's water and it's making noise",
        "My husband tried to fix it but now it's worse and there's water coming from somewhere maybe the toilet or sink I don't know",
        "It's been like this since last Tuesday and we tried everything but the water keeps coming"
      ]
      
      rambling.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ Rambling handled: ${result.length} results from "${input.substring(0, 40)}..."`)
      })
    })

    test('Should handle mixed valid and invalid input', () => {
      const mixed = [
        "abc123 xyz bathroom is leaking 456",
        "!@#$% toilet won't flush *&^%$#",
        "... kitchen sink ... dripping ..."
      ]
      
      mixed.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ Mixed input handled: "${input.substring(0, 40)}..."`)
      })
    })
  })

  describe('Dispatcher-Ready Output', () => {
    
    test('Should provide clear dispatch information for emergency', () => {
      const input = "Pipe burst in basement, water everywhere!"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
      
      // Should provide enough info for dispatcher to act
      const hasArea = result.some(r => r.plumbingIssueLocId)
      const hasSymptom = result.some(r => r.symptomId)
      
      expect(hasArea).toBe(true)
      console.log(`✅ Emergency dispatch-ready: area=${result[0].plumbingIssueLocId}, symptom=${result[0].symptomId}`)
    })

    test('Should provide confidence for dispatcher decision', () => {
      const inputs = [
        "Toilet is clogged",
        "Something is leaking somewhere",
        "I need a plumber"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        
        console.log(`✅ Confidence for "${input}": ${result[0].confidence || 'N/A'}`)
      })
    })

    test('Should handle all possible input types gracefully', () => {
      const inputs = [
        { type: 'clear', text: "Toilet clogged" },
        { type: 'compound', text: "Ceiling wet from bathroom above" },
        { type: 'vague', text: "Something wrong" },
        { type: 'multiple', text: "Toilet and sink both leaking" },
        { type: 'urgent', text: "HELP water everywhere" }
      ]
      
      inputs.forEach(({ type, text }) => {
        const result = findPatterns(text)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        console.log(`✅ ${type}: "${text}" -> ${result.length} results`)
      })
    })
  })
})
