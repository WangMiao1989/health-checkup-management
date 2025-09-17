<template>
  <div class="page-container">
    <div class="search-area">
      <div class="left-group">
        <el-button type="primary" icon="plus" @click="addCourse">追加</el-button>
        <el-button type="success" @click="addCourse">コース保存</el-button>
      </div>
    </div>

    <div class="context-container">
      <div class="table-container">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column prop="item" label="健診項目" width="200" />

          <el-table-column prop="duration" label="健診時間" width="100" align="right" />

          <el-table-column prop="price" label="単価" width="100" align="right">
            <template #default="scope">
              {{ scope.row.id && scope.row.price + '円' }}
            </template>
          </el-table-column>

          <el-table-column
            v-for="course in courseData"
            :key="course.id"
            :label="course.name"
            align="center"
            width="100"
          >
            <template #default="scope">
              <div @click="changeCourse(course.id, scope.row.id)">
                {{ scope.row.id ? (course.exams.includes(scope.row.id) ? '〇' : '-') : getTotalAmount(course)}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const courseData = ref([{
  id: 1,
  name: '２日コース(男性)',
  exams: ['2']
},{
  id: 2,
  name: '２日コース(女性)',
  exams: ['1','2']
}]);

// 表格数据
const tableData = ref([
  {
    id: '1',
    category: '常规检查',
    item: '身体測定',
    duration: '20分',
    price: '3,500'
  },
  {
    id: '2',
    category: '常规检查',
    item: '血液検査',
    duration: '30分',
    price: '4,000'
  },
  {
    id: '3',
    category: '常规检查',
    item: '尿検査',
    duration: '15分',
    price: '12,000'
  },
  {
    id: '4',
    category: '影像检查',
    item: 'PET-CT',
    duration: '1時間30分',
    price: '22,000'
  },
  {
    id: '5',
    category: '影像检查',
    item: '眼科検査',
    duration: '2時間',
    price: '8,000'
  },
  {
    id: '6',
    category: '影像检查',
    item: '聴力検査',
    duration: '3時間30分',
    price: '5,000'
  },
  {
    id: '7',
    category: '影像检查',
    item: '口腔機能検査',
    duration: '15分',
    price: '2,000'
  },
  {
    id: '8',
    category: '影像检查',
    item: '内視鏡検査',
    duration: '1時間30分',
    price: '32,000'
  },
  {
    id: null,
    category: '影像检查',
    item: '健診料金（税込）',
    duration: '',
    price: ''
  }
])

const addCourse = () => {
  let course = {
    id: new Date().getTime(),
    name: 'コース名称',
    exams: []
  }
  courseData.value.push(course);
}

const changeCourse = (courseId, itemId) => {
  const courseArry = courseData.value.find(c => courseId == c.id)?.exams;
  let index = courseArry.indexOf(itemId);
  if(index > -1){
    courseArry.splice(index, 1);
  }else{
    courseArry.push(itemId);
  } 
}

const getTotalAmount = (course) => {
  let total = 0;
  course.exams.forEach(e => {
    let priceStr = tableData.value.find( i => i.id == e)?.price;
    let price = priceStr.replace('円','').replaceAll(',','');
    total += Number(price);
  });
  return total + '円';
}
</script>