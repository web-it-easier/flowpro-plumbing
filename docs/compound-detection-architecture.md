# Compound Location Detection Architecture

## Overview
Transforms compound location patterns like "ceiling from upstairs bathroom" into a canonical model that distinguishes between **primary work locations** (where plumbers work) and **damage areas** (what's affected).

---

## Core Problem Solved

### Before: Equal Treatment
```
Input: "Water pouring through ceiling from upstairs bathroom"
❌ Both areas treated equally: ceiling + bathroom
❌ Creates confusion about where to send plumber
❌ May route to wrong trade or create duplicate jobs
```

### After: Primary vs Damage Distinction
```
Input: "Water pouring through ceiling from upstairs bathroom"
✅ Primary: upstairs bathroom (plumbing work location)
✅ Damage: ceiling (context/severity)
✅ Clear dispatch: send plumber to bathroom, note ceiling damage
```

---

## Canonical Model Structure

```json
{
  "matchText": "ceiling from the upstairs bathroom",
  "primary": {
    "alias": "upstairs bathroom",
    "areaId": "bathroom", 
    "role": "source"
  },
  "damage": {
    "alias": "ceiling",
    "areaId": "ceiling",
    "role": "affected"
  },
  "preposition": "from",
  "confidence": 0.87,
  "ambiguity": false,
  "pattern": "area-first"
}
```

### Field Explanations
- **primary**: Where trade work is performed (dispatch target)
- **damage**: Affected surface (context, severity, referrals)
- **confidence**: Auto-routing confidence score
- **ambiguity**: Whether source is uncertain
- **preposition**: Helps determine primary vs damage

---

## Pattern Detection Logic

### Area-First Patterns
**Pattern**: `{area} (from|in|at) (the?) {location}`

**Examples**:
- "ceiling from upstairs bathroom" → primary = bathroom
- "leak in kitchen" → primary = kitchen  
- "water at sink" → primary = sink

**Source Detection Rules**:
- `from` → location is source (work location)
- `in` → location is source (work location)
- `at` → location is source (work location)

### Future: Preposition-First Patterns
**Pattern**: `(from|in|at) (the?) {location} (to|into|onto)? {area}`

**Examples**:
- "from upstairs bathroom to ceiling" → primary = bathroom
- "in kitchen ceiling" → primary = kitchen

---

## Multi-Symptom Handling

### Current Issue
```
Input: "ceiling is sagging and dripping"
❌ May create: ceiling+sagging + ceiling+dripping
❌ Redundant processing
❌ Confusing severity assessment
```

### Proposed Solution: Symptom Aggregation
```
Input: "ceiling is sagging and dripping"
✅ Single area: ceiling
✅ Multiple symptoms: [sagging, dripping]
✅ Combined severity: max(sagging, dripping)
✅ Single job with comprehensive notes
```

### Implementation Strategy
1. **Collect all symptoms per area** in one pass
2. **Aggregate by area**: `{ceiling: [sagging, dripping]}`
3. **Calculate combined severity**: highest priority symptom
4. **Create single contextual match** with multiple symptoms

---

## Confidence & Ambiguity Rules

### Confidence Scoring
- **0.8+**: High confidence → auto-route
- **0.5-0.8**: Medium confidence → dispatcher review
- **<0.5**: Low confidence → ask clarifying question

### Ambiguity Detection
Mark `ambiguity = true` when:
- Location part doesn't match known area
- Only damage area mentioned (no source)
- Multiple possible sources
- Unclear preposition

### Clarifying Questions
When `ambiguity === true`:
- "Which room is above the ceiling — bathroom, kitchen, or roof?"
- "Is the leak coming from a fixture or the ceiling itself?"
- "Do you see water coming from toilet, sink, or shower?"

---

## Dispatch Integration

### Job Creation Logic
```javascript
if (compound.confidence >= 0.8) {
  createJob({
    area: compound.primary.areaId,
    alias: compound.primary.alias,
    symptoms: aggregatedSymptoms,
    severity: calculatedSeverity,
    notes: `Damage to ${compound.damage.alias} noted`
  })
}
```

### Referral Logic
```javascript
if (compound.damage.areaId !== compound.primary.areaId) {
  createReferral({
    trade: 'drywall/restoration',
    area: compound.damage.areaId,
    priority: 'medium',
    notes: `Secondary damage from plumbing issue`
  })
}
```

---

## File Organization

### Core Files
```
utils/ai/
├── lookupMaps.js                 # Main orchestration
├── compoundLocationHelpers.js    # Pattern detection helpers
└── symptomAggregation.js         # Multi-symptom handling (future)
```

### Data Files
```
data/
├── issueAreas.js                 # Area definitions
├── symptoms.js                   # Symptom definitions
└── areaJobConfigs.json          # Job configurations
```

---

## Testing Strategy

### Test Cases
1. **Clear compounds**: "ceiling from upstairs bathroom"
2. **Ambiguous cases**: "ceiling is dripping"
3. **Multiple symptoms**: "ceiling sagging and dripping"
4. **Preposition variations**: "leak in kitchen", "water at sink"
5. **Edge cases**: "roof leaking", "wall damp"

### Expected Behaviors
- ✅ Correct primary/damage identification
- ✅ Proper confidence scoring
- ✅ Appropriate ambiguity detection
- ✅ Single job per area (no duplicates)
- ✅ Symptom aggregation working

---

## Future Enhancements

### Phase 1: Complete Current Implementation
- ✅ Canonical model
- ✅ Area-first patterns
- ✅ Primary vs damage logic
- ⏳ Multi-symptom aggregation

### Phase 2: Advanced Patterns
- Preposition-first patterns
- Window-based fallback detection
- Smart location inference
- Pattern confidence scoring

### Phase 3: Smart Ambiguity Resolution
- Contextual question generation
- Historical pattern learning
- Customer response parsing
- Confidence improvement

### Phase 4: Integration Features
- Auto-referral generation
- Severity calculation
- Job priority scoring
- Dispatch optimization

---

## Success Metrics

### Accuracy Metrics
- **Compound detection accuracy**: >90%
- **Primary vs damage correct**: >95%
- **False positive rate**: <5%
- **Ambiguity detection**: >85%

### Business Metrics
- **Reduced dispatcher calls**: 30% fewer clarification calls
- **Faster routing**: 50% faster job creation
- **Fewer duplicate jobs**: 80% reduction
- **Higher customer satisfaction**: Better first-time resolution

---

## Implementation Checklist

### Core Functionality
- [x] Canonical compound model
- [x] Area-first pattern detection
- [x] Primary vs damage logic
- [x] Helper file organization
- [ ] Multi-symptom aggregation
- [ ] Confidence scoring
- [ ] Ambiguity detection
- [ ] Clarifying questions

### Integration
- [ ] Dispatch system integration
- [ ] Job creation logic
- [ ] Referral system
- [ ] UI for ambiguous cases
- [ ] Customer question flow

### Testing & Quality
- [ ] Unit tests for all patterns
- [ ] Integration tests
- [ ] Real-world test cases
- [ ] Performance testing
- [ ] Accuracy validation

---

## Notes & Decisions

### Key Architectural Decisions
1. **Primary vs Damage**: Source location gets the job, damage gets context
2. **Canonical Model**: Single, predictable structure for all compounds
3. **Helper Separation**: Complex logic in dedicated files for maintainability
4. **Confidence-Based Routing**: Auto-route high confidence, human review medium/low

### Multi-Symptom Philosophy
**One area, multiple symptoms = one job**
- Prevents duplicate jobs for same area
- Combines severity appropriately
- Clearer work orders for plumbers
- Better customer experience

### Future Considerations
- Pattern learning from corrections
- Customer response parsing
- Multi-trade coordination
- Historical accuracy tracking
