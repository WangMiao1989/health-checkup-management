<template>
  <div class="health-checkup-container">
    <!-- 头部标题区 -->
    <div class="health-checkup-header">
      <div class="system-title">健診フロー作成</div>
    </div>
    
    <!-- 検索エリア-->
    <div class="search-area">
      <div class="left-group">
        <el-date-picker
          v-model="searchDate"
          type="date"
          style="width:150px"
          placeholder="日付を選択">
        </el-date-picker>
        <el-input v-model="searchName" placeholder="名前を検索" style="width:150px"></el-input>
        <el-button type="primary">検索</el-button>
      </div>
      <div class="right-group">
        <el-button type="success">保存</el-button>
        <el-button type="danger">リセット</el-button>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="health-checkup-main">
      <div class="schedule-container">
        <div class="schedule-content">
          <div class="timeline">
            <div class="patient-name">患者姓名</div>
            <div 
              v-for="(slot, index) in timeSlots" 
              :key="index"
              class="time-slot"
              :class="{ hour: slot.time.endsWith(':00') }"
            >
              {{ slot.display }}
            </div>
          </div>
          
          <div 
            v-for="patient in patients" 
            :key="patient.id"
            class="patient-row"
          >
            <div class="patient-name" @click="selectPatient(patient)">{{ patient.name }}</div>
            <div class="time-slots" :class="!selectedPatient ? '' : (selectedPatient.id == patient.id ? 'row-selected' : 'row-unselected')">
              <div 
                v-for="(slot, index) in timeSlots" 
                :key="index"
                :class="'slot slot_'+index"
                @drop="onDrop(patient.id, $event)"
                @dragover.prevent
                @dragenter.prevent
                @dragleave.prevent
              >
                <draggable
                  :list="getFlowInSlot(patient, index)"
                  :group="{ name: 'exams', pull: true, put: false }"
                  item-key="id"
                  class="empty-slot"
                  @start="handleDragStart"  
                  @end="handleDragEnd"
                >
                  <template #item="{ element }">
                    <div 
                      class="exam-block" 
                      :class="element.code"
                      :style="{ width: (element.duration * SLOT_WIDTH - 4) + 'px',display: element.hidden ? 'none' : '' }"
                      @dblclick="removeExam(patient.id, element.id)"
                    >
                      {{ element.name }}
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="health-checkup-stats">
      <h3>共通健診項目</h3>
      <!-- 检查项目列表 -->
      <div class="exam-list">
        <draggable 
          :list="commonExams" 
          :group="{ name: 'exams', pull: 'clone', put: false }"
          item-key="id"
          class="common-exam-area"
          @start="handleDragStart"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div 
              class="common-exam" 
              :class="element.code">
              {{ element.name }} <br /> {{ element.duration * UNIT_MINUTES }}分
            </div>
          </template>
        </draggable>
      </div>

      <h3 v-if="selectedPatient">{{selectedPatient.name}}様の健診項目</h3>
      <div class="exam-list">
        <draggable 
          :list="getExamByPatient()"
          :group="{ name: 'exams', pull: 'clone', put: false }"
          item-key="id"
          class="common-exam-area"
          @start="handleDragStart"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div 
              class="common-exam" 
              :class="element.code">
              {{ element.name }} <br /> {{ element.duration * UNIT_MINUTES }}分
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 统计信息区 -->
    <div class="health-checkup-stats" style="display: none;">
      <h3>统计信息</h3>
      <div class="stats-content">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalExams }}</div>
          <div class="stat-label">总检查项目</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalDuration }}</div>
          <div class="stat-label">总检查时长</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.avgExams }}</div>
          <div class="stat-label">人均检查数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'; 
import './HealthCheckupFlow.css';

// 時間軸の開始時
const START_HOUR = 7;
// 時間軸の終了時
const END_HOUR = 18;
// 時間軸の分単位
const UNIT_MINUTES = 5;
// 総Slot数
const TOTAL_SLOTS = (END_HOUR - START_HOUR)*(60/UNIT_MINUTES) + 1;
// oneセルの幅
const SLOT_WIDTH = 30;

// timeSlot生成
const timeSlots = ref([])
for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
  for (let min = 0; min < 60; min += UNIT_MINUTES) {
    const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    timeSlots.value.push({
      time,
      display: min === 0 ? `${hour.toString().padStart(2, '0')}` : `${min.toString().padStart(2, '0')}`
    })
    if (hour == END_HOUR) break;
  }
}

