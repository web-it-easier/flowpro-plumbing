/**
 * Control-flow and high-level behavior tests for lookupMaps.js
 * - Memory-safe: uses spies/mocks to avoid heavy pattern building
 */

import { describe, test, expect } from 'vitest'
import * as lookup from '../../lookupMaps.js'

describe('lookupMaps - Control Flow', () => {
  describe('findPatterns - branch behavior (safe inputs)', () => {
    test('returns ambiguous for clearly unmatched input', () => {
      const result = lookup.findPatterns('no plumbing issues here')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].method).toBe('ambiguous')
      expect(result[0].context).toBe('ambiguous_input')
    })

    test('returns an array for simple matched input', () => {
      const result = lookup.findPatterns('toilet leaking')
      expect(Array.isArray(result)).toBe(true)
      // Could be contextual or fallback depending on rules; just ensure structure
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('method')
      }
    })
  })

  describe('findFallbackMatches - smoke', () => {
    test('returns array for simple area+symptom input', () => {
      const result = lookup.findFallbackMatches('toilet leaking')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('collectAreaAliases - shape test', () => {
    test('returns object with arrays for safe short clause', () => {
      const { areaAliases, symptomGroups } = lookup.collectAreaAliases(
        'bathroom ceiling leaking'
      )
      expect(Array.isArray(areaAliases)).toBe(true)
      expect(Array.isArray(symptomGroups)).toBe(true)
    })
  })
})
