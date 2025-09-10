<template>
  <div class="patients-container">
    <h3>患者列表</h3>
    <div class="patient-list">
      <div v-for="patient in patients" :key="patient.id" class="patient-card">
        {{ patient.name }} ({{ patient.gender }}, {{ patient.age }}岁)
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  patients: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.patients-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.patient-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.patient-card {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>