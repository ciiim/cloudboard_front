<template>
  <top></top>
  <div class="box">
    <div class="item"></div>
    <div class="container item">
      <el-tabs
        v-model="activeBackPack"
        @edit="handleTabEdit"
        @tab-change="handleTabChange"
        type="card"
        editable
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.title"
          :name="tab.name"
        >
          <component :is="tab.view" @bagCreatedCallback="handleBagCreated" @enteredBag="handleBagEntered" :bagName="activeBackPack" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="item">
      <right-buttons
        :currentTabType="activeBagType"
        @create-backpack-clicked="handleCreateBackpack"
      ></right-buttons>
    </div>
  </div>
</template>

<script setup lang="ts">
import Entry from "@/components/bag/entry.vue";
import FileList from "@/components/bag/filelist.vue";
import CreateBackpack from "@/components/bag/createbag.vue";
import { ref } from "vue";
import type { TabPaneName } from "element-plus";

const tableIndex = ref(0);

const defaultTab = {
  view: Entry,
  title: "起始页",
  name: "default",
  type: "entry"
};

const tabs = ref([defaultTab]);

const activeBackPack = ref("default");
const activeBagType = ref('entry');

const handleTabChange = (tabName: string) => {
  let tab = tabs.value.find((tab) => tab.name === tabName);
  if (tab) {
    activeBagType.value = tab.type;
  }
};

const handleBagEntered = (data : any) => {
  console.log(data)
  if (data.msg == "success") {
    let nowTab = tabs.value.find((tab) => tab.name === activeBackPack.value);
    if (nowTab) {
      nowTab.name = data.bag;
      nowTab.title = data.bag;
      nowTab.view = FileList;
      nowTab.type = 'filelist';
      activeBackPack.value = data.bag;
      activeBagType.value = nowTab.type;
    }
  }
}

const handleBagCreated = (data: any) => {
  console.log(data);
  if (data.msg == "success") {
    let nowTab = tabs.value.find((tab) => tab.name === "NewBackPack");
    if (nowTab) {
      nowTab.name = data.bagName;
      nowTab.title = data.bagName;
      nowTab.view = FileList;
      nowTab.type = 'filelist';
      activeBackPack.value = data.bagName;
      activeBagType.value = nowTab.type;
    }
  }
};

const handleTabEdit = (
  targetName: TabPaneName | undefined,
  action: "remove" | "add"
) => {
  if (action === "add") {
    tabs.value.push({
      name: "default" + tableIndex.value++,
      title: "新标签页" + tableIndex.value,
      view: Entry,
      type: "entry",
    });
  } else if (action === "remove") {
    const atabs = tabs.value;
    let activeName = activeBackPack.value;
    if (atabs.length <= 1) {
      return;
    }
    if (activeName === targetName) {
      atabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = atabs[index + 1] || atabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }
    activeBackPack.value = activeName;
    tabs.value = atabs.filter((tab) => tab.name !== targetName);
  }
};

const handleCreateBackpack = () => {
  tabs.value.push({
    view: CreateBackpack,
    title: "新建背包",
    name: "NewBackPack",
    type: "create",
  });
};
</script>

<style>
.box {
  display: flex;
  width: 100%;
}

.item {
  flex: 1;
  padding: 10px;
}

.container {
  position: relative;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  left: 0;
}
.el-table {
  border-radius: 10px;
  overflow: hidden;
  min-height: 600px;
}

.context-menu {
  position: absolute;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.context-menu li {
  padding: 8px 12px;
  cursor: pointer;
}
.context-menu li:hover {
  background-color: #f5f5f5;
}
</style>
