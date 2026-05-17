<template>
  <div class="admin-calendar-page">
    <div class="container mx-auto p-6">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">📅 Admin Calendar</h1>
            <p class="text-gray-600">Manage job scheduling and team assignments</p>
          </div>
          <NuxtLink to="/admin" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            ← Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <AdminCalendar
          @date-range-selected="handleDateRangeSelected"
          @booking-added="handleBookingAdded"
          @all-bookings-cleared="handleAllBookingsCleared"
          @booking-removed="handleBookingRemoved"
          @proceed-to-checkout="handleCheckout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminCalendar from '~/components/admin/AdminCalendar.vue'

const bookingResult = ref(null)

// Handle date range selection from AdminCalendar
const handleDateRangeSelected = (dateRange) => {
  console.log('Admin calendar date range selected:', dateRange)
  bookingResult.value = `Selected ${dateRange.length} day${dateRange.length > 1 ? 's' : ''}: ${dateRange.map(d => d.toDateString()).join(' → ')}`
}

// Handle booking added to accumulation
const handleBookingAdded = (booking) => {
  console.log('Admin booking added:', booking)
  bookingResult.value = `Booking added: ${booking.dates.length} day${booking.dates.length > 1 ? 's' : ''} with ${booking.plumbers.length} plumber${booking.plumbers.length > 1 ? 's' : ''} - $${booking.totalCost.toLocaleString()}`
}

// Handle all bookings cleared
const handleAllBookingsCleared = () => {
  console.log('Admin all bookings cleared')
  bookingResult.value = 'All bookings have been cleared'
}

// Handle individual booking removed
const handleBookingRemoved = (bookingId) => {
  console.log('Admin booking removed:', bookingId)
  bookingResult.value = `Booking ${bookingId} has been removed`
}

// Handle checkout request
const handleCheckout = (checkoutData) => {
  console.log('Admin proceeding to checkout:', checkoutData)
  bookingResult.value = `Proceeding to checkout with ${checkoutData.bookings.length} bookings, total: $${checkoutData.totalCost}`
}

// Page metadata
definePageMeta({
  title: 'Admin Calendar - FlowPro Plumbing',
  description: 'Admin calendar for managing plumbing job scheduling and team assignments'
})
</script>

<style scoped>
.admin-calendar-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
