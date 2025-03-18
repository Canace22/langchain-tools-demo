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
    <template #content>
      <t-chat-content
        class="chat-content"
        :role="msg.type"
        :content="msg.content"
        variant="base"
      >
      </t-chat-content>
      <t-chat-action
        class="user-action"
        :content="msg.content"
        :operation-btn="['copy', 'replay']"
        @operation="handleOperation"
        v-if="msg.type === 'user'"
      ></t-chat-action>
      <t-chat-action
        class="ai-action"
        :is-good="isGood"
        :is-bad="isBad"
        :content="msg.content"
        :operation-btn="['good', 'bad', 'replay', 'copy']"
        @operation="handleOperation"
        v-if="msg.type !== 'user' && msg.showActions"
      ></t-chat-action>
    </template>
  </t-chat-item>
</template>

<script setup>
import { computed, ref } from 'vue';
const props = defineProps({
  msg: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['operation']);

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

const isGood = ref(false);
const isBad = ref(false);
const showActions = ref(false);

const handleOperation = (value, e) => {
  if (value === 'good') {
    isGood.value = !isGood.value;
    isBad.value = false;
  } else if (value === 'bad') {
    isBad.value = !isBad.value;
    isGood.value = false;
  }
  emits('operation', value);
};
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
  position: relative;
}

.message:hover .user-action {
  display: block;
}

.user-action {
  display: none;
  transition: opacity 0.2s ease-in-out;
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
.message.user :deep(.t-chat__content) {
  align-items: flex-end;
}
</style>
