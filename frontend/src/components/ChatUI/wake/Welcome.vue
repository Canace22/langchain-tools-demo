<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-header">
        <img v-if="image" :src="image" alt="Ant Design X" class="avatar-image" />
        <div v-else class="avatar-placeholder">
          <el-icon :size="32"><component :is="icon" /></el-icon>
        </div>
        <div class="header-text">
          <h2 class="welcome-title">{{ title }}</h2>
          <p class="welcome-description">{{ description }}</p>
        </div>
      </div>
      
      <div class="welcome-examples" v-if="examples && examples.length > 0">
        <h3 class="examples-title">Try asking:</h3>
        <ul class="examples-list">
          <li v-for="(example, index) in examples" :key="index" 
              class="example-item" @click="$emit('select', example)">
            {{ example }}
          </li>
        </ul>
      </div>
      
      <div class="welcome-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  title: {
    type: String,
    default: 'Hello, I\'m Ant Design X'
  },
  description: {
    type: String,
    default: 'Base on Ant Design, AGI product interface solution, create a better intelligent vision~'
  },
  icon: {
    type: String,
    default: 'ChatRound'
  },
  image: {
    type: String,
    default: ''
  },
  examples: {
    type: Array,
    default: () => []
  }
});

defineEmits(['select']);
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 24px;
  height: 100%;
  background-color: #f7f9fa;
}

.welcome-content {
  max-width: 800px;
  width: 100%;
  text-align: left;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.welcome-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #409EFF;
}

.header-text {
  flex: 1;
}

.welcome-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.welcome-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

.examples-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #303133;
}

.examples-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-item {
  padding: 12px 16px;
  background-color: #F5F7FA;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  border: 1px solid transparent;
}

.example-item:hover {
  background-color: #ECEFF5;
  border-color: #DCDFE6;
}

.welcome-footer {
  margin-top: 32px;
}
</style> 