<style>
.board {
  margin: 10px;
  border: 2px solid #ebeef5;
  border-radius: 5px;
}
</style>

<template>
  <el-menu :collapse="props.isCollapse">
    <!-- 循环 -->
    <el-menu-item v-for="board in boardList" :index="board.space" class="board" @click="setNowBoard(board)">
      <template #title>
        <div>
          <el-icon><Files /></el-icon>
          <span slot="title">{{ board.space_nickname }}</span>
        </div>
      </template>
    </el-menu-item>
    <!-- 循环结束 -->
    <el-menu-item index="newBoard" @click="newBoard">
      <template #title>
        <el-icon><CirclePlus /></el-icon>
        <span slot="title">新建板</span>
      </template>
    </el-menu-item>
  </el-menu>
  <el-dialog
    title="新建板"
    v-model="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form
      :model="newBoardform"
      :rules="newBoardrules"
      ref="newBoardFormRef"
      label-position="left"
      hide-required-asterisk
    >
      <el-form-item label="板名" prop="name">
        <el-input v-model="newBoardform.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="newBoardform.password"></el-input>
      </el-form-item>
      <el-form-item label="可见性" prop="visible">
        <el-select
          v-model="newBoardform.visible"
          placeholder="请选择"
          label="可见性"
        >
          <el-option label="公开" value="0"></el-option>
          <el-option label="私密" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="置顶" prop="pinned">
        <el-checkbox v-model="newBoardform.pinned"></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitNewBoardForm(newBoardFormRef)"
          >创建</el-button
        >
        <el-button
          @click="
            dialogVisible = false;
            newBoardFormRef?.resetFields();
          "
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { CirclePlus, Files } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import type { FormInstance } from "element-plus";
import { ref, onMounted } from "vue";
import jwt_decode from "jwt-decode";

const dialogVisible = ref(false);
const boardList = ref();
const props = defineProps(["isCollapse"]);
const nowBoard = ref();
defineExpose({ nowBoard });

const token = localStorage.getItem("token");

const decoded: any = jwt_decode(token!);
const uid = decoded.uid;

const newBoard = () => {
    dialogVisible.value = true;
};

const newBoardFormRef = ref<FormInstance>();

const newBoardform = ref({
    name: "",
    password: "",
    visible: undefined, // 0: public, 1: private
    pinned: 0, // 0: not pinned, 1: pinned
});

const newBoardrules = ref({
    name: [
        { required: true, message: "请输入板名", trigger: "blur" },
        { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
    ],
    visible: [{ required: true, message: "请选择可见性", trigger: "blur" }],
    pinned: [{ required: true, message: "请选择是否置顶", trigger: "blur" }],
});



const handleClose = (done: any) => {
  newBoardFormRef.value?.resetFields();
  done();
};

const submitNewBoardForm = (form: FormInstance | undefined) => {
  form?.validate((valid: boolean) => {
    if (valid) {
      axios.defaults.baseURL = "http://localhost:8080";
      axios({
        url: "/api/v1/board",
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          name: newBoardform.value.name,
          owner_uid: uid,
          passwd: newBoardform.value.password,
          visible: Number(newBoardform.value.visible),
          pinned: Number(newBoardform.value.pinned),
        },
      })
        .then((res: any) => {
          console.log(res.data);
          dialogVisible.value = false;
          newBoardFormRef.value?.resetFields();
        })
        .finally(() => {
          getBoardList();
        });
    } else {
      return false;
    }
  });
};

const checkAuth = (): boolean => {
  if (decoded.exp < Date.now() / 1000) {
    localStorage.removeItem("token");
    return false;
  } else {
    return true;
  }
};

const getBoardList = async () => {
  axios.defaults.baseURL = "http://localhost:8080";
  await axios({
    url: "/api/v1/board/list",
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
    params: {
      uid: uid,
    },
  })
    .then((res: any) => {
      boardList.value = res.data.data.boards;
    })
    .catch((err: any) => {
      console.log(err.response);
      ElMessage.error("获取板列表失败");
    });
};

const setNowBoard = (board: any) => {
  nowBoard.value = board
};

onMounted(() => {
  if (checkAuth()) {
    getBoardList();
  }
});
</script>
