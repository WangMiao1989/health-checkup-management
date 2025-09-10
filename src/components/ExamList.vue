<template>
  <div class="exams-container">
    <h3>检查项目</h3>
    <div class="exam-list">
      <div 
        v-for="exam in examTypes" 
        :key="exam.id" 
        class="exam-to-add" 
        draggable="true"
        @dragstart="startDrag($event, exam)"
      >
        {{ exam.name }} ({{ exam.duration }}分钟)
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['exam-drag-start'])

const props = defineProps({
  examTypes: {
    type: Array,
    required: true
  }
})

const startDrag = (event, exam) => {
  event.dataTransfer.setData('examData', JSON.stringify(exam))
  emit('exam-drag-start', exam)
}
</script>

<style scoped>
.exams-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.exam-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.exam-to-add {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: move;
  border: 1px dashed #dcdfe6;
}
.exam-to-add:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
}
</style>