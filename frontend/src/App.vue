<template>
  <div class="app-container">
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
@import './Style/style.css';
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  height: 100%;
}

/* Element Plus 主题变量覆盖 */
:root {
  --el-color-primary: #409EFF;
  --el-color-success: #67C23A;
  --el-color-warning: #E6A23C;
  --el-color-danger: #F56C6C;
  --el-color-info: #909399;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #409EFF;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav a {
  color: #606266;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav a:hover, .nav a.router-link-active {
  color: #409EFF;
}

.app-content {
  flex: 1;
  overflow: auto;
}
</style>
