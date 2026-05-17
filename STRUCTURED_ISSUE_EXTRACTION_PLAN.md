# Structured Issue Extraction Plan

## **Objective**
Transform the current raw keyword matching system into a structured issue extraction model that separates:
- Issue Area (WHERE)
- Symptom (WHAT)
- Severity (URGENCY)

## **Current Problems**
- `toilet makes strange noises` incorrectly maps to `water_heater_services`
- Generic keywords like `faucet`, `dripping`, `strange noises` create noise
- No context awareness
- Hard to maintain and debug

## **Research Sources**
- Angi: Emergency plumbing guidance
- Balkan Plumbing: Emergency recognition signals
- United Plumbing: Common problems and symptoms

## **Target Architecture**

### **Data Structure: Hybrid Model**
```
issueAreas.json     - Area vocabulary
symptoms.json       - Symptom vocabulary  
issuePatterns.json  - Area + Symptom mapping rules
```

### **Output Structure**
```javascript
{
  "areas": ["toilet"],
  "symptoms": ["noise", "running"],
  "severity": "schedule",
  "jobType": "bathroom_kitchen_fixtures",
  "confidence": 0.8
}
```

## **Implementation Steps**

### **Step 1: Define Issue Areas**
**File:** `data/issueAreas.json`
**Purpose:** Define all plumbing fixture/area vocabulary

**Structure:**
```json
[
  {
    "id": "toilet",
    "aliases": ["toilet", "commode", "bathroom toilet"],
    "category": "bathroom"
  },
  {
    "id": "faucet", 
    "aliases": ["faucet", "tap", "fixture"],
    "category": "bathroom"
  }
]
```

**Core Areas (from research):**
- toilet
- faucet / fixture
- drain / sewer
- pipe / water line
- water heater
- gas line
- sump / exterior drainage
- sink / garbage disposal

### **Step 2: Define Symptoms**
**File:** `data/symptoms.json`
**Purpose:** Define all problem symptom vocabulary

**Structure:**
```json
[
  {
    "id": "leak",
    "aliases": ["leak", "leaking", "dripping", "water leak"],
    "category": "water_issue"
  },
  {
    "id": "noise",
    "aliases": ["noise", "noisy", "strange noises", "hissing", "gurgling", "banging"],
    "category": "sound_issue"
  }
]
```

**Core Symptoms (from research):**
- leak / dripping
- clog / blockage / backup
- running
- overflowing
- noise / strange sounds
- no hot water
- low water pressure
- bad smell / gas smell
- water damage / flooding
- not working

### **Step 3: Define Issue Patterns**
**File:** `data/issuePatterns.json`
**Purpose:** Map area + symptom to job type and severity

**Structure:**
```json
[
  {
    "area": "toilet",
    "symptoms": ["running", "overflowing", "clogged", "noise"],
    "jobType": "bathroom_kitchen_fixtures",
    "severityBySymptom": {
      "overflowing": "immediate",
      "clogged": "same_day", 
      "running": "schedule",
      "noise": "schedule"
    }
  }
]
```

### **Step 4: Update AI Logic**
**File:** `utils/ai/aiBasicLearner.js`
**Purpose:** Extract structured data instead of raw keyword matching

**New Logic:**
1. Extract all matching areas from text
2. Extract all matching symptoms from text  
3. Match area + symptom combinations to patterns
4. Determine severity based on symptom
5. Return structured result

### **Step 5: Update UI**
**File:** `pages/ai-test.vue`
**Purpose:** Display structured results clearly

**New Display:**
- Show detected areas
- Show detected symptoms
- Show calculated severity
- Show confidence scores

## **Example Transformations**

### **Before (Current)**
```
Input: "toilet makes strange noises and faucet is dripping"
Output: 
- water_heater_services (from "strange noises")
- bathroom_kitchen_fixtures (from "faucet") 
- bathroom_kitchen_fixtures (from "dripping")
```

### **After (Structured)**
```
Input: "toilet makes strange noises and faucet is dripping"
Output:
{
  "areas": ["toilet", "faucet"],
  "symptoms": ["noise", "leak"],
  "severity": "same_day",
  "jobType": "bathroom_kitchen_fixtures",
  "issues": [
    { "area": "toilet", "symptom": "noise", "severity": "schedule" },
    { "area": "faucet", "symptom": "leak", "severity": "same_day" }
  ]
}
```

## **Benefits of Structured Approach**

### **Better Context Understanding**
- `toilet + noise` = bathroom issue (not water heater)
- `gas + smell` = immediate emergency
- `water heater + noise` = water heater issue

### **More Flexible**
- Can handle multiple issues in one sentence
- Can prioritize by severity
- Can explain reasoning

### **Easier Maintenance**
- Clear separation of vocabulary vs logic
- Easy to add new areas or symptoms
- Easy to adjust severity rules

### **Better for AI Enhancement**
- Can later add semantic matching
- Can later add LLM classification
- Can add confidence scoring

## **Deterministic Emergency Rules**

Keep hard rules for critical safety issues:

```javascript
// Always immediate - no AI needed
if (text.includes("smell gas") || text.includes("rotten egg")) {
  return { severity: "immediate", area: "gas_line", symptom: "gas_leak" }
}
```

## **Migration Strategy**

### **Phase 1: Data Creation**
- Create JSON files for areas, symptoms, patterns
- Add comprehensive vocabulary
- Test with common examples

### **Phase 2: Logic Implementation**  
- Update AI extraction logic
- Maintain backward compatibility
- Add structured output

### **Phase 3: UI Updates**
- Update display for structured results
- Add confidence indicators
- Add reasoning explanation

### **Phase 4: Testing & Refinement**
- Test with real customer examples
- Refine vocabulary and patterns
- Adjust severity rules

## **Success Metrics**

### **Accuracy**
- Correct area identification: 95%+
- Correct symptom identification: 90%+
- Correct severity assignment: 95%+

### **User Experience**
- Clear, explainable results
- No confusing wrong categorizations
- Better multi-issue handling

### **Maintainability**
- Easy to add new vocabulary
- Clear separation of concerns
- Simple debugging

## **Timeline Estimate**

- **Phase 1 (Data):** 30 minutes
- **Phase 2 (Logic):** 1-2 hours  
- **Phase 3 (UI):** 1 hour
- **Phase 4 (Testing):** 30 minutes
- **Total:** 3-4 hours

**Note:** This assumes rapid iteration with immediate testing and tweaking - not corporate development cycles!

## **Next Immediate Action**

**Start with Step 1:** Create `data/issueAreas.json` with core plumbing areas and aliases based on research sources.

## **Notes**

- This approach maintains deterministic behavior for emergencies
- Structured data enables future AI enhancements
- Vocabulary can be expanded without changing core logic
- Severity rules can be adjusted independently
- Multiple issues in one sentence are properly handled
