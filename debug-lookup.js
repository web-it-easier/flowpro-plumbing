#!/usr/bin/env node

// Debug lookup map contents
import { DAMAGE_PLACE_LOOKUP } from './utils/ai/lookupMaps.js'

console.log('=== DAMAGE PLACE LOOKUP DEBUG ===\n')

// Check specific entries
console.log('Direct lookups:')
console.log('"ceiling" maps to:', DAMAGE_PLACE_LOOKUP['ceiling'])
console.log('"bathroom" maps to:', DAMAGE_PLACE_LOOKUP['bathroom'])
console.log('"upstairs bathroom" maps to:', DAMAGE_PLACE_LOOKUP['upstairs bathroom'])
console.log('"upstairs" maps to:', DAMAGE_PLACE_LOOKUP['upstairs'])
console.log('')

// Show all bathroom-related entries
console.log('=== ALL BATHROOM-RELATED ENTRIES ===')
Object.entries(DAMAGE_PLACE_LOOKUP)
  .filter(([key]) => key.includes('bathroom'))
  .forEach(([key, value]) => {
    console.log(`"${key}" → ${value}`)
  })

console.log('\n=== ALL UPSTAIRS-RELATED ENTRIES ===')
Object.entries(DAMAGE_PLACE_LOOKUP)
  .filter(([key]) => key.includes('upstairs'))
  .forEach(([key, value]) => {
    console.log(`"${key}" → ${value}`)
  })
