<template>
  <uploader :options="options" @fileAdded="fileAdded">
    <uploader-unsupport>
      <p>您的浏览器不支持上传</p>
    </uploader-unsupport>
    <uploader-drop>
      <p>拖拽文件至此或</p>
      <uploader-btn>选择文件</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
</template>

<script setup lang="ts">
import axios from "axios";
import SparkMD5 from "spark-md5";
import { computed, watch, ref } from "vue";

const CHUNKSIZE = 1024 * 1024 * 5; // 5MB
const props = defineProps(["info"]);
const infoRef = computed(() => {
  return props.info;
});
watch(infoRef, () => {
  options.value.query.space = infoRef.value.space;
  options.value.query.baseDir = infoRef.value.base;
});

const preChunk = (chunk : any) => {
  console.log(chunk);
  chunk.preprocessFinished();
}


const options = ref({
  target: "//localhost:8080/api/v1/board/upload",
  testChunks: false,
  chunkSize: CHUNKSIZE,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  query: {
    space: infoRef.value.space,
    baseDir: infoRef.value.base,
  },
  preprocess: preChunk
});


const computeMD5 = async (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log("file", file);
    let fileReader = new FileReader();
    let time = new Date().getTime();
    let blobSlice = File.prototype.slice;
    let currentChunk = 0;
    const chunkSize = CHUNKSIZE;
    let chunks = file.chunks.length;
    let spark = new SparkMD5.ArrayBuffer();

    function loadNext() {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
    }

    loadNext();

    fileReader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer);

      if (currentChunk < chunks) {
        currentChunk++;
        loadNext();
      } else {
        let md5 = spark.end();
        console.log(
          `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
            file.size
          } 用时：${new Date().getTime() - time} ms`
        );
        resolve(md5);
      }
    };

    fileReader.onerror = function () {
      reject();
      console.warn("oops, something went wrong.");
    };
  });
};

const getStoreID = async (file: any): Promise<string> => {
  let fileHash;
  let md5 = await computeMD5(file);
  fileHash = md5;
  axios.defaults.baseURL = "http://localhost:8080";
  fileHash = await axios({
    url: "/api/v1/board/pre-upload",
    method: "post",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    data: {
      space: infoRef.value.space,
      base: infoRef.value.base,
      fileName: file.name,
      fileHash: fileHash,
      totalChunks: file.chunks.length,
    },
  });
  return fileHash.data.data.storeID;
};

const preUpload = async (file: any): Promise<boolean> => {
  file.uniqueIdentifier = await getStoreID(file);
  return true;
};

const fileAdded = async (file: any): Promise<boolean> => {
  file.pause();
  let pre = await preUpload(file)
  if (!pre) {
    file.cancel();
    return false;
  }
  file.resume();
  return true;
};
</script>
