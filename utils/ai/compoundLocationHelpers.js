// ========================================
// COMPOUND LOCATION DETECTION HELPERS
// ========================================

import { PLUMBING_ISSUE_ITEM_LOOKUP, DAMAGE_PLACE_LOOKUP } from './lookupMaps.js';

// Prepositions for compound location detection (damage_first patterns)
// NOTE: Considered but excluded to prevent false connections:
// - 'on' (e.g., "water on floor" - floor isn't source, just collection point)
// - 'by' (e.g., "leak by sink" - ambiguous proximity, not clear source)
// Current set focuses on clear source-location relationships
const SPATIAL_PREPOSITIONS = [
  'from', 'in', 'at', 'above', 'below', 'under', 'behind', 
  'next to', 'near', 'around', 'through', 'inside', 
  'underneath', 'over', 'across', 'along'
];

// Reverse-direction verbs for source-first patterns
// Pattern: "upstairs bathroom has ceiling leak"
const REVERSE_DIRECTION_VERBS = [
  'has', 'have', 'with', 'shows', 'showing', 'is leaking', 'are leaking',
  'was leaking', 'were leaking', 'dripping from', 'coming from', 'running from'
];

/**
 * Helper: Find area in text using lookup map
 */
export const findAreaInText = (text, lookupMap) => {
  if (!text) return null
  const lowerText = text.toLowerCase().trim()
  return Object.entries(lookupMap).find(([alias]) => 
    lowerText === alias.toLowerCase().trim()
  )
}

/**
 * Helper: Escape string for safe use in RegExp
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Helper: Find ALL area matches in text using lookup map
 * Returns array of all matching aliases found in the text
 * Strategy: find all candidate spans by word-boundary regex, then pick
 * longest non-overlapping spans greedily. This avoids overlaps such as
 * "upstairs bathroom" and "bathroom" both matching.
 */
export const findAllAreasInText = (text, lookupMap) => {
  // 1. Guard clause - return empty array if no text
  if (!text) return []
  
  // 2. Convert input text to lowercase and trim whitespace
  //    "Upstairs Bathroom OR Kitchen" → "upstairs bathroom or kitchen"
  const lowerText = text.toLowerCase().trim()
  
  // 3. Array to hold all potential matches before filtering
  const candidates = []

  // 4. Loop through all aliases in the lookup map
  //    lookupMap = { "upstairs bathroom": "upstairs_bathroom", "bathroom": "bathroom", ... }
  for (const [alias, areaId] of Object.entries(lookupMap)) {
    // 5. Clean up the alias (lowercase, trim)
    //    "Upstairs Bathroom" → "upstairs bathroom"
    const aliasLower = alias.toLowerCase().trim()
    if (!aliasLower) continue // Skip empty aliases
    
    // 6. Create word-boundary regex to find exact matches
    //    \b = word boundary, ensures "bathroom" doesn't match in "bathroom vanity"
    //    \bupstairs bathroom\b matches "upstairs bathroom" but not part of other words
    const pattern = new RegExp(`\\b${escapeRegex(aliasLower)}\\b`, 'gi')
    
    // 7. Execute regex to find ALL matches in the text (not just first)
    //    This catches repeated mentions like "bathroom...and bathroom again"
    let m
    //.exec() searches the text and returns the first match.
    //But after each call, the regex remembers where it stopped, 
    //so the next call continues from there.It's like reading a book with a bookmark 📖.
    while ((m = pattern.exec(lowerText)) !== null) {
      // 8. Extract position and length of each match
      //    For "upstairs bathroom" at start: start=0, end=16, length=16
      const start = m.index
      const end = m.index + aliasLower.length
      candidates.push({ alias, areaId, start, end, length: end - start })
    }
  }

  // 9. Sort candidates by length (longest first), then by position for stability
  //    This ensures "upstairs bathroom" (16 chars) comes before "bathroom" (8 chars)
  candidates.sort((a, b) => (b.length - a.length) || (a.start - b.start))

  // 10. Array to hold final non-overlapping matches
  const selected = []
  
  // 11. Greedy selection of non-overlapping matches
  for (const c of candidates) {
    // 12. Check if this candidate overlaps with any already selected candidate
    //    Overlap exists if: NOT (c.end <= s.start OR c.start >= s.end)
    //    Which means: c.start < s.end AND c.end > s.start
    const overlaps = selected.some(s => !(c.end <= s.start || c.start >= s.end))
    
    // 13. Only add if no overlap found
    if (!overlaps) {
      selected.push(c)
    }
  }

  // 14. Sort final selection back to original text order
  selected.sort((a, b) => a.start - b.start)
  
  // 15. Return just the [alias, areaId] pairs in order
  return selected.map(s => [s.alias, s.areaId])
}

/**
 * Helper: Build regex patterns for area relationships
 * Pattern: "ceiling from upstairs bathroom" (damage from source)
 * 
 * @param {Object} lookup - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of RegExp patterns
 */
