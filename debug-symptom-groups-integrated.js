#!/usr/bin/env node

// Test integrated symptom grouping with full AI detection
import { getAISuggestion } from './utils/ai/aiBasicLearner.js'

console.log('=== INTEGRATED SYMPTOM GROUPING TEST ===\n')

const testText = "Water is pouring through the ceiling from the upstairs bathroom, the ceiling is bubbling and sagging."
console.log('Test input:', testText)
console.log('')

try {
  const result = getAISuggestion(testText)
  
  console.log('=== AI DETECTION RESULT ===')
  console.log('Total issues found:', result.issues.length)
  console.log('')
  
  // Group by area to see symptom grouping
  const issuesByArea = {}
  result.issues.forEach(issue => {
    const area = issue.areaAlias || 'Unknown Area'
    if (!issuesByArea[area]) {
      issuesByArea[area] = []
    }
    issuesByArea[area].push(issue)
  })
  
  Object.entries(issuesByArea).forEach(([area, issues]) => {
    console.log(`📍 ${area}:`)
    issues.forEach(issue => {
      const symptom = issue.symptomAlias || 'No symptom'
      const grouped = issue.isGrouped ? ' (GROUPED)' : ''
      console.log(`   - ${symptom}${grouped}`)
    })
    console.log('')
  })
  
  console.log('=== GROUPED ISSUES ===')
  result.issues.filter(issue => issue.isGrouped).forEach(issue => {
    console.log(`Grouped: ${issue.symptomAlias} on ${issue.areaAlias}`)
  })
  
} catch (error) {
  console.error('Error:', error.message)
}
