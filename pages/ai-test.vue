<!-- TEST VERSION - Uses contextual matching to solve ambiguity -->
<template>
  <div class="ai-test-container">
    <h1>AI Test - Contextual Pattern Matching</h1>
    <p class="subtitle">Testing bulletproof text recognition without ambiguity</p>
    
    <div class="test-section">
      <div class="test-header">
        <h2>Comprehensive Test Suite</h2>
        <div class="test-controls">
          <button @click="runAllTests" class="run-all-button">
            🧪 Run All Tests
          </button>
          <button @click="clearAllTests" class="clear-button">
            🗑️ Clear All
          </button>
        </div>
      </div>
      
      <!-- Test Categories Filter -->
      <div class="category-filter">
        <button 
          v-for="category in testCategories" 
          :key="category"
          @click="filterCategory = filterCategory === category ? null : category"
          class="category-button"
          :class="{ active: filterCategory === category }"
        >
          {{ category }} ({{ testCases.filter(t => t.category === category).length }})
        </button>
      </div>
      
      <div class="test-cases">
        <div 
          v-for="(testCase, index) in filteredTestCases" 
          :key="index"
          @click="runTest(testCase, index)"
          class="test-button"
          :class="{ 
            active: currentTestIndex === index,
            passed: testResults[index]?.passed,
            failed: testResults[index]?.passed === false
          }"
        >
          <div class="test-header-row">
            <span class="test-title">{{ testCase.title }}</span>
            <span class="test-method" :class="testCase.shouldUse">{{ testCase.shouldUse }}</span>
          </div>
          <div class="test-input">"{{ testCase.input }}"</div>
          <div class="test-expected">Expected: {{ testCase.expected }}</div>
          <div class="test-meta">
            <span class="expected-count">Count: {{ testCase.expectedCount }}</span>
            <span class="expected-priorities" v-if="testCase.priorities.length">
              Priorities: {{ testCase.priorities.join(', ') }}
            </span>
          </div>
          <div class="test-result" v-if="testResults[index]">
            <span :class="{ success: testResults[index].passed, fail: !testResults[index].passed }">
              {{ testResults[index].passed ? '✅ PASS' : '❌ FAIL' }}
            </span>
            <span class="actual-result">
              Actual: {{ testResults[index].actualMethod }} ({{ testResults[index].actualCount }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <h3>Custom Input</h3>
      <textarea 
        v-model="currentInput"
        @input="analyzeText"
        placeholder="Type your plumbing issue here..."
        class="input-textarea"
      ></textarea>
      
      <button @click="analyzeText" class="analyze-button">
        Analyze Text
      </button>
    </div>

    <div class="results-section" v-if="results">
      <h3>Results ({{ results.detectedBy || 'Standard' }} Method)</h3>
      
      <div class="summary">
        <div class="summary-item">
          <span class="label">Total Issues:</span>
          <span class="value">{{ results.totalIssues }}</span>
        </div>
              </div>

      <div class="issues-by-priority">
  
        <div v-for="(issues, priority) in results.groupedIssues" :key="priority" class="priority-group">
          <h4 :class="priority.toLowerCase()">-> {{ priority }} ({{ issues.length }})</h4>
          <!-- <div v-if="issues.length === 0" class="no-issues">No issues (:)</div> -->
          <div class="issue-list">
            <div v-for="issue in issues" :key="issue.id" class="issue-card">
             
              
              <div class="issue-header">
                <span class="issue-title">{{ issue.jobTypeTitle }}</span>
                <span class="issue-confidence">{{ Math.round(issue.confidence * 100) }}%</span>
              </div>
              <div class="issue-details">
                <div class="issue-description">
                  <div class="area-badge">{{ issue.areaAlias }}</div>
                  <div class="symptom-text">{{ issue.symptomAlias }}</div>
                </div>
                <div class="issue-meta">
                  <span class="issue-severity">{{ issue.severity }}</span>
                  <span class="issue-method">{{ issue.detectedBy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Analysis Section -->
    <div class="analysis-section" v-if="showAnalysis && testResults.length > 0">
      <h3>Test Analysis Results</h3>
      
      <!-- Test Statistics -->
      <div class="test-stats">
        <div class="stat-card">
          <div class="stat-value">{{ testStats.passedTests }}/{{ testStats.totalTests }}</div>
          <div class="stat-label">Tests Passed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ testStats.contextualMatches }}</div>
          <div class="stat-label">Contextual</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ testStats.fallbackMatches }}</div>
          <div class="stat-label">Fallback</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ testStats.ambiguousMatches }}</div>
          <div class="stat-label">Ambiguous</div>
        </div>
      </div>
      
      <!-- Failed Tests Details -->
      <div class="failed-tests" v-if="testStats.failedTests > 0">
        <h4>❌ Failed Tests ({{ testStats.failedTests }})</h4>
        <div class="failed-test-list">
          <div 
            v-for="(result, index) in testResults.filter(r => !r.passed)" 
            :key="index"
            class="failed-test-item"
          >
            <div class="failed-title">{{ result.testCase.title }}</div>
            <div class="failed-details">
              Expected: {{ result.testCase.shouldUse }} ({{ result.testCase.expectedCount }})
              → Actual: {{ result.actualMethod }} ({{ result.actualCount }})
            </div>
            <div class="failed-input">"{{ result.testCase.input }}"</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="debug-section" v-if="debugInfo">
      <div class="debug-header">
        <h3>Debug Information</h3>
        <button @click="copyDebugInfo" class="copy-button" title="Copy to clipboard">
          <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          {{ copySuccess ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <pre class="debug-output">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAISuggestion, debugAISuggestion } from '../utils/ai/aiBasicLearner.js'

const currentInput = ref('')
const results = ref(null)
const debugInfo = ref(null)
const testResults = ref([])
const currentTestIndex = ref(-1)
const showAnalysis = ref(false)
const testStats = ref({
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  contextualMatches: 0,
  fallbackMatches: 0,
  ambiguousMatches: 0
})

const filterCategory = ref(null)
const copySuccess = ref(false)

const filteredTestCases = computed(() => {
  if (!filterCategory.value) return testCases
  return testCases.filter(t => t.category === filterCategory.value)
})

const testCases = [
  // === CONTEXTUAL PATTERN TESTS (High Confidence) ===
  {
    category: "Contextual - Emergency",
    title: "🚨 Gas + Burst + Ceiling",
    input: "I smell gas in the kitchen, the ceiling is bubbling with paint, and the pipe burst in the basement!",
    expected: "3 mixed matches: gas_smell + ceiling_bubbling + pipe_burst",
    shouldUse: "mixed",
    expectedCount: 3,
    priorities: ["IMMEDIATE", "IMMEDIATE", "IMMEDIATE"]
  },
  {
    category: "Contextual - Emergency",
    title: "🚨 Gas Leak + Water Flood",
    input: "The gas line is leaking and the main water pipe burst, water is flooding everywhere!",
    expected: "3 mixed matches: gas_leak + water_main_burst + flooding",
    shouldUse: "mixed",
    expectedCount: 3,
    priorities: ["IMMEDIATE", "IMMEDIATE", "IMMEDIATE"]
  },
  {
    category: "Contextual - Mixed",
    title: "💧 Ceiling Water Damage",
    input: "Water is pouring through the ceiling from the upstairs bathroom, the ceiling is bubbling and sagging.",
    expected: "1 contextual match: ceiling_bubbling (water damage)",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Compound - Area Relationships",
    title: "🏠 Ceiling from Bathroom",
    input: "Water is pouring through the ceiling from the upstairs bathroom",
    expected: "1 contextual match with area relationship",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Compound - Area Relationships", 
    title: "🏠 Wall from Kitchen",
    input: "The wall is wet from the kitchen sink leak",
    expected: "1 contextual match with area relationship",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["SAME_DAY"]
  },
  {
    category: "Compound - Area Relationships",
    title: "🏠 Floor from Laundry",
    input: "Water damage on the floor from the washing machine in the laundry room",
    expected: "1 contextual match with area relationship",
    shouldUse: "contextual", 
    expectedCount: 1,
    priorities: ["SAME_DAY"]
  },
  {
    category: "Compound - Area Relationships",
    title: "🏠 Ceiling in Basement",
    input: "The ceiling in the basement is leaking from the bathroom above",
    expected: "1 contextual match with area relationship",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["SAME_DAY"]
  },
  {
    category: "Compound - Area Relationships",
    title: "🏠 Garage at House",
    input: "The garage at the house has water coming from the main line",
    expected: "1 contextual match with area relationship",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  
  // // === FALLBACK PATTERN TESTS (Medium Confidence) ===
  // {
  //   category: "Fallback - Mixed",
  //   title: "🔧 Water Heater Issues",
  //   input: "My water heater is running continuously, the pipes are making noise, and I have no hot water.",
  //   expected: "3 mixed matches: pipe_noise + water_heater(area-only) + no_hot_water",
  //   shouldUse: "mixed",
  //   expectedCount: 3,
  //   priorities: ["SAME_DAY", "SCHEDULE", "SAME_DAY"]
  // },
  // {
  //   category: "Fallback - Multiple",
  //   title: "🚽 Bathroom Problems",
  //   input: "The toilet is running, the bathroom faucet is leaking, and the drain is clogged.",
  //   expected: "3 contextual matches: toilet_running + faucet_leak + drain_clog",
  //   shouldUse: "contextual",
  //   expectedCount: 3,
  //   priorities: ["SCHEDULE", "SCHEDULE", "SAME_DAY"]
  // },
  // {
  //   category: "Contextual - Emergency",
  //   title: "💥 Burst + Flood Emergency",
  //   input: "A pipe burst in the basement and water is flooding the garage.",
  //   expected: "2 mixed matches: pipe_burst + flooding",
  //   shouldUse: "mixed",
  //   expectedCount: 2,
  //   priorities: ["IMMEDIATE", "IMMEDIATE"]
  // },
  
  // // === AMBIGUOUS INPUT TESTS ===
  // {
  //   category: "Ambiguous",
  //   title: "🤔 Just Symptoms",
  //   input: "bubbling running leaking dripping",
  //   expected: "Fallback - symptoms only, no areas",
  //   shouldUse: "fallback",
  //   expectedCount: 4,
  //   priorities: ["SAME_DAY", "SCHEDULE", "SAME_DAY", "SAME_DAY"]
  // },
  // {
  //   category: "Ambiguous",
  //   title: "🤔 Just Areas",
  //   input: "toilet sink faucet pipes ceiling",
  //   expected: "Fallback - areas only, no symptoms",
  //   shouldUse: "fallback",
  //   expectedCount: 5,
  //   priorities: ["SCHEDULE", "SCHEDULE", "SCHEDULE", "SCHEDULE", "SCHEDULE"]
  // },
  // {
  //   category: "Ambiguous",
  //   title: "🤔 Unrelated Words",
  //   input: "The cat is sleeping on the couch while watching TV.",
  //   expected: "Ambiguous - no plumbing terms detected",
  //   shouldUse: "ambiguous",
  //   expectedCount: 0,
  //   priorities: []
  // },
  
  // // === EDGE CASE TESTS ===
  // {
  //   category: "Edge Cases",
  //   title: "🔍 Single Word",
  //   input: "leaking",
  //   expected: "Fallback - single symptom only",
  //   shouldUse: "fallback",
  //   expectedCount: 1,
  //   priorities: ["SAME_DAY"]
  // },
  // {
  //   category: "Edge Cases",
  //   title: "🔍 Empty Input",
  //   input: "",
  //   expected: "No input - should return null",
  //   shouldUse: "none",
  //   expectedCount: 0,
  //   priorities: []
  // },
  // {
  //   category: "Edge Cases",
  //   title: "🔍 Typos",
  //   input: "The faucett is leeking and the toylet is runing.",
  //   expected: "Fallback - should find partial matches despite typos",
  //   shouldUse: "fallback",
  //   expectedCount: 2,
  //   priorities: ["SCHEDULE", "SCHEDULE"]
  // },
  
  // // === STRESS TESTS ===
  // {
  //   category: "Stress Tests",
  //   title: "🌪️ Maximum Issues",
  //   input: "I smell gas, the ceiling is bubbling, the toilet is running, the kitchen faucet is leaking, the bathroom sink is clogged, the water heater burst, the main pipe is frozen, the drain is backing up, and there's no water pressure.",
  //   expected: "Multiple issues across all priorities",
  //   shouldUse: "mixed",
  //   expectedCount: 9,
  //   priorities: ["IMMEDIATE", "IMMEDIATE", "SCHEDULE", "SCHEDULE", "SAME_DAY", "IMMEDIATE", "IMMEDIATE", "SAME_DAY", "SCHEDULE"]
  // },
  // {
  //   category: "Stress Tests",
  //   title: "🌪️ Repeated Words",
  //   input: "Leaking leaking leaking faucet faucet faucet toilet toilet toilet running running running burst burst burst gas gas gas",
  //   expected: "Should handle duplicates gracefully",
  //   shouldUse: "fallback",
  //   expectedCount: 3,
  //   priorities: ["SCHEDULE", "SCHEDULE", "IMMEDIATE"]
  // },
  
  // === PANIC DETECTION TESTS ===
  {
    category: "Panic Detection",
    title: "😰 Panic - Repetition + Urgency",
    input: "help help ceiling pouring water everywhere bathroom flooding please help now",
    expected: "Merged incident with panic override to IMMEDIATE",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Panic Detection",
    title: "😰 Panic - Emergency Keywords",
    input: "emergency!!! water burst pipe flooding everywhere need help immediately",
    expected: "Merged incident with panic override to IMMEDIATE",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Panic Detection",
    title: "😰 Panic - Can't Stop + Worse",
    input: "can't stop water pouring getting worse ceiling wall floor all wet",
    expected: "Merged incident with panic override to IMMEDIATE",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  
  // === INCIDENT MERGER TESTS ===
  {
    category: "Incident Merger",
    title: "🧩 Multi-Area Multi-Symptom",
    input: "ceiling pouring bathroom flooding wall wet floor damage everywhere",
    expected: "1-2 merged incidents combining ceiling/wall/floor with sources",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Incident Merger",
    title: "🧩 Complex Incident with Source",
    input: "Water is pouring through the ceiling from the upstairs bathroom, the wall is wet and the floor has puddles",
    expected: "1 merged incident: ceiling from bathroom with pouring + wall wet + floor puddles",
    shouldUse: "contextual",
    expectedCount: 1,
    priorities: ["IMMEDIATE"]
  },
  {
    category: "Incident Merger",
    title: "🧩 No Panic - Should Stay Clarification",
    input: "ceiling has some damage bathroom might be leaking",
    expected: "Multiple area_only matches routed to clarification (no panic override)",
    shouldUse: "fallback",
    expectedCount: 2,
    priorities: ["CLARIFICATION", "CLARIFICATION"]
  }
]

// Test analysis functions
const testCategories = computed(() => [...new Set(testCases.map(t => t.category))])
const testMethods = computed(() => [...new Set(testCases.map(t => t.shouldUse))])

const runTest = (testCase, index) => {
  currentInput.value = testCase.input
  currentTestIndex.value = index
  analyzeText()
}

const runAllTests = () => {
  testResults.value = []
  testStats.value = {
    totalTests: testCases.length,
    passedTests: 0,
    failedTests: 0,
    contextualMatches: 0,
    fallbackMatches: 0,
    ambiguousMatches: 0
  }
  
  testCases.forEach((testCase, index) => {
    const debugResult = debugAISuggestion(testCase.input)
    const cleanResult = getAISuggestion(testCase.input)
    
    const testResult = {
      testCase,
      debugResult,
      cleanResult,
      passed: evaluateTest(testCase, cleanResult),
      actualMethod: getDetectionMethod(cleanResult),
      actualCount: cleanResult?.totalIssues || 0,
      actualPriorities: getActualPriorities(cleanResult)
    }
    
    testResults.value.push(testResult)
    
    // Update stats
    if (testResult.passed) testStats.value.passedTests++
    else testStats.value.failedTests++
    
    const method = testResult.actualMethod
    if (method === 'contextual') testStats.value.contextualMatches++
    else if (method === 'fallback') testStats.value.fallbackMatches++
    else if (method === 'ambiguous') testStats.value.ambiguousMatches++
  })
  
  showAnalysis.value = true
}

const evaluateTest = (testCase, result) => {
  if (!result) return testCase.expectedCount === 0
  
  // Check if expected method matches actual method
  if (testCase.shouldUse !== 'mixed' && testCase.shouldUse !== getDetectionMethod(result)) {
    return false
  }
  
  // Check if expected count matches actual count
  if (testCase.expectedCount !== result.totalIssues) {
    return false
  }
  
  // Check priorities (if specified) - order-insensitive
  if (testCase.priorities.length > 0) {
    const actualPriorities = getActualPriorities(result)
    const countMap = (arr) => arr.reduce((acc, p) => { acc[p] = (acc[p] || 0) + 1; return acc }, {})
    const exp = countMap(testCase.priorities)
    const act = countMap(actualPriorities)
    const keys = new Set([...Object.keys(exp), ...Object.keys(act)])
    for (const k of keys) {
      if ((exp[k] || 0) !== (act[k] || 0)) return false
    }
    return true
  }
  
  return true
}

const getDetectionMethod = (result) => {
  if (!result || result.totalIssues === 0) return 'ambiguous'
  const hasContextual = result.issues?.some(issue => issue.detectedBy === 'contextual')
  const hasNonContextual = result.issues?.some(issue => issue.detectedBy !== 'contextual')
  if (hasContextual && hasNonContextual) return 'mixed'
  if (hasContextual) return 'contextual'
  return 'fallback'
}

const getActualPriorities = (result) => {
  if (!result || !result.groupedIssues) return []
  
  const priorities = []
  Object.keys(result.groupedIssues).forEach(priority => {
    result.groupedIssues[priority].forEach(() => {
      priorities.push(priority)
    })
  })
  return priorities
}

const clearAllTests = () => {
  testResults.value = []
  testStats.value = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    contextualMatches: 0,
    fallbackMatches: 0,
    ambiguousMatches: 0
  }
  showAnalysis.value = false
  currentTestIndex.value = -1
  results.value = null
  debugInfo.value = null
  currentInput.value = ''
}

const copyDebugInfo = async () => {
  try {
    const debugText = JSON.stringify(debugInfo.value, null, 2)
    await navigator.clipboard.writeText(debugText)
    
    // Show success feedback
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy debug info:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = JSON.stringify(debugInfo.value, null, 2)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const analyzeText = async () => {
  if (!currentInput.value.trim()) {
    results.value = null
    return
  }

  // Get debug info first
  debugInfo.value = debugAISuggestion(currentInput.value)
  
  // Get clean results - let errors bubble up naturally
  results.value = getAISuggestion(currentInput.value)
}
</script>

<style scoped>
.ai-test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.subtitle {
  color: #666;
  font-style: italic;
  margin-bottom: 30px;
}

.test-section {
  margin-bottom: 30px;
}

.test-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.test-button {
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.test-button:hover {
  background: #e9e9e9;
  border-color: #999;
}

.test-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.test-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.test-input {
  font-style: italic;
  color: #333;
  margin-bottom: 5px;
}

.test-expected {
  font-size: 0.9em;
  color: #666;
}

.input-section {
  margin-bottom: 30px;
}

.input-textarea {
  width: 100%;
  height: 100px;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 15px;
}

.analyze-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.analyze-button:hover {
  background: #218838;
}

.results-section {
  background: #414040;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  h3 {
    color: white;
  }
}

.summary {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  gap: 10px;
  color: white;
 
}

.label {
  font-weight: bold;
}

.value {
  color: white;
  background: #6a6b6c;
  padding: 5px 10px;
  border-radius: 4px;
}

.issues-by-priority {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  h3 {
    color: white;
  }
}

.priority-group h4 {
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
}

.immediate { background: #dc3545; }
.same-day { background: #ffc107; color: #333; }
.schedule { background: #6c757d; }
.clarification { background: #f59e0b; color: white; }

.no-issues {
  color: #666;
  font-style: italic;
}

.issue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.issue-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-title {
  font-weight: bold;
}

.issue-confidence {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.issue-details {
  font-size: 0.9em;
}

.issue-description {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.area-badge {
  background: #2563eb;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
}

.symptom-text {
  color: #dc2626;
  font-weight: 500;
}

.issue-meta {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.issue-severity {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8em;
}

.issue-method {
  color: #666;
  font-size: 0.8em;
}

.debug-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.debug-header h3 {
  margin: 0;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s;
}

.copy-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.copy-button:active {
  transform: translateY(0);
}

.copy-icon {
  width: 16px;
  height: 16px;
}

.debug-output {
  background: #f1f1f1;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9em;
  line-height: 1.4;
}

/* New Test Suite Styles */
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.test-controls {
  display: flex;
  gap: 10px;
}

.run-all-button {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.run-all-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.clear-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-button:hover {
  background: #5a6268;
}

.category-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-button {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9em;
}

.category-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.category-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.test-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.test-method {
  font-size: 0.8em;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.test-method.contextual {
  background: #28a745;
  color: white;
}

.test-method.fallback {
  background: #ffc107;
  color: #333;
}

.test-method.ambiguous {
  background: #6c757d;
  color: white;
}

.test-method.mixed {
  background: #17a2b8;
  color: white;
}

.test-meta {
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 0.8em;
  color: #666;
}

.test-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.test-result .success {
  color: #28a745;
  font-weight: bold;
}

.test-result .fail {
  color: #dc3545;
  font-weight: bold;
}

.actual-result {
  font-size: 0.8em;
  color: #666;
}

.test-button.passed {
  border-color: #28a745;
  background: #f8fff9;
}

.test-button.failed {
  border-color: #dc3545;
  background: #fff8f8;
}

/* Analysis Section */
.analysis-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.test-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #007bff;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.failed-tests {
  margin-top: 20px;
}

.failed-test-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.failed-test-item {
  background: #fff8f8;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px;
}

.failed-title {
  font-weight: bold;
  color: #dc3545;
  margin-bottom: 5px;
}

.failed-details {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.failed-input {
  font-style: italic;
  color: #999;
  font-size: 0.8em;
}
</style>
