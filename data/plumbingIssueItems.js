/**
 * PLUMBING FIXTURES & COMPONENTS REGISTRY
 * 
 * Defines specific fixtures, components, appliances, and systems that need fixing.
 * Used by AI detection system to identify WHAT needs fixing (not WHERE).
 * 
 * SEMANTIC SEPARATION:
 * - This file = FIXTURES/COMPONENTS (what plumber fixes)
 * - damagePlaces.js = LOCATIONS (where damage is visible)
 * 
 * Example: "Toilet in bathroom is clogged"
 * - toilet = FIXTURE (what plumber fixes) - from this file
 * - bathroom = LOCATION (where damage is seen) - from damagePlaces.js
 * 
 * PROPERTY GUIDE:
 * - locationId: Unique identifier for this work location (used in detection results)
 * - customerSearchTerms: Common names customers use to describe this location (AI pattern matching)
 * - dispatchCategory: Determines team size, tools needed, and dispatch priority
 *   * fixture = Complete unit (toilet, sink, shower) - general toolkit
 *   * component = Specific part (flapper, cartridge) - may need specific part
 *   * appliance = Major equipment (water heater, dishwasher) - often needs 2 plumbers
 *   * system = Infrastructure (pipes, sewer line) - may need excavation crew
 * - technicalDescription: Internal notes for dispatchers and plumbers
 */

