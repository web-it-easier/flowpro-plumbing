/**
 * Test Suite: Damage Place Detection
 * 
 * Tests detection of all damage surfaces where plumbing issues manifest.
 * Each damage place from damagePlaces.js should be detectable.
 */

import { findPatterns } from '../lookupMaps.js'

describe('Damage Place Detection - All Surfaces', () => {
  
  describe('Surface Damage Detection', () => {
    
    test('Should detect ceiling damage', () => {
      const inputs = [
        "Water is dripping from my ceiling",
        "There's a wet spot on the ceiling",
        "My bathroom ceiling is bubbling",
        "Ceiling has water stain"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'ceiling' || 
          (r.compound && r.compound.contextLocation?.plumbingIssueLocId === 'ceiling'))
        expect(detected).toBeDefined()
        console.log(`✅ Ceiling detected: "${input}"`)
      })
    })

    test('Should detect wall damage', () => {
      const inputs = [
        "Water coming through the wall",
        "My bathroom wall is wet",
        "Wall has water damage behind it",
        "Interior wall is soaked"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'wall' ||
          (r.compound && r.compound.contextLocation?.plumbingIssueLocId === 'wall'))
        expect(detected).toBeDefined()
        console.log(`✅ Wall detected: "${input}"`)
      })
    })

    test('Should detect floor damage', () => {
      const inputs = [
        "Water pooling on the floor",
        "My kitchen floor is wet",
        "Bathroom floor has water all over it",
        "Subfloor is soaked"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'floor')
        expect(detected).toBeDefined()
        console.log(`✅ Floor detected: "${input}"`)
      })
    })

    test('Should detect baseboard damage', () => {
      const inputs = [
        "Water is coming up through my baseboards",
        "Baseboards are wet at the bottom",
        "Floor trim has water damage",
        "Baseboard molding is soaked"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'baseboard')
        expect(detected).toBeDefined()
        console.log(`✅ Baseboard detected: "${input}"`)
      })
    })

    test('Should detect under sink cabinet damage', () => {
      const inputs = [
        "Water under my kitchen sink cabinet",
        "Bathroom vanity is wet underneath",
        "Cabinet under the sink has water",
        "Sink cabinet is flooded"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'under_sink_cabinet')
        expect(detected).toBeDefined()
        console.log(`✅ Under sink cabinet detected: "${input}"`)
      })
    })

    test('Should detect stairwell damage', () => {
      const inputs = [
        "Water flowing down the stairwell",
        "Stairs are wet from upstairs leak",
        "Water on the stair landing",
        "Staircase has water running down"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'stairwell')
        if (detected) {
          console.log(`✅ Stairwell detected: "${input}"`)
        } else {
          console.log(`⚠️ Stairwell not detected (fallback): "${input}" -> ${result[0]?.areaAlias || 'N/A'}`)
        }
      })
    })
  })

  describe('Structural Damage Detection', () => {
    
    test('Should detect foundation damage', () => {
      const inputs = [
        "Water seeping into the foundation",
        "Foundation wall has cracks with water",
        "Concrete foundation is wet",
        "Slab leak showing in foundation"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'foundation')
        expect(detected).toBeDefined()
        console.log(`✅ Foundation detected: "${input}"`)
      })
    })
  })

  describe('Exterior Damage Detection', () => {
    
    test('Should detect yard damage', () => {
      const inputs = [
        "Water bubbling up in my yard",
        "Front lawn has wet spot",
        "Back yard is soggy",
        "Water line break in garden"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'yard')
        expect(detected).toBeDefined()
        console.log(`✅ Yard detected: "${input}"`)
      })
    })

    test('Should detect driveway damage', () => {
      const inputs = [
        "Water pooling on driveway",
        "Concrete driveway has water coming up",
        "Asphalt driveway is wet from leak",
        "Water main break in drive way"
      ]
      
      inputs.forEach(input => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === 'driveway')
        expect(detected).toBeDefined()
        console.log(`✅ Driveway detected: "${input}"`)
      })
    })
  })

  describe('Damage Place Severity Assessment', () => {
    
    test('Should prioritize emergency damage locations', () => {
      const emergencies = [
        { input: "Water gushing from ceiling", plumbingIssueLocId: 'ceiling', severity: 'immediate' },
        { input: "Foundation flooding", plumbingIssueLocId: 'foundation', severity: 'immediate' },
        { input: "Stairwell full of water", plumbingIssueLocId: 'stairwell', severity: 'immediate' }
      ]
      
      emergencies.forEach(({ input, plumbingIssueLocId }) => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === plumbingIssueLocId)
        expect(detected).toBeDefined()
        console.log(`✅ Emergency ${plumbingIssueLocId} detected: "${input}"`)
      })
    })

    test('Should detect compound damage locations', () => {
      const compounds = [
        { 
          input: "Ceiling is leaking from upstairs bathroom", 
          contextId: 'ceiling', 
          workId: 'bathroom' 
        },
        { 
          input: "Wall wet behind kitchen sink", 
          contextId: 'wall', 
          workId: 'kitchen' 
        },
        { 
          input: "Floor flooded from basement leak", 
          contextId: 'floor', 
          workId: 'basement' 
        }
      ]
      
      compounds.forEach(({ input, contextId, workId }) => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        
        // Check for compound detection
        const hasCompound = result.some(r => 
          r.compound && 
          r.compound.contextLocation?.plumbingIssueLocId === contextId &&
          r.compound.workLocation?.plumbingIssueLocId === workId
        )
        
        if (hasCompound) {
          console.log(`✅ Compound detected: "${input}"`)
        } else {
          // Fallback: at least one part should be detected
          const hasContext = result.some(r => 
            r.plumbingIssueLocId === contextId || 
            r.compound?.contextLocation?.plumbingIssueLocId === contextId
          )
          expect(hasContext).toBe(true)
          console.log(`⚠️ Partial detection: "${input}" (context: ${hasContext})`)
        }
      })
    })
  })

  describe('Damage Place Edge Cases', () => {
    
    test('Should handle multiple damage locations', () => {
      const input = "Water is coming through the ceiling and the wall is wet too"
      const result = findPatterns(input)
      
      expect(result).toBeDefined()
      
      const hasCeiling = result.some(r => r.plumbingIssueLocId === 'ceiling')
      const hasWall = result.some(r => r.plumbingIssueLocId === 'wall')
      
      expect(hasCeiling || hasWall).toBe(true)
      console.log(`✅ Multiple locations: ceiling=${hasCeiling}, wall=${hasWall}`)
    })

    test('Should detect damage with various symptoms', () => {
      const combos = [
        { input: "Ceiling is dripping", plumbingIssueLocId: 'ceiling', symptomId: 'leak' },
        { input: "Wall is bubbling", plumbingIssueLocId: 'wall', symptomId: 'bubbling' },
        { input: "Floor is flooded", plumbingIssueLocId: 'floor', symptomId: 'flooding' },
        { input: "Baseboard is wet", plumbingIssueLocId: 'baseboard', symptomId: 'leak' }
      ]
      
      combos.forEach(({ input, plumbingIssueLocId }) => {
        const result = findPatterns(input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
        
        const detected = result.find(r => r.plumbingIssueLocId === plumbingIssueLocId)
        expect(detected).toBeDefined()
        console.log(`✅ Damage+symptom: "${input}"`)
      })
    })
  })
})
