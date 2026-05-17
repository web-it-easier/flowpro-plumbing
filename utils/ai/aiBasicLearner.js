// PRODUCTION VERSION - Contextual Pattern Matching
// This version uses advanced contextual pattern matching instead of simple keywords

import jobTypes from '../../data/jobTypes.json'
import SYMPTOMS from '../../data/symptoms.json'
import { findPatterns, debugMatches } from './lookupMaps.js'

/**
 * Detect panic indicators in customer input
 * Handles emergency keywords, repetition, and exclamation marks
 */
const detectPanicIndicators = (text) => {
  const lowerText = text.toLowerCase()
  
  // Direct help requests
  const helpPattern = /\b(help|please help|help me|somebody help|need help)\b/g
  
  // Urgency/time indicators  
  const urgencyPattern = /\b(emergency|urgent|asap|right now|immediately|right away|now|hurry|quick|fast)\b/g
  
  // Uncontrolled situation
  const uncontrolledPattern = /\b(can'?t stop|won'?t stop|getting worse|worse|out of control|spreading)\b/g
  
  // Water damage intensity (already symptoms, but reinforce panic)
  const intensityPattern = /\b(everywhere|all over|flooding|burst|gushing|pouring|streaming)\b/g
  
  // Panic exclamations
  const panicWords = /\b(omg|oh god|oh no|please|oh my god|holy crap|damn|disaster)\b/g
  
  // Repetition detection (same word 2+ times)
  const repetitionPattern = /\b(\w+)\s+\1\b/gi
  
  // Multiple exclamation marks
  const exclamationPattern = /!{2,}/g
  
  const indicators = {
    help: (lowerText.match(helpPattern) || []).length,
    urgency: (lowerText.match(urgencyPattern) || []).length,
    uncontrolled: (lowerText.match(uncontrolledPattern) || []).length,
    intensity: (lowerText.match(intensityPattern) || []).length,
    panicWords: (lowerText.match(panicWords) || []).length,
    repetition: (text.match(repetitionPattern) || []).length,
    exclamations: (text.match(exclamationPattern) || []).length
  }
  
  // Calculate panic score
  const totalScore = Object.values(indicators).reduce((sum, count) => sum + count, 0)
  
  return {
    hasPanic: totalScore > 0,
    score: totalScore,
    indicators
  }
}

/**
 * 🤖 AI Job Type Suggestion - Contextual Pattern Matching
 * Uses area+symptom context to solve ambiguity problems
 * 
 * @param {string} customerText - What the customer says
 * @returns {object} - { issues: [], groupedIssues: {}, totalIssues: number }
 */
