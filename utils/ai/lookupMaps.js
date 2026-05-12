// ========================================
// AI PATTERN MATCHING SYSTEM
// ========================================

// Split location data: damage places (locations where damage visible) vs plumbing items (what needs fixing - fixtures, components, appliances, systems)
import DAMAGE_PLACES from '../../data/damagePlaces.js'
import { PLUMBING_ISSUE_ITEMS } from '../../data/plumbingIssueItems.js'
import SYMPTOMS from '../../data/symptoms.js'
import AREA_JOB_CONFIGS from '../../data/areaJobConfigs.js'
import { buildAreaRelationshipPatterns, buildReverseDirectionPatterns, findAreaConnectionsInText, findReverseDirectionConnections, detectPatternStrategy, deduplicateCompounds } from './compoundLocationHelpers.js'
import {
  processSymptomsByArea,
  processAreaSymptomPairs,
  addFallbackMatches
} from './contextualMatchHelpers.js'

// ========================================
// NORMALIZATION & LOOKUP MAPS
// ========================================

/**
 * Normalizes text for consistent matching
 * - Lowercase conversion
 * - Remove extra whitespace
 * - Standardize punctuation
 */
export const normalizeText = (text) => {
  return text.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]/g, ' ')
}

// Create lookup maps for efficient pattern matching
export const DAMAGE_PLACE_LOOKUP = {}
export const PLUMBING_ISSUE_ITEM_LOOKUP = {}
export const SYMPTOM_LOOKUP = {}

// Metadata maps to store category and other properties
export const PLUMBING_LOCATION_METADATA = {}
export const DAMAGE_PLACE_METADATA = {}

// Build damage place lookup map (locations where damage manifests - visible or detected)
DAMAGE_PLACES.forEach(place => {
  place.aliases.forEach(alias => {
    DAMAGE_PLACE_LOOKUP[alias.toLowerCase()] = place.id
  })
  DAMAGE_PLACE_METADATA[place.id] = {
    category: place.category || 'location',
    description: place.description
  }
})

// Build plumbing items lookup map (what needs fixing - fixtures, components, appliances, systems)
PLUMBING_ISSUE_ITEMS.forEach(item => {
  item.customerSearchTerms.forEach(alias => {
    PLUMBING_ISSUE_ITEM_LOOKUP[alias.toLowerCase()] = item.locationId
  })
  PLUMBING_LOCATION_METADATA[item.locationId] = {
    dispatchCategory: item.dispatchCategory,
    technicalDescription: item.technicalDescription
  }
})

// NOTE: Separate lookups maintained for semantic clarity
// DAMAGE_PLACE_LOOKUP = where damage is visible (locations: rooms, surfaces)
// PLUMBING_ISSUE_ITEM_LOOKUP = what needs fixing (fixtures, components, appliances, systems)
// These are NOT combined to enforce strict semantic separation

// Build symptom lookup map from aliases
SYMPTOMS.forEach(symptom => {
  symptom.aliases.forEach(alias => {
    SYMPTOM_LOOKUP[alias.toLowerCase()] = symptom.id
  })
})

// ========================================
// REGEX PATTERNS
// ========================================

// Build separate regex patterns for semantic clarity
const DAMAGE_PLACE_WORDS = Object.keys(DAMAGE_PLACE_LOOKUP).join('|')
const PLUMBING_ISSUE_TERMS = Object.keys(PLUMBING_ISSUE_ITEM_LOOKUP).join('|')
const SYMPTOM_WORDS = Object.keys(SYMPTOM_LOOKUP).join('|')

// Separate regexes for each pattern type
export const DAMAGE_PLACE_REGEX = new RegExp(`\b(${DAMAGE_PLACE_WORDS})\b`, 'gi')  // Locations: ceiling, wall, bathroom, kitchen
export const PLUMBING_ISSUE_REGEX = new RegExp(`\\b(${PLUMBING_ISSUE_TERMS})\\b`, 'gi')  // Issues: toilet, faucet, water heater, pipes
export const SYMPTOM_REGEX = new RegExp(`\b(${SYMPTOM_WORDS})\b`, 'gi')  // Symptoms: leaking, dripping, clogged, no_water

// ========================================
// SYMPTOM GROUPING
// ========================================

// Pre-compile regex pattern for performance (created once at module load)
const SYMPTOM_GROUP_PATTERN = new RegExp(
  `(${SYMPTOM_WORDS})\\s*(?:and|,)\\s*(${SYMPTOM_WORDS})(?:\\s*(?:and|,)\\s*(${SYMPTOM_WORDS}))*`,
  'gi'
)

