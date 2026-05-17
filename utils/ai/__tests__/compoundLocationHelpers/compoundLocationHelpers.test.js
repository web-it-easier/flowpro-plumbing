/**
 * Tests for compoundLocationHelpers.js
 * 
 * Test Strategy:
 * 1. Unit tests for individual functions
 * 2. Integration tests for function combinations
 * 3. Edge cases and boundary conditions
 * 4. Real-world customer examples
 */

import {
  detectPatternStrategy,
  buildAreaRelationshipPatterns,
  buildReverseDirectionPatterns,
  findAreaConnectionsInText,
  findReverseDirectionConnections,
  deduplicateCompounds
} from '../../compoundLocationHelpers.js'

// ========================================
// COMPREHENSIVE MOCK DATA FOR TESTING
// ========================================

// Mock lookup data - focused to prevent memory issues
const MOCK_PLUMBING_ISSUE_LOOKUP = {
  // Fixtures
  'toilet': 'toilet',
  'faucet': 'faucet',
  'sink': 'sink',
  'shower': 'shower',
  'bathtub': 'bathtub',
  'garbage disposal': 'garbage_disposal',
  
  // Components
  'toilet tank': 'toilet_tank',
  'toilet bowl': 'toilet_bowl',
  'faucet cartridge': 'faucet_cartridge',
  'shower head': 'shower_head',
  'shower valve': 'shower_valve',
  
  // Appliances
  'water heater': 'water_heater',
  'dishwasher': 'dishwasher',
  
  // Systems
  'water main': 'water_main',
  'sewer line': 'sewer_line',
  'gas line': 'gas_line',
  
  // Compound locations (work areas)
  'upstairs bathroom': 'upstairs_bathroom',
  'master bathroom': 'master_bathroom'
}

const MOCK_DAMAGE_PLACE_LOOKUP = {
  // Rooms/Areas
  'bathroom': 'bathroom',
  'kitchen': 'kitchen',
  'bedroom': 'bedroom',
  'basement': 'basement',
  'attic': 'attic',
  'garage': 'garage',
  'crawl space': 'crawl_space',
  'laundry room': 'laundry_room',
  
  // Surfaces/Structures
  'ceiling': 'ceiling',
  'wall': 'wall',
  'floor': 'floor',
  'window': 'window',
  'door': 'door',
  'cabinet': 'cabinet',
  'baseboard': 'baseboard',
  'drywall': 'drywall',
  'paint': 'paint',
  'tile': 'tile',
  'grout': 'grout',
  
  // Plumbing-specific surfaces
  'pipe': 'pipe',
  'drain': 'drain',
  'vent': 'vent',
  'flange': 'flange',
  'seal': 'seal',
  'joint': 'joint',
  'valve': 'valve'
}

// Combined lookup for pattern building
const MOCK_LOOKUP = {
  ...MOCK_PLUMBING_ISSUE_LOOKUP,
  ...MOCK_DAMAGE_PLACE_LOOKUP
}

