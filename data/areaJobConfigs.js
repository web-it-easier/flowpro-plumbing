/**
 * Area Job Configurations - Dispatch routing configuration
 * Maps plumbing areas to job types, supported symptoms, and severity overrides
 * 
 * This is the dispatch layer: determines job type, urgency, and valid symptoms
 * for each plumbing area detected by the AI system.
 */

export default [
  {
    "area": "toilet",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["clog", "running", "overflowing", "noise", "leak", "not_working", "slow_drain", "bad_smell", "flapper", "fill_valve"],
    "severityOverrides": {
      "overflowing": "immediate",
      "clog": "same_day",
      "bad_smell": "same_day"
    }
  },
  {
    "area": "toilet_tank",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "running", "overflowing", "noise", "not_working", "fill_valve", "flapper"],
    "severityOverrides": {
      "overflowing": "immediate",
      "leak": "same_day"
    }
  },
  {
    "area": "faucet",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "low_pressure", "high_pressure", "noise", "not_working", "discolored_water", "temperature_fluctuation"],
    "severityOverrides": {}
  },
  {
    "area": "sink",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["clog", "slow_drain", "leak", "bad_smell", "overflowing", "low_pressure", "not_working"],
    "severityOverrides": {
      "overflowing": "immediate",
      "clog": "same_day",
      "bad_smell": "same_day"
    }
  },
  {
    "area": "shower",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "low_pressure", "high_pressure", "temperature_fluctuation", "slow_drain", "clog", "noise", "not_working", "no_hot_water"],
    "severityOverrides": {
      "no_hot_water": "same_day",
      "clog": "same_day"
    }
  },
  {
    "area": "shower_stall",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "low_pressure", "high_pressure", "temperature_fluctuation", "slow_drain", "clog", "noise", "not_working", "no_hot_water"],
    "severityOverrides": {
      "no_hot_water": "same_day",
      "clog": "same_day"
    }
  },
  {
    "area": "bathtub",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["slow_drain", "clog", "leak", "overflowing", "bad_smell", "not_working", "temperature_fluctuation", "no_hot_water"],
    "severityOverrides": {
      "overflowing": "immediate",
      "clog": "same_day",
      "no_hot_water": "same_day"
    }
  },
  {
    "area": "garbage_disposal",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["noise", "leak", "clog", "not_working", "bad_smell", "running"],
    "severityOverrides": {}
  },
  {
    "area": "dishwasher",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "clog", "not_working", "bad_smell", "overflowing", "no_water"],
    "severityOverrides": {
      "overflowing": "immediate",
      "no_water": "same_day"
    }
  },
  {
    "area": "ice_maker",
    "jobType": "bathroom_kitchen_fixtures",
    "supportedSymptoms": ["leak", "not_working", "no_water", "discolored_water"],
    "severityOverrides": {
      "no_water": "same_day"
    }
  },
  {
    "area": "drain",
    "jobType": "drain_cleaning_sewer",
    "supportedSymptoms": ["clog", "slow_drain", "bad_smell", "overflowing", "backup", "noise", "drain_flies"],
    "severityOverrides": {
      "overflowing": "immediate",
      "drain_flies": "same_day",
      "bad_smell": "same_day",
      "clog": "same_day"
    }
  },
  {
    "area": "sewer",
    "jobType": "drain_cleaning_sewer",
    "supportedSymptoms": ["clog", "slow_drain", "bad_smell", "overflowing", "not_working"],
    "severityOverrides": {
      "overflowing": "immediate",
      "bad_smell": "immediate",
      "clog": "same_day"
    }
  },
  {
    "area": "cleanout",
    "jobType": "drain_cleaning_sewer",
    "supportedSymptoms": ["clog", "overflowing", "bad_smell", "backup"],
    "severityOverrides": {
      "overflowing": "immediate",
      "bad_smell": "same_day",
      "clog": "same_day"
    }
  },
  {
    "area": "water_heater",
    "jobType": "water_heater_services",
    "supportedSymptoms": ["no_hot_water", "leak", "noise", "pilot_light", "not_working", "sediment", "temperature_fluctuation", "discolored_water", "gas_smell", "burst"],
    "severityOverrides": {
      "gas_smell": "immediate",
      "burst": "immediate",
      "leak": "same_day",
      "no_hot_water": "same_day",
      "pilot_light": "same_day"
    }
  },
  {
    "area": "pipe",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "burst", "frozen", "corrosion", "noise", "vibration", "no_water", "discolored_water","flooding", "overflowing"],
    "severityOverrides": {
      "burst": "immediate",
      "frozen": "immediate",
      "no_water": "immediate",
      "flooding": "immediate",
      "overflowing": "immediate",
      "leak": "same_day",
      "corrosion": "same_day"
    }
  },
  {
    "area": "water_main",
    "jobType": "emergency_plumbing",
    "supportedSymptoms": ["burst", "leak", "no_water", "low_pressure", "discolored_water"],
    "severityOverrides": {
      "burst": "immediate",
      "leak": "immediate",
      "no_water": "immediate",
      "low_pressure": "same_day",
      "discolored_water": "same_day"
    }
  },
  {
    "area": "valve",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "not_working", "low_pressure", "high_pressure", "corrosion"],
    "severityOverrides": {
      "leak": "same_day",
      "corrosion": "same_day"
    }
  },
  {
    "area": "pressure_regulator",
    "jobType": "maintenance_inspection",
    "supportedSymptoms": ["low_pressure", "high_pressure", "noise", "vibration", "not_working"],
    "severityOverrides": {
      "high_pressure": "same_day"
    }
  },
  {
    "area": "water_meter",
    "jobType": "maintenance_inspection",
    "supportedSymptoms": ["leak", "not_working", "broken_glass", "frozen"],
    "severityOverrides": {
      "leak": "same_day"
    }
  },
  {
    "area": "backflow_preventer",
    "jobType": "maintenance_inspection",
    "supportedSymptoms": ["not_working", "bad_smell", "discolored_water", "leak"],
    "severityOverrides": {
      "discolored_water": "same_day",
      "leak": "same_day"
    }
  },
  {
    "area": "gas_line",
    "jobType": "gas_line_services",
    "supportedSymptoms": ["gas_smell", "leak", "not_working", "corrosion", "pilot_light", "burst"],
    "severityOverrides": {
      "gas_smell": "immediate",
      "leak": "immediate",
      "corrosion": "same_day",
      "burst": "immediate"
    }
  },
  {
    "area": "sump_pump",
    "jobType": "outdoor_drainage",
    "supportedSymptoms": ["not_working", "noise", "overflowing", "leak", "running"],
    "severityOverrides": {
      "overflowing": "immediate",
      "not_working": "same_day"
    }
  },
  {
    "area": "hose_bib",
    "jobType": "outdoor_drainage",
    "supportedSymptoms": ["leak", "frozen", "low_pressure", "not_working"],
    "severityOverrides": {
      "frozen": "immediate",
      "leak": "same_day"
    }
  },
  {
    "area": "water_softener",
    "jobType": "maintenance_inspection",
    "supportedSymptoms": ["not_working", "sediment", "discolored_water", "low_pressure", "leak"],
    "severityOverrides": {
      "leak": "same_day",
      "discolored_water": "same_day"
    }
  },
  {
    "area": "water_filtration",
    "jobType": "maintenance_inspection",
    "supportedSymptoms": ["not_working", "discolored_water", "sediment", "low_pressure", "leak", "bad_smell"],
    "severityOverrides": {
      "discolored_water": "same_day",
      "bad_smell": "same_day",
      "leak": "same_day"
    }
  },
  {
    "area": "washing_machine",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "clog", "not_working", "overflowing", "no_water"],
    "severityOverrides": {
      "overflowing": "immediate",
      "leak": "same_day",
      "no_water": "same_day"
    }
  },
  {
    "area": "ceiling",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "overflowing", "noise", "bubbling", "sagging", "pouring"],
    "severityOverrides": {
      "leak": "immediate",
      "overflowing": "immediate",
      "noise": "immediate",
      "bubbling": "immediate",
      "sagging": "immediate",
      "pouring": "immediate"
    }
  },
  {
    "area": "wall",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "overflowing", "noise"],
    "severityOverrides": {
      "leak": "immediate",
      "overflowing": "immediate",
      "noise": "immediate"
    }
  },
  // DAMAGE PLACES (context locations - where problem shows)
  {
    "area": "floor",
    "jobType": "leak_detection_repair",
    "supportedSymptoms": ["leak", "flooding", "water_pooling", "wet_floor", "water_damage"],
    "severityOverrides": {
      "flooding": "immediate",
      "water_pooling": "same_day",
      "water_damage": "same_day"
    }
  },
  {
    "area": "foundation",
    "jobType": "slab_leak_repair",
    "supportedSymptoms": ["leak", "water_intrusion", "crack", "moisture", "seepage"],
    "severityOverrides": {
      "leak": "immediate",
      "water_intrusion": "immediate"
    }
  },
  {
    "area": "yard",
    "jobType": "water_line_repair",
    "supportedSymptoms": ["leak", "wet_spot", "soggy_ground", "water_bubbling", "low_pressure"],
    "severityOverrides": {
      "water_bubbling": "immediate",
      "leak": "immediate",
      "low_pressure": "same_day"
    }
  },
  {
    "area": "driveway",
    "jobType": "water_line_repair",
    "supportedSymptoms": ["leak", "wet_spot", "water_pooling", "low_pressure"],
    "severityOverrides": {
      "leak": "immediate",
      "low_pressure": "same_day"
    }
  },
  {
    "area": "baseboard",
    "jobType": "slab_leak_repair",
    "supportedSymptoms": ["leak", "water_damage", "moisture", "staining", "mold"],
    "severityOverrides": {
      "leak": "immediate",
      "water_damage": "same_day"
    }
  },
  {
    "area": "under_sink_cabinet",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["leak", "water_damage", "moisture", "bad_smell", "slow_drain"],
    "severityOverrides": {
      "leak": "same_day",
      "water_damage": "same_day"
    }
  },
  {
    "area": "living_room",
    "jobType": "emergency_plumbing",
    "supportedSymptoms": ["gas_smell", "gas_leak", "dizzy", "headache", "nausea"],
    "severityOverrides": {
      "gas_smell": "immediate",
      "gas_leak": "immediate",
      "dizzy": "immediate"
    }
  },
  {
    "area": "hidden_leak",
    "jobType": "plumbing_repairs",
    "supportedSymptoms": ["expensive_bill", "high_bill", "unusual_usage", "mystery_water", "sound_running"],
    "severityOverrides": {
      "expensive_bill": "same_day",
      "high_bill": "same_day",
      "mystery_water": "immediate"
    }
  },
  {
    "area": "stairwell",
    "jobType": "emergency_plumbing",
    "supportedSymptoms": ["leak", "water_flowing", "flooding", "water_damage"],
    "severityOverrides": {
      "water_flowing": "immediate",
      "flooding": "immediate",
      "leak": "immediate"
    }
  }
]
