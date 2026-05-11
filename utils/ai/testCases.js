// Shared AI test cases used by pages/ai-test.vue and pages/dispatch/index.vue
// Keep this as the single source of truth for comprehensive scenarios.

export const testCases = [
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
  },

  // === FALLBACK TESTS (Medium Confidence) ===
  {
    category: "Fallback Tests",
    title: "🔧 Simple Leak",
    input: "There's a leak under the sink",
    expected: "Basic pattern match for leak",
    shouldUse: "fallback",
    expectedCount: 1,
    priorities: ["SAME_DAY"]
  },
  {
    category: "Fallback Tests",
    title: "🚰 Clogged Drain",
    input: "My drain is clogged and water won't go down",
    expected: "Basic pattern match for clogged drain",
    shouldUse: "fallback",
    expectedCount: 1,
    priorities: ["SAME_DAY"]
  },
  {
    category: "Fallback Tests",
    title: "🚽 Sewer Backup",
    input: "Sewage is backing up into my shower and multiple drains are clogged",
    expected: "Multiple matches for sewer backup and clogged drains",
    shouldUse: "fallback",
    expectedCount: 2,
    priorities: ["SAME_DAY", "SAME_DAY"]
  }
];
