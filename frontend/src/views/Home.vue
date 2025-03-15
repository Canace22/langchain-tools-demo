<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">Home</a-menu-item>
        <a-menu-item key="2">About</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <h1>Welcome to Your Vue 3 + Ant Design Vue App</h1>
        <a-button type="primary">Click Me</a-button>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Vue 3 + Ant Design Vue ©2024
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const selectedKeys = ref(['1'])

    return {
      selectedKeys
    }
  }
})
</script>

<style scoped>
.header {
  position: fixed;
  z-index: 1;
  width: 100%;
}

.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
</style> 