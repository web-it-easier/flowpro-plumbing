/**
 * Helper functions for contextual pattern matching
 * Breaks down the large findContextualMatches function into focused, testable modules
 */

import { SYMPTOM_LOOKUP, MATCHING_RULES } from './lookupMaps.js'

/**
 * Process symptoms for a specific area
 * Separates grouped symptoms from individual symptoms
 * 
 * @param {Array} clauseSymptomsForArea - Symptoms found in clause for this area
 * @param {Array} clauseSymptomGroups - Grouped symptoms (connected by "and")
 * @param {Set} allowed - Allowed symptom IDs for this area
 * @returns {Object} - { individualSymptoms, groupedSymptoms }
 */
export const processSymptomsByArea = (clauseSymptomsForArea, clauseSymptomGroups, allowed) => {
  // Extract grouped symptoms that are valid for this area
  const groupedSymptoms = []
  for (const group of clauseSymptomGroups) {
    const validGroupedSymptoms = group.filter(symptom => {
      const symptomId = SYMPTOM_LOOKUP[symptom.toLowerCase()]
      return symptomId && allowed.has(symptomId)
    })
    if (validGroupedSymptoms.length > 1) {
      groupedSymptoms.push(validGroupedSymptoms)
    }
  }
  
  // Track which symptoms are part of groups
  const groupedSymptomIds = new Set(
    groupedSymptoms.flat().map(symptom => SYMPTOM_LOOKUP[symptom.toLowerCase()]).filter(Boolean)
  )
  
  // Keep only individual symptoms (not part of groups)
  const individualSymptoms = clauseSymptomsForArea.filter(symptom => !groupedSymptomIds.has(symptom.symptomId))
  
  return { individualSymptoms, groupedSymptoms }
}

/**
 * Create match object for individual symptom
 * 
 * @param {Object} area - Area object with plumbingIssueLocId and alias
 * @param {Object} symptom - Symptom object with symptomId and alias
 * @param {Function} getWorkItemCategory - Function to get category
 * @param {Function} getTeamSizeRecommendation - Function to get team size
 * @returns {Object} - Match object
 */
export const createIndividualSymptomMatch = (area, symptom, getWorkItemCategory, getTeamSizeRecommendation) => {
  const patternEntry = MATCHING_RULES.find(rule =>
    rule.plumbingIssueLocId === area.plumbingIssueLocId && rule.symptomId === symptom.symptomId
  )

  return {
    plumbingIssueLocId: area.plumbingIssueLocId,
    symptomId: symptom.symptomId,
    areaAlias: area.alias,
    symptomAlias: symptom.alias,
    dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
    teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
    context: `${area.plumbingIssueLocId}_${symptom.symptomId}`,
    pattern: patternEntry?.pattern || null,
    method: 'contextual',
    confidence: 0.95
  }
}

/**
 * Create match object for grouped symptoms (connected by "and")
 * 
 * @param {Object} area - Area object with plumbingIssueLocId and alias
 * @param {Array} symptomGroup - Array of symptom aliases
 * @param {Function} getWorkItemCategory - Function to get category
 * @param {Function} getTeamSizeRecommendation - Function to get team size
 * @returns {Object} - Match object with isGrouped flag
 */
export const createGroupedSymptomMatch = (area, symptomGroup, getWorkItemCategory, getTeamSizeRecommendation) => {
  const symptomIds = symptomGroup.map(symptom => SYMPTOM_LOOKUP[symptom.toLowerCase()]).filter(Boolean)
  
  // Find pattern entries for all symptoms in the group
  const patternEntries = symptomIds.map(symptomId => 
    MATCHING_RULES.find(rule => 
      rule.plumbingIssueLocId === area.plumbingIssueLocId && rule.symptomId === symptomId
    )
  ).filter(Boolean)

  return {
    plumbingIssueLocId: area.plumbingIssueLocId,
    symptomId: symptomIds.join('_and_'), // Combined symptom ID
    areaAlias: area.alias,
    symptomAlias: symptomGroup.join(' and '), // Combined symptom display
    dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
    teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
    context: `${area.plumbingIssueLocId}_${symptomIds.join('_and_')}`,
    pattern: patternEntries.length > 0 ? patternEntries[0].pattern : null,
    method: 'contextual',
    confidence: 0.95,
    isGrouped: true // Mark as grouped symptoms
  }
}

/**
 * Create match object for symptom-only (no area found)
 * 
 * @param {Object} symptom - Symptom object with symptomId and alias
 * @returns {Object} - Match object
 */
