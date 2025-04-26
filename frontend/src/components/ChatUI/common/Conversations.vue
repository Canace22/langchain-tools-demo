<template>
  <div class="conversations-container">
    <div class="conversations-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="{ 'user-message': message.isUser }">
        <el-avatar v-if="!message.isUser || showUserAvatar" :class="['avatar', message.isUser ? 'user-avatar' : 'ai-avatar']">
          <el-icon v-if="!message.isUser"><Monitor /></el-icon>
          <el-icon v-else><User /></el-icon>
        </el-avatar>
        <div class="message-content" :class="{ 'user-no-avatar': message.isUser && !showUserAvatar }">
          <div class="message-header">
            <span class="sender-name">{{ message.isUser ? 'You' : 'AI Assistant' }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <bubble :type="message.isUser ? 'secondary' : 'primary'" :show-tail="true">
            {{ message.content }}
          </bubble>
          <div class="message-actions" v-if="showActions">
            <el-button-group>
              <el-button type="text" size="small" @click="handleCopy(message)">
                <el-icon><Document /></el-icon>
              </el-button>
              <el-button type="text" size="small" @click="$emit('thumbsUp', message)">
                <el-icon><Top /></el-icon>
              </el-button>
              <el-button type="text" size="small" @click="$emit('thumbsDown', message)">
                <el-icon><Bottom /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      <div v-if="loading" class="message-wrapper">
        <el-avatar class="avatar ai-avatar">
          <el-icon><Monitor /></el-icon>
        </el-avatar>
        <div class="message-content">
          <div class="message-header">
            <span class="sender-name">AI Assistant</span>
          </div>
          <bubble type="primary" :show-tail="true">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </bubble>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick ,computed} from 'vue';
import { Document, Top, Bottom, Monitor, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import Bubble from './Bubble.vue';

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showUserAvatar: {
    type: Boolean,
    default: true
  }
});

const messagesContainer = ref(null);

const messages = computed(() => {
  return props.messages?.map(message => ({
    ...message,
    isUser: message.role === 'user'||message.type === 'user'
  }));
});

// Automatically scroll to bottom when messages change
watch(() => props.messages.length, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}, { immediate: true });

// Format timestamp to human-readable time
const formatTime = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Handle copy message content to clipboard
const handleCopy = (message) => {
  navigator.clipboard.writeText(message.content)
    .then(() => {
      ElMessage({
        message: 'Message copied to clipboard!',
        type: 'success',
        duration: 2000
      });
    })
    .catch(err => {
      console.error('Failed to copy message:', err);
      ElMessage({
        message: 'Failed to copy message',
        type: 'error',
        duration: 2000
      });
    });
};

defineEmits(['thumbsUp', 'thumbsDown']);
</script>

<style scoped>
.conversations-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversations-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 24px;
  gap: 12px;
}

.user-message {
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
}

.user-avatar {
  background-color: #67C23A;
}

.ai-avatar {
  background-color: #409EFF;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.user-message .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-header {
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.sender-name {
  font-weight: 500;
  font-size: 14px;
}

.message-time {
  color: #909399;
  font-size: 12px;
}

.message-actions {
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.message-wrapper:hover .message-actions {
  opacity: 1;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.user-no-avatar {
  max-width: 85%;
  margin-left: auto;
}
</style> 