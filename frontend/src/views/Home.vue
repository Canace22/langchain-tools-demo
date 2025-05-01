<template>
  <el-container class="chat-layout">
    <el-aside class="chat-sider" width="260">
      <div class="logo">
        <span>早安 AI</span>
      </div>
      <el-button type="primary" class="new-chat" @click="createNewChat">
        <el-icon><Plus /></el-icon>
        新建对话
      </el-button>
      <div class="chat-list">
        <el-menu
          :default-active="selectedChat[0]"
          class="chat-menu"
          @select="handleChatSelect"
        >
          <el-menu-item
            v-for="chat in chatList"
            :key="chat.id"
            :index="chat.id"
          >
            <div class="chat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span class="chat-title">{{ chat.title }}</span>
              <el-icon class="delete-icon" @click.stop="deleteChat(chat.id)">
                <Delete />
              </el-icon>
            </div>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 工具面板 -->
      <div class="tools-panel">
        <div class="tools-header">
          <el-icon><Tools /></el-icon>
          <span>工具箱</span>
        </div>
        <el-menu
          :default-active="selectedTool[0]"
          class="tools-menu"
          @select="handleToolSelect"
        >
          <el-menu-item v-for="tool in tools" :key="tool.id" :index="tool.id">
            <div class="tool-item">
              <el-icon><component :is="tool.icon" /></el-icon>
              <span class="tool-title">{{ tool.title }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <Chat
      :messages="messages"
      :title="currentChat?.title"
      :is-typing="isTyping"
      @send="sendMessage"
      @operation="handleOperation"
    >
      <template #header-actions>
        <el-dropdown>
          <div class="user-dropdown">
            <el-avatar :size="32" :icon="User" />
            <span class="username">User</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><SwitchButton /></el-icon>
                退出
              </el-dropdown-item>
              <el-dropdown-item @click="clearAllChatData">
                <el-icon><Delete /></el-icon>
                清除所有数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #empty v-if="showWelcome">
        <Welcome
          title="你好，我是早安 AI"
          description="我可以回答你的问题，帮助你完成各种任务。"
          icon="ChatRound"
          :examples="welcomeExamples"
          @select="handleExampleSelect"
        />
      </template>
    </Chat>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, reactive, watch } from 'vue';
import Chat from '@/components/Chat.vue';
import Welcome from '@/components/ChatUI/wake/Welcome.vue';
import { Plus, Monitor, ChatDotRound, Tools, User, Setting, SwitchButton, Delete } from '@element-plus/icons-vue';

// 状态定义
const selectedChat = ref('1');
const inputMessage = ref('');
const isTyping = ref(false);
const messageContainer = ref(null);
const ws = ref(null);
const userIP = ref('获取中...');
const selectedTool = ref('');
const showWelcome = ref(true);

// 聊天列表
const chatList = ref([
  { id: '1', title: '新对话 1' },
  { id: '2', title: '新对话 2' }
]);

// 欢迎示例内容
const welcomeExamples = ref([
  '珠海今天天气怎么样？',
  '介绍一下深圳的景点',
  '如何学习人工智能？'
]);

// 消息列表
const messages = ref([]);
const messagesList = reactive({});

// 工具列表
const tools = ref([
  {
    id: 'image-processor',
    title: '图片处理',
    icon: 'image',
    description: '支持图片批量处理、重命名、整理等功能',
    examples: [
      '处理目录 /path/to/images 按日期',
      '统计目录 /path/to/images',
      '整理图片 /path/to/images 复制'
    ]
  },
  {
    id: 'weather',
    title: '天气查询',
    icon: 'cloud',
    description: '查询全国各地天气信息',
    examples: ['深圳天气怎么样？', '北京今天天气如何？', '查询上海的天气']
  },
  {
    id: 'location',
    title: '地理位置',
    icon: 'location',
    description: '查询地理位置信息',
    examples: ['珠海市在哪里？', '查询广州的位置', '深圳市位置在哪']
  }
]);

