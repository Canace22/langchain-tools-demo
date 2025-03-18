<template>
  <div>
    <el-button @click="dialogVisible = true">AI 对话</el-button>
    <el-dialog
      v-model="dialogVisible"
      title="AI 对话"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="dialogVisible = false"
    >
      <div class="chat-container">
      <Chat
        :messages="messages"
        :is-typing="isTyping"
        :title-visible="false"
        @send="sendMessage"
        @operation="handleOperation"
      >
      </Chat>
    </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import Chat from '@/components/Chat.vue';

// 状态定义
const selectedChat = ref('1');
const inputMessage = ref('');
const isTyping = ref(false);
const messageContainer = ref(null);
const ws = ref(null);
const userIP = ref('获取中...');
const selectedTool = ref('');
const dialogVisible = ref(false);

// 聊天列表
const chatList = ref([
  { id: '1', title: '新对话 1' },
  { id: '2', title: '新对话 2' }
]);

// 消息列表
const messages = ref([
  {
    id: 1,
    type: 'ai',
    content: '你好，我能为你做些什么？',
    timestamp: Date.now() - 1000,
    showActions: false
  },
  {
    id: 2,
    type: 'user',
    content: '珠海今天天气怎么样？',
    timestamp: Date.now() - 1000
  }
]);

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
  messages.value = [];
};

const deleteChat = (id) => {
  const index = chatList.value.findIndex((chat) => chat.id === id);
  if (index > -1) {
    chatList.value.splice(index, 1);
    if (selectedChat.value === id) {
      selectedChat.value = chatList.value.length ? chatList.value[0].id : '';
    }
  }
};

const handleChatSelect = (value) => {
  selectedChat.value = value;
};

const clearMessages = () => {
  messages.value = [];
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

  const currentToolId = currentChat.value?.toolId;
  const messageText = inputMessage.trim();

  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: messageText,
    timestamp: Date.now()
  });

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
      messages.value.push({
        id: messages.value.length + 1,
        type: 'ai',
        content: data.response,
        timestamp: Date.now(),
        showActions: true
      });
      scrollToBottom();
    }
  };

  wsClient.onerror = (error) => {
    console.error('WebSocket error:', error);
    MessagePlugin.error('Connection error, falling back to HTTP mode');
  };

  ws.value = wsClient;
};

// 生命周期钩子
onMounted(() => {
  setupWebSocket();
  getUserIP();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<style scoped>
.chat-container {
  height: 60%;
}
</style>
