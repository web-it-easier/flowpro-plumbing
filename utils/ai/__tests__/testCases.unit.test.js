import { describe, it, expect } from 'vitest'
import { testCases } from '../testCases.js'

const ALLOWED_METHODS = new Set(['contextual', 'fallback', 'mixed'])
const ALLOWED_PRIORITIES = new Set(['IMMEDIATE', 'SAME_DAY', 'SCHEDULE', 'CLARIFICATION'])

describe('utils/ai/testCases.js - data integrity', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(testCases)).toBe(true)
    expect(testCases.length).toBeGreaterThan(0)
  })

  it('each test case has required fields with valid types/values', () => {
    for (const tc of testCases) {
      // required fields present
      expect(tc).toHaveProperty('category')
      expect(tc).toHaveProperty('title')
      expect(tc).toHaveProperty('input')
      expect(tc).toHaveProperty('expected')
      expect(tc).toHaveProperty('shouldUse')
      expect(tc).toHaveProperty('expectedCount')
      expect(tc).toHaveProperty('priorities')

      // basic types
      expect(typeof tc.category).toBe('string')
      expect(tc.category.trim().length).toBeGreaterThan(0)

      expect(typeof tc.title).toBe('string')
      expect(tc.title.trim().length).toBeGreaterThan(0)

      expect(typeof tc.input).toBe('string')
      expect(tc.input.trim().length).toBeGreaterThan(0)
      expect(tc.input.length).toBeLessThanOrEqual(2000)

      expect(typeof tc.expected).toBe('string')
      expect(tc.expected.trim().length).toBeGreaterThan(0)

      expect(ALLOWED_METHODS.has(tc.shouldUse)).toBe(true)

      expect(Number.isInteger(tc.expectedCount)).toBe(true)
      expect(tc.expectedCount).toBeGreaterThanOrEqual(0)

      expect(Array.isArray(tc.priorities)).toBe(true)
      expect(tc.priorities.length).toBe(tc.expectedCount)
      for (const p of tc.priorities) {
        expect(typeof p).toBe('string')
        expect(ALLOWED_PRIORITIES.has(p)).toBe(true)
      }
    }
  })

  it('titles are unique and categories appear at least once', () => {
    const titles = new Set()
    const catCounts = new Map()

    for (const tc of testCases) {
      const t = tc.title.trim()
      expect(titles.has(t)).toBe(false)
      titles.add(t)

      catCounts.set(tc.category, (catCounts.get(tc.category) || 0) + 1)
    }

    // baseline categories we expect to find
    const baseline = [
      'Contextual - Emergency',
      'Contextual - Mixed',
      'Compound - Area Relationships',
      'Panic Detection',
      'Incident Merger',
      'Fallback Tests',
    ]
    for (const cat of baseline) {
      expect(catCounts.get(cat)).toBeGreaterThan(0)
    }
  })
})