// 2. 患者数据
const patients = ref([
  { id: 1, name: '小林　太郎', flow: [] , exams: [
    { name: '超音波（乳腺）', code: 'blood-test', duration: 4 }
    ,{ name: '内視鏡前処置（個室）', code: 'x-ray', duration: 36 }
    ,{ name: '前処置＠内視鏡室', code: 'mri', duration: 2 }
    ,{ name: '上下内視鏡(鎮静下)', code: 'ultrasound', duration: 8 }]
  },
  { id: 2, name: '加藤　花子', flow: [] , exams: [
    { name: '聴力', code: 'blood-test', duration: 2 }
    ,{ name: '内視鏡前処置（個室）', code: 'x-ray', duration: 36 }
    ,{ name: '胸部CT', code: 'mri', duration: 2 }
    ,{ name: '上下内視鏡(鎮静下)', code: 'ultrasound', duration: 8 }
    ,{ name: 'リカバリー', code: 'blood-test', duration: 6 }
    ,{ name: 'PET-CT', code: 'blood-test', duration: 18 }]},
  { id: 3, name: '竹下　彩', flow: [] , exams: [
    { name: '超音波（乳腺）', code: 'blood-test', duration: 4 }
    ,{ name: '頸動脈', code: 'x-ray', duration: 6 }
    ,{ name: 'リカバリー', code: 'blood-test', duration: 6 }]},
  { id: 4, name: '山下　卓也', flow: [] , exams: [
    { name: '眼科検査', code: 'blood-test', duration: 2 }
    ,{ name: '前処置＠内視鏡室', code: 'mri', duration: 2 }
    ,{ name: '上下内視鏡(鎮静下)', code: 'ultrasound', duration: 8 }
    ,{ name: 'リカバリー', code: 'blood-test', duration: 6 }
    ,{ name: 'MRI（頭部）', code: 'blood-test', duration: 5 }]},
  { id: 5, name: '山田　健司', flow: [] , exams: [
    { name: '骨密度', code: 'blood-test', duration: 3 }
    ,{ name: '内視鏡前処置（個室）', code: 'x-ray', duration: 36 }
    ,{ name: '前処置＠内視鏡室', code: 'mri', duration: 2 }
    ,{ name: '上下内視鏡(鎮静下)', code: 'ultrasound', duration: 8 }]},
])

// 3. 检查项目数据
const commonExams = ref([
  { name: '案内', code: 'blood-test', duration: 2 },
  { name: '移動', code: 'x-ray', duration: 1 },
  { name: '待機', code: 'mri', duration: 2 },
  { name: '翌日説明', code: 'ultrasound', duration: 2 },
  { name: '結果説明', code: 'ecg', duration: 3 },
  { name: '帰り支度', code: 'urine-test', duration: 2 }
])

// 移動中項目
const draggingExam = ref(null) 
const selectedPatient = ref(null)

const searchDate = ref(new Date());
const searchName = ref(null);

// drag start
const handleDragStart = (event) => {
  const exam = event.item.__draggable_context?.element
  if (exam) {
    draggingExam.value = exam;
    exam.hidden = true;
  }
}

// drag end
const handleDragEnd = () => {
  setTimeout(() => {
    draggingExam.value = null
  }, 100)
}

// 放置
const onDrop = (patientId, event) => {

  // 患者行取得
  const timeSlotsContainer = event.currentTarget.closest('.time-slots');
  if (!timeSlotsContainer) return;
  
  // 患者行のoffset
  const containerRect = timeSlotsContainer.getBoundingClientRect();

  // セルのleft
  const scrollLeft = timeSlotsContainer.scrollLeft;
  
  // フォーカスoffset.left - 患者行.left
  const mouseX = event.clientX - containerRect.left + scrollLeft;
  
  // index計算
  const slotIndex = Math.min(Math.floor(mouseX / SLOT_WIDTH), timeSlots.value.length - 1);

  if(draggingExam) {

    // flowから移動する場合
    if(draggingExam.value.id){
      // 移動前健診項目を削除
      removeExam(draggingExam.value.patientId, draggingExam.value.id);
    }
    // 移動後健診項目を削除
    addExam(patientId, slotIndex, draggingExam.value);  
  }
}

// 項目削除
const removeExam = (patientId, examId) => {
  const patient = patients.value.find(p => p.id === patientId)
  if (!patient) return

  const examIndex = patient.flow.findIndex(e => e.id === examId)
  if (examIndex !== -1) {
    patient.flow.splice(examIndex, 1)
  }
}