/**
 * Detect symptom groups connected by "and"
 * Example: "bubbling and sagging" → ["bubbling", "sagging"]
 * Example: "leaking, dripping, and running" → ["leaking", "dripping", "running"]
 * 
 * @param {string} text - Text to search for symptom groups
 * @returns {Array} - Array of symptom groups, each containing multiple symptoms
 */
export const detectSymptomGroups = (text) => {
  const symptomGroups = []

  // Pattern: symptom (and|,) symptom (and|,) symptom
  // Matches: "bubbling and sagging", "leaking, dripping, and running"
  // Uses pre-compiled SYMPTOM_GROUP_PATTERN for performance

  let match
  while ((match = SYMPTOM_GROUP_PATTERN.exec(text)) !== null) {
    // exec() returns: [fullMatch, group1, group2, group3]
    // match[0] = full matched string (e.g., "bubbling, sagging, and cracking")
    // match[1] = first capture group (e.g., "bubbling")
    // match[2] = second capture group (e.g., "sagging")
    // match[3] = third capture group (e.g., "cracking") or undefined
    // slice(1) removes the full match at index 0, keeping only captured symptoms
    const group = match.slice(1).filter(Boolean) // Remove undefined/null values
    if (group.length > 1) {
      symptomGroups.push(group)
    }
  }

  return symptomGroups
}

// ========================================
// MATCHING RULES
// ========================================

const createMatchingRules = () => {
  const allRules = []

  // Loop through each area job config and create a flat rule per area+symptom pair
  AREA_JOB_CONFIGS.forEach(areaJobConfig => {
    // For each area job config, create rules for all its supported symptoms
    areaJobConfig.supportedSymptoms.forEach(symptomId => {
      const rule = {
        plumbingIssueLocId: areaJobConfig.area,       // e.g., "toilet" 
        symptomId: symptomId,             // e.g., "clog", "running"
        pattern: areaJobConfig            // Full area job config with jobType, overrides, etc.
      }
      allRules.push(rule)
    })
  })

  return allRules
}

export const MATCHING_RULES = createMatchingRules()
export const VALID_SYMPTOMS_BY_CATEGORY = (() => {
  const byCategory = new Map()
  for (const { plumbingIssueLocId, symptomId } of MATCHING_RULES) {
    if (!byCategory.has(plumbingIssueLocId)) {
      byCategory.set(plumbingIssueLocId, new Set())
    }
    byCategory.get(plumbingIssueLocId).add(symptomId)
  }
  return byCategory
})()

// ========================================
// CATEGORY HELPER FUNCTIONS
// ========================================

/**
 * Get work item category for dispatch decisions
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {string|null} - Category (fixture, component, appliance, system) or null
 */
export const getWorkItemCategory = (plumbingIssueLocId) => {
  return PLUMBING_LOCATION_METADATA[plumbingIssueLocId]?.dispatchCategory || null
}

/**
 * Get damage place type for cross-trade coordination
 * Used by other trades (drywall, painters) to plan materials and work
 * @param {string} placeId - The damage place ID
 * @returns {string|null} - Type (room, surface, structure, etc.) or null
 */
export const getDamagePlaceType = (placeId) => {
  return DAMAGE_PLACE_METADATA[placeId]?.category || null
}

/**
 * Check if a plumbing issue location is a component (specific part)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isComponent = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'component'
}

/**
 * Check if a plumbing issue location is a fixture (complete unit)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isFixture = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'fixture'
}

/**
 * Check if a plumbing issue location is an appliance (major equipment)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isAppliance = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'appliance'
}

/**
 * Check if a plumbing issue location is a system (infrastructure)
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {boolean}
 */
export const isSystem = (plumbingIssueLocId) => {
  return getWorkItemCategory(plumbingIssueLocId) === 'system'
}

/**
 * Get team size recommendation based on category
 * @param {string} plumbingIssueLocId - The plumbing issue location ID
 * @returns {number} - Recommended team size (1, 2, or 3)
 */