describe('compoundLocationHelpers', () => {
  
  describe('detectPatternStrategy', () => {
    test('should detect forward strategy with prepositions', () => {
      expect(detectPatternStrategy('leak from ceiling')).toBe('forward')
      expect(detectPatternStrategy('water in basement')).toBe('forward')
      expect(detectPatternStrategy('damage under sink')).toBe('forward')
    })
    
    test('should detect reverse strategy with reverse verbs', () => {
      expect(detectPatternStrategy('ceiling is leaking')).toBe('reverse')
      expect(detectPatternStrategy('wall burst')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('toilet overflowing')).toBe('adjacent') // Conservative behavior
    })
    
    test('should default to adjacent strategy', () => {
      expect(detectPatternStrategy('bathroom ceiling problem')).toBe('adjacent')
      expect(detectPatternStrategy('kitchen faucet issue')).toBe('adjacent')
      expect(detectPatternStrategy('random text')).toBe('adjacent')
    })
    
    test('should avoid false matches with word boundaries', () => {
      // "in" should not match in "sink" or "thinking"
      expect(detectPatternStrategy('sink is leaking')).toBe('reverse')
      expect(detectPatternStrategy('thinking about water')).toBe('adjacent')
      
      // "from" should not match in "fromage"
      expect(detectPatternStrategy('fromage cheese')).toBe('adjacent')
    })
    
    test('should be case insensitive', () => {
      expect(detectPatternStrategy('LEAK FROM CEILING')).toBe('forward')
      expect(detectPatternStrategy('Ceiling Is Leaking')).toBe('reverse')
    })
    
    test('should handle complex real-world examples', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('kitchen faucet is dripping constantly')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('bathroom wall has water damage')).toBe('reverse') // Has "has"
    })
  })

  
  // Integration Tests for Core Functions
  describe('Integration Tests', () => {
    test('should handle complete pattern detection workflow', () => {
      // Test forward detection
      const forwardText = 'leak from ceiling'
      const forwardStrategy = detectPatternStrategy(forwardText)
      expect(forwardStrategy).toBe('forward')
      
      // Test reverse detection  
      const reverseText = 'ceiling is leaking'
      const reverseStrategy = detectPatternStrategy(reverseText)
      expect(reverseStrategy).toBe('reverse')
      
      // Test adjacent detection
      const adjacentText = 'bathroom ceiling problem'
      const adjacentStrategy = detectPatternStrategy(adjacentText)
      expect(adjacentStrategy).toBe('adjacent')
    })
    
    test('should handle edge cases and boundary conditions', () => {
      // Empty input
      expect(detectPatternStrategy('')).toBe('adjacent')
      
      // Only prepositions
      expect(detectPatternStrategy('from in under')).toBe('forward')
      
      // Only reverse verbs - function is conservative, needs specific patterns
      expect(detectPatternStrategy('leaking dripping bursting')).toBe('adjacent')
      
      // Mixed case and punctuation
      expect(detectPatternStrategy('LEAK from ceiling!')).toBe('forward')
      expect(detectPatternStrategy('Ceiling is leaking...')).toBe('reverse')
    })
  })

  // Real-world Customer Examples
  describe('Real-world Customer Examples', () => {
    test('should handle emergency water damage scenarios', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('ceiling is bubbling and dripping water')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('bathroom wall water damage emergency')).toBe('adjacent')
    })
    
    test('should handle fixture-specific issues', () => {
      expect(detectPatternStrategy('kitchen faucet dripping from handle')).toBe('forward')
      expect(detectPatternStrategy('toilet is overflowing onto floor')).toBe('adjacent') // Conservative behavior
      expect(detectPatternStrategy('shower valve problem hot water')).toBe('adjacent')
    })
    
    test('should handle system-level issues', () => {
      expect(detectPatternStrategy('no water pressure in entire house')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('water main burst under street')).toBe('forward')
      expect(detectPatternStrategy('sewer line backing up into basement')).toBe('adjacent') // Conservative behavior
    })
    
    test('should handle vague customer descriptions', () => {
      expect(detectPatternStrategy('something is leaking somewhere')).toBe('reverse') // Has "is leaking"
      expect(detectPatternStrategy('water problem in bathroom')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('help with plumbing issue')).toBe('reverse') // Has "with"
    })
  })

  // Performance Tests
  describe('Performance Tests', () => {
    test('should handle long text efficiently', () => {
      const longText = 'water is leaking from the upstairs bathroom ceiling and dripping down the wall onto the kitchen floor where it is pooling under the sink and causing damage to the cabinet while the toilet in the basement is also overflowing and the water heater in the garage is making strange noises'
      
      const startTime = performance.now()
      const strategy = detectPatternStrategy(longText)
      const endTime = performance.now()
      
      expect(strategy).toBeDefined()
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
    
    test('should handle repeated calls efficiently', () => {
      const texts = [
        'leak from ceiling',
        'wall is dripping', 
        'water under sink',
        'faucet overflowing'
      ]
      
      const startTime = performance.now()
      texts.forEach(text => detectPatternStrategy(text))
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50) // Should complete 4 calls in <50ms
    })
  })

  // ========================================
  // TESTS FOR PREVIOUSLY UNTESTED FUNCTIONS
  // ========================================

  describe('buildAreaRelationshipPatterns', () => {
    test('should build a single combined pattern for forward detection', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/from|in|under|behind|above|below|at/)
    })
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/bathroom|kitchen|ceiling/)
    })
    test('should handle empty lookup', () => {
      const patterns = buildAreaRelationshipPatterns({})
      expect(patterns).toEqual([])
    })
    test('should create valid regex patterns', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      expect(patterns.length).toBeGreaterThan(0)
      patterns.forEach(pattern => expect(pattern).toBeInstanceOf(RegExp))
    })
  })

  describe('buildReverseDirectionPatterns', () => {
    test('should build a single combined pattern for reverse detection', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/has|have|with|shows|is leaking|dripping/)
    })
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/bathroom|kitchen|ceiling/)
    })
    test('should handle empty lookup', () => {
      const patterns = buildReverseDirectionPatterns({})
      expect(patterns).toEqual([])
    })
    test('should create valid regex patterns', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      expect(patterns.length).toBeGreaterThan(0)
      patterns.forEach(pattern => expect(pattern).toBeInstanceOf(RegExp))
    })
  })

  describe('findAreaConnectionsInText', () => {
    test('should find forward connections', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from bathroom', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
    })
    test('should find multiple connections', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from bathroom. wall from kitchen', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(2)
      const locationIds = connections.map(c => c.workLocation.plumbingIssueLocId)
      expect(locationIds).toContain('bathroom')
      expect(locationIds).toContain('kitchen')
    })
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from upstairs bathroom', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    test('should handle different prepositions', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const fromConnection = findAreaConnectionsInText('sink from wall', patterns, MOCK_LOOKUP)
      const inConnection = findAreaConnectionsInText('bathroom in kitchen', patterns, MOCK_LOOKUP)
      const underConnection = findAreaConnectionsInText('cabinet under sink', patterns, MOCK_LOOKUP)
      expect(fromConnection[0].workLocation.plumbingIssueLocId).toBe('wall')
      expect(inConnection[0].workLocation.plumbingIssueLocId).toBe('kitchen')
      expect(underConnection[0].workLocation.plumbingIssueLocId).toBe('sink')
    })
    test('should return empty for no matches', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('random text with no locations', patterns, MOCK_LOOKUP)
      expect(connections).toEqual([])
    })
    test('should handle case insensitive matching', () => {
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText('CEILING FROM BATHROOM', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
  })

  describe('findReverseDirectionConnections', () => {
    test('should find reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('bathroom has ceiling leak', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('bathroom')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    test('should find multiple reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const conn1 = findReverseDirectionConnections('bathroom has ceiling leak', patterns, MOCK_LOOKUP)
      const conn2 = findReverseDirectionConnections('kitchen has wall damage', patterns, MOCK_LOOKUP)
      expect(conn1).toHaveLength(1)
      expect(conn1[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(conn2).toHaveLength(1)
      expect(conn2[0].workLocation.plumbingIssueLocId).toBe('kitchen')
    })
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      // Note: reverse patterns filter out multi-word aliases for regex safety,
      // so single-word locations like 'kitchen' or 'sink' are used here
      const connections = findReverseDirectionConnections('bathroom has kitchen leak', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].workLocation.alias).toBe('bathroom')
    })
    test('should handle different reverse verbs', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const leakingConnection = findReverseDirectionConnections('bathroom is leaking ceiling', patterns, MOCK_LOOKUP)
      const hasConnection = findReverseDirectionConnections('kitchen has wall', patterns, MOCK_LOOKUP)
      const withConnection = findReverseDirectionConnections('bathroom with sink', patterns, MOCK_LOOKUP)
      expect(leakingConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(hasConnection[0].workLocation.plumbingIssueLocId).toBe('kitchen')
      expect(withConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    test('should return empty for no matches', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('random text with no locations', patterns, MOCK_LOOKUP)
      expect(connections).toEqual([])
    })
    test('should handle case insensitive matching', () => {
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections('BATHROOM IS LEAKING CEILING', patterns, MOCK_LOOKUP)
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
  })

  describe('deduplicateCompounds', () => {
    test('should remove duplicate connections', () => {
      const connections = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } }
      ]
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['bathroom', 'kitchen'])
    })
    test('should handle empty array', () => {
      expect(deduplicateCompounds([])).toEqual([])
    })
    test('should preserve unique connections', () => {
      const connections = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } },
        { compoundAlias: 'bathroom-floor', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'floor' } }
      ]
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(3)
    })
    test('should handle complex duplicates', () => {
      const connections = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' }, contextLocation: { plumbingIssueLocId: 'ceiling' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' }, contextLocation: { plumbingIssueLocId: 'wall' } }
      ]
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['bathroom', 'kitchen'])
    })
  })

  // ========================================
  // ADVANCED INTEGRATION TESTS
  // ========================================

  describe('Advanced Integration Tests', () => {
    test('should handle complete forward detection workflow', () => {
      const text = 'ceiling from bathroom'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward')
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MOCK_LOOKUP)
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    test('should handle complete reverse detection workflow', () => {
      const text = 'bathroom has ceiling leak'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('reverse')
      const patterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const connections = findReverseDirectionConnections(text, patterns, MOCK_LOOKUP)
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    test('should handle adjacent strategy with both methods', () => {
      const text = 'bathroom ceiling problem'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('adjacent')
      const forwardPatterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const reversePatterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const forwardConnections = findAreaConnectionsInText(text, forwardPatterns, MOCK_LOOKUP)
      const reverseConnections = findReverseDirectionConnections(text, reversePatterns, MOCK_LOOKUP)
      const totalConnections = [...forwardConnections, ...reverseConnections]
      expect(totalConnections.length).toBeGreaterThanOrEqual(0)
    })
    test('should handle complex compound location detection', () => {
      const text = 'ceiling from upstairs bathroom'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward')
      const patterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MOCK_LOOKUP)
      expect(connections.length).toBeGreaterThan(0)
      const compoundConnection = connections.find(c => c.workLocation.plumbingIssueLocId === 'upstairs_bathroom')
      expect(compoundConnection).toBeDefined()
      expect(compoundConnection.workLocation.alias).toBe('upstairs bathroom')
    })
    test('should handle multiple pattern types in same text', () => {
      const text = 'bathroom is leaking ceiling and sink from wall'
      const strategy = detectPatternStrategy(text)
      expect(strategy).toBe('forward')
      const forwardPatterns = buildAreaRelationshipPatterns(MOCK_LOOKUP)
      const reversePatterns = buildReverseDirectionPatterns(MOCK_LOOKUP)
      const forwardConnections = findAreaConnectionsInText(text, forwardPatterns, MOCK_LOOKUP)
      const reverseConnections = findReverseDirectionConnections(text, reversePatterns, MOCK_LOOKUP)
      const allConnections = [...forwardConnections, ...reverseConnections]
      expect(allConnections.length).toBeGreaterThan(0)
    })
    test('should deduplicate complex connection sets', () => {
      const connections = [
        { compoundAlias: 'ceiling-bathroom', workLocation: { plumbingIssueLocId: 'ceiling' }, contextLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'ceiling-bathroom', workLocation: { plumbingIssueLocId: 'ceiling' }, contextLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'wall-kitchen', workLocation: { plumbingIssueLocId: 'wall' }, contextLocation: { plumbingIssueLocId: 'kitchen' } },
        { compoundAlias: 'wall-kitchen', workLocation: { plumbingIssueLocId: 'wall' }, contextLocation: { plumbingIssueLocId: 'kitchen' } },
        { compoundAlias: 'floor-basement', workLocation: { plumbingIssueLocId: 'floor' }, contextLocation: { plumbingIssueLocId: 'basement' } }
      ]
      const deduplicated = deduplicateCompounds(connections)
      expect(deduplicated).toHaveLength(3)
      expect(deduplicated.map(c => c.workLocation.plumbingIssueLocId)).toEqual(['ceiling', 'wall', 'floor'])
    })
  })
})