export const buildAreaRelationshipPatterns = (lookup) => {
  // Build a single combined regex for ALL aliases instead of one per alias
  // This prevents OOM when lookup maps have hundreds of entries
  const aliases = Object.keys(lookup).filter(a => !a.includes(' '))
  if (aliases.length === 0) return []

  const prepositionPattern = SPATIAL_PREPOSITIONS.join('|')
  // Sort by length (longest first) so longer aliases match before shorter ones
  const aliasPattern = aliases.sort((a, b) => b.length - a.length).map(escapeRegex).join('|')

  // Single pattern: (ceiling|wall|floor|...)\s+(from|in|at|...)\s+(?:the\s+)?([^.,;!?\n]+)
  const pattern = new RegExp(`(${aliasPattern})\\s+(${prepositionPattern})\\s+(?:the\\s+)?([^.,;!?\\n]+)`, 'gi')

  return [pattern]
}

/**
 * Helper: Build reverse-direction patterns for source-first relationships
 * Pattern: "upstairs bathroom has ceiling leak" (source has damage)
 * 
 * @param {Object} lookup - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of RegExp patterns
 */
export const buildReverseDirectionPatterns = (lookup) => {
  // Build a single combined regex for ALL aliases instead of one per alias
  // This prevents OOM when lookup maps have hundreds of entries
  const aliases = Object.keys(lookup).filter(a => !a.includes(' '))
  if (aliases.length === 0) return []

  const verbPattern = REVERSE_DIRECTION_VERBS.join('|')
  // Sort by length (longest first) so longer aliases match before shorter ones
  const aliasPattern = aliases.sort((a, b) => b.length - a.length).map(escapeRegex).join('|')

  // Single pattern: ([^.,;!?\n]+)\s+(has|have|...)\s+(?:the\s+)?(ceiling|wall|floor|...)
  const pattern = new RegExp(`([^.,;!?\\n]+)\\s+(${verbPattern})\\s+(?:the\\s+)?(${aliasPattern})`, 'gi')

  return [pattern]
}

/**
 * Helper: Find reverse-direction connections in text using verb patterns
 * Searches text for patterns like "upstairs bathroom has ceiling leak" and returns connections
 * 
 * @param {string} text - Text to search in
 * @param {Array} regexPatterns - Array of RegExp patterns built by buildReverseDirectionPatterns
 * @param {Object} lookupMap - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of area connection objects with workLocation and contextLocation
 */
export const findReverseDirectionConnections = (text, regexPatterns, lookupMap) => {
  const foundConnections = []
  const uniqueDamageAreas = new Set()
  
  console.log('DEBUG findReverseDirectionConnections: text:', text)
  
  for (const pattern of regexPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      console.log('DEBUG findReverseDirectionConnections: pattern match:', match)
      // Pattern: (source_candidate) (verb) (damage_candidate)
      // e.g., "upstairs bathroom has ceiling"
      const [, sourceCandidate, verb, damageCandidate] = match
      
      // Track unique damage areas mentioned
      uniqueDamageAreas.add(damageCandidate.toLowerCase())
      
      // For reverse patterns, sourceCandidate should be work location, damageCandidate should be damage area
      const sourceMatch = findAreaInText(sourceCandidate, PLUMBING_ISSUE_ITEM_LOOKUP) || 
                         findAreaInText(sourceCandidate, DAMAGE_PLACE_LOOKUP)
      const damageMatch = findAreaInText(damageCandidate, lookupMap)
      
      console.log('DEBUG findReverseDirectionConnections: sourceMatch:', sourceMatch, 'damageMatch:', damageMatch)
      
      if (sourceMatch && damageMatch) {
        const [sourceAlias, sourceAreaId] = sourceMatch
        const [damageAlias, damageAreaId] = damageMatch
        
        foundConnections.push({
          matchText: `${sourceCandidate} ${verb} ${damageCandidate}`.trim(),
          workLocation: {
            plumbingIssueLocId: sourceAreaId,
            alias: sourceAlias,
            role: 'work_site'
          },
          contextLocation: {
            plumbingIssueLocId: damageAreaId,
            alias: damageAlias,
            role: 'context'
          },
          consumedText: [sourceCandidate.toLowerCase(), damageCandidate.toLowerCase()],
          uniqueDamageAreas: Array.from(uniqueDamageAreas),
          verb,
          confidence: 0.85, // Slightly lower confidence for reverse patterns
          ambiguity: false,
          pattern: 'source-first'
        })
      }
    }
  }
  
  console.log('DEBUG findReverseDirectionConnections: unique damage areas found:', Array.from(uniqueDamageAreas))
  
  return foundConnections
}

/**
 * Helper: Detect optimal pattern strategy for text
 * Returns which detection method to use based on text content
 */
