// Team Calculation Utilities
// Centralized logic for team size, duration, and cost calculations

/**
 * Get team size for a SINGLE job type
 * Returns the requiredTeamSize from the job object
 * Only handles full job objects (strings removed as dead code)
 */
export const getSingleJobTeamSize = (jobType) => {
  if (!jobType) return 0
  
  // We only receive full job objects from JobTypeSelector
  // No string handling needed - that was dead code
  return jobType.requiredTeamSize || 0
}

/**
 * Get total team size required for MULTIPLE selected job types (summation)
 * Returns the SUM of all required team sizes for all selected jobs
 */
export const getTotalTeamSize = (jobTypes) => {
  if (!jobTypes || jobTypes.length === 0) return 0
  
  // Sum the team sizes required for all selected job types
  const teamSizes = jobTypes.map(jobType => getSingleJobTeamSize(jobType))
  return teamSizes.reduce((sum, size) => sum + size, 0)
}

/**
 * Get estimated duration from the job object
 * Only handles full job objects (strings removed as dead code)
 */
export const getEstimatedDuration = (jobType) => {
  if (!jobType) return null
  
  // We only receive full job objects from JobTypeSelector
  // No string handling needed - that was dead code
  return jobType.estimatedDuration || null
}

/**
 * Get job type description for team size context
 * Uses real researched descriptions from jobTypes.js
 */
export const getJobTypeDescription = (jobType) => {
  if (!jobType) return null
  
  // We only receive full job objects from JobTypeSelector
  // No string handling needed - that was dead code
  return jobType.description || null
}

/**
 * Get combined job type description for multiple jobs
 * Only handles full job objects (strings removed as dead code)
 */
export const getCombinedJobDescription = (jobTypes) => {
  if (!jobTypes || jobTypes.length === 0) return null
  if (jobTypes.length === 1) return getJobTypeDescription(jobTypes[0])
  
  const totalTeamSize = getTotalTeamSize(jobTypes)
  
  // We only receive full job objects from JobTypeSelector
  const jobNames = jobTypes.map(jt => jt.name).join(' + ')
  
  return `Multiple jobs requiring ${totalTeamSize} technicians: ${jobNames}`
}

/**
 * Get combined estimated duration for multiple job types
 * Sums up the duration of all selected jobs
 */
export const getCombinedDuration = (jobTypes) => {
  if (!jobTypes || jobTypes.length === 0) return null
  if (jobTypes.length === 1) return getEstimatedDuration(jobTypes[0])
  
  // For multiple jobs, estimate longer duration
  const totalHours = jobTypes.reduce((total, jobType) => {
    const durationText = getEstimatedDuration(jobType)
    return total + parseDurationToHours(durationText)
  }, 0)
  
  if (totalHours <= 8) return `${totalHours} hours`
  if (totalHours <= 24) return `${Math.ceil(totalHours / 8)} days`
  return `${Math.ceil(totalHours / 40)} weeks`
}

/**
 * Parse duration text to hours (helper function)
 * Converts various duration formats to numeric hours
 */
export const parseDurationToHours = (durationText) => {
  if (!durationText) return null
  
  // Handle ranges like "2-4 hours"
  if (durationText.includes('-')) {
    const parts = durationText.split('-')
    const min = parseFloat(parts[0]) || 0
    const max = parseFloat(parts[1]) || 0
    return (min + max) / 2 // average of range
  }
  
  // Handle single values
  const value = parseFloat(durationText)
  if (durationText.includes('hour')) return value
  if (durationText.includes('day')) return value * 8
  if (durationText.includes('week')) return value * 40
  
  return null // Unknown format
}

/**
 * Calculate estimated job cost (team rate × estimated hours)
 * Handles multiple job types with combined duration
 */
export const calculateEstimatedJobCost = (jobTypes, teamHourlyRate) => {
  if (!jobTypes || jobTypes.length === 0 || teamHourlyRate === 0) return 0
  
  // Get combined duration for all selected job types
  const durationText = getCombinedDuration(jobTypes)
  const hours = parseDurationToHours(durationText)
  
  return teamHourlyRate * hours
}

/**
 * Get team emoji based on validation status
 */
export const getTeamEmoji = (validationType) => {
  const emojis = {
    'success': ' team',
    'warning': ' team',
    'error': ' team',
    'neutral': ' team'
  }
  return emojis[validationType] || null
}