// 用户菜单选项
const userMenuOptions = [
  {
    content: `IP: ${userIP.value}`,
    prefixIcon: 'monitor'
  },
  {
    content: '设置',
    prefixIcon: 'setting'
  },
  {
    content: '退出',
    prefixIcon: 'poweroff'
  }
];

// 头像
const userAvatar = 'https://tdesign.gtimg.com/site/avatar.jpg';
const aiAvatar = 'https://tdesign.gtimg.com/site/chat-avatar.png';

// 计算属性
const currentChat = computed(() => {
  return chatList.value.find((chat) => chat.id === selectedChat.value);
});

// 方法定义
const createNewChat = () => {
  const newId = String(chatList.value.length + 1);
  chatList.value.unshift({
    id: newId,
    title: `新对话 ${newId}`
  });
  selectedChat.value = newId;
  if (!messagesList[newId]) {
    messagesList[newId] = [];
  }
  messages.value = messagesList[newId];
  showWelcome.value = true;
  saveToLocalStorage();
};

const handleExampleSelect = (example) => {
  showWelcome.value = false;

  sendMessage(example);
};

const deleteChat = (id) => {
  const index = chatList.value.findIndex((chat) => chat.id === id);
  if (index > -1) {
    chatList.value.splice(index, 1);
    delete messagesList[id];
    if (selectedChat.value === id) {
      selectedChat.value = chatList.value.length ? chatList.value[0].id : '';
      messages.value = selectedChat.value ? messagesList[selectedChat.value] || [] : [];
      showWelcome.value = messages.value.length === 0;
    }
    saveToLocalStorage();
  }
};

const handleChatSelect = (value) => {
  selectedChat.value = value;
  if (!messagesList[value]) {
    messagesList[value] = [];
  }
  messages.value = messagesList[value];
  showWelcome.value = messages.value.length === 0;
};

const clearMessages = () => {
  messages.value = [];
  showWelcome.value = true;
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP.value = data.ip;
  } catch (error) {
    console.error('获取IP地址失败:', error);
    userIP.value = '获取失败';
  }
};

const handleToolSelect = (value) => {
  const tool = tools.value.find((t) => t.id === value);
  if (tool) {
    selectTool(tool);
  }
};

const selectTool = (tool) => {
  const newId = String(chatList.value.length + 1);
  chatList.value.unshift({
    id: newId,
    title: `${tool.title} 对话`,
    toolId: tool.id
  });
  selectedChat.value = newId;
  messages.value = [
    {
      id: Date.now(),
      type: 'ai',
      content: `我是${tool.title}助手，${
        tool.description
      }\n\n您可以这样问我：\n${tool.examples.map((e) => `- ${e}`).join('\n')}`,
      timestamp: Date.now(),
      showActions: true
    }
  ];
  selectedTool.value = tool.id;
};

const sendMessage = async (inputMessage) => {
  if (!inputMessage.trim() || isTyping.value) return;

  showWelcome.value = false;
  const currentToolId = currentChat.value?.toolId;
  const messageText = inputMessage.trim();

  const newMessage = {
    id: Date.now(),
    type: 'user',
    content: messageText,
    timestamp: Date.now()
  };
  
  messages.value.push(newMessage);
  if (!messagesList[selectedChat.value]) {
    messagesList[selectedChat.value] = [];
  }
  messagesList[selectedChat.value] = messages.value;

  inputMessage = '';
  scrollToBottom();

  isTyping.value = true;

  try {
    ws.value.send(
      JSON.stringify({
        message: messageText,
        toolId: currentToolId
      })
    );
  } catch (error) {
    console.error('发送消息失败:', error);
    MessagePlugin.error('发送消息失败，请重试');
  } finally {
    isTyping.value = false;
  }
};

const handleOperation = (value) => {
  console.log('operation', value);
};

const newline = () => {
  inputMessage.value += '\n';
};

const handleUserMenuClick = (data) => {
  console.log('Menu clicked:', data);
};

