# Data Model Separation - Clean Architecture

## Overview
Refactored data model to cleanly separate **work locations** from **damage manifestation locations**.

## The Problem (Before)
- Both `plumbingIssueItems.js` and `damagePlaces.js` contained "bathroom", "kitchen", etc.
- Same word meant different things in different contexts
- Caused ambiguity in AI pattern matching
- Unclear semantic meaning

## The Solution (After)

### `plumbingIssueItems.js` - WORK LOCATIONS ONLY
**Where the plumber goes to fix the source of the problem**

**Work Location Categories:**
1. **Rooms** - General work areas where plumber performs repairs
   - `bathroom` - General bathroom work area
   - `kitchen` - Kitchen work area
   - `basement` - Basement work area
   - `garage` - Garage work area
   - `laundry_room` - Laundry room work area
   - `attic` - Attic work area
   - `crawl_space` - Crawl space work area
   - `exterior` - Exterior work area
   - `upstairs` - Upstairs work area
   - `downstairs` - Downstairs work area

2. **Specific Rooms** - Room + floor combinations
   - `upstairs_bathroom` - Upstairs bathroom
   - `downstairs_bathroom` - Downstairs bathroom
   - `master_bathroom` - Master bathroom
   - `kitchen_sink_area` - Kitchen sink area

3. **Fixtures** - Specific plumbing fixtures
   - `toilet`, `sink`, `shower`, `bathtub`, `faucet`, etc.

4. **Components** - Parts of fixtures
   - `toilet_flapper`, `toilet_tank`, `fill_valve`, etc.

5. **Appliances** - Major equipment
   - `water_heater`, `dishwasher`, `washing_machine`, etc.

6. **Systems** - Infrastructure
   - `water_main`, `sewer_line`, `gas_line`, `pipes`, etc.

**Example entries:**
```javascript
{
  "locationId": "bathroom",
  "customerSearchTerms": ["bathroom", "restroom", "washroom"],
  "dispatchCategory": "fixture",
  "technicalDescription": "General bathroom work area - contains multiple fixtures"
}
```

### `damagePlaces.js` - DAMAGE MANIFESTATION LOCATIONS ONLY
**Where the customer sees/observes the problem**

**Damage Location Categories:**
1. **Surfaces** - Physical surfaces where damage appears
   - `ceiling` - Ceiling surfaces affected by leaks from above
   - `wall` - Wall surfaces affected by leaks
   - `floor` - Floor surfaces where water pools
   - `baseboard` - Floor trim where water wicks up
   - `stairwell` - Stairs where water tracks down

2. **Structures** - Building structures
   - `foundation` - Foundation areas with water intrusion

3. **Exterior** - Outside areas
   - `yard` - Yard areas with water line breaks
   - `driveway` - Driveway surfaces with leaks

**Example entries:**
```javascript
{
  "id": "ceiling",
  "aliases": ["ceiling", "ceiling drywall", "ceiling paint"],
  "category": "surface",
  "description": "Ceiling surfaces affected by plumbing leaks from above"
}
```

## Semantic Distinction

### Customer Input: "Bathroom ceiling is leaking"

**Before (Confusing):**
- "bathroom" → matches both files
- Unclear if it's work location or damage location
- Ambiguous AI pattern matching

**After (Clear):**
- "bathroom" → `plumbingIssueItems.js` (work location - where plumber goes)
- "ceiling" → `damagePlaces.js` (damage location - where water appears)
- **Result:** Compound location = "ceiling from bathroom"
  - Damage shows in: ceiling
  - Plumber works in: bathroom

### Another Example: "Water dripping from kitchen sink"

**Work Location:** `kitchen_sink_area` (plumbingIssueItems.js)
- Where plumber fixes the source (faucet, drain connection)

**Damage Location:** `ceiling` or `floor` (damagePlaces.js)
- Where water drips/pools (below the sink)

## Benefits of Separation

✅ **Clear semantics** - No ambiguity about what each location means
✅ **Better AI matching** - Compound locations are unambiguous
✅ **Maintainability** - Each file has single responsibility
✅ **Scalability** - Easy to add new work locations or damage locations
✅ **Accuracy** - Prevents false matches from overlapping data
✅ **Documentation** - Self-documenting code structure

## Implementation Details

### Property Differences

**plumbingIssueItems.js (Work Locations):**
- `locationId` - Unique identifier
- `customerSearchTerms` - How customers describe this work location
- `dispatchCategory` - Determines team size and tools
- `technicalDescription` - Internal notes for dispatchers

**damagePlaces.js (Damage Locations):**
- `id` - Unique identifier
- `aliases` - How customers describe where damage appears
- `category` - Type of surface/structure
- `description` - What kind of damage affects this location

### AI Pattern Matching

**Compound Location Detection:**
```
Input: "ceiling from upstairs bathroom is dripping"

1. Find damage location: "ceiling" → damagePlaces.js
2. Find work location: "upstairs bathroom" → plumbingIssueItems.js
3. Create compound: { damage: "ceiling", source: "upstairs_bathroom" }
4. Result: Plumber goes to upstairs_bathroom to fix source of ceiling leak
```

## Migration Notes

- ✅ Removed all room entries from `damagePlaces.js`
- ✅ Added all room entries to `plumbingIssueItems.js`
- ✅ Kept only surface/structure entries in `damagePlaces.js`
- ✅ Updated file headers with clear semantic distinction
- ✅ No duplicate entries across files

## Files Modified

1. **damagePlaces.js**
   - Removed: bathroom, kitchen, basement, garage, laundry_room, master_bedroom, upstairs, downstairs, attic, crawl_space, exterior
   - Kept: ceiling, wall, floor, foundation, yard, driveway, baseboard, stairwell
   - Added: Clear header explaining damage manifestation locations

2. **plumbingIssueItems.js**
   - Added: All room/area work locations at beginning
   - Removed: Duplicate compound work locations at end
   - Updated: Header with semantic distinction explanation

## Testing Recommendations

Test compound location detection with:
- "ceiling from bathroom" → damage: ceiling, source: bathroom ✓
- "wall in kitchen" → damage: wall, source: kitchen ✓
- "floor from basement" → damage: floor, source: basement ✓
- "basement ceiling leaking" → damage: ceiling, source: basement ✓

All should now unambiguously match correct locations!
