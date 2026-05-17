<template>
  <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 class="font-semibold text-gray-800 mb-3 text-sm sm:text-base">🎨 Calendar Legend:</h4>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
      <!-- Available -->
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded"></div>
        <span class="text-xs text-gray-700">Available</span>
      </div>
      
      <!-- Selected -->
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-blue-300/80 to-indigo-400/80 dark:from-blue-600/80 dark:to-indigo-700/80 border-2 border-blue-400 dark:border-blue-500 rounded relative">
          <span class="absolute top-0 left-0 text-xs text-gray-800 dark:text-white">✨</span>
        </div>
        <span class="text-xs text-gray-700 dark:text-gray-300">Selected</span>
      </div>
      
      <!-- Limited -->
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-600 rounded opacity-90"></div>
        <span class="text-xs text-gray-700">Limited ⚠️</span>
      </div>
      
      <!-- Busy -->
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-red-200 to-red-400 border-2 border-red-500 rounded opacity-70"></div>
        <span class="text-xs text-gray-700">Busy 🔒</span>
      </div>
      
      <!-- Dragging -->
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-br from-purple-200 to-pink-200 border-2 border-purple-300 rounded"></div>
        <span class="text-xs text-gray-700">Dragging 🎯</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple legend component - no props or logic needed
</script>

<style scoped>
/* No additional styles needed - using Tailwind classes */
</style>
