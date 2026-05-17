/**
 * Simple Tests for compoundLocationHelpers.js
 * 
 * Tests only the functions that don't require heavy pattern building
 * Focuses on deduplication and basic functionality
 */

import {
  deduplicateCompounds
} from '../../compoundLocationHelpers.js'

describe('compoundLocationHelpers - Simple Tests', () => {

  describe('deduplicateCompounds', () => {
    test('should remove duplicate compounds by compoundAlias', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } }, // duplicate
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } }
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.compoundAlias)).toEqual(['bathroom-ceiling', 'kitchen-wall'])
    })
    
    test('should handle empty array', () => {
      expect(deduplicateCompounds([])).toEqual([])
    })
    
    test('should preserve unique compounds', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } },
        { compoundAlias: 'bedroom-floor', workLocation: { plumbingIssueLocId: 'bedroom' } }
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(3) // All are unique
    })
    
    test('should handle complex duplicates', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } }, // duplicate
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } }, // duplicate
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } } // duplicate
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(2)
      expect(deduplicated.map(c => c.compoundAlias)).toEqual(['bathroom-ceiling', 'kitchen-wall'])
    })
    
    test('should handle mixed duplicates and unique items', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } }, // duplicate
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } },
        { compoundAlias: 'bedroom-floor', workLocation: { plumbingIssueLocId: 'bedroom' } },
        { compoundAlias: 'kitchen-wall', workLocation: { plumbingIssueLocId: 'kitchen' } }, // duplicate
        { compoundAlias: 'garage-door', workLocation: { plumbingIssueLocId: 'garage' } }
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(4)
      expect(deduplicated.map(c => c.compoundAlias)).toEqual(['bathroom-ceiling', 'kitchen-wall', 'bedroom-floor', 'garage-door'])
    })
    
    test('should preserve order of first occurrence', () => {
      const compounds = [
        { compoundAlias: 'first-a', workLocation: { plumbingIssueLocId: 'first' } },
        { compoundAlias: 'second-b', workLocation: { plumbingIssueLocId: 'second' } },
        { compoundAlias: 'first-a', workLocation: { plumbingIssueLocId: 'first' } }, // duplicate
        { compoundAlias: 'third-c', workLocation: { plumbingIssueLocId: 'third' } },
        { compoundAlias: 'second-b', workLocation: { plumbingIssueLocId: 'second' } } // duplicate
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(3)
      expect(deduplicated.map(c => c.compoundAlias)).toEqual(['first-a', 'second-b', 'third-c'])
    })
    
    test('should handle edge cases with undefined/null compoundAlias', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } },
        { compoundAlias: null, workLocation: { plumbingIssueLocId: 'wall' } },
        { compoundAlias: undefined, workLocation: { plumbingIssueLocId: 'floor' } }
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(3) // Should handle null/undefined as distinct values
    })
  })

  // Performance Tests for deduplication
  describe('Deduplication Performance', () => {
    test('should handle large arrays efficiently', () => {
      // Create array with many duplicates
      const compounds = []
      for (let i = 0; i < 1000; i++) {
        compounds.push({
          compoundAlias: `compound-${i % 10}`, // 10 unique values
          workLocation: { plumbingIssueLocId: i % 10 }
        })
      }
      
      const startTime = performance.now()
      const deduplicated = deduplicateCompounds(compounds)
      const endTime = performance.now()
      
      expect(deduplicated.length).toBeLessThanOrEqual(10) // Max 10 unique compoundAlias values
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
    
    test('should handle single item array', () => {
      const compounds = [
        { compoundAlias: 'bathroom-ceiling', workLocation: { plumbingIssueLocId: 'bathroom' } }
      ]
      
      const deduplicated = deduplicateCompounds(compounds)
      expect(deduplicated).toHaveLength(1)
      expect(deduplicated[0]).toEqual(compounds[0])
    })
  })
})
