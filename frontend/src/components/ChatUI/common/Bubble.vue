<template>
  <div :class="['bubble', type]">
    <div class="bubble-content">
      <slot></slot>
    </div>
    <div v-if="showTail" class="bubble-tail"></div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'info', 'warning', 'success', 'error'].includes(value)
  },
  showTail: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.bubble {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.bubble-content {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.bubble-tail {
  position: absolute;
  bottom: 0;
  width: 16px;
  height: 16px;
  overflow: hidden;
}

.bubble-tail::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  transform: translateY(-50%) rotate(45deg);
}

/* Types styling */
.primary {
  background-color: #409EFF;
  color: white;
}

.primary .bubble-tail {
  left: -8px;
}

.primary .bubble-tail::after {
  background-color: #409EFF;
  left: 8px;
}

.secondary {
  background-color: #F2F6FC;
  color: #333;
}

.secondary .bubble-tail {
  right: -8px;
}

.secondary .bubble-tail::after {
  background-color: #F2F6FC;
  right: 8px;
}

.info {
  background-color: #E6F1FC;
  color: #409EFF;
}

.warning {
  background-color: #FAECD8;
  color: #E6A23C;
}

.success {
  background-color: #E1F3D8;
  color: #67C23A;
}

.error {
  background-color: #FCE2E2;
  color: #F56C6C;
}
</style> 