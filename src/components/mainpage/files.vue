<template>
  <div v-if="nowBoard !== undefined">
    <Upload
      :info="{ space: nowBoard.space, base: nowBaseDir + '/' + nowDir }"
    ></Upload>
    <el-button @click="backPrev">返回</el-button>
    <el-button @click="newFolder">新建文件夹</el-button>
    <el-button>上传文件</el-button>
    <el-table :data="boardSub">
      <el-table-column prop="name" label="文件名">
        <template #default="scope">
          <el-text
            v-if="scope.row.editing == true"
            type="primary"
            :underline="false"
          >
            <el-input
              ref="nowInput"
              v-model="scope.row.name"
              size="small"
              clearable
              @change="setNewName(scope.row)"
              @blur="leaveInput(scope.row)"
            ></el-input>
          </el-text>
          <el-link
            v-else
            type="primary"
            :underline="false"
            @click="openFolder(scope.row)"
            >{{ scope.row.name }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="is_dir" label="类型"></el-table-column>
      <el-table-column prop="size" label="大小"></el-table-column>
      <el-table-column prop="mod_time" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            v-if="scope.row.file_type !== 'dir'"
            link
            type="primary"
            size="small"
            @click="downloadFile(scope.row)"
            >下载</el-button
          >
          <el-button link type="primary" size="small">重命名</el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteFile(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import axios from "axios";
import { ElMessage,ElMessageBox } from "element-plus";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import { preDownload } from "@/components/mainpage/download";

const props = defineProps(["nowBoard"]);
const nowBaseDir = ref("");
const nowDir = ref("");

interface BoardSubItem {
  name: string;
  size: string;
  file_type: string;
  mod_time: string;
  editing?: boolean;
}

const nowBoard = computed(() => {
  return props.nowBoard;
});
const boardSub = ref<BoardSubItem[]>([]);

watch(nowBoard, () => {
  if (nowBoard !== undefined) {
    nowBaseDir.value = "";
    nowDir.value = "";
    getBoardSub();
  }
});

const nowInput = ref();

const getFocus = () => {
  nextTick(() => {
    nowInput.value?.focus();
  });
};

const backPrev = () => {
  if (nowDir.value == "" || nowDir.value == "/") {
    return;
  }
  var temp = nowBaseDir.value;
  nowBaseDir.value = temp.substring(0, temp.lastIndexOf("/"));
  nowDir.value = temp.substring(temp.lastIndexOf("/") + 1);
  getBoardSub();
};

const newFolder = () => {
  boardSub.value.push({
    name: "",
    size: "",
    file_type: "dir",
    mod_time: "",
    editing: true,
  });
  getFocus();
};

const leaveInput = (row: any) => {
  if (row.name == "") {
    //删除
    boardSub.value.splice(boardSub.value.indexOf(row), 1);
    return;
  }
};

const setNewName = (row: any) => {
  console.log(row);
  row.editing = false;
  newFolderA(row.name);
};

const openFolder = (row: any) => {
  if (row.file_type !== "dir") {
    return;
  }
  if (nowDir.value !== "") {
    nowBaseDir.value = nowBaseDir.value + "/" + nowDir.value;
  }
  nowDir.value = row.name;
  getBoardSub();
};

const downloadFile = async (row: any) => {
  if (row.file_type === "dir") {
    return;
  }

  let { downloadID, chunkNum } = await preDownload({
    name: row.name,
    space: nowBoard.value.space,
    baseDir: nowBaseDir.value + "/" + nowDir.value,
  });

  if (downloadID === "") {
    return;
  }
  const slicePromises = Array.from({ length: chunkNum }, (_, i) =>
  downloadFileGet(downloadID,i)
      );
  const blobArray = await Promise.all(slicePromises);
  const blob = new Blob(blobArray);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = row.name;
  link.click()
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
  downloadDone(downloadID);
};

const deleteFile = async (row: any) => {
  await deleteFileRequest(
    nowBoard.value.space,
    nowBaseDir.value + "/" + nowDir.value,
    row.name + ".meta"
  );
  getBoardSub()
};

const formatBytes = (byteString: string): string => {
  const bytes = parseInt(byteString, 10);
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

//api field

const deleteFileRequest = async (
  space: string,
  base: string,
  fileName: string
) => {
  axios.defaults.baseURL = "http://localhost:8080";
  await axios({
    url: "/api/v1/board/f",
    method: "delete",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: {
      space: space,
      baseDir: base,
      fileName: fileName,
    },
  })
    .then((res: any) => {
      if (!res.data.success) {
        ElMessage.error(res.data.msg);
      }
    })
    .catch((err: any) => {
      ElMessage.error(err.response.data.msg);
    });
};

const downloadFileGet = async (downloadID: string,chunkIndex:number): Promise<any> => {
  axios.defaults.baseURL = "http://localhost:8080";
  let response = await axios({
    url: "/api/v1/board/download",
    responseType: "blob",
    method: "get",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params:{
      downloadID:downloadID,
      chunkIndex:chunkIndex
    }
  });
  return response.data;
};

const downloadDone = async (downloadID: string) => {
  axios.defaults.baseURL = "http://localhost:8080";
  await axios({
    url: "/api/v1/board/download-done",
    method: "post",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: {
      downloadID: downloadID,
    },
  })
    .then((res: any) => {
      if (!res.data.success) {
        ElMessage.error(res.data.msg);
      }
    })
    .catch((err: any) => {
      ElMessage.error(err.response.data.msg);
    });
};

const getBoardSub = () => {
  axios.defaults.baseURL = "http://localhost:8080";
  axios({
    url: "/api/v1/board/sub",
    method: "get",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      space: props.nowBoard.space,
      baseDir: nowBaseDir.value,
      nowDir: nowDir.value,
    },
  })
    .then((res: any) => {
      if (res.data.code !== 2000) {
        ElMessage.error(res.data.msg);
      }
      boardSub.value =
        res.data.data.subInfos === null ? [] : res.data.data.subInfos;
      boardSub.value.forEach((item) => {
        if (item.file_type === "dir") {
          item.size = "-";
        } else {
          item.name = item.name.substring(0, item.name.lastIndexOf(".meta"));
          item.size = formatBytes(item.size);
        }
      });
    })
    .catch((err: any) => {
      ElMessage.error(err.response.data.msg);
    });
};

const newFolderA = (newName: string) => {
  axios.defaults.baseURL = "http://localhost:8080";

  axios({
    url: "/api/v1/board/dir",
    method: "post",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: {
      space: props.nowBoard.space,
      baseDir: nowBaseDir.value + "/" + nowDir.value,
      newDir: newName,
    },
  })
    .then((res: any) => {
      if (res.data.code !== 2000) {
        ElMessage.error(res.data.msg);
      }
      getBoardSub();
    })
    .catch((err: any) => {
      ElMessage.error(err.response.data.msg);
    })
    .finally(() => {
      getBoardSub();
    });
};
</script>
