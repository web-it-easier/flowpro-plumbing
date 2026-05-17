/**
 * AI Response Formatting Utilities
 * Handles intelligent response generation for ambiguous inputs and various AI scenarios
 */

import { normalizeText } from './lookupMaps.js'

/**
 * Get context-aware ambiguous response with intelligent suggestions
 * Detects type of ambiguous input and provides problem-specific guidance
 *
 * @param {string} text - Customer's input text
 * @returns {Array} - Context-aware ambiguous response
 */
export function getContextAwareAmbiguousResponse(text) {
  const normalizedText = normalizeText(text)
  
  const baseResponse = {
    plumbingIssueLocId: null,
    symptomId: null,
    areaAlias: null,
    symptomAlias: null,
    pattern: null,
    method: 'ambiguous'
  }
  
  // Gas emergency indicators
  if (normalizedText.includes('gas') || normalizedText.includes('smell')) {
    return [{
      ...baseResponse,
      context: 'ambiguous_gas_emergency',
      message: 'Potential gas emergency detected - immediate action required',
      suggestions: [
        'Call customer immediately - safety emergency',
        'Advise evacuation from building immediately',
        'Dispatch emergency gas technician',
        'Notify fire department if strong gas smell',
        'Check for gas meter access and shut-off capability'
      ]
    }]
  }
  
  // Billing/water bill indicators
  if (normalizedText.includes('bill') || normalizedText.includes('expensive') || 
      normalizedText.includes('high') && normalizedText.includes('water')) {
    return [{
      ...baseResponse,
      context: 'ambiguous_billing_concern',
      message: 'Expensive water bill detected - may indicate hidden leak',
      suggestions: [
        'Call customer immediately - potential hidden leak',
        'Advise checking water meter for continuous flow when no water running',
        'Recommend shutting off main valve if meter shows flow',
        'Schedule leak detection inspection ASAP',
        'Ask about recent changes in water usage or appliance issues'
      ]
    }]
  }
  
  // Default generic ambiguous response
  return [{
    ...baseResponse,
    context: 'ambiguous_input',
    message: 'Input needs clarification - call customer for details',
    suggestions: [
      'Call customer immediately to assess situation',
      'Ask about specific location of issue',
      'Inquire about visible symptoms (leaking, dripping, noises)',
      'Check if issue is active or intermittent',
      'Determine urgency and safety concerns'
    ]
  }]
}
