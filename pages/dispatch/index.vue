<template>
  <div class="dispatcher-container">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">👨‍💼 FlowPro Dispatcher</h1>
            <p class="text-lg text-gray-600">
              AI-powered customer issue analysis and team assignment
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="toggleTestSuite" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              🧪 {{ showTestSuite ? 'Hide Tests' : 'Show Tests' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Workflow -->
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <!-- Left: Customer Input -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <!-- TESTING INDICATOR - REMOVE LATER -->
          <div class="mb-3 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs font-semibold text-yellow-800">
            🧪 TESTING MODE - Customer input will be replaced by real website intake forms
          </div>
          
          <h2 class="text-2xl font-bold mb-4">📞 Customer Report</h2>
          <textarea
            v-model="customerText"
            @input="analyzeIssue"
            placeholder="Paste customer description here..."
            class="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          ></textarea>
          
          <div class="mt-4">
            <button @click="analyzeIssue" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              🔍 Analyze Issue
            </button>
          </div>

          <div v-if="!showTestSuite" class="mt-4 space-y-2">
            <p class="text-sm font-semibold text-gray-700">Quick Load:</p>
            <button
              v-for="(example, idx) in quickExamples"
              :key="idx"
              @click="loadTestCase(example.text)"
              class="w-full text-left p-2 text-sm bg-gray-100 hover:bg-blue-100 rounded border border-gray-300 transition"
            >
              {{ example.name }}
            </button>
          </div>
        </div>

        <!-- Right: Advanced Analysis Results -->
        <div v-if="results && results.totalIssues > 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">🎯 Analysis Results</h2>
            <span class="px-3 py-1 rounded-full text-sm font-medium" :class="getDetectionMethodClass(results.detectedBy)">
              {{ results.detectedBy || 'Standard' }} Method
            </span>
          </div>

          <!-- Summary -->
          <div class="bg-white rounded-lg p-4 mb-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-500 text-sm">Total Issues</p>
                <p class="text-2xl font-bold text-blue-600">{{ results.totalIssues }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Detection Method</p>
                <p class="text-2xl font-bold text-purple-600">{{ results.detectedBy || 'Standard' }}</p>
              </div>
            </div>
          </div>

          <!-- Issues by Priority -->
          <div class="issues-by-priority">
            <div v-for="(issues, priority) in results.groupedIssues" :key="priority" class="mb-4">
              <h4 :class="getPriorityClass(priority)" class="px-3 py-2 rounded-lg text-white font-bold mb-2">
                {{ priority }} ({{ issues.length }})
              </h4>
              <div class="space-y-2">
                <div v-for="issue in issues" :key="issue.id" class="bg-white rounded-lg p-3 border-l-4" :style="{ borderColor: getPriorityColor(priority) }">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <span class="font-bold text-gray-900">{{ issue.jobTypeTitle }}</span>
                      <span class="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{{ Math.round(issue.confidence * 100) }}%</span>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 mb-2">
                    <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">{{ issue.areaAlias }}</span>
                    <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{{ issue.symptomAlias }}</span>
                  </div>
                  <div class="flex gap-2 text-xs text-gray-500">
                    <span>{{ issue.severity }}</span>
                    <span>•</span>
                    <span>{{ issue.detectedBy }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommended Actions -->
          <div class="mt-4 bg-white rounded-lg p-4">
            <h4 class="font-bold mb-3">📋 Recommended Actions:</h4>
            <ul class="space-y-2 text-sm">
              <li v-for="(action, idx) in getRecommendedActions(results)" :key="idx" class="flex items-start gap-2">
                <span class="text-green-600 font-bold">✓</span>
                <span>{{ action }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- No Match State -->
        <div v-else class="bg-yellow-50 rounded-lg shadow-lg p-6 border-2 border-yellow-300">
          <p class="text-lg font-semibold mb-2">🤔 No Issue Detected</p>
          <p class="text-gray-600">Enter a customer description to see dispatcher recommendations.</p>
        </div>
      </div>

      <!-- Test Suite Section -->
      <div v-if="showTestSuite" class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">🧪 Comprehensive Test Suite</h2>
          <div class="flex gap-2">
            <button @click="runAllTests" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ▶️ Run All Tests
            </button>
            <button @click="clearTests" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              🗑️ Clear
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            v-for="category in testCategories"
            :key="category"
            @click="filterCategory = filterCategory === category ? null : category"
            class="px-3 py-1 rounded-full text-sm border"
            :class="{ 'bg-blue-600 text-white border-blue-600': filterCategory === category, 'bg-gray-100': filterCategory !== category }"
          >
            {{ category }} ({{ testCases.filter(t => t.category === category).length }})
          </button>
        </div>

        <!-- Test Cases Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(testCase, index) in filteredTestCases"
            :key="index"
            @click="runTest(testCase, index)"
            class="p-4 border-2 rounded-lg cursor-pointer transition"
            :class="getTestClass(testCase, index)"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold text-sm">{{ testCase.title }}</span>
              <span v-if="testResults[index]" :class="testResults[index].passed ? 'text-green-600' : 'text-red-600'">
                {{ testResults[index].passed ? '✅' : '❌' }}
              </span>
            </div>
            <div class="text-xs text-gray-600 mb-2">"{{ testCase.input.substring(0, 80) }}..."</div>
            <div class="text-xs">
              <span class="bg-blue-100 px-2 py-1 rounded">{{ testCase.shouldUse }}</span>
              <span class="bg-purple-100 px-2 py-1 rounded ml-1">{{ testCase.expectedCount }} issues</span>
            </div>
          </div>
        </div>

        <!-- Test Statistics -->
        <div v-if="showTestStats" class="mt-6 grid grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{{ testStats.passedTests }}/{{ testStats.totalTests }}</div>
            <div class="text-sm text-gray-600">Passed</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">{{ testStats.contextualMatches }}</div>
            <div class="text-sm text-gray-600">Contextual</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ testStats.fallbackMatches }}</div>
            <div class="text-sm text-gray-600">Fallback</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-red-600">{{ testStats.ambiguousMatches }}</div>
            <div class="text-sm text-gray-600">Ambiguous</div>
          </div>
        </div>
      </div>

      <!-- Debug Section (click anywhere to toggle raw vs diagnostic) -->
      <div 
        class="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-xs cursor-pointer select-none hover:bg-gray-800 transition-colors"
        @click="toggleDebug"
        title="Click anywhere to toggle between Raw and Diagnostic debug output"
      >
        <div class="flex items-center justify-between mb-4">
          <p class="font-bold">🔧 Debug Panel ({{ showDebug ? 'Diagnostic' : 'Raw' }})</p>
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 rounded bg-gray-800 text-[10px] hover:bg-gray-700 transition-colors">
              {{ showDebug ? '🔍 Diagnostic' : '📊 Raw' }}
            </span>
            <button 
              @click.stop="copyDebugOutput"
              class="px-2 py-1 rounded bg-green-800 text-[10px] hover:bg-green-700 transition-colors flex items-center gap-1"
              title="Copy debug output to clipboard"
            >
              📋 Copy
            </button>
            <span class="px-2 py-1 rounded bg-blue-800 text-[10px] hover:bg-blue-700 transition-colors">
              click to toggle
            </span>
          </div>
        </div>
        <pre class="overflow-x-auto cursor-text">{{ JSON.stringify(debugPayload, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAISuggestion, debugAISuggestion } from '~/utils/ai/aiBasicLearner.js'
import { testCases } from '~/utils/ai/testCases.js'

const customerText = ref('')
const results = ref(null)
const showDebug = ref(false)
const showTestSuite = ref(false)
const filterCategory = ref(null)
const testResults = ref([])
const currentTestIndex = ref(-1)
const showTestStats = ref(false)

const testStats = ref({
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  contextualMatches: 0,
  fallbackMatches: 0,
  ambiguousMatches: 0
})

// Quick examples for workflow
const quickExamples = [
  {
    name: '🚨 Gas Leak (IMMEDIATE)',
    text: 'I smell gas in my living room and I am feeling dizzy'
  },
  {
    name: '💧 Burst Pipe (IMMEDIATE)',
    text: 'The pipe has burst in my basement and water is everywhere!'
  },
  {
    name: '🚽 Sewer Backup (SAME_DAY)',
    text: 'Sewage is backing up into my shower and multiple drains are clogged'
  }
]

// testCases are imported from shared module for parity with ai-test.vue

const testCategories = computed(() => [...new Set(testCases.map(t => t.category))])
const filteredTestCases = computed(() => {
  if (!filterCategory.value) return testCases
  return testCases.filter(t => t.category === filterCategory.value)
})

const analyzeIssue = () => {
  if (!customerText.value.trim()) {
    results.value = null
    return
  }
  results.value = getAISuggestion(customerText.value)
}

const loadTestCase = (text) => {
  customerText.value = text
  analyzeIssue()
}

const toggleTestSuite = () => { showTestSuite.value = !showTestSuite.value }
const toggleDebug = () => { showDebug.value = !showDebug.value }

const copyDebugOutput = async () => {
  const text = JSON.stringify(debugPayload.value, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    // Show brief success feedback
    const button = event.target
    const originalText = button.innerHTML
    button.innerHTML = '✅ Copied!'
    button.classList.add('bg-green-600')
    setTimeout(() => {
      button.innerHTML = originalText
      button.classList.remove('bg-green-600')
    }, 1500)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Live debug payload toggles between raw (results) and diagnostic (debugAISuggestion)
const debugPayload = computed(() => {
  if (!customerText.value?.trim()) return results.value
  return showDebug.value ? debugAISuggestion(customerText.value) : results.value
})

const runTest = (testCase, index) => {
  customerText.value = testCase.input
  currentTestIndex.value = index
  analyzeIssue()
  
  // Evaluate test
  const testResult = {
    testCase,
    result: results.value,
    passed: evaluateTest(testCase, results.value)
  }
  testResults.value[index] = testResult
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
    const result = getAISuggestion(testCase.input)
    
    const testResult = {
      testCase,
      result,
      passed: evaluateTest(testCase, result),
      actualMethod: result?.detectedBy || 'standard',
      actualCount: result?.totalIssues || 0
    }
    
    testResults.value.push(testResult)
    
    if (testResult.passed) testStats.value.passedTests++
    else testStats.value.failedTests++
    
    const method = testResult.actualMethod.toLowerCase()
    if (method === 'contextual') testStats.value.contextualMatches++
    else if (method === 'fallback') testStats.value.fallbackMatches++
    else testStats.value.ambiguousMatches++
  })
  
  showTestStats.value = true
}

const clearTests = () => {
  testResults.value = []
  testStats.value = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    contextualMatches: 0,
    fallbackMatches: 0,
    ambiguousMatches: 0
  }
  showTestStats.value = false
}

const evaluateTest = (testCase, result) => {
  if (!result) return false
  // Simple evaluation - check if we got expected number of issues
  return result.totalIssues === testCase.expectedCount
}

const getTestClass = (testCase, index) => {
  const baseClass = 'border-gray-200 hover:border-blue-300'
  if (!testResults.value[index]) return baseClass
  
  if (testResults.value[index].passed) {
    return 'border-green-400 bg-green-50'
  } else {
    return 'border-red-400 bg-red-50'
  }
}

const getPriorityClass = (priority) => {
  const classes = {
    'IMMEDIATE': 'bg-red-600',
    'SAME_DAY': 'bg-amber-600',
    'SCHEDULE': 'bg-blue-600',
    'CLARIFICATION': 'bg-purple-600'
  }
  return classes[priority] || 'bg-gray-600'
}

const getPriorityColor = (priority) => {
  const colors = {
    'IMMEDIATE': '#dc2626',
    'SAME_DAY': '#f59e0b',
    'SCHEDULE': '#3b82f6',
    'CLARIFICATION': '#9333ea'
  }
  return colors[priority] || '#6b7280'
}

const getDetectionMethodClass = (method) => {
  const classes = {
    'contextual': 'bg-green-600 text-white',
    'fallback': 'bg-yellow-600 text-white',
    'ambiguous': 'bg-red-600 text-white'
  }
  return classes[method?.toLowerCase()] || 'bg-gray-600 text-white'
}

const getRecommendedActions = (results) => {
  if (!results || !results.groupedIssues) return ['Analyze customer needs', 'Provide quote', 'Schedule appointment']
  
  const actions = []
  const hasImmediate = results.groupedIssues['IMMEDIATE']?.length > 0
  const hasSameDay = results.groupedIssues['SAME_DAY']?.length > 0
  
  if (hasImmediate) {
    actions.push('Dispatch emergency team immediately')
    actions.push('Advise customer of safety precautions')
  }
  if (hasSameDay) {
    actions.push('Schedule same-day service')
    actions.push('Prepare necessary equipment')
  }
  
  actions.push('Provide cost estimate')
  actions.push('Confirm appointment details')
  
  return actions
}
</script>

<style scoped>
.dispatcher-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
}
</style>
