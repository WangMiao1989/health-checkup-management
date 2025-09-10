<template>
  <div class="schedule-grid">
    <div 
      v-for="patient in patients" 
      :key="patient.id" 
      class="patient-row"
    >
      <div class="patient-info">
        {{ patient.name }}
      </div>
      <div 
        v-for="(time, index) in timeSlots" 
        :key="index" 
        class="time-slot"
        @drop="handleDrop($event, patient.id, time)" 
        @dragover="allowDrop($event)"
      >
        <!-- 使用v-for和条件判断确保exam存在 -->
        <template v-if="scheduledExams && scheduledExams[patient.id]">
          <div 
            v-for="exam in scheduledExams[patient.id]" 
            :key="exam.id"
            v-show="exam && exam.startTime === time"
            class="exam-item" 
            :style="{ 
              width: (exam.duration / 10 * 40 - 2) + 'px', 
              backgroundColor: exam.color,
              left: '1px',
              height: '54px'
            }"
            draggable="true"
            @dragstart="startScheduledDrag($event, exam, patient.id)"
            @drop="handleScheduledDrop($event, patient.id, time)"
            @dragover="allowDrop($event)"
          >
            {{ exam.name }} ({{ exam.startTime }})
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const emit = defineEmits(['add-exam', 'move-exam'])

const props = defineProps({
  patients: {
    type: Array,
    required: true,
    default: () => []
  },
  timeSlots: {
    type: Array,
    required: true,
    default: () => []
  },
  scheduledExams: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 确保数据正确初始化
onMounted(() => {
  console.log('ScheduleGrid mounted with exams:', props.scheduledExams)
})

const allowDrop = (event) => {
  event.preventDefault()
}

const handleDrop = (event, patientId, time) => {
  event.preventDefault()
  try {
    const examData = JSON.parse(event.dataTransfer.getData('examData'))
    if (examData && examData.name) {
      emit('add-exam', { examData, patientId, time })
    }
  } catch (e) {
    console.error('解析拖拽数据失败:', e)
  }
}

const startScheduledDrag = (event, exam, patientId) => {
  if (exam && exam.id) {
    event.dataTransfer.setData('scheduledExamData', JSON.stringify({
      exam: exam,
      patientId: patientId
    }))
  }
}

const handleScheduledDrop = (event, patientId, time) => {
  event.preventDefault()
  try {
    const data = JSON.parse(event.dataTransfer.getData('scheduledExamData'))
    if (data && data.exam && data.exam.id) {
      emit('move-exam', { exam: data.exam, patientId, time })
    }
  } catch (e) {
    console.error('解析拖拽数据失败:', e)
  }
}
</script>

<style scoped>
.schedule-grid {
  width: 100%;
}
.patient-row {
  display: flex;
  height: 60px;
  margin-bottom: 10px;
  position: relative;
}
.patient-info {
  min-width: 120px;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-right: 1px solid #ebeef5;
}
.time-slot {
  min-width: 40px;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  position: relative;
}
.exam-item {
  position: absolute;
  color: white;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 12px;
  cursor: move;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
}
.exam-item:hover {
  opacity: 0.9;
}
</style>