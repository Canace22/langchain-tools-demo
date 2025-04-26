<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="welcome-icon" v-if="icon">
        <el-icon :size="48"><component :is="icon" /></el-icon>
      </div>
      <img v-if="image" :src="image" alt="Welcome" class="welcome-image" />
      <h2 class="welcome-title">{{ title }}</h2>
      <p class="welcome-description">{{ description }}</p>
      
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
    default: 'Welcome to AI Assistant'
  },
  description: {
    type: String,
    default: 'I can help you with various tasks. Feel free to ask me anything!'
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
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  height: 100%;
}

.welcome-content {
  max-width: 600px;
  text-align: center;
}

.welcome-icon {
  margin-bottom: 24px;
  color: #409EFF;
}

.welcome-image {
  max-width: 240px;
  max-height: 240px;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.welcome-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 32px;
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