<template>
  <div class="prompts-container">
    <h3 v-if="title" class="prompts-title">{{ title }}</h3>
    <div class="prompts-grid">
      <div 
        v-for="(prompt, index) in prompts" 
        :key="index" 
        class="prompt-item"
        :class="{ 'prompt-item-selected': isSelectedPrompt(prompt) }"
        @click="handleSelectPrompt(prompt)"
      >
        <el-icon v-if="prompt.icon" class="prompt-icon"><component :is="prompt.icon" /></el-icon>
        <div class="prompt-content">
          <div class="prompt-name">{{ prompt.name }}</div>
          <div class="prompt-description">{{ prompt.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Suggested Prompts'
  },
  prompts: {
    type: Array,
    default: () => []
  },
  selectedPrompt: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['select']);

const isSelectedPrompt = (prompt) => {
  if (!props.selectedPrompt) return false;
  return props.selectedPrompt.id === prompt.id;
};

const handleSelectPrompt = (prompt) => {
  emit('select', prompt);
};
</script>

<style scoped>
.prompts-container {
  padding: 16px;
}

.prompts-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #303133;
}

.prompts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.prompt-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #F5F7FA;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.prompt-item:hover {
  background-color: #ECEFF5;
  border-color: #DCDFE6;
}

.prompt-item-selected {
  background-color: #E6F1FC;
  border-color: #409EFF;
}

.prompt-icon {
  font-size: 24px;
  color: #409EFF;
  margin-top: 2px;
}

.prompt-content {
  flex: 1;
}

.prompt-name {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 4px;
  color: #303133;
}

.prompt-description {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> 