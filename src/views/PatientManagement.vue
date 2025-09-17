<template>
  <div class="page-container">

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
        <el-button style="width:100px" type="primary"><el-icon><plus /></el-icon>追加</el-button>
      </div>
    </div>

    <div class="context-container">
      <el-table
        :data="tableData" border style="width: 100%"
      >
        <el-table-column prop="name" label="氏名" align="center" />

        <el-table-column prop="examDay" label="予約日" align="center" />

        <el-table-column prop="birthday" label="生年月日" align="center" />

        <el-table-column prop="sex" label="性別" align="center" />

        <el-table-column prop="mail" label="メール" align="center" />

        <el-table-column prop="examItems" label="健診項目" align="left" />

        <el-table-column prop="durationTotal" label="健診総時間" align="center" />

        <el-table-column prop="amount" label="健診料金（税込）" align="right" />

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              icon="Delete"
              @click="handleDelete(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 表格数据
const tableData = ref([
  {
    id: '1',
    name: '小林　太郎',
    birthday: '2000年12月31日（25歳）',
    sex: '男性',
    examDay: '2025-10-10',
    mail: 'xxxx@gmail.com',
    examItems: '血圧、BMI検査、血液検査、口腔機能検査',
    durationTotal: '1時間30分',
    amount: '98,000円'
  },
  {
    id: '2',
    name: '加藤　花子',
    birthday: '2001年06月27日（24歳）',
    sex: '男性',
    examDay: '2025-10-09',
    mail: 'xxxx@gmail.com',
    examItems: 'MRA検査、血液検査',
    durationTotal: '6時間30分',
    amount: '128,000円'
  },
  {
    id: '3',
    name: '竹下　彩',
    birthday: '2005年10月10日（20歳）',
    sex: '女性',
    examDay: '2025-10-13',
    mail: 'xxxx@gmail.com',
    examItems: '血圧、BMI検査、内視鏡検査',
    durationTotal: '15時間30分',
    amount: '198,000円'
  },
  {
    id: '4',
    name: '山田　健司',
    birthday: '1995年10月10日（30歳）',
    sex: '男性',
    examDay: '2025-09-30',
    mail: 'xxxx@gmail.com',
    examItems: '血圧、BMI検査、血液検査',
    durationTotal: '3時間30分',
    amount: '298,000円'
  }

])

const searchDate = ref(new Date());
const searchName = ref(null);

// 删除行
const handleDelete = (index) => {
  tableData.value.splice(index, 1)
}
</script>