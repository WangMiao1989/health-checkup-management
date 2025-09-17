<template>
  <div class="page-container">
    <div style="text-align: left;">
      <el-button type="success" @click="gotoCreateCourse"><el-icon><plus /></el-icon>コース追加へ</el-button>
    </div>
    <div class="context-container">
      <div class="table-container">
        <div class="table-header">
          <span class="title">コース健診項目</span>
          <div v-if="!openAddAreaFlag"><el-button style="width:100px" type="primary" @click="openAddArea"><el-icon><plus /></el-icon>追加</el-button></div>
        </div>
        <div v-if="openAddAreaFlag" class="add-item-area">
          <el-dropdown style="width:100" v-model="examItem.category">
            <el-button>種別 <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>常规检查</el-dropdown-item>
                <el-dropdown-item>影像检查</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-input style="width:250px" v-model="examItem.name" placeholder="健診項目名称"></el-input>
          <el-time-select style="width:150px" format="HH:mm" start="00:00" end="23:55" step="00:05" v-model="examItem.duration" placeholder="健診時間" />
          <el-input style="width:100px" v-model="examItem.price" placeholder="単価"></el-input>
          <el-color-picker style="width:50px" v-model="examItem.color"><span :style="{background:addExam.color}">{{addExam.name}}</span></el-color-picker>
          <el-button style="width:100px" type="success" @click="addExamItem">確定</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >

          <el-table-column prop="item" label="健診項目" width="300">
            <template #edit="scope">
              <el-input
                v-model="scope.row.item"
                size="small"
                @blur="cancelEdit(scope.$index)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="item" label="健診時間" width="100">
            <template #default="scope">
              {{scope.row.duration}}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="単価" width="100">
            <template #edit="scope">
              <el-input-number
                v-model="scope.row.price"
                size="small"
                :min="0"
                :precision="2"
                @blur="cancelEdit(scope.$index)"
              />
            </template>
            <template #default="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="イメージ" width="150">
            <template #default="scope">
              <div class="image-box">{{scope.row.item}}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
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

    <div class="context-container">
      <div class="table-container">
        <div class="table-header">
          <span class="title">オプション健診項目</span>
          <div v-if="!openAddAreaFlag"><el-button style="width:100px" type="primary" @click="openAddArea"><el-icon><plus /></el-icon>追加</el-button></div>
        </div>
        <div v-if="openAddAreaFlag" class="add-item-area">
          <el-dropdown style="width:100" v-model="examItem.category">
            <el-button>種別 <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>常规检查</el-dropdown-item>
                <el-dropdown-item>影像检查</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-input style="width:250px" v-model="examItem.name" placeholder="健診項目名称"></el-input>
          <el-time-select style="width:150px" format="HH:mm" start="00:00" end="23:55" step="00:05" v-model="examItem.duration" placeholder="健診時間" />
          <el-input style="width:100px" v-model="examItem.price" placeholder="単価"></el-input>
          <el-color-picker style="width:50px" v-model="examItem.color"><span :style="{background:addExam.color}">{{addExam.name}}</span></el-color-picker>
          <el-button style="width:100px" type="success" @click="addExamItem">確定</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >

          <el-table-column prop="item" label="健診項目" width="300">
            <template #edit="scope">
              <el-input
                v-model="scope.row.item"
                size="small"
                @blur="cancelEdit(scope.$index)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="item" label="健診時間" width="100">
            <template #default="scope">
              {{scope.row.duration}}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="単価" width="100">
            <template #edit="scope">
              <el-input-number
                v-model="scope.row.price"
                size="small"
                :min="0"
                :precision="2"
                @blur="cancelEdit(scope.$index)"
              />
            </template>
            <template #default="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="イメージ" width="150">
            <template #default="scope">
              <div class="image-box">{{scope.row.item}}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
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

    <div class="context-container">
      <div class="table-container">
        <div class="table-header">
          <span class="title">共通項目</span>
          <div v-if="!openAddAreaFlag"><el-button style="width:100px" type="primary" @click="openAddArea"><el-icon><plus /></el-icon>追加</el-button></div>
        </div>
        <div v-if="openAddAreaFlag" class="add-item-area">
          <el-dropdown style="width:100" v-model="examItem.category">
            <el-button>種別 <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>常规检查</el-dropdown-item>
                <el-dropdown-item>影像检查</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-input style="width:250px" v-model="examItem.name" placeholder="健診項目名称"></el-input>
          <el-time-select style="width:150px" format="HH:mm" start="00:00" end="23:55" step="00:05" v-model="examItem.duration" placeholder="健診時間" />
          <el-input style="width:100px" v-model="examItem.price" placeholder="単価"></el-input>
          <el-color-picker style="width:50px" v-model="examItem.color"><span :style="{background:addExam.color}">{{addExam.name}}</span></el-color-picker>
          <el-button style="width:100px" type="success" @click="addExamItem">確定</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >

          <el-table-column prop="item" label="健診項目" width="300">
            <template #edit="scope">
              <el-input
                v-model="scope.row.item"
                size="small"
                @blur="cancelEdit(scope.$index)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="item" label="健診時間" width="100">
            <template #default="scope">
              {{scope.row.duration}}
            </template>
          </el-table-column>

          <el-table-column prop="price" label="単価" width="100">
            <template #default="">
              -
            </template>
          </el-table-column>

          <el-table-column prop="price" label="イメージ" width="150">
            <template #default="scope">
              <div class="image-box">{{scope.row.item}}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const examItem = ref({
  type: null,
  category: null,
  name: null,
  duration: null,
  price: null,
  color: null
});

const openAddAreaFlag = ref(false);

const openAddArea = () => {
  openAddAreaFlag.value = !openAddAreaFlag.value;
}

// 表格数据
const tableData = ref([
  {
    category: '常规检查',
    item: '血液検査',
    duration: '30分',
    price: 35.50
  },
  {
    category: '常规检查',
    item: '尿検査',
    duration: '15分',
    price: 20.00
  },
  {
    category: '影像检查',
    item: 'PET-CT',
    duration: '1時間30分',
    price: 320.00
  }
])

const addExamItem = () => {
  console.log(examItem.value)
  openAddAreaFlag.value = false;
}

// 删除行
const handleDelete = (index) => {
  tableData.value.splice(index, 1)
}

const gotoCreateCourse = () => {
  router.push('course-manage');
}
</script>