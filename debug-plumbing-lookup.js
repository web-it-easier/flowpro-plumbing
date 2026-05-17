#!/usr/bin/env node

// Debug plumbing work location lookup
import { PLUMBING_ISSUE_ITEM_LOOKUP } from './utils/ai/lookupMaps.js'

console.log('=== PLUMBING WORK LOCATION LOOKUP DEBUG ===\n')

// Check specific entries
console.log('Direct lookups:')
console.log('"upstairs bathroom" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['upstairs bathroom'])
console.log('"downstairs bathroom" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['downstairs bathroom'])
console.log('"master bathroom" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['master bathroom'])
console.log('"kitchen sink" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['kitchen sink'])
console.log('"upstairs" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['upstairs'])
console.log('"bathroom" maps to:', PLUMBING_ISSUE_ITEM_LOOKUP['bathroom'])
console.log('')

// Show all compound work locations
console.log('=== ALL COMPOUND WORK LOCATIONS ===')
Object.entries(PLUMBING_ISSUE_ITEM_LOOKUP)
  .filter(([key]) => key.includes(' ') && (key.includes('bathroom') || key.includes('kitchen')))
  .forEach(([key, value]) => {
    console.log(`"${key}" → ${value}`)
  })

console.log('\n=== ALL UPSTAIRS WORK LOCATIONS ===')
Object.entries(PLUMBING_ISSUE_ITEM_LOOKUP)
  .filter(([key]) => key.includes('upstairs'))
  .forEach(([key, value]) => {
    console.log(`"${key}" → ${value}`)
  })