export const createSymptomOnlyMatch = (symptom) => {
  return {
    plumbingIssueLocId: null,
    symptomId: symptom.symptomId,
    areaAlias: null,
    symptomAlias: symptom.alias,
    context: `symptom_${symptom.symptomId}`,
    pattern: null,
    method: 'symptom_only',
    confidence: 0.75,
    message: `Detected: ${symptom.alias}. Need location for service.`
  }
}

/**
 * Create match object for area-only (no symptom found)
 * 
 * @param {Object} area - Area object with plumbingIssueLocId and alias
 * @param {Function} getWorkItemCategory - Function to get category
 * @param {Function} getTeamSizeRecommendation - Function to get team size
 * @returns {Object} - Match object
 */
export const createAreaOnlyMatch = (area, getWorkItemCategory, getTeamSizeRecommendation) => {
  return {
    plumbingIssueLocId: area.plumbingIssueLocId,
    symptomId: null,
    areaAlias: area.alias,
    symptomAlias: null,
    dispatchCategory: getWorkItemCategory(area.plumbingIssueLocId),
    teamSizeRecommendation: getTeamSizeRecommendation(area.plumbingIssueLocId),
    context: `area_${area.plumbingIssueLocId}`,
    pattern: null,
    method: 'area_only',
    confidence: 0.5,
    message: `Found: ${area.alias}. What issue are you experiencing?`
  }
}

/**
 * Process area-symptom pairs for a single area
 * Handles both individual and grouped symptoms
 * 
 * @param {Object} area - Area object
 * @param {Object} symptomData - { individualSymptoms, groupedSymptoms }
 * @param {Set} usedAreas - Track used areas
 * @param {Set} usedSymptoms - Track used symptoms
 * @param {Set} seenPairs - Track seen area-symptom pairs
 * @param {Function} getWorkItemCategory - Function to get category
 * @param {Function} getTeamSizeRecommendation - Function to get team size
 * @returns {Array} - Array of match objects
 */
export const processAreaSymptomPairs = (
  area,
  symptomData,
  usedAreas,
  usedSymptoms,
  seenPairs,
  getWorkItemCategory,
  getTeamSizeRecommendation
) => {
  const matches = []
  const { individualSymptoms, groupedSymptoms } = symptomData

  // Process individual symptoms
  for (const symptom of individualSymptoms) {
    const key = `${area.plumbingIssueLocId}:${symptom.symptomId}`
    if (seenPairs.has(key)) continue

    matches.push(createIndividualSymptomMatch(area, symptom, getWorkItemCategory, getTeamSizeRecommendation))

    usedAreas.add(area.plumbingIssueLocId)
    usedSymptoms.add(symptom.symptomId)
    seenPairs.add(key)
  }

  // Process grouped symptoms
  for (const symptomGroup of groupedSymptoms) {
    const symptomIds = symptomGroup.map(symptom => SYMPTOM_LOOKUP[symptom.toLowerCase()]).filter(Boolean)
    const groupKey = `${area.plumbingIssueLocId}:${symptomIds.join('_and_')}`
    if (seenPairs.has(groupKey)) continue

    matches.push(createGroupedSymptomMatch(area, symptomGroup, getWorkItemCategory, getTeamSizeRecommendation))

    // Mark all symptoms in group as used
    symptomIds.forEach(symptomId => usedSymptoms.add(symptomId))
    seenPairs.add(groupKey)
  }

  return matches
}

/**
 * Add fallback matches for unused symptoms and areas
 * 
 * @param {Array} clauseSymptomsAll - All symptoms found in clause
 * @param {Array} clauseAreas - All areas found in clause
 * @param {Set} usedSymptoms - Track used symptoms
 * @param {Set} usedAreas - Track used areas
 * @param {Function} getWorkItemCategory - Function to get category
 * @param {Function} getTeamSizeRecommendation - Function to get team size
 * @returns {Array} - Array of fallback match objects
 */
export const addFallbackMatches = (
  clauseSymptomsAll,
  clauseAreas,
  usedSymptoms,
  usedAreas,
  getWorkItemCategory,
  getTeamSizeRecommendation
) => {
  const matches = []

  // Add unused symptoms as symptom-only
  for (const symptom of clauseSymptomsAll) {
    if (usedSymptoms.has(symptom.symptomId)) continue
    matches.push(createSymptomOnlyMatch(symptom))
    usedSymptoms.add(symptom.symptomId)
  }

  // Add unused areas as area-only
  for (const area of clauseAreas) {
    if (usedAreas.has(area.plumbingIssueLocId)) continue
    matches.push(createAreaOnlyMatch(area, getWorkItemCategory, getTeamSizeRecommendation))
    usedAreas.add(area.plumbingIssueLocId)
  }

  return matches
}