// WebSocket 设置
const setupWebSocket = () => {
  const wsClient = new WebSocket(`ws://${window.location.hostname}:3000/ws`);

  wsClient.onopen = () => {
    console.log('WebSocket connection established');
  };

  wsClient.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.error) {
      MessagePlugin.error(data.error);
    } else {
      const aiMessage = {
        id: messages.value.length + 1,
        type: 'ai',
        content: data.response,
        timestamp: Date.now(),
        showActions: true
      };
      messages.value.push(aiMessage);
      messagesList[selectedChat.value] = messages.value;
      scrollToBottom();
    }
  };

  wsClient.onerror = (error) => {
    console.error('WebSocket error:', error);
    MessagePlugin.error('Connection error, falling back to HTTP mode');
  };

  ws.value = wsClient;
};

// 保存数据到localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('chatList', JSON.stringify(chatList.value));
    localStorage.setItem('messagesList', JSON.stringify(messagesList));
    localStorage.setItem('selectedChat', selectedChat.value);
  } catch (error) {
    console.error('保存到localStorage失败:', error);
  }
};

// 从localStorage加载数据
const loadFromLocalStorage = () => {
  try {
    const savedChatList = localStorage.getItem('chatList');
    const savedMessagesList = localStorage.getItem('messagesList');
    const savedSelectedChat = localStorage.getItem('selectedChat');
    
    if (savedChatList) {
      chatList.value = JSON.parse(savedChatList);
    }
    
    if (savedMessagesList) {
      const parsedMessages = JSON.parse(savedMessagesList);
      Object.keys(parsedMessages).forEach(key => {
        messagesList[key] = parsedMessages[key];
      });
    }
    
    if (savedSelectedChat) {
      selectedChat.value = savedSelectedChat;
    }
  } catch (error) {
    console.error('从localStorage加载失败:', error);
  }
};

// 监听变化并保存
watch(chatList, saveToLocalStorage, { deep: true });
watch(messagesList, saveToLocalStorage, { deep: true });
watch(selectedChat, saveToLocalStorage);

// 生命周期钩子
onMounted(() => {
  // 先从localStorage加载数据
  loadFromLocalStorage();
  
  setupWebSocket();
  getUserIP();
  
  // 初始化每个聊天的消息列表
  chatList.value.forEach(chat => {
    if (!messagesList[chat.id]) {
      messagesList[chat.id] = [];
    }
  });
  
  // 初始化当前选中聊天的消息
  if (selectedChat.value) {
    messages.value = messagesList[selectedChat.value] || [];
    showWelcome.value = messages.value.length === 0;
  }
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

// 增加清除所有会话数据的方法
const clearAllChatData = () => {
  try {
    localStorage.removeItem('chatList');
    localStorage.removeItem('messagesList');
    localStorage.removeItem('selectedChat');
    
    chatList.value = [{ id: '1', title: '新对话 1' }];
    Object.keys(messagesList).forEach(key => delete messagesList[key]);
    selectedChat.value = '1';
    messages.value = [];
    showWelcome.value = true;
  } catch (error) {
    console.error('清除数据失败:', error);
  }
};
</script>

<style scoped>
.chat-layout {
  height: 100vh;
}

.chat-sider {
  background: #1e1e1e;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 260px;
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo .el-icon {
  font-size: 24px;
  margin-right: 8px;
}

.new-chat {
  margin: 16px;
  width: calc(100% - 32px);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-menu {
  border-right: none;
  background-color: transparent;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 8px;
  position: relative;
  width: 100%;
}

.chat-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  position: absolute;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color:var(--el-color-danger) !important;
}

.chat-item:hover .delete-icon {
  opacity: 1;
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
}

.send-button {
  flex-shrink: 0;
  height: auto;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.username {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}

.tools-panel {
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.tools-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.85);
}

.tools-header .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.tools-menu {
  border-right: none;
  background-color: transparent;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-menu) {
  background-color: transparent;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
}

:deep(.el-menu-item:hover) {
  color: #409eff;
}

:deep(.el-menu-item .el-icon) {
  color: inherit;
}
</style>
