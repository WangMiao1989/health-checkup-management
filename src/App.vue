<template>
  <div id="app">
    <el-menu
        :default-active="activeRoute"
        @select="handleMenuSelect"
        mode="horizontal"
    >
        <el-menu-item index="/">フロー作成</el-menu-item>
        <el-menu-item index="/about">患者管理</el-menu-item>
        <el-menu-item index="/contact">健診項目管理</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import 'element-plus/dist/index.css';

const router = useRouter();
const activeRoute = ref('/');

const handleMenuSelect = (index) => {
    router.push(index);
    activeRoute.value = index;
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Meiryo UI', sans-serif;
}
body {
  padding: 0 10px 10px 10px;
  background-color: #f5f7fa;
}
</style>