<template>
  <div id="app">
    <el-menu
        :default-active="activeRoute"
        @select="handleMenuSelect"
        mode="horizontal"
    >
        <el-menu-item index="/">フロー作成</el-menu-item>
        <el-menu-item index="/patient-manage">患者健診管理</el-menu-item>
        <el-menu-item index="/exam-item-manage">健診項目管理</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';
import './assets/styles/global.css'

const router = useRouter();
const activeRoute = ref('/');

const handleMenuSelect = (index) => {
    router.push(index);
    activeRoute.value = index;
};
</script>