/**
 * Damage Places - Locations where plumbing damage/manifestation is VISIBLE
 * These are the "context locations" - where the customer sees the problem
 * 
 * This file contains BOTH rooms/areas AND surfaces where damage appears
 * Fixtures/components are in plumbingIssueItems.js
 * 
 * Example distinction:
 * - "bathroom" (damagePlaces.js) = room where damage is visible
 * - "toilet" (plumbingIssueItems.js) = fixture that needs fixing
 */

export default [
  // ROOMS - Areas where damage is observed
  {
    "id": "bathroom",
    "aliases": ["bathroom", "restroom", "washroom", "upstairs bathroom", "downstairs bathroom", "outside bathroom", "guesthouse bathroom", "master bathroom", "half bathroom", "full bathroom", "main bathroom", "guest bathroom"],
    "category": "room",
    "description": "Bathroom room where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "kitchen",
    "aliases": ["kitchen", "in the kitchen", "kitchen area", "main kitchen", "galley kitchen"],
    "category": "room",
    "description": "Kitchen room where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "basement",
    "aliases": ["basement", "in the basement", "downstairs basement", "cellar", "lower level"],
    "category": "room",
    "description": "Basement room where damage is visible (context location - plumber fixes fixtures/lines inside)"
  },
  {
    "id": "garage",
    "aliases": ["garage", "in the garage", "attached garage", "detached garage", "car garage"],
    "category": "room",
    "description": "Garage room where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "laundry_room",
    "aliases": ["laundry room", "laundry area", "utility room", "washer area", "dryer room"],
    "category": "room",
    "description": "Laundry room where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "master_bedroom",
    "aliases": ["master bedroom", "master suite", "ensuite bathroom"],
    "category": "room",
    "description": "Master bedroom area where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "living_room",
    "aliases": ["living room", "living room", "living area", "front room", "main room", "sitting room", "lounge"],
    "category": "room",
    "description": "Living room area where damage is visible (context location - plumber fixes fixtures inside)"
  },
  {
    "id": "upstairs",
    "aliases": ["upstairs", "second floor", "upper floor", "upstairs area", "top floor"],
    "category": "floor",
    "description": "Upstairs floor where damage is visible (context location)"
  },
  {
    "id": "hidden_leak",
    "aliases": ["expensive bill", "high water bill", "unusual water usage", "mystery water", "running water sound", "water bill high"],
    "category": "diagnostic",
    "description": "Diagnostic indicator of hidden leak (not a physical location)"
  },
  {
    "id": "downstairs",
    "aliases": ["downstairs", "first floor", "main floor", "ground floor", "lower floor"],
    "category": "floor",
    "description": "Downstairs/main floor where damage is visible (context location)"
  },
  {
    "id": "attic",
    "aliases": ["attic", "in the attic", "attic space", "roof space"],
    "category": "space",
    "description": "Attic area where damage is visible (context location)"
  },
  {
    "id": "crawl_space",
    "aliases": ["crawl space", "crawlspace", "under house", "underneath house"],
    "category": "space",
    "description": "Crawl space where damage is visible (context location)"
  },
  {
    "id": "exterior",
    "aliases": ["outside", "exterior", "outdoor", "outdoors", "external"],
    "category": "location",
    "description": "Exterior areas where damage is visible (context location)"
  },
  // FIXTURES - Large fixtures where damage is visible (context locations)
  {
    "id": "toilet",
    "aliases": ["toilet", "commode", "water closet", "john", "throne", "wc"],
    "category": "fixture",
    "description": "Toilet fixture where damage/leaks are visible (plumber fixes tank components, bowl, or seal)"
  },
  {
    "id": "bathtub",
    "aliases": ["bathtub", "tub", "soaking tub"],
    "category": "fixture",
    "description": "Bathtub fixture where damage/leaks are visible (plumber fixes faucet, drain, or components)"
  },
  {
    "id": "sink",
    "aliases": ["sink", "basin", "kitchen sink", "bathroom sink", "vanity sink", "wash basin"],
    "category": "fixture",
    "description": "Sink basin where damage/leaks are visible (plumber fixes faucet, drain, or supply lines)"
  },
  {
    "id": "under_sink_cabinet",
    "aliases": ["under sink cabinet", "under sink", "sink cabinet", "cabinet under sink", "cabinet under the sink", "vanity cabinet", "under vanity", "underneath", "wet underneath", "water under", "sink base", "vanity base"],
    "category": "surface",
    "description": "Cabinet or area under sink where water damage is visible"
  },
  {
    "id": "shower_stall",
    "aliases": ["shower stall", "shower enclosure", "shower pan", "walk in shower"],
    "category": "fixture", 
    "description": "Shower fixture where damage/leaks are visible (plumber fixes shower head, valves, or drain)"
  },
  {
    "id": "washing_machine",
    "aliases": ["washing machine", "washer", "clothes washer", "laundry machine"],
    "category": "fixture",
    "description": "Washing machine fixture where damage/leaks are visible (plumber fixes supply lines, valves, or drain connections)"
  },
  {
    "id": "ice_maker",
    "aliases": ["ice maker", "icemaker", "ice machine", "refrigerator ice maker"],
    "category": "fixture",
    "description": "Ice maker fixture where damage/leaks are visible (plumber fixes water supply line and connections)"
  },
  {
    "id": "dishwasher",
    "aliases": ["dishwasher", "dish washing machine", "built-in dishwasher", "undercounter dishwasher"],
    "category": "fixture",
    "description": "Dishwasher fixture where damage/leaks are visible (plumber fixes supply line, drain hose, or air gap)"
  },
  // SURFACES - Physical surfaces where damage appears
  {
    "id": "ceiling",
    "aliases": ["ceiling", "bathroom ceiling", "kitchen ceiling", "ceiling drywall", "ceiling paint", "upstairs ceiling", "downstairs ceiling"],
    "category": "surface",
    "description": "Ceiling surfaces affected by plumbing leaks from above"
  },
  {
    "id": "wall",
    "aliases": ["wall", "bathroom wall", "kitchen wall", "interior wall", "drywall", "wall paint", "inside wall"],
    "category": "surface",
    "description": "Wall surfaces affected by plumbing leaks inside"
  },
  {
    "id": "floor",
    "aliases": ["floor", "flooring", "bathroom floor", "kitchen floor", "basement floor", "garage floor", "subfloor"],
    "category": "surface",
    "description": "Floor surfaces where water pools or leaks through"
  },
  {
    "id": "foundation",
    "aliases": ["foundation", "concrete foundation", "slab", "foundation wall"],
    "category": "structure",
    "description": "Foundation areas where water intrusion occurs"
  },
  {
    "id": "yard",
    "aliases": ["yard", "lawn", "front yard", "back yard", "garden", "landscape"],
    "category": "exterior",
    "description": "Exterior yard areas with water line breaks or sewer issues"
  },
  {
    "id": "driveway",
    "aliases": ["driveway", "drive way", "concrete driveway", "asphalt driveway"],
    "category": "exterior",
    "description": "Driveway surfaces where water main breaks or leaks appear"
  },
  {
    "id": "baseboard",
    "aliases": ["baseboard", "baseboards", "molding", "floor trim", "wall bottom", "baseboard molding"],
    "category": "surface",
    "description": "Floor trim and baseboards where water wicks up from slab or floor leaks"
  },
  {
    "id": "stairwell",
    "aliases": ["stairs", "stairwell", "staircase", "steps", "stair landing", "stairway"],
    "category": "surface",
    "description": "Stair areas where water tracks down from upper floor leaks"
  }
]
