#!/usr/bin/env node

// Test symptom grouping directly
import { detectSymptomGroups, collectAreaAliases } from './utils/ai/lookupMaps.js'

console.log('=== SYMPTOM GROUPING INTEGRATION TEST ===\n')

const testText = "Water is pouring through the ceiling from the upstairs bathroom, the ceiling is bubbling and sagging."
console.log('Test input:', testText)
console.log('')

// Test 1: Direct symptom group detection
console.log('=== 1. DIRECT SYMPTOM GROUP DETECTION ===')
const groups = detectSymptomGroups(testText)
console.log('Symptom groups found:', groups)
console.log('')

// Test 2: Integration with area collection
console.log('=== 2. INTEGRATION WITH AREA COLLECTION ===')
try {
  const { areaAliases, symptomGroups } = collectAreaAliases(testText)
  console.log('Area aliases found:', areaAliases)
  console.log('Symptom groups found:', symptomGroups)
  console.log('')
  
  // Test 3: Different input
  console.log('=== 3. DIFFERENT INPUT TEST ===')
  const testText2 = "the toilet is leaking and dripping"
  console.log('Input:', testText2)
  const groups2 = detectSymptomGroups(testText2)
  console.log('Groups found:', groups2)
  
} catch (error) {
  console.error('Error in area collection:', error.message)
  console.error('Stack:', error.stack)
}
