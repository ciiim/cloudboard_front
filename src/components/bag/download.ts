import axios from "axios";

export interface downloadFileinfo {
  name: string;
  space: string;
  baseDir: string;
}

export async function preDownload(downloadFileinfo: downloadFileinfo) : Promise<{downloadID:string,chunkNum:number}> {
  console.log(downloadFileinfo);
  axios.defaults.baseURL = "http://localhost:8080"
  let response = await axios({
    method: "get",
    url: "api/v1/board/pre-download",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    params: {
      fileName: downloadFileinfo.name + ".meta",
      space: downloadFileinfo.space,
      base: downloadFileinfo.baseDir
    }
  })
  return {
    downloadID: response.data.data.downloadID,
    chunkNum: response.data.data.chunkNum
  };
}
