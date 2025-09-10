<template>
  <div class="time-axis">
    <div class="time-cell placeholder"></div>
    <div 
      v-for="(time, index) in timeSlots" 
      :key="index" 
      :class="['time-cell', time.endsWith('00') ? 'hour' : '']"
    >
      {{ time.endsWith('00') ? time : '' }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  timeSlots: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.time-axis {
  display: flex;
  height: 50px;
  margin-bottom: 10px;
  position: sticky;
  left: 0;
}
.time-cell {
  min-width: 40px;
  text-align: center;
  border-right: 1px solid #ebeef5;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-cell.hour {
  background-color: #f5f7fa;
  font-weight: bold;
}
.time-cell.placeholder {
  min-width: 120px;
  background-color: #f5f7fa;
}
</style>