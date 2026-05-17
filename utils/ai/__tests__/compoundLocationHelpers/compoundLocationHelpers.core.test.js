/**
 * Core Tests for compoundLocationHelpers.js
 * 
 * Focus on essential functions without memory-heavy pattern building
 * Tests the core logic that doesn't require large data imports
 */

import {
  detectPatternStrategy
} from '../../compoundLocationHelpers.js'

describe('compoundLocationHelpers - Core Tests', () => {
  
  describe('detectPatternStrategy', () => {
    test('should detect forward strategy with prepositions', () => {
      expect(detectPatternStrategy('leak from ceiling')).toBe('forward')
      expect(detectPatternStrategy('water in basement')).toBe('forward')
      expect(detectPatternStrategy('damage under sink')).toBe('forward')
      expect(detectPatternStrategy('problem at wall')).toBe('forward')
      expect(detectPatternStrategy('issue on floor')).toBe('adjacent') // "on" is not a preposition in the regex
    })
    
    test('should detect reverse strategy with reverse verbs', () => {
      expect(detectPatternStrategy('ceiling is leaking')).toBe('reverse')
      expect(detectPatternStrategy('toilet has problem')).toBe('reverse')
      expect(detectPatternStrategy('sink with issue')).toBe('reverse')
      expect(detectPatternStrategy('faucet shows damage')).toBe('reverse')
      expect(detectPatternStrategy('wall bursting')).toBe('adjacent') // Conservative
      expect(detectPatternStrategy('toilet overflowing')).toBe('adjacent') // Conservative
    })
    
    test('should default to adjacent strategy', () => {
      expect(detectPatternStrategy('bathroom ceiling problem')).toBe('adjacent')
      expect(detectPatternStrategy('kitchen faucet issue')).toBe('adjacent')
      expect(detectPatternStrategy('random text')).toBe('adjacent')
      expect(detectPatternStrategy('plumbing emergency')).toBe('adjacent')
      expect(detectPatternStrategy('help needed')).toBe('adjacent')
    })
    
    test('should avoid false matches with word boundaries', () => {
      // "in" should not match in "sink" or "thinking"
      expect(detectPatternStrategy('sink is leaking')).toBe('reverse')
      expect(detectPatternStrategy('thinking about water')).toBe('adjacent')
      
      // "from" should not match in "fromage"
      expect(detectPatternStrategy('fromage cheese')).toBe('adjacent')
      
      // "has" should not match in "hash"
      expect(detectPatternStrategy('hash password')).toBe('adjacent')
    })
    
    test('should be case insensitive', () => {
      expect(detectPatternStrategy('LEAK FROM CEILING')).toBe('forward')
      expect(detectPatternStrategy('Ceiling Is Leaking')).toBe('reverse')
      expect(detectPatternStrategy('BATHROOM WALL PROBLEM')).toBe('adjacent')
    })
    
    test('should handle edge cases', () => {
      expect(detectPatternStrategy('')).toBe('adjacent')
      expect(detectPatternStrategy('   ')).toBe('adjacent')
      expect(detectPatternStrategy('...')).toBe('adjacent')
      expect(detectPatternStrategy('???')).toBe('adjacent')
    })
    
    test('should handle complex real-world examples', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('kitchen faucet is dripping constantly')).toBe('adjacent') // Conservative
      expect(detectPatternStrategy('bathroom wall has water damage')).toBe('reverse')
      expect(detectPatternStrategy('ceiling shows bubbling paint')).toBe('reverse')
    })
    
    test('should prioritize prepositions over reverse verbs', () => {
      expect(detectPatternStrategy('ceiling is leaking from bathroom')).toBe('forward') // Has preposition
      expect(detectPatternStrategy('wall burst in kitchen')).toBe('forward') // Has preposition
      expect(detectPatternStrategy('toilet has problem in basement')).toBe('forward') // Has preposition
    })
  })

  // Performance Tests
  describe('Performance Tests', () => {
    test('should handle long text efficiently', () => {
      const longText = 'water is leaking from the upstairs bathroom ceiling and dripping down the wall onto the kitchen floor where it is pooling under the sink and causing damage to the cabinet while the toilet in the basement is also overflowing and the water heater in the garage is making strange noises'
      
      const startTime = performance.now()
      const strategy = detectPatternStrategy(longText)
      const endTime = performance.now()
      
      expect(strategy).toBeDefined()
      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })
    
    test('should handle repeated calls efficiently', () => {
      const texts = [
        'leak from ceiling',
        'wall is dripping', 
        'water under sink',
        'faucet overflowing',
        'toilet running',
        'shower leaking',
        'basement flooding',
        'gas smell'
      ]
      
      const startTime = performance.now()
      texts.forEach(text => detectPatternStrategy(text))
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50) // Should complete 8 calls in <50ms
    })
    
    test('should handle many short texts efficiently', () => {
      const shortTexts = Array(50).fill().map((_, i) => `test ${i} text`)
      
      const startTime = performance.now()
      shortTexts.forEach(text => detectPatternStrategy(text))
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(200) // Should complete 50 calls in <200ms
    })
  })

  // Real-world Customer Examples
  describe('Real-world Customer Examples', () => {
    test('should handle emergency water damage scenarios', () => {
      expect(detectPatternStrategy('water leaking from upstairs bathroom ceiling')).toBe('forward')
      expect(detectPatternStrategy('ceiling is bubbling and dripping water')).toBe('adjacent') // Conservative
      expect(detectPatternStrategy('bathroom wall water damage emergency')).toBe('adjacent')
      expect(detectPatternStrategy('major flood in basement')).toBe('forward') // Has "in"
    })
    
    test('should handle fixture-specific issues', () => {
      expect(detectPatternStrategy('kitchen faucet dripping from handle')).toBe('forward')
      expect(detectPatternStrategy('toilet is overflowing onto floor')).toBe('adjacent') // Conservative
      expect(detectPatternStrategy('shower valve problem hot water')).toBe('adjacent')
      expect(detectPatternStrategy('garbage disposal not working')).toBe('adjacent')
    })
    
    test('should handle system-level issues', () => {
      expect(detectPatternStrategy('no water pressure in entire house')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('water main burst under street')).toBe('forward')
      expect(detectPatternStrategy('sewer line backing up into basement')).toBe('adjacent') // Conservative
      expect(detectPatternStrategy('gas smell detected in house')).toBe('forward') // Has "in"
    })
    
    test('should handle vague customer descriptions', () => {
      expect(detectPatternStrategy('something is leaking somewhere')).toBe('reverse') // Has "is leaking"
      expect(detectPatternStrategy('water problem in bathroom')).toBe('forward') // Has "in"
      expect(detectPatternStrategy('help with plumbing issue')).toBe('reverse') // Has "with"
      expect(detectPatternStrategy('need plumber assistance')).toBe('adjacent')
      expect(detectPatternStrategy('emergency plumbing situation')).toBe('adjacent')
    })
    
    test('should handle mixed scenarios', () => {
      expect(detectPatternStrategy('water from ceiling and wall is wet')).toBe('forward') // Has preposition
      expect(detectPatternStrategy('ceiling is leaking but floor is dry')).toBe('reverse') // Has "is"
      expect(detectPatternStrategy('multiple issues in bathroom and kitchen')).toBe('forward') // Has "in"
    })
  })
})
