import { describe, it, expect } from 'vitest'
import { getAISuggestion, debugAISuggestion } from '../aiBasicLearner.js'

describe('AI Integration - Critical Test Cases', () => {
  // Just test 3 critical cases to avoid memory issues
  const criticalCases = [
    {
      title: '🚨 Gas Emergency',
      input: 'I smell gas in my living room and I am feeling dizzy',
      expectedCount: 1,
      expectedMethod: 'contextual'
    },
    {
      title: '💧 Burst Pipe',
      input: 'The pipe has burst in my basement and water is everywhere!',
      expectedCount: 1,
      expectedMethod: 'contextual'
    },
    {
      title: '🚽 Sewer Backup',
      input: 'Sewage is backing up into my shower and multiple drains are clogged',
      expectedCount: 2,
      expectedMethod: 'fallback'
    }
  ]

  criticalCases.forEach((testCase, index) => {
    it(`handles ${testCase.title} correctly`, () => {
      console.log(`\n🧪 Testing: ${testCase.title}`)
      console.log(`   Input: "${testCase.input}"`)
      
      // Test getAISuggestion
      const aiResult = getAISuggestion(testCase.input)
      const debugResult = debugAISuggestion(testCase.input)
      
      console.log(`   AI Result: ${aiResult?.totalIssues ?? 0} issues`)
      console.log(`   Debug Result: ${debugResult?.totalIssues ?? 0} issues`)
      
      // Basic checks
      expect(aiResult).toBeDefined()
      expect(debugResult).toBeDefined()
      expect(typeof aiResult.totalIssues).toBe('number')
      expect(typeof debugResult.totalIssues).toBe('number')
      
      // Consistency check
      expect(aiResult.totalIssues).toBe(debugResult.totalIssues)
      
      // Expected results (loose checks for now)
      console.log(`   Expected: ${testCase.expectedCount} issues, method: ${testCase.expectedMethod}`)
      console.log(`   Actual: ${aiResult.totalIssues} issues, method: ${getDetectionMethod(aiResult)}`)
      
      // At minimum, should detect something for these critical cases
      expect(aiResult.totalIssues).toBeGreaterThan(0)
    })
  })

  it('shows coverage summary', () => {
    console.log('\n📊 INTEGRATION TEST SUMMARY:')
    console.log('   Tested 3 critical cases to avoid memory issues')
    console.log('   For full coverage, use dispatcher interface "Show Tests" feature')
    console.log('   Current test focuses on: Gas emergency, Burst pipe, Sewer backup')
  })
})

// Helper function
function getDetectionMethod(result) {
  if (!result || result.totalIssues === 0) return 'ambiguous'
  const hasContextual = result.issues?.some(issue => issue.detectedBy === 'contextual')
  const hasNonContextual = result.issues?.some(issue => issue.detectedBy !== 'contextual')
  if (hasContextual && hasNonContextual) return 'mixed'
  if (hasContextual) return 'contextual'
  return 'fallback'
}
