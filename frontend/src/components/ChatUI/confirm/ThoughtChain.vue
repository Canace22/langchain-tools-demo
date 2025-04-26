<template>
  <div class="thought-chain-container">
    <div class="thought-chain-header" v-if="title">
      <div class="thought-chain-title">
        <el-icon><Cpu /></el-icon>
        <span>{{ title }}</span>
      </div>
      <div class="thought-chain-actions">
        <el-button type="text" @click="toggleExpanded">
          {{ expanded ? 'Collapse' : 'Expand' }}
          <el-icon>
            <component :is="expanded ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </el-button>
      </div>
    </div>

    <div v-if="expanded || alwaysShowSummary" class="thought-chain-summary">
      <p>{{ summary }}</p>
    </div>

    <el-collapse-transition>
      <div v-if="expanded" class="thought-chain-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="thought-step"
          :class="{ 'thought-step-active': currentStepIndex === index }"
        >
          <div class="thought-step-header">
            <div class="thought-step-indicator">
              <div class="thought-step-number">{{ index + 1 }}</div>
            </div>
            <div class="thought-step-title">{{ step.title }}</div>
          </div>
          <div class="thought-step-content">
            <p>{{ step.content }}</p>
            <div v-if="step.code" class="thought-step-code">
              <el-button size="small" type="text" class="copy-button" @click="copyCode(step.code)">
                <el-icon><Document /></el-icon>
                Copy
              </el-button>
              <pre><code>{{ step.code }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Cpu, ArrowUp, ArrowDown, Document } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    default: 'AI Reasoning'
  },
  summary: {
    type: String,
    default: 'This is a summary of the AI\'s thought process.'
  },
  steps: {
    type: Array,
    default: () => []
  },
  initialExpanded: {
    type: Boolean,
    default: false
  },
  alwaysShowSummary: {
    type: Boolean,
    default: true
  }
});

const expanded = ref(props.initialExpanded);
const currentStepIndex = ref(props.steps.length - 1);

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const copyCode = (code) => {
  navigator.clipboard.writeText(code)
    .then(() => {
      ElMessage({
        message: 'Code copied to clipboard!',
        type: 'success',
        duration: 2000
      });
    })
    .catch(err => {
      console.error('Failed to copy code:', err);
      ElMessage({
        message: 'Failed to copy code',
        type: 'error',
        duration: 2000
      });
    });
};

onMounted(() => {
  // Initialize to the last step
  if (props.steps.length > 0) {
    currentStepIndex.value = props.steps.length - 1;
  }
});
</script>

<style scoped>
.thought-chain-container {
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  background-color: #F8F9FA;
  padding: 16px;
  margin-bottom: 16px;
}

.thought-chain-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.thought-chain-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 16px;
  color: #303133;
}

.thought-chain-summary {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #FFFFFF;
  border-radius: 6px;
  border-left: 4px solid #409EFF;
}

.thought-chain-steps {
  border-top: 1px dashed #DCDFE6;
  padding-top: 16px;
}

.thought-step {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  background-color: #FFFFFF;
  border-left: 3px solid #E4E7ED;
  transition: all 0.3s;
}

.thought-step-active {
  border-left-color: #409EFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.thought-step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.thought-step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #F2F6FC;
}

.thought-step-number {
  font-weight: 500;
  color: #409EFF;
}

.thought-step-title {
  font-weight: 500;
  color: #303133;
}

.thought-step-content {
  padding-left: 40px;
  color: #606266;
}

.thought-step-code {
  margin-top: 12px;
  position: relative;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

pre {
  background-color: #F5F7FA;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
  margin: 0;
  font-size: 14px;
  color: #303133;
}

code {
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 