<template>
  <div class="admin-dashboard">
    <div class="container mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">🏢 Admin Dashboard</h1>
        <p class="text-gray-600">Manage bookings, teams, and scheduling</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900">Today's Jobs</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ todayJobsCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900">Active Plumbers</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ activePlumbersCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900">Pending Assignments</h3>
          <p class="text-3xl font-bold text-yellow-600 mt-2">{{ pendingAssignmentsCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900">Revenue Today</h3>
          <p class="text-3xl font-bold text-purple-600 mt-2">${{ todayRevenue.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">📅 Calendar Management</h2>
          <p class="text-gray-600 mb-4">View and manage job scheduling</p>
          <NuxtLink to="/admin/calendar" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Open Calendar
          </NuxtLink>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">👥 Team Management</h2>
          <p class="text-gray-600 mb-4">Manage plumber assignments and availability</p>
          <NuxtLink to="/dispatch" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Dispatch Board
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock data - replace with real data later
const todayJobsCount = ref(8)
const activePlumbersCount = ref(6)
const pendingAssignmentsCount = ref(3)
const todayRevenue = ref(2450)

// Page metadata
definePageMeta({
  title: 'Admin Dashboard - FlowPro Plumbing',
  description: 'Admin dashboard for managing plumbing business operations'
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
