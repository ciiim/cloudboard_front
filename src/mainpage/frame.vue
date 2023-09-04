<template>
    <el-container>
        <el-header></el-header>
    <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
            <Sidebar ref="sideBarRef"></sidebar>
        </el-aside>
        <el-main>
            <Files :now-board="nowBoard"></Files>
        </el-main>
    </el-container>
    </el-container>
</template>

<script setup lang="ts">
import {ref, onMounted, watchEffect} from 'vue';

import Sidebar from '@/components/mainpage/sidebar.vue';
import Files from '@/components/mainpage/files.vue';
const isCollapse = ref(false);
const sideBarRef = ref();
const nowBoard = ref();

watchEffect(() => {
    nowBoard.value = sideBarRef.value?.nowBoard;
});

</script>