export const suggestJobType = (customerText) => {
  // Use contextual pattern matching
  const matches = findPatterns(customerText)
  
  // Detect panic indicators in the input
  const panicInfo = detectPanicIndicators(customerText)
  
  // Calculate symptom and area density for complex incident detection
  const symptomMatches = matches.filter(m => m.symptomId)
  const areaMatches = matches.filter(m => m.areaId)
  const hasHighDensity = (symptomMatches.length >= 2 && areaMatches.length >= 2) || areaMatches.length >= 3
  
  // Debug: Log density calculation
  console.log('Density check:', {
    symptomCount: symptomMatches.length,
    areaCount: areaMatches.length,
    hasHighDensity,
    matches: matches.map(m => ({symptomId: m.symptomId, areaId: m.areaId}))
  })

  if (matches.length === 0) {
    return {
      issues: [],
      groupedIssues: {
        IMMEDIATE: [],
        SAME_DAY: [],
        SCHEDULE: [],
        CLARIFICATION: []
      },
      totalIssues: 0
    }
  }
 
  // Convert matches to issues
  const issues = matches.map((match, index) => {
    // Handle ambiguous input specially
    if (match.method === 'ambiguous') {
      return {
        id: `issue-${index + 1}`,
        jobType: null,
        jobTypeTitle: 'Clarification Needed',
        area: null,
        symptom: null,
        areaAlias: null,
        symptomAlias: null,
        severity: 'clarification',
        confidence: 0.1, // Very low confidence
        description: match.message,
        detectedBy: 'ambiguous',
        pattern: null,
        suggestions: match.suggestions
      }
    }

    // Handle normal matches
    let jobType = null
    let jobTypeId = null

    if (match.pattern) {
      // Pattern match - get job type from pattern
      jobTypeId = match.pattern.jobType
      jobType = jobTypes.find(jt => jt.id === jobTypeId)
    } else if (match.method === 'fallback_symptom_only') {
      // Symptom-only match - no job type available
    } else {
      // Fallback - try direct job type
      jobTypeId = match.jobType
      jobType = jobTypes.find(jt => jt.id === jobTypeId)
    }

    // Compute severity with clarification handling
    let severity = 'schedule' // default baseline

    if (match.method === 'area_only') {
      // Area with no valid symptom -> needs dispatcher clarification
      severity = 'clarification'
    } else if (match.method === 'symptom_only' || match.method === 'fallback_symptom_only') {
      // For symptom-only matches, use symptom default; if not immediate, route to clarification
      const symptomData = SYMPTOMS.find(s => s.id === match.symptomId)
      if (symptomData && symptomData.severity) {
        severity = symptomData.severity
      }
      if (severity !== 'immediate') {
        severity = 'clarification'
      }
    } else {
      // For contextual/fallback pattern matches: use area overrides if present,
      // otherwise fall back to the symptom's default severity.
      const patternData = match.pattern || match
      if (patternData.severityOverrides) {
        // Check if this is a grouped symptom (e.g., "bubbling_and_sagging")
        if (match.symptomId && match.symptomId.includes('_and_')) {
          // For grouped symptoms, check if ANY individual symptom has "immediate" override
          const individualSymptoms = match.symptomId.split('_and_')
          const hasImmediateOverride = individualSymptoms.some(id =>
            patternData.severityOverrides[id] === 'immediate'
          )
          if (hasImmediateOverride) {
            severity = 'immediate'
          } else if (patternData.severityOverrides[match.symptomId]) {
            severity = patternData.severityOverrides[match.symptomId]
          }
        } else if (patternData.severityOverrides[match.symptomId]) {
          severity = patternData.severityOverrides[match.symptomId]
        }
      }
      // If still no severity from overrides, fall back to symptom default
      if (severity === 'schedule' && match.symptomId) {
        const symptomData = SYMPTOMS.find(s => s.id === match.symptomId)
        if (symptomData) {
          severity = symptomData.severity
        }
      }
    }

    // Panic override: if customer shows panic AND we have high symptom/area density
    // upgrade to immediate regardless of other logic
    if (panicInfo.hasPanic && hasHighDensity && severity !== 'immediate') {
      severity = 'immediate'
    }

    return {
      id: `issue-${index + 1}`,
      jobType: jobTypeId,
      jobTypeTitle: jobType?.name || (jobTypeId ? 'Unknown Job Type' : 'No Job Type Assigned'),
      area: match.areaId,
      symptom: match.symptomId,
      areaAlias: match.areaAlias || 'Unknown Area',
      symptomAlias: match.symptomAlias,
      severity,
      confidence:
        match.method === 'contextual' ? 0.95 :
        match.method === 'fallback' ? 0.75 :
        match.method === 'symptom_only' ? 0.75 :
        match.method === 'area_only' ? 0.5 : 0.1,
      description: match.areaAlias ? `${match.areaAlias} ${match.symptomAlias}` : match.symptomAlias,
      detectedBy: match.method, // Shows which method was used
      pattern: match.pattern // Keep the pattern reference for UI
    }
  })

  // Filter out null issues (from job type not found)
  const validIssues = issues.filter(issue => issue !== null)

  // Incident Merger: Group related issues by damage area and merge symptoms
  const mergeIncidents = (issuesToMerge) => {
    const incidentsByArea = new Map()
    const sourceLocations = []
    
    // First pass: identify source locations (work items) vs damage areas
    for (const issue of issuesToMerge) {
      if (issue.detectedBy === 'area_only' && issue.area) {
        // Check if this is a plumbing work item (source) or damage area
        const isWorkItem = issue.area.includes('bathroom') || 
                          issue.area.includes('kitchen') || 
                          issue.area.includes('laundry') ||
                          issue.area.includes('sink') ||
                          issue.area.includes('toilet')
        if (isWorkItem) {
          sourceLocations.push(issue.areaAlias || issue.area)
        }
      }
    }
    
    // Second pass: group by damage area and merge
    for (const issue of issuesToMerge) {
      // Skip standalone source locations (they'll be attached to damage areas)
      if (issue.detectedBy === 'area_only' && !issue.symptom) {
        const isDamageArea = issue.area === 'ceiling' || 
                             issue.area === 'wall' || 
                             issue.area === 'floor'
        if (!isDamageArea) continue
      }
      
      const areaKey = issue.area || 'unknown'
      
      if (!incidentsByArea.has(areaKey)) {
        incidentsByArea.set(areaKey, {
          ...issue,
          mergedSymptoms: [issue.symptomAlias].filter(Boolean),
          sourceLocation: null,
          highestSeverity: issue.severity
        })
      } else {
        const existing = incidentsByArea.get(areaKey)
        // Merge symptoms
        if (issue.symptomAlias && !existing.mergedSymptoms.includes(issue.symptomAlias)) {
          existing.mergedSymptoms.push(issue.symptomAlias)
        }
        // Track highest severity
        if (issue.severity === 'immediate' || 
            (issue.severity === 'same_day' && existing.highestSeverity === 'schedule') ||
            (issue.severity === 'same_day' && existing.highestSeverity === 'clarification')) {
          existing.highestSeverity = issue.severity
        }
        // Update confidence to highest
        if (issue.confidence > existing.confidence) {
          existing.confidence = issue.confidence
        }
      }
    }
    
    // Attach source locations to primary incident (prefer ceiling/wall/floor)
    const mergedIncidents = Array.from(incidentsByArea.values())
    if (sourceLocations.length > 0 && mergedIncidents.length > 0) {
      // Find the most severe incident or first damage area incident
      const primaryIncident = mergedIncidents.find(i => 
        i.area === 'ceiling' || i.area === 'wall' || i.area === 'floor'
      ) || mergedIncidents[0]
      primaryIncident.sourceLocation = sourceLocations.join(', ')
    }
    
    // Build final merged issues
    return mergedIncidents.map((incident, index) => ({
      ...incident,
      id: `incident-${index + 1}`,
      symptomAlias: incident.mergedSymptoms.join(', '),
      description: incident.sourceLocation 
        ? `${incident.areaAlias} from ${incident.sourceLocation}: ${incident.mergedSymptoms.join(', ')}`
        : `${incident.areaAlias}: ${incident.mergedSymptoms.join(', ')}`,
      severity: incident.highestSeverity
    }))
  }
  
  // Apply incident merging if we have high density (complex incident)
  console.log('Applying merger:', hasHighDensity)
  const mergedIssues = hasHighDensity ? mergeIncidents(validIssues) : validIssues
  console.log('Result count:', mergedIssues.length)

  // Group by severity
  const groupedIssues = {
    IMMEDIATE: [],
    SAME_DAY: [],
    SCHEDULE: [],
    CLARIFICATION: []
  }

  for (const issue of mergedIssues) {
    if (issue.severity === 'immediate') {
      groupedIssues.IMMEDIATE.push(issue)
    } else if (issue.severity === 'same_day') {
      groupedIssues.SAME_DAY.push(issue)
    } else if (issue.severity === 'clarification') {
      groupedIssues.CLARIFICATION.push(issue)
    } else {
      groupedIssues.SCHEDULE.push(issue)
    }
  }

  return {
    issues: mergedIssues,
    groupedIssues,
    totalIssues: mergedIssues.length
  }
}

/**
 * Debug function to see what would be matched
 */
export const debugAISuggestion = (customerText) => {
  debugMatches(customerText)
  return suggestJobType(customerText)
}

/**
 * Enhanced AI Suggestion - With job type details
 * Compatible function for UI integration
 */
export const getAISuggestion = (customerText) => {
  const suggestion = suggestJobType(customerText)
  
  if (suggestion.totalIssues === 0) {
    return {
      ...suggestion,
      jobDetails: null,
      message: 'No specific job type detected'
    }
  }
 
  // Add job type details to all issues if available
  if (suggestion.issues && suggestion.issues.length > 0) {
    suggestion.issues.forEach(issue => {
      if (issue.jobType) {
        const jobDetails = jobTypes.find(jt => jt.id === issue.jobType)
        issue.jobTypeDetails = jobDetails
      }
    })
  }

  return {
    ...suggestion,
    jobDetails: suggestion.issues?.[0]?.jobTypeDetails || null,
    message: suggestion.totalIssues === 1 
      ? `AI suggests: ${suggestion.issues?.[0]?.jobTypeTitle || 'Unknown'}`
      : `AI detected ${suggestion.totalIssues} issues`
  }
}
