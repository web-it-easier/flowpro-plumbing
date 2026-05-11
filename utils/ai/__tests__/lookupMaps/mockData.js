/**
 * Mock data for lookupMaps tests
 * Provides predictable test data without loading from files
 */

// What needs fixing (PLUMBING_ISSUE_ITEM_LOOKUP)
export const mockPlumbingIssueItems = {
  'toilet': { dispatchCategory: 'fixture' },
  'sink': { dispatchCategory: 'fixture' },
  'faucet': { dispatchCategory: 'fixture' },
  'shower': { dispatchCategory: 'fixture' },
  'bathtub': { dispatchCategory: 'fixture' },
  'bathroom': { dispatchCategory: 'fixture' },
  'kitchen': { dispatchCategory: 'fixture' },
  'ceiling': { dispatchCategory: 'fixture' },
  'wall': { dispatchCategory: 'fixture' },
  'floor': { dispatchCategory: 'fixture' },
  'pipe': { dispatchCategory: 'component' },
  'water heater': { dispatchCategory: 'appliance' },
  'drain': { dispatchCategory: 'component' },
  'fill valve': { dispatchCategory: 'component' },
  'flapper': { dispatchCategory: 'component' }
}

// Where damage is visible (DAMAGE_PLACE_LOOKUP)
export const mockDamagePlaceLookup = {
  'bathroom': { category: 'room' },
  'kitchen': { category: 'room' },
  'bedroom': { category: 'room' },
  'ceiling': { category: 'surface' },
  'wall': { category: 'surface' },
  'floor': { category: 'surface' },
  'foundation': { category: 'structure' },
  'basement': { category: 'room' }
}


export const mockSymptoms = {
  'leaking': { category: 'symptom', urgency: 'medium' },
  'dripping': { category: 'symptom', urgency: 'low' },
  'clogged': { category: 'symptom', urgency: 'medium' },
  'bursting': { category: 'symptom', urgency: 'high' },
  'flooding': { category: 'symptom', urgency: 'high' },
  'no water': { category: 'symptom', urgency: 'high' }
}

export const mockSymptomGroups = [
  {
    name: 'water_issues',
    symptoms: ['leaking', 'dripping', 'bursting', 'flooding'],
    category: 'water_leak',
    urgency: 'high'
  },
  {
    name: 'drainage_issues',
    symptoms: ['clogged', 'backed up', 'slow drain'],
    category: 'drainage',
    urgency: 'medium'
  }
]
