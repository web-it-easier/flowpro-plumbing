/**
 * 📚 Educational Descriptions for Plumbing Issues
 * 
 * This module generates customer-friendly educational messages
 * for different plumbing categories and specific issues.
 */

export const getEducationalDescription = (category) => {
  // Rules table: ordered by specificity
  const rules = [
    {
      when: () => category === 'gas_line_services',
      message: () => `Gas leaks are extremely dangerous and can cause explosions, carbon monoxide poisoning, and death. 
        If you smell gas, evacuate immediately and call 911 from outside. Do not use electrical switches, 
        light matches, or create any sparks. A professional gas technician must locate and repair the leak.`
    },
    {
      when: () => category === 'emergency_plumbing',
      message: () => `Burst pipes cause immediate water damage and structural problems. Water can damage walls, 
        ceilings, foundations, and electrical systems. Shut off your main water valve immediately to stop the flow. 
        Document damage with photos for insurance. Professional emergency plumbing repair is required.`
    },
    {
      when: () => category === 'water_heater_services',
      message: () => `Water heater issues can range from simple repairs to complete replacement. Common problems include 
        sediment buildup, failed heating elements, and leaking tanks. A professional plumber can diagnose the issue 
        and recommend repair or replacement. Regular maintenance can extend your water heater's lifespan.`
    },
    {
      when: () => category === 'drain_cleaning_sewer',
      message: () => `Clogged drains and sewer backups are common but serious issues. Tree roots, hair, grease, and 
        debris accumulate over time. Professional hydro-jetting can clear blockages safely. Avoid chemical drain cleaners 
        as they damage pipes. Regular drain maintenance prevents future clogs.`
    },
    {
      when: () => category === 'bathroom_kitchen_fixtures',
      message: () => `Leaky faucets and running toilets waste water and increase your bills. A single dripping faucet 
        can waste 3,000 gallons per year. Most fixture issues involve worn washers, cartridges, or fill valves that 
        can be repaired or replaced. Professional repair is quick and affordable.`
    },
    {
      when: () => category === 'plumbing_repairs',
      message: () => `Pipe leaks and general plumbing repairs require professional diagnosis and repair. Small leaks 
        can cause significant water damage over time. Early detection prevents costly structural damage. Regular 
        inspections help identify problems before they become emergencies.`
    },
    {
      when: () => category === 'maintenance_inspection',
      message: () => `Regular plumbing inspections identify potential problems before they become expensive emergencies. 
        Professional inspections check for leaks, corrosion, water pressure issues, and code violations. Annual 
        maintenance extends the life of your plumbing system and saves money long-term.`
    },
    {
      when: () => category === 'outdoor_drainage',
      message: () => `Proper outdoor drainage protects your foundation and prevents water damage. Grading, gutters, 
        and drainage systems direct water away from your home. Poor drainage causes foundation cracks, basement flooding, 
        and structural damage. Professional assessment ensures proper water management.`
    }
  ]

  // Find matching rule
  for (const rule of rules) {
    if (rule.when()) {
      return rule.message()
    }
  }

  // Fallback
  return `Professional plumbing service is recommended for this issue. A licensed plumber can diagnose the problem 
    and provide appropriate solutions.`
}