export const getTeamSizeRecommendation = (plumbingIssueLocId) => {
  const category = getWorkItemCategory(plumbingIssueLocId)
  switch (category) {
    case 'component':
      return 1 // Simple part replacement
    case 'fixture':
      return 1 // Most fixture repairs are single plumber
    case 'appliance':
      return 2 // Water heaters, sump pumps often need 2 for safety/lifting
    case 'system':
      return 2 // Sewer lines, main pipes may need 2+
    default:
      return 1
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Detects relationships between locations and plumbing items: where damage shows vs what needs fixing
 * Uses separate lookups for semantic clarity:
 * - PLUMBING_ISSUE_ITEM_LOOKUP for plumbing items (fixtures, components, appliances, systems)
 * - DAMAGE_PLACE_LOOKUP for locations (where damage is visible)
 * 
 * Example: "ceiling from bathroom"
 * - workLocation: bathroom (location where damage originates) - DAMAGE_PLACE
 * - contextLocation: ceiling (where damage is visible) - DAMAGE_PLACE
 * 
 * Example: "toilet is leaking"
 * - workLocation: toilet (fixture that needs fixing) - PLUMBING_ISSUE_ITEM
 * - contextLocation: bathroom (where damage visible) - DAMAGE_PLACE
 * 
 * Example: "water heater in basement"
 * - workLocation: water_heater (appliance that needs fixing) - PLUMBING_ISSUE_ITEM
 * - contextLocation: basement (where appliance is located) - DAMAGE_PLACE
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of area relationship objects
 */
export const detectAreaRelationships = (text) => {
  console.log('DEBUG: Detecting area relationships in clause:', text)

  // Determine optimal strategy for this text
  const strategy = detectPatternStrategy(text)
  console.log('DEBUG: Detected pattern strategy:', strategy)

  let allDetectedConnections = []

  if (strategy === 'forward') {
    // Use forward detection only (preposition patterns)
    console.log('DEBUG: Using forward detection strategy')
    const workAreaRegexPatterns = buildAreaRelationshipPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
    const damageAreaRegexPatterns = buildAreaRelationshipPatterns(DAMAGE_PLACE_LOOKUP)

    const foundWorkAreaConnections = findAreaConnectionsInText(text, workAreaRegexPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
    const foundDamageAreaConnections = findAreaConnectionsInText(text, damageAreaRegexPatterns, DAMAGE_PLACE_LOOKUP)
    allDetectedConnections = foundWorkAreaConnections.concat(foundDamageAreaConnections)

  } else if (strategy === 'reverse') {
    // Use reverse detection only (verb patterns)
    console.log('DEBUG: Using reverse detection strategy')
    const reverseWorkAreaPatterns = buildReverseDirectionPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
    const reverseDamageAreaPatterns = buildReverseDirectionPatterns(DAMAGE_PLACE_LOOKUP)

    const foundWorkAreaConnections = findReverseDirectionConnections(text, reverseWorkAreaPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
    const foundDamageAreaConnections = findReverseDirectionConnections(text, reverseDamageAreaPatterns, DAMAGE_PLACE_LOOKUP)
    allDetectedConnections = foundWorkAreaConnections.concat(foundDamageAreaConnections)

  } else {
    // Adjacent patterns: try both forward and reverse as fallback
    console.log('DEBUG: Using adjacent patterns (try both strategies)')
    const workAreaRegexPatterns = buildAreaRelationshipPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
    const damageAreaRegexPatterns = buildAreaRelationshipPatterns(DAMAGE_PLACE_LOOKUP)
    const reverseWorkAreaPatterns = buildReverseDirectionPatterns(PLUMBING_ISSUE_ITEM_LOOKUP)
    const reverseDamageAreaPatterns = buildReverseDirectionPatterns(DAMAGE_PLACE_LOOKUP)

    const forwardWorkConnections = findAreaConnectionsInText(text, workAreaRegexPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
    const forwardDamageConnections = findAreaConnectionsInText(text, damageAreaRegexPatterns, DAMAGE_PLACE_LOOKUP)
    const reverseWorkConnections = findReverseDirectionConnections(text, reverseWorkAreaPatterns, PLUMBING_ISSUE_ITEM_LOOKUP)
    const reverseDamageConnections = findReverseDirectionConnections(text, reverseDamageAreaPatterns, DAMAGE_PLACE_LOOKUP)

    allDetectedConnections = [
      ...forwardWorkConnections,
      ...forwardDamageConnections,
      ...reverseWorkConnections,
      ...reverseDamageConnections
    ]
  }

  // Remove duplicate connections
  const uniqueConnections = deduplicateCompounds(allDetectedConnections)

  console.log('DEBUG: Final detected connections:', JSON.stringify(uniqueConnections, null, 2))
  return uniqueConnections
}

/**
 * Helper function: collect longest area aliases in a clause
 * Keeps the longest alias for each area (more specific = better context)
 * Prevents overlapping shorter aliases by processing longest first
 * Checks for area relationships first (e.g., "ceiling from upstairs bathroom")
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of objects with plumbingIssueLocId and alias
 */
const collectAreaAliases = (clause) => {
  const aliasMap = new Map()

  // First, detect symptom groups connected by "and"
  const symptomGroups = detectSymptomGroups(clause)
  console.log('DEBUG collectAreaAliases: symptom groups found:', symptomGroups)

  // Then, check for area relationships (damage showing in one area, source in another)
  const relationships = detectAreaRelationships(clause)
  console.log('DEBUG collectAreaAliases: area relationships:', relationships)

  if (relationships && relationships.length > 0) {
    for (const rel of relationships) {
      console.log('DEBUG collectAreaAliases: relationship object:', JSON.stringify(rel, null, 2))
      // Add WORK LOCATION (where plumber goes - e.g., "upstairs bathroom")
      aliasMap.set(rel.workLocation.plumbingIssueLocId, rel.workLocation.alias)
      console.log('DEBUG collectAreaAliases: added WORK LOCATION:', rel.workLocation.plumbingIssueLocId, '->', rel.workLocation.alias)

      // Store context location for dispatcher info (e.g., "ceiling" - where damage shows)
      rel.contextLocationId = rel.contextLocation.plumbingIssueLocId
      rel.contextLocationAlias = rel.contextLocation.alias
    }
  }

  // Then, check regular aliases (skip if area already has relationship match)
  const usedAreas = relationships && relationships.length > 0
    ? new Set([
      ...relationships.flatMap(r => [r.workLocation.plumbingIssueLocId, r.contextLocation.plumbingIssueLocId].filter(Boolean)),
      ...relationships.flatMap(r => r.consumedText || [])
    ])
    : new Set()

  console.log('DEBUG collectAreaAliases: usedAreas:', Array.from(usedAreas))

  // Sort aliases by length (longest first) to prevent overlapping matches
  // Process work locations first (most important), then damage places
  const workEntries = Object.entries(PLUMBING_ISSUE_ITEM_LOOKUP).sort((a, b) => b[0].length - a[0].length)
  const damageEntries = Object.entries(DAMAGE_PLACE_LOOKUP).sort((a, b) => b[0].length - a[0].length)
  const sortedEntries = [...workEntries, ...damageEntries]

  for (const [alias, plumbingIssueLocId] of sortedEntries) {
    // Skip if area already has compound match
    if (usedAreas.has(plumbingIssueLocId)) continue

    if (!clause.includes(alias.toLowerCase())) continue

    // If same area already has a match, only replace if new alias is longer
    if (aliasMap.has(plumbingIssueLocId)) {
      const existingAlias = aliasMap.get(plumbingIssueLocId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(plumbingIssueLocId, alias)
      }
    }
    // If different area, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(plumbingIssueLocId, alias)
      }
    }
  }

  // Convert to objects for compatibility with existing code
  const areaAliases = Array.from(aliasMap.entries()).map(([plumbingIssueLocId, alias]) => ({ plumbingIssueLocId, alias }))

  // Add symptom groups to the result for grouped symptom processing
  return { areaAliases, symptomGroups }
}

/**
 * Helper function: collect longest symptom aliases in a clause
 * Keeps the longest alias for each symptom (more specific = better context)
 * Prevents overlapping shorter aliases by processing longest first
 * 
 * @param {string} clause - Text clause to search in
 * @returns {Array} - Array of objects with symptomId and alias
 */
const collectSymptomAliases = (clause) => {
  const aliasMap = new Map()

  // Sort aliases by length (longest first) to prevent overlapping matches
  const sortedEntries = Object.entries(SYMPTOM_LOOKUP)
    .sort((a, b) => b[0].length - a[0].length)

  for (const [alias, symptomId] of sortedEntries) {
    if (!clause.includes(alias.toLowerCase())) continue

    // If same symptom already has a match, only replace if new alias is longer
    if (aliasMap.has(symptomId)) {
      const existingAlias = aliasMap.get(symptomId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(symptomId, alias)
      }
    }
    // If different symptom, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(symptomId, alias)
      }
    }
  }

  // Convert to objects for compatibility with existing code
  return Array.from(aliasMap.entries()).map(([symptomId, alias]) => ({ symptomId, alias }))
}

/**
 * Helper function: collect longest symptom aliases for specific allowed symptom IDs
 * Used to only collect symptoms that are valid for a specific area
 * Prevents overlapping shorter aliases by processing longest first
 * 
 * @param {string} clause - Text clause to search in
 * @param {Set} allowedIds - Set of allowed symptom IDs
 * @returns {Array} - Array of objects with symptomId and alias
 */
const collectSymptomAliasesForIds = (clause, allowedIds) => {
  if (!allowedIds || allowedIds.size === 0) return []
  const aliasMap = new Map()

  // Sort aliases by length (longest first) to prevent overlapping matches
  const sortedEntries = Object.entries(SYMPTOM_LOOKUP)
    .sort((a, b) => b[0].length - a[0].length)

  for (const [alias, symptomId] of sortedEntries) {
    if (!allowedIds.has(symptomId)) continue
    if (!clause.includes(alias.toLowerCase())) continue

    // If same symptom already has a match, only replace if new alias is longer
    if (aliasMap.has(symptomId)) {
      const existingAlias = aliasMap.get(symptomId)
      if (alias.length > existingAlias.length) {
        aliasMap.set(symptomId, alias)
      }
    }
    // If different symptom, check for overlaps with existing aliases
    else {
      const overlaps = Array.from(aliasMap.values())
        .some(existingAlias => existingAlias.includes(alias))
      if (!overlaps) {
        aliasMap.set(symptomId, alias)
      }
    }
  }

  return Array.from(aliasMap.entries()).map(([symptomId, alias]) => ({ symptomId, alias }))
}

/**
 * Helper: prune shorter symptom aliases that are substrings of longer ones
 * Example: keep 'no water pressure' and drop 'no water' in same clause
 */
const pruneRedundantSymptomAliases = (items) => {
  if (!items || items.length <= 1) return items || []
  const sorted = items.slice().sort((a, b) => b.alias.length - a.alias.length)
  const kept = []
  for (const cand of sorted) {
    const alias = cand.alias.toLowerCase()
    const overlaps = kept.some(k => k.alias.toLowerCase().includes(alias))
    if (!overlaps) kept.push(cand)
  }
  return kept
}

// ========================================
// CONTEXTUAL MATCHING
// ========================================

/**
 * High-confidence contextual pattern matching
 * 
 * WHAT THIS DOES:
 * Finds exact area+symptom combinations in the same context.
 * This is the most accurate matching method (95% confidence).
 * 
 * HOW IT WORKS:
 * 1. Split input into clauses by natural boundaries (commas, periods, "and")
 * 2. Within each clause, look for area words AND symptom words
 * 3. Only match if both area and symptom appear in the SAME clause
 * 4. Validate that the area+symptom combination exists in our pattern data
 * 
 * EXAMPLE:
 * Input: "The kitchen faucet is leaking and the toilet is running"
 * 
 * Clause 1: "the kitchen faucet is leaking"
 * - Finds: "kitchen faucet" (area) + "leaking" (symptom) 
 * - Result: faucet leak (SAME_DAY priority)
 * 
 * Clause 2: "the toilet is running"  
 * - Finds: "toilet" (area) + "running" (symptom)
 * - Result: toilet running (SCHEDULE priority)
 * 
 * AMBIGUITY SOLVING:
 * - "Bubbling ceiling" = Water damage (emergency)
 * - "Bubbling pipes" = Noise (schedule)  
 * - Same word, different meaning based on context!
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of contextual pattern matches
 */
/**
 * Main function: Find all contextual pattern matches in customer input
 * 
 * High-level flow:
 * 1. Split text into clauses (preserve "and" for symptom grouping)
 * 2. For each clause, find areas and symptoms
 * 3. Match areas with their valid symptoms
 * 4. Add fallback matches for unmatched areas/symptoms
 */
export function findContextualMatches(text) {
  // EXAMPLE INPUT: "The bathroom ceiling is dripping and sagging, the wall is wet"

  // 1. Initialize empty arrays and sets to track matches and prevent duplicates
  //    matches = [] (will hold all final matches)
  //    processedWorkLocations = new Set() (tracks work locations already processed)
  //    processedSymptoms = new Set() (tracks symptoms already processed)
  //    processedLocationSymptomPairs = new Set() (tracks location+symptom combinations already processed)
  const plumbingIssueReports = []
  const processedWorkLocations = new Set()
  const processedSymptoms = new Set()
  const processedLocationSymptomPairs = new Set()

  // 2. Split text into clauses for context processing
  //    Input: "The bathroom ceiling is dripping and sagging, the wall is wet"
  //    After split: ["The bathroom ceiling is dripping and sagging", "the wall is wet"]
  //    NOTE: Don't split on 'and' - we need it for symptom grouping (e.g., "bubbling and sagging")
  const clientInputClauses = text
    .split(/[,;.]/)
    .map(c => normalizeText(c.trim()))
    .filter(c => c.length > 0)

  // 3. Process each clause separately
  for (const clientInputClause of clientInputClauses) {
    // First clause: "the bathroom ceiling is dripping and sagging"
    // Second clause: "the wall is wet"

    // 4. Collect location aliases and symptom groups from clause
    //    For "the bathroom ceiling is dripping and sagging":
    //    foundLocations = [{plumbingIssueLocId: "bathroom", alias: "bathroom"}] (location from damagePlaces.js)
    //    foundSymptomGroups = [["dripping", "sagging"]] (grouped by "and")
    const { areaAliases: foundLocations, symptomGroups: foundSymptomGroups } = collectAreaAliases(clientInputClause)

    // 5. Process each location found in the clause
    for (const area of foundLocations) {
      // First iteration: area = {plumbingIssueLocId: "bathroom", alias: "bathroom"}
      // Note: "bathroom" is a location (from damagePlaces.js), not a fixture
      console.log('DEBUG: Processing area:', area)

      // 6. Get valid symptoms for this location from VALID_SYMPTOMS_BY_CATEGORY
      //    For bathroom location: validSymptomsForLocation = {"leak", "dripping", "overflowing", "clogged", ...}
      //    These symptoms are valid when they appear in bathroom context
      const validSymptomsForLocation = VALID_SYMPTOMS_BY_CATEGORY.get(area.plumbingIssueLocId) || new Set()
      console.log('DEBUG: Valid symptoms for area:', Array.from(validSymptomsForLocation))
      if (validSymptomsForLocation.size === 0) continue

      // 7. Collect symptoms found in clause that are valid for this area
      //    Clause: "the bathroom ceiling is dripping and sagging"
      //    Valid symptoms for bathroom: ["dripping", "sagging"]
      let foundValidSymptoms = collectSymptomAliasesForIds(clientInputClause, validSymptomsForLocation)
      foundValidSymptoms = pruneRedundantSymptomAliases(foundValidSymptoms)
      console.log('DEBUG: Found symptoms for area:', foundValidSymptoms)

      // 8. Separate grouped symptoms from individual symptoms
      //    Input: foundValidSymptoms = ["dripping", "sagging"]
      //    Input: foundSymptomGroups = [["dripping", "sagging"]]
      //    Output: separatedSymptoms = {
      //      individualSymptoms: [], (none, both are grouped)
      //      groupedSymptoms: [["dripping", "sagging"]]
      //    }
      const separatedSymptoms = processSymptomsByArea(foundValidSymptoms, foundSymptomGroups, validSymptomsForLocation)
      console.log('DEBUG: Grouped symptoms:', separatedSymptoms.groupedSymptoms)
      console.log('DEBUG: Individual symptoms:', separatedSymptoms.individualSymptoms)

      // 9. Process area-symptom pairs and create match objects
      //    Creates match for: bathroom + "dripping and sagging"
      //    Result: {
      //      plumbingIssueLocId: "bathroom",
      //      symptomId: "dripping_and_sagging",
      //      areaAlias: "bathroom",
      //      symptomAlias: "dripping and sagging",
      //      method: "contextual",
      //      confidence: 0.95,
      //      isGrouped: true
      //    }
      const areaMatches = processAreaSymptomPairs(
        area,
        separatedSymptoms,
        processedWorkLocations,
        processedSymptoms,
        processedLocationSymptomPairs,
        getWorkItemCategory,
        getTeamSizeRecommendation
      )
      plumbingIssueReports.push(...areaMatches)
    }

    // 10. Collect all symptoms in clause for fallback handling
    //    For "the bathroom ceiling is dripping and sagging":
    //    clauseSymptomsAll = ["dripping", "sagging"]
    let clauseSymptomsAll = collectSymptomAliases(clientInputClause)
    clauseSymptomsAll = pruneRedundantSymptomAliases(clauseSymptomsAll)

    // 11. Add fallback matches for unused symptoms and areas
    //    If any symptoms or areas weren't matched, create symptom-only or area-only matches
    //    Example: If "wall" was found but no symptoms matched it:
    //    Result: {
    //      plumbingIssueLocId: "wall",
    //      symptomId: null,
    //      areaAlias: "wall",
    //      method: "area_only",
    //      confidence: 0.5,
    //      message: "Found: wall. What issue are you experiencing?"
    //    }
    const fallbackMatches = addFallbackMatches(
      clauseSymptomsAll,
      foundLocations,
      processedSymptoms,
      processedWorkLocations,
      getWorkItemCategory,
      getTeamSizeRecommendation
    )
    plumbingIssueReports.push(...fallbackMatches)
  }

  // 12. Return all matches found across all clauses
  //    Final result: [
  //      {plumbingIssueLocId: "bathroom", symptomId: "dripping_and_sagging", ...},
  //      {plumbingIssueLocId: "wall", symptomId: null, ...} (if wall had no symptoms)
  //    ]
  return plumbingIssueReports
}

// ========================================
// FALLBACK REGEX MATCHING
// ========================================

/**
 * Find fallback matches using regex when no contextual patterns match
 *
 * WHAT THIS DOES:
 * This is the backup matching system when contextual patterns fail.
 * It uses regex to independently find area words and symptom words,
 * then combines them to find valid area+symptom patterns.
 *
 * WHY THIS EXISTS:
 * Contextual patterns are very specific (require exact area+symptom phrases).
 * Fallback matching is more flexible - it finds ANY area word and ANY
 * symptom word anywhere in the text, then checks if they form a valid combo.
 *
 * TRADE-OFFS:
 * - Less accurate than contextual matching (75% confidence vs 95%)
 * - More flexible (can match partial or unusual phrasing)
 * - Can produce false positives (matches that don't make sense)
 *
 * EXAMPLE:
 * Input: "The faucet is leaking and the toilet is running"
 *
 * Step 1: Find individual words
 * - Area regex finds: "faucet", "toilet"
 * - Symptom regex finds: "leaking", "running"
 *
 * Step 2: Extract unique IDs
 * - Area IDs: {"faucet", "toilet"}
 * - Symptom IDs: {"leak", "running"}
 *
 * Step 3: Find valid patterns from MATCHING_RULES
 * - faucet+leak -> valid
 * - toilet+running -> valid
 * - Result: Returns 2 issues
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of pattern matches found via fallback method
 */
export function findFallbackMatches(text) {
  // Step 1: Find area and symptom words independently using regex
  const { fixableItems, damageLocations } = findFixableItemsAndDamageLocations(text)
  const areaMatches = [...fixableItems, ...damageLocations]
  const symptomMatches = findSymptomMatches(text)

  // Step 2: Extract unique IDs for pattern matching
  const plumbingIssueLocIds = new Set(areaMatches.map(match => match.id))
  const symptomIds = new Set(symptomMatches.map(match => match.id))

  // Step 3: Find patterns where BOTH area AND symptom were detected
  const patterns = []

  for (const entry of MATCHING_RULES) {
    // Skip if we don't have both the area and symptom for this rule
    if (!plumbingIssueLocIds.has(entry.plumbingIssueLocId) || !symptomIds.has(entry.symptomId)) continue

    // Find the actual match objects to get the customer's original words
    const areaMatch = areaMatches.find(match => match.id === entry.plumbingIssueLocId)
    const symptomMatch = symptomMatches.find(match => match.id === entry.symptomId)

    patterns.push({
      plumbingIssueLocId: entry.plumbingIssueLocId,
      symptomId: entry.symptomId,
      areaAlias: areaMatch?.alias || entry.plumbingIssueLocId,
      symptomAlias: symptomMatch?.alias || entry.symptomId,
      dispatchCategory: getWorkItemCategory(entry.plumbingIssueLocId),
      teamSizeRecommendation: getTeamSizeRecommendation(entry.plumbingIssueLocId),
      pattern: entry.pattern,  // Contains job type, severity, etc.
      method: 'fallback',
      confidence: 0.75
    })
  }

  return patterns
}

/**
 * Fallback: Standard regex matching
 */
const collectRegexMatches = (text, regex, lookup) => {
  const normalizedText = normalizeText(text)
  const raw = []
  for (const match of normalizedText.matchAll(regex)) {
    const alias = match[0].toLowerCase()
    const id = lookup[alias]
    if (!id) continue
    raw.push({
      id,
      alias,
      start: match.index,
      end: match.index + match[0].length,
      len: match[0].length,
      confidence: 0.6
    })
  }

  // Prefer longer phrases and avoid overlapping spans
  raw.sort((a, b) => b.len - a.len)
  const accepted = []
  const seenIds = new Set()

  const overlaps = (a, b) => !(a.end <= b.start || b.end <= a.start)

  for (const cand of raw) {
    if (seenIds.has(cand.id)) continue
    if (accepted.some(x => overlaps(x, cand))) continue
    accepted.push(cand)
    seenIds.add(cand.id)
  }

  // Drop helper len before returning
  return accepted.map(({ len: _len, ...rest }) => rest)
}


// New, clearer APIs
// Returns only the fixable plumbing items (WHAT needs fixing)
export function findFixableItems(text) {
  return collectRegexMatches(text, PLUMBING_ISSUE_REGEX, PLUMBING_ISSUE_ITEM_LOOKUP)
}

// Returns only the damage locations (WHERE damage is visible)
export function findDamageLocations(text) {
  return collectRegexMatches(text, DAMAGE_PLACE_REGEX, DAMAGE_PLACE_LOOKUP)
}

// Returns both categories in a structured object for clearer downstream use
export function findFixableItemsAndDamageLocations(text) {
  const fixableItems = findFixableItems(text)
  const damageLocations = findDamageLocations(text)
  return { fixableItems, damageLocations }
}

export function findSymptomMatches(text) {
  return collectRegexMatches(text, SYMPTOM_REGEX, SYMPTOM_LOOKUP)
}

// ========================================
// MAIN ORCHESTRATOR
// ========================================

/**
 * Main pattern finding function with ambiguity detection
 *
 * WHAT THIS DOES:
 * This is the orchestrator that tries different matching strategies in order:
 * 1. Contextual matching (most accurate, requires area+symptom context)
 * 2. Fallback matching (less accurate, more flexible)
 * 3. Ambiguous handling (asks for clarification)
 *
 * WHY THIS EXISTS:
 * Different customer inputs require different approaches. Some customers
 * give clear context ("The ceiling is bubbling"), others give vague input
 * ("I have a leak"). This function handles all cases appropriately.
 *
 * MATCHING STRATEGY:
 * - Try the most accurate method first (contextual)
 * - Fall back to more flexible method if needed (fallback)
 * - Ask for clarification if nothing matches (ambiguous)
 *
 * EXAMPLE SCENARIOS:
 *
 * Scenario 1: Clear context
 * Input: "The ceiling is bubbling"
 * -> Contextual match: ceiling + bubbling
 * -> Returns: water damage issue (IMMEDIATE)
 *
 * Scenario 2: Partial information
 * Input: "The faucet is leaking and the toilet is running"
 * -> Contextual: No exact pattern matches
 * -> Fallback: Finds "faucet" + "leak", "toilet" + "running"
 * -> Returns: 2 issues (SAME_DAY, SCHEDULE)
 *
 * Scenario 3: Too vague
 * Input: "I have a leak"
 * -> Contextual: No pattern matches
 * -> Fallback: No area found, only symptom
 * -> Ambiguous: Asks for clarification
 * -> Returns: "Where is the leak?"
 *
 * CONFIDENCE LEVELS:
 * - Contextual: 95% (very accurate)
 * - Fallback: 75% (moderately accurate)
 * - Ambiguous: 10% (needs clarification)
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Array of pattern matches or ambiguous response
 */
export function findPatterns(text) {
  // 1. Try contextual matching first (most accurate)
  const contextualMatches = findContextualMatches(text)

  if (contextualMatches.length > 0) {
    return contextualMatches
  }

  // 2. Try fallback matching (area + symptom combinations)
  const fallbackMatches = findFallbackMatches(text)

  if (fallbackMatches.length > 0) {
    return fallbackMatches
  }

  // 3. Handle ambiguous input - no clear patterns found
  // Return a special ambiguous result instead of useless symptom-only matches
  return [{
    plumbingIssueLocId: null,
    symptomId: null,
    areaAlias: null,
    symptomAlias: null,
    context: 'ambiguous_input',
    pattern: null,
    method: 'ambiguous',
    message: 'Input is too ambiguous. Please provide more specific information about the location and issue.',
    suggestions: [
      'Where is the issue occurring? (e.g., kitchen faucet, bathroom ceiling)',
      'What specific problem are you experiencing? (e.g., leaking, bubbling, running)',
      'Can you describe the affected fixture or area?'
    ]
  }]
}

/**
 * Debug function to show what would be matched
 */
export function debugMatches(text) {
  const { fixableItems, damageLocations } = findFixableItemsAndDamageLocations(text)
  return {
    fixableItems,
    damageLocations,
    symptoms: findSymptomMatches(text),
    patterns: findPatterns(text)
  }
}

// Export helper functions for testing
export { collectAreaAliases }