// 項目作成
const addExam = (patientId, slotIndex, exam) => {
  const patient = patients.value.find(p => p.id === patientId)
  const isTimeValid = slotIndex >= 0 && slotIndex <= timeSlots.value.length - exam.duration

  if (!patient || !isTimeValid) return

  let newExam = {...exam,
    id : new Date().getTime(),
    patientId,
    startTime : slotIndex,
    endTime : slotIndex + exam.duration - 1,
    hidden : false
  }

  // コンフリクト解決
  if(!resolveConflict(newExam)){
    alert('空き時間がたりない！！！');
    return;
  }
  
  // 項目追加
  patient.flow.push(newExam);
}

// コンフリクトリスト取得
const resolveConflict = (exam) => {
  const patient = patients.value.find(p => p.id === exam.patientId)
  const flow = patient.flow;

  // 昇順ソート
  flow.sort((a, b) => a.endTime - b.endTime);

  // 追加健診により、前後リストを分割
  const beforeList = flow.filter(i => i.startTime < exam.startTime);
  const afterList =  flow.filter(i => i.startTime >= exam.startTime);

  // 前に移動処理
  if(beforeList != 0){
    let lastExam = beforeList[beforeList.length - 1];
    // 前リストに被りがある場合
    if(lastExam.endTime >= exam.startTime){
      // 前に移動offset
      let beforeOffset = lastExam.endTime - exam.startTime + 1;
      // 総slot数
      let totalSlotCnt = lastExam.endTime + 1;
      // 利用済slot数
      let usedSlotCnt = beforeList.reduce((total, cur) => { return total + cur.duration }, 0);
      // 空きslot数
      let enableSlotCnt = totalSlotCnt - usedSlotCnt;
      if(enableSlotCnt < beforeOffset){
        return false;
      }

      // 前の移動処理
      for(let i = lastExam.startTime; i >= 0; i--){
        let existExam = getExistExam(beforeList, i);
        if(existExam){
          i = existExam.startTime;
          continue;
        } else {
          beforeOffset--;
          beforeList.filter( f => f.startTime > i).forEach( e => {e.startTime--; e.endTime--;});
        }

        // 移動完了
        if(beforeOffset == 0) break;
      }
    }
  }

  // 後ろに移動処理
  if(afterList.length != 0){
    let firstExam = afterList[0];
    // 後ろリストに被りがある場合
    if(firstExam.startTime <= exam.endTime){
      // 後ろに移動offset
      let afterOffset = exam.endTime - firstExam.startTime + 1;
      // 総slot数
      let totalSlotCnt = TOTAL_SLOTS - exam.startTime;
      // 利用済slot数
      let usedSlotCnt = afterList.reduce((total, cur) => { return total + cur.duration }, 0);
      // 空きslot数
      let enableSlotCnt = totalSlotCnt - usedSlotCnt;
      if(enableSlotCnt < afterOffset){
        return false;
      }

      // 後ろの移動処理
      for(let i = firstExam.endTime; i <= TOTAL_SLOTS; i++){
        let existExam = getExistExam(afterList, i);
        console.log(i,existExam)
        if(existExam){
          i = existExam.endTime;
          continue;
        } else {
          afterOffset--;
          afterList.filter( f => f.endTime < i).forEach( e => {e.startTime++; e.endTime++;});
        }

        // 移動完了
        if(afterOffset == 0) break;
      }
    }
  }
  return true;
}

// listにindexの項目を返す
const getExistExam = (list, index) => {
  return list.find( exam => exam.startTime <= index && exam.endTime >= index);
}

// 7. 统计信息计算
const stats = computed(() => {
  let totalExams = 0
  let totalDuration = 0

  patients.value.forEach(patient => {
    totalExams += patient.flow.length
    patient.flow.forEach(exam => {
      totalDuration += exam.duration * 10 // 10分钟/单位
    })
  })

  return {
    totalExams,
    totalDuration: `${Math.floor(totalDuration / 60)}小时${totalDuration % 60}分钟`,
    avgExams: (totalExams / patients.value.length).toFixed(1)
  }
})

const selectPatient = (patient) => {
  if(selectedPatient.value && selectedPatient.value.id == patient.id ){
    selectedPatient.value = null;
  }else{
    selectedPatient.value = patient;
  }
}

const getFlowInSlot = (patient, slotIndex) => {
  return patient.flow.filter(exam => exam.startTime === slotIndex);
}

const getExamByPatient = () => {
  if(!selectedPatient.value) return [];
  return patients.value.find(p => p.id === selectedPatient.value.id).exams;
}
</script>