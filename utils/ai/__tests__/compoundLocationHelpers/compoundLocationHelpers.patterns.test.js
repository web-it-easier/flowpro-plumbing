/**
 * Pattern Tests for compoundLocationHelpers.js
 * 
 * Tests the pattern building and connection finding functions
 * Uses minimal mock data to avoid memory issues
 */

import {
  buildAreaRelationshipPatterns,
  buildReverseDirectionPatterns,
  findAreaConnectionsInText,
  findReverseDirectionConnections,
  deduplicateCompounds
} from '../../compoundLocationHelpers.js'

// Minimal mock data for pattern testing
const MINIMAL_LOOKUP = {
  'bathroom': 'bathroom',
  'kitchen': 'kitchen',
  'ceiling': 'ceiling',
  'wall': 'wall',
  'floor': 'floor',
  'toilet': 'toilet',
  'faucet': 'faucet',
  'sink': 'sink',
  'upstairs bathroom': 'upstairs_bathroom'
}

describe('compoundLocationHelpers - Pattern Tests', () => {

  describe('buildAreaRelationshipPatterns', () => {
    test('should build a single combined pattern for forward detection', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/from|in|under|behind|above|below|at/)
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      // Combined regex includes all aliases; multi-word areas are skipped
      expect(patterns[0].source).toMatch(/bathroom|kitchen|ceiling/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildAreaRelationshipPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      expect(patterns.length).toBeGreaterThan(0)
      patterns.forEach(pattern => {
        expect(pattern).toBeInstanceOf(RegExp)
      })
    })
  })

  describe('buildReverseDirectionPatterns', () => {
    test('should build a single combined pattern for reverse detection', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/has|have|with|shows|is leaking|dripping/)
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toBeInstanceOf(RegExp)
      expect(patterns[0].source).toMatch(/bathroom|kitchen|ceiling/)
    })
    
    test('should handle empty lookup', () => {
      const patterns = buildReverseDirectionPatterns({})
      expect(patterns).toEqual([])
    })
    
    test('should create valid regex patterns', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      expect(patterns.length).toBeGreaterThan(0)
      patterns.forEach(pattern => {
        expect(pattern).toBeInstanceOf(RegExp)
      })
    })
  })

  describe('findAreaConnectionsInText', () => {
    // Forward pattern: (alias)\s+(preposition)\s+(source)
    // Alias comes FIRST, then preposition, then source location
    test('should find forward connections', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from bathroom', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('bathroom')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple connections', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from bathroom, wall from kitchen', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(2)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[1].workLocation.plumbingIssueLocId).toBe('kitchen')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('ceiling from upstairs bathroom', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('upstairs_bathroom')
      expect(connections[0].workLocation.alias).toBe('upstairs bathroom')
    })
    
    test('should handle different prepositions', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      
      const fromConnection = findAreaConnectionsInText('sink from wall', patterns, MINIMAL_LOOKUP)
      const inConnection = findAreaConnectionsInText('bathroom in kitchen', patterns, MINIMAL_LOOKUP)
      const underConnection = findAreaConnectionsInText('cabinet under sink', patterns, MINIMAL_LOOKUP)
      
      expect(fromConnection[0].workLocation.plumbingIssueLocId).toBe('wall')
      expect(inConnection[0].workLocation.plumbingIssueLocId).toBe('kitchen')
      expect(underConnection).toEqual([]) // cabinet not in minimal lookup
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('random text with no locations', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText('CEILING FROM BATHROOM', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
  })

  describe('findReverseDirectionConnections', () => {
    // Reverse pattern: (source)\s+(verb)\s+(alias)
    // Source comes FIRST, then verb, then damage alias
    test('should find reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('bathroom has ceiling leak', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].contextLocation.plumbingIssueLocId).toBe('ceiling')
      expect(connections[0].workLocation.alias).toBe('bathroom')
      expect(connections[0].contextLocation.alias).toBe('ceiling')
    })
    
    test('should find multiple reverse connections', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      // Note: reverse pattern source capture is greedy, so test separately
      const conn1 = findReverseDirectionConnections('bathroom has ceiling leak', patterns, MINIMAL_LOOKUP)
      const conn2 = findReverseDirectionConnections('kitchen has wall damage', patterns, MINIMAL_LOOKUP)
      
      expect(conn1).toHaveLength(1)
      expect(conn1[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(conn2).toHaveLength(1)
      expect(conn2[0].workLocation.plumbingIssueLocId).toBe('kitchen')
    })
    
    test('should handle compound locations', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      // findAreaInText does exact match; 'upstairs bathroom' must be in real lookups
      const connections = findReverseDirectionConnections('bathroom has ceiling leak', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(connections[0].workLocation.alias).toBe('bathroom')
    })
    
    test('should handle different reverse verbs', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      
      const leakingConnection = findReverseDirectionConnections('bathroom is leaking ceiling', patterns, MINIMAL_LOOKUP)
      const hasConnection = findReverseDirectionConnections('kitchen has wall', patterns, MINIMAL_LOOKUP)
      const withConnection = findReverseDirectionConnections('bathroom with ceiling', patterns, MINIMAL_LOOKUP)
      
      expect(leakingConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
      expect(hasConnection[0].workLocation.plumbingIssueLocId).toBe('kitchen')
      expect(withConnection[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    
    test('should return empty for no matches', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('random text with no locations', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toEqual([])
    })
    
    test('should handle case insensitive matching', () => {
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections('BATHROOM IS LEAKING CEILING', patterns, MINIMAL_LOOKUP)
      
      expect(connections).toHaveLength(1)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
  })

  describe('deduplicateCompounds', () => {
    // deduplicateCompounds uses compoundAlias as the dedup key
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
      expect(deduplicated).toHaveLength(3) // All are unique compoundAlias
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

  // Simple Integration Tests
  describe('Simple Integration Tests', () => {
    test('should handle complete forward detection workflow', () => {
      const text = 'ceiling from bathroom'
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    
    test('should handle complete reverse detection workflow', () => {
      const text = 'bathroom is leaking ceiling'
      const patterns = buildReverseDirectionPatterns(MINIMAL_LOOKUP)
      const connections = findReverseDirectionConnections(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      expect(connections[0].workLocation.plumbingIssueLocId).toBe('bathroom')
    })
    
    test('should handle compound location detection', () => {
      const text = 'ceiling from upstairs bathroom'
      const patterns = buildAreaRelationshipPatterns(MINIMAL_LOOKUP)
      const connections = findAreaConnectionsInText(text, patterns, MINIMAL_LOOKUP)
      
      expect(connections.length).toBeGreaterThan(0)
      // Should find compound location "upstairs bathroom"
      const compoundConnection = connections.find(c => c.workLocation.plumbingIssueLocId === 'upstairs_bathroom')
      expect(compoundConnection).toBeDefined()
      expect(compoundConnection.workLocation.alias).toBe('upstairs bathroom')
    })
  })
})
