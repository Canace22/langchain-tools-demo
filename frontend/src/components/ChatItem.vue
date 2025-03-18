<template>
  <t-chat-item
    :role="msg.type"
    :content="msg.content"
    :datetime="formatTime(msg.timestamp)"
    :avatar="msg.avatar"
    variant="outline"
    :class="['message', msg.type]" 
    v-bind="$attrs"
  >
    <template #avatar>
      <el-avatar
        :size="40"
        :style="{
          backgroundColor: msg.type === 'user' ? '#67C23A' : '#409EFF'
        }"
      >
        <el-icon v-if="msg.type === 'user'"><User /></el-icon>
        <el-icon v-else><Monitor /></el-icon>
      </el-avatar>
    </template>
  </t-chat-item>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  msg: {
    type: Object,
    default: () => ({})
  }
});

const msg = computed(() => {
  console.log('msg', props.msg);

  return {
    ...props.msg,
    avatar:
      props.msg.type === 'user'
        ? 'https://tdesign.gtimg.com/site/avatar.jpg'
        : 'https://tdesign.gtimg.com/site/chat-avatar.png'
  };
});

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};
const formatName = (type) => {
  return type === 'user' ? '自己' : '早安 AI';
};
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-body {
  flex: 1;
  max-width: 80%;
}

.message-info {
  margin-bottom: 4px;
  font-size: 12px;
  color: #999;
}

.message.user .message-info {
  text-align: right;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background: #f5f5f5;
  line-height: 1.5;
}

.message.user .message-content {
  background: #409eff;
  color: white;
} 
.message.user :deep(.t-chat__content){
  align-items: flex-end;
}
</style>
