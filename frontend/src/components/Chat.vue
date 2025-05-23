<template>
  <el-container class="chat-container">
    <el-header class="chat-header" v-if="titleVisible">
      <div class="header-content">
        <div class="header-title">{{ title }}</div>
        <div class="header-actions">
          <slot name="header-actions" />
        </div>
      </div>
    </el-header>

    <el-main class="chat-content" ref="messageContainer">
      <slot name="empty" v-if="messages.length === 0"></slot>
      <div class="message-list" v-else>
        <conversations
          :messages="messages"
          :show-user-avatar="false"
          :enable-markdown="true"
          @operation="(val) => emits('operation', val)"
        />

        <div v-if="isTyping" class="message ai">
          <div class="avatar">
            <el-avatar :size="40" style="background-color: #409eff">
              <el-icon><Monitor /></el-icon>
            </el-avatar>
          </div>
          <div class="message-content typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </el-main>

    <el-footer class="chat-footer">
      <sender :loading="isTyping" v-model="inputMessage" @send="handleSend" />
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { Conversations, Sender } from '@/components/ChatUI';
import { Monitor } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: 'AI Chat'
  },
  messages: {
    type: Array,
    default: () => []
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  titleVisible: {
    type: Boolean,
    default: true
  }
});
const emits = defineEmits(['operation', 'send']);

const inputMessage = ref('');
const handleSelectPrompt = (prompt) => {
  console.log(prompt);
  inputMessage.value = prompt;
};

const handleSend = (val) => {
  emits('send', val);
};
</script>

<style scoped>
.chat-container {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.chat-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.message-list {
  /* max-width: 800px; */
  margin: 0 auto;
}

/* .message {
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
} */

.message-actions {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.chat-footer {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  height: 20%;
}
</style>