export const detectPatternStrategy = (text) => {
  // Check for prepositions with word boundaries (avoid false matches like "in" in "sink")
  const hasPreposition = SPATIAL_PREPOSITIONS.some(p => 
    new RegExp(`\\b${escapeRegex(p)}\\b`, 'i').test(text)
  )
  
  // Check for reverse-direction verbs with word boundaries
  const hasReverseVerb = REVERSE_DIRECTION_VERBS.some(v => 
    new RegExp(`\\b${escapeRegex(v)}\\b`, 'i').test(text)
  )
  
  // Strategy selection logic
  if (hasPreposition) {
    return 'forward' // Clear preposition pattern: "ceiling from bathroom"
  } else if (hasReverseVerb) {
    return 'reverse' // Clear reverse pattern: "bathroom has ceiling leak"
  } else {
    return 'adjacent' // No clear indicators, try adjacent patterns
  }
}

/**
 * Helper: Find area connections in text using regex patterns
 * Searches text for patterns like "ceiling from bathroom", "wall behind sink", "floor under toilet" and returns connections
 * 
 * @param {string} text - Text to search in
 * @param {Array} regexPatterns - Array of RegExp patterns built by buildAreaRelationshipPatterns
 * @param {Object} lookupMap - Lookup map (PLUMBING_ISSUE_ITEM_LOOKUP or DAMAGE_PLACE_LOOKUP)
 * @returns {Array} - Array of area connection objects with workLocation and contextLocation
 */
export const findAreaConnectionsInText = (text, regexPatterns, lookupMap) => {
  const foundConnections = []
  const uniqueDamageAreas = new Set() // Track unique damage areas mentioned
  
  console.log('DEBUG findAreaConnectionsInText: text:', text)
  
  for (const pattern of regexPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      console.log('DEBUG findAreaConnectionsInText: pattern match:', match)
      // Pattern: (damage_candidate) (from|in|at) (source_candidate)
      // e.g., "ceiling from upstairs bathroom"
      // Note: "from/in/at" typically means following = source, first = damage
      const [, damageCandidate, preposition, sourceCandidate] = match
      
      // Track unique damage areas mentioned
      uniqueDamageAreas.add(damageCandidate.toLowerCase())
      
      // Validate damage candidate in current lookup map
      const damageMatch = findAreaInText(damageCandidate, lookupMap)
      
      // For source candidate, find ALL possible matches (not just first one)
      // This handles cases like "ceiling from upstairs bathroom or kitchen"
      let sourceMatches = []
      if (lookupMap === DAMAGE_PLACE_LOOKUP) {
        // Try work locations first, then fallback to damage places
        sourceMatches = findAllAreasInText(sourceCandidate, PLUMBING_ISSUE_ITEM_LOOKUP)
        if (sourceMatches.length === 0) {
          sourceMatches = findAllAreasInText(sourceCandidate, DAMAGE_PLACE_LOOKUP)
        }
      } else {
        // Already searching work locations
        sourceMatches = findAllAreasInText(sourceCandidate, lookupMap)
      }
      
      console.log('DEBUG findAreaConnectionsInText: damageMatch:', damageMatch, 'sourceMatches:', sourceMatches)
      
      if (damageMatch && sourceMatches.length > 0) {
        const [damageAlias, damageAreaId] = damageMatch
        
        // Create connections for ALL found source matches
        for (const [sourceAlias, sourceAreaId] of sourceMatches) {
          // Determine work location vs context based on preposition
          // Most prepositions mean sourceCandidate is the work location (where plumber goes)
          // damageCandidate is where damage shows (context for dispatcher)
          const prepositionIndicatesSource = SPATIAL_PREPOSITIONS.includes(preposition.toLowerCase())
          
          foundConnections.push({
            matchText: `${damageCandidate} ${preposition} ${sourceAlias}`.trim(),
            originalText: `${damageCandidate} ${preposition} ${sourceCandidate}`.trim(), // Keep original for reference
            workLocation: {
              plumbingIssueLocId: prepositionIndicatesSource ? sourceAreaId : damageAreaId,
              alias: prepositionIndicatesSource ? sourceAlias : damageAlias,
              role: 'work_site'
            },
            contextLocation: {
              plumbingIssueLocId: prepositionIndicatesSource ? damageAreaId : sourceAreaId,
              alias: prepositionIndicatesSource ? damageAlias : sourceAlias,
              role: 'context'
            },
            consumedText: [damageCandidate.toLowerCase(), sourceAlias.toLowerCase()], // Track consumed parts
            uniqueDamageAreas: Array.from(uniqueDamageAreas), // All unique damage areas mentioned
            preposition,
            confidence: sourceMatches.length > 1 ? 0.75 : 0.87, // Lower confidence if multiple possibilities
            ambiguity: sourceMatches.length > 1, // Mark as ambiguous if multiple sources found
            pattern: 'area-first',
            alternativeSources: sourceMatches.length > 1 ? sourceMatches.map(([alias]) => alias) : []
          })
        }
      }
    }
  }
  
  console.log('DEBUG findAreaConnectionsInText: unique damage areas found:', Array.from(uniqueDamageAreas))
  
  return foundConnections
}

/**
 * Helper: Deduplicate compounds by compoundAlias
 * 
 * @param {Array} compounds - Array of compound objects
 * @returns {Array} - Deduplicated array
 */
export const deduplicateCompounds = (compounds) => {
  const seen = new Set()
  return compounds.filter(c => {
    const key = c.compoundAlias
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
