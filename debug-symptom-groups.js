#!/usr/bin/env node

// Test symptom grouping with "and"
import { detectSymptomGroups } from './utils/ai/lookupMaps.js'

console.log('=== SYMPTOM GROUPING TEST ===\n')

const testText = "the ceiling is bubbling and sagging"
console.log('Test input:', testText)
console.log('')

const groups = detectSymptomGroups(testText)
console.log('Symptom groups found:', groups)
console.log('')

const testText2 = "the toilet is leaking, dripping, and running"
console.log('Test input 2:', testText2)
console.log('')

const groups2 = detectSymptomGroups(testText2)
console.log('Symptom groups found:', groups2)
