// 🎯 AI Pattern Buckets - Central Export for All Pattern Types
// This makes it easy to import all patterns at once or individually

import { SPECIFIC_PHRASES } from './specificPhrases.js'
import { REGEX_PATTERNS } from './regexPatterns.js'
import { GENERAL_KEYWORDS } from './generalKeywords.js'

export { SPECIFIC_PHRASES } from './specificPhrases.js'
export { REGEX_PATTERNS } from './regexPatterns.js'
export { GENERAL_KEYWORDS } from './generalKeywords.js'

// 🎯 All patterns in one object (for convenience)

export const ALL_PATTERNS = {
  SPECIFIC_PHRASES,
  REGEX_PATTERNS,
  GENERAL_KEYWORDS
}

// 🎯 Pattern metadata (for debugging and validation)
export const PATTERN_METADATA = {
  SPECIFIC_PHRASES: {
    confidence: 0.9,
    type: 'exact-match',
    description: 'Exact phrases customers commonly use'
  },
  REGEX_PATTERNS: {
    confidence: 0.7,
    type: 'pattern-match',
    description: 'Flexible patterns for word order variations'
  },
  GENERAL_KEYWORDS: {
    confidence: 0.5,
    type: 'keyword-match',
    description: 'Fallback keywords when nothing else matches'
  }
}
