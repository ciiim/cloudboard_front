<template>
  <div class="top">
    <el-button class="right-button">
      <router-link to="/admin">Admin</router-link>
    </el-button>
  </div>
</template>

<style>
.top {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #333;
    color: white;
    padding: 10px 20px;
}

.right-button {
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.right-button a, .right-button a:visited, .right-button a:hover, .right-button a:active {
    color: #000;
    text-decoration: none;
}

</style>