export const PLUMBING_ISSUE_ITEMS = [
  // FIXTURES - Specific plumbing fixtures that need fixing
  {
    "locationId": "toilet",
    "customerSearchTerms": ["toilet", "commode", "water closet", "john", "throne"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Toilet fixture with tank, bowl, and flushing mechanism"
  },
  {
    "locationId": "toilet_tank",
    "customerSearchTerms": ["toilet tank", "tank", "flush tank", "cistern"],
    "dispatchCategory": "component",
    "technicalDescription": "Toilet water tank containing fill valve and flapper"
  },
  {
    "locationId": "toilet_bowl",
    "customerSearchTerms": ["toilet bowl", "bowl", "porcelain bowl"],
    "dispatchCategory": "component",
    "technicalDescription": "Toilet bowl base with wax ring and flange"
  },
  {
    "locationId": "toilet_flapper",
    "customerSearchTerms": ["flapper", "flapper valve", "flush valve seal", "rubber flapper"],
    "dispatchCategory": "component",
    "technicalDescription": "Rubber seal that stops water flow from tank to bowl"
  },
  {
    "locationId": "fill_valve",
    "customerSearchTerms": ["fill valve", "ballcock", "float valve", "toilet fill valve"],
    "dispatchCategory": "component",
    "technicalDescription": "Valve that refills toilet tank after flush"
  },
  {
    "locationId": "toilet_handle",
    "customerSearchTerms": ["toilet handle", "flush handle", "toilet lever", "flush lever"],
    "dispatchCategory": "component",
    "technicalDescription": "Lever arm that activates toilet flush mechanism"
  },
  {
    "locationId": "wax_ring",
    "customerSearchTerms": ["wax ring", "toilet seal", "toilet gasket", "wax seal"],
    "dispatchCategory": "component",
    "technicalDescription": "Seal between toilet bowl and floor flange"
  },
  {
    "locationId": "faucet",
    "customerSearchTerms": ["faucet", "tap", "water tap", "kitchen faucet", "sink faucet"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Water tap fixtures for sinks, tubs, and showers"
  },
  {
    "locationId": "faucet_cartridge",
    "customerSearchTerms": ["cartridge", "faucet cartridge", "valve cartridge", "mixer cartridge"],
    "dispatchCategory": "component",
    "technicalDescription": "Internal valve that controls water flow and temperature in faucet"
  },
  {
    "locationId": "aerator",
    "customerSearchTerms": ["aerator", "faucet aerator", "tap aerator", "screen"],
    "dispatchCategory": "component",
    "technicalDescription": "Mesh screen at faucet tip that mixes air with water"
  },
    {
    "locationId": "shower",
    "customerSearchTerms": ["shower", "shower stall", "walk in shower"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Shower enclosure with valve, head, and drain"
  },
  {
    "locationId": "shower_head",
    "customerSearchTerms": ["shower head", "showerhead", "rain shower", "hand shower"],
    "dispatchCategory": "component",
    "technicalDescription": "Water outlet head for shower"
  },
  {
    "locationId": "shower_valve",
    "customerSearchTerms": ["shower valve", "mixing valve", "shower control", "thermostatic valve"],
    "dispatchCategory": "component",
    "technicalDescription": "Valve controlling water temperature and flow to shower head"
  },
  {
    "locationId": "shower_door",
    "customerSearchTerms": ["shower door", "shower enclosure", "glass door"],
    "dispatchCategory": "component",
    "technicalDescription": "Enclosure door for shower area"
  },
  {
    "locationId": "bathtub_faucet",
    "customerSearchTerms": ["bathtub faucet", "tub faucet", "soaking tub faucet", "tub spout", "bathtub spout"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Faucet assembly for bathtub with spout and handles"
  },
  {
    "locationId": "tub_drain",
    "customerSearchTerms": ["tub drain", "bathtub drain", "pop up drain", "trip lever", "drain stopper"],
    "dispatchCategory": "component",
    "technicalDescription": "Drain assembly for bathtub with stopper mechanism"
  },
  {
    "locationId": "overflow_drain",
    "customerSearchTerms": ["overflow drain", "overflow plate", "trip lever cover", "overflow gasket"],
    "dispatchCategory": "component",
    "technicalDescription": "Secondary drain preventing tub overflow"
  },
  {
    "locationId": "shower_drain",
    "customerSearchTerms": ["shower drain", "shower drain cover", "shower strainer", "shower grate"],
    "dispatchCategory": "component",
    "technicalDescription": "Drain assembly for shower stall with cover/grate"
  },
  {
    "locationId": "jacuzzi",
    "customerSearchTerms": ["jacuzzi", "whirlpool", "jetted tub", "spa tub", "hot tub"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Jetted bathtub with pump and motor"
  },
  {
    "locationId": "jacuzzi_motor",
    "customerSearchTerms": ["jacuzzi motor", "pump motor", "jet pump", "circulation pump"],
    "dispatchCategory": "component",
    "technicalDescription": "Motor that circulates water through jets in jetted tub"
  },
  {
    "locationId": "garbage_disposal",
    "customerSearchTerms": ["garbage disposal", "disposal", "garburator", "food waste disposer", "sink disposal"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Kitchen sink garbage disposal unit"
  },
  {
    "locationId": "p_trap",
    "customerSearchTerms": ["p trap", "p-trap", "sink trap", "drain trap", "j bend"],
    "dispatchCategory": "component",
    "technicalDescription": "Curved pipe under sink preventing sewer gas entry"
  },
  {
    "locationId": "drain_stopper",
    "customerSearchTerms": ["drain stopper", "sink stopper", "pop up stopper", "basket strainer"],
    "dispatchCategory": "component",
    "technicalDescription": "Stopper mechanism for sink drains"
  },
  {
    "locationId": "hose_bib",
    "customerSearchTerms": ["hose bib", "hosebib", "spigot", "outdoor faucet", "garden faucet", "hose faucet", "silcock"],
    "dispatchCategory": "fixture",
    "technicalDescription": "Exterior water faucet for hoses and irrigation"
  },
  // APPLIANCES
  {
    "locationId": "dishwasher",
    "customerSearchTerms": ["dishwasher", "dish washer", "dish machine", "portable dishwasher"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Dishwashing appliance with water supply and drain"
  },
  {
    "locationId": "washing_machine",
    "customerSearchTerms": ["washing machine", "washer", "clothes washer", "laundry machine"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Washing machine with hot/cold supply lines and drain"
  },
  {
    "locationId": "ice_maker",
    "customerSearchTerms": ["ice maker", "icemaker", "ice machine", "refrigerator ice maker"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Refrigerator ice maker with water supply line"
  },
  {
    "locationId": "water_heater",
    "customerSearchTerms": ["water heater", "hot water heater", "hot water tank"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Tank water heating appliance"
  },
  {
    "locationId": "tankless_water_heater",
    "customerSearchTerms": ["tankless water heater", "instant water heater", "on demand water heater"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Tankless on-demand water heating system"
  },
  {
    "locationId": "boiler",
    "customerSearchTerms": ["boiler", "steam boiler", "hot water boiler", "heating boiler"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Boiler for hydronic heating and hot water"
  },
  {
    "locationId": "heating_element",
    "customerSearchTerms": ["heating element", "heater element", "burner", "gas burner"],
    "dispatchCategory": "component",
    "technicalDescription": "Heating element or burner in water heater or boiler"
  },
  {
    "locationId": "anode_rod",
    "customerSearchTerms": ["anode rod", "sacrificial anode", "anode"],
    "dispatchCategory": "component",
    "technicalDescription": "Sacrificial rod preventing tank corrosion in water heater"
  },
  {
    "locationId": "tp_valve",
    "customerSearchTerms": ["temperature pressure valve", "tp valve", "t p valve", "relief valve", "pressure relief"],
    "dispatchCategory": "component",
    "technicalDescription": "Safety valve releasing pressure/temperature from water heater"
  },
  {
    "locationId": "sump_pump",
    "customerSearchTerms": ["sump pump", "basement pump", "sump pit pump", "drainage pump"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Basement sump pump for groundwater removal"
  },
  {
    "locationId": "water_softener",
    "customerSearchTerms": ["water softener", "softener", "water conditioner", "ion exchange system"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Water softening system with brine tank"
  },
  {
    "locationId": "water_filtration",
    "customerSearchTerms": ["water filtration", "water filter", "filtration system", "whole house filter", "reverse osmosis"],
    "dispatchCategory": "appliance",
    "technicalDescription": "Water filtration or purification system"
  },
  // SYSTEMS
  {
    "locationId": "drain",
    "customerSearchTerms": ["drain", "drain line", "drain pipe", "sink drain", "shower drain", "floor drain"],
    "dispatchCategory": "system",
    "technicalDescription": "Drainage piping for waste water removal"
  },
  {
    "locationId": "sewer",
    "customerSearchTerms": ["sewer", "sewer line", "main sewer", "sewer pipe", "sanitary sewer"],
    "dispatchCategory": "system",
    "technicalDescription": "Main sewer line connecting house to municipal system"
  },
  {
    "locationId": "pipe",
    "customerSearchTerms": ["pipe", "pipes", "water pipe", "supply pipe", "plumbing pipe", "copper pipe", "pvc pipe", "pex pipe"],
    "dispatchCategory": "system",
    "technicalDescription": "Water supply or drainage piping throughout building"
  },
  {
    "locationId": "water_main",
    "customerSearchTerms": ["water main", "main water line", "street water", "water service line", "main line", "main pipe"],
    "dispatchCategory": "system",
    "technicalDescription": "Main water service line from street to building - requires shutoff at street level"
  },
  {
    "locationId": "valve",
    "customerSearchTerms": ["valve", "shutoff valve", "ball valve", "gate valve", "angle stop", "supply valve"],
    "dispatchCategory": "system",
    "technicalDescription": "Water shutoff valves and control valves"
  },
  {
    "locationId": "pressure_regulator",
    "customerSearchTerms": ["pressure regulator", "prv", "pressure reducing valve", "water pressure valve"],
    "dispatchCategory": "system",
    "technicalDescription": "Water pressure regulating device"
  },
  {
    "locationId": "water_meter",
    "customerSearchTerms": ["water meter", "meter", "utility meter", "water usage meter"],
    "dispatchCategory": "system",
    "technicalDescription": "Municipal water meter measuring usage"
  },
  {
    "locationId": "backflow_preventer",
    "customerSearchTerms": ["backflow preventer", "backflow valve", "rpz", "reduced pressure zone", "backflow device"],
    "dispatchCategory": "system",
    "technicalDescription": "Backflow prevention device protecting water supply"
  },
  {
    "locationId": "cleanout",
    "customerSearchTerms": ["cleanout", "clean out", "access point", "sewer cleanout", "drain cleanout"],
    "dispatchCategory": "system",
    "technicalDescription": "Access point for drain and sewer line cleaning"
  },
  {
    "locationId": "gas_line",
    "customerSearchTerms": ["gas line", "gas pipe", "natural gas line", "propane line", "gas supply"],
    "dispatchCategory": "system",
    "technicalDescription": "Natural gas or propane supply piping"
  }
]
