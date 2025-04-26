<template>
  <div class="demo-container">
    <el-page-header title="Chat UI Components" @back="goBack" />
    
    <el-tabs type="border-card">
      <el-tab-pane label="Common">
        <h2>Bubble Component</h2>
        <div class="demo-section">
          <div class="demo-item">
            <bubble type="primary">This is a primary bubble</bubble>
          </div>
          <div class="demo-item">
            <bubble type="secondary">This is a secondary bubble</bubble>
          </div>
          <div class="demo-item">
            <bubble type="info">This is an info bubble</bubble>
          </div>
          <div class="demo-item">
            <bubble type="warning">This is a warning bubble</bubble>
          </div>
          <div class="demo-item">
            <bubble type="success">This is a success bubble</bubble>
          </div>
          <div class="demo-item">
            <bubble type="error">This is an error bubble</bubble>
          </div>
        </div>

        <h2>Conversations Component</h2>
        <div class="demo-section">
          <conversations :messages="demoMessages" :loading="isLoading" />
          <el-button type="primary" @click="toggleLoading">
            {{ isLoading ? 'Stop Loading' : 'Start Loading' }}
          </el-button>
          <el-button @click="addMessage">Add Message</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Wake">
        <h2>Welcome Component</h2>
        <div class="demo-section">
          <welcome 
            title="Welcome to AI Assistant" 
            description="I'm here to help you with your tasks. What would you like to know?"
            icon="ChatRound"
            :examples="[
              'Tell me about Element Plus',
              'How can I create a responsive layout?',
              'Show me how to use the ElTable component'
            ]"
            @select="handleSelectExample"
          />
        </div>

        <h2>Prompts Component</h2>
        <div class="demo-section">
          <prompts
            title="Choose a prompt template"
            :prompts="demoPrompts"
            :selectedPrompt="selectedPrompt"
            @select="handleSelectPrompt"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="Express">
        <h2>Sender Component</h2>
        <div class="demo-section">
          <sender 
            v-model="inputMessage" 
            :loading="messageLoading"
            @send="handleSendMessage"
            @upload="handleUpload"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="Confirm">
        <h2>ThoughtChain Component</h2>
        <div class="demo-section">
          <thought-chain
            title="AI Reasoning Process"
            summary="I analyzed the input by breaking it down into key entities, identifying relationships, and applying logical reasoning to form conclusions."
            :steps="thoughtSteps"
            :initialExpanded="false"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// Import components
import Bubble from '@/components/ChatUI/common/Bubble.vue';
import Conversations from '@/components/ChatUI/common/Conversations.vue';
import Welcome from '@/components/ChatUI/wake/Welcome.vue';
import Prompts from '@/components/ChatUI/wake/Prompts.vue';
import Sender from '@/components/ChatUI/express/Sender.vue';
import ThoughtChain from '@/components/ChatUI/confirm/ThoughtChain.vue';

const router = useRouter();

// Demo data
const isLoading = ref(false);
const demoMessages = ref([
  { 
    id: 1, 
    content: 'Hello, how can I help you today?', 
    isUser: false, 
    timestamp: new Date(Date.now() - 3600000)
  },
  { 
    id: 2, 
    content: 'I need help with Element Plus components.', 
    isUser: true, 
    timestamp: new Date(Date.now() - 3500000)
  },
  { 
    id: 3, 
    content: 'I can definitely help with that! Element Plus is a Vue 3 UI library with a rich set of components. What specific component are you interested in?', 
    isUser: false, 
    timestamp: new Date(Date.now() - 3400000)
  }
]);

const demoPrompts = ref([
  { 
    id: 1, 
    name: 'Explain Code', 
    description: 'Explain this code in simple terms', 
    icon: 'Document' 
  },
  { 
    id: 2, 
    name: 'Debug Issue', 
    description: 'Help me debug an error in my code', 
    icon: 'Warning' 
  },
  { 
    id: 3, 
    name: 'Optimize Code', 
    description: 'Suggest ways to improve performance', 
    icon: 'Refresh' 
  },
  { 
    id: 4, 
    name: 'Convert Code', 
    description: 'Convert code from one language to another', 
    icon: 'Switch' 
  }
]);

const thoughtSteps = ref([
  {
    title: 'Identify Intent',
    content: 'First, I identified that the user is asking about Element Plus components, which suggests they need guidance on using this UI library.'
  },
  {
    title: 'Analyze Context',
    content: 'Next, I determined that the user might be new to Element Plus or facing challenges with specific components.'
  },
  {
    title: 'Research Components',
    content: 'I recalled the various components available in Element Plus and their usage patterns.',
    code: 'import { ElButton, ElTable, ElForm } from "element-plus"\n\n// Basic button usage\n<el-button type="primary">Primary Button</el-button>'
  },
  {
    title: 'Formulate Response',
    content: 'Finally, I crafted a response that acknowledges their query and offers to provide more specific guidance.'
  }
]);

const inputMessage = ref('');
const messageLoading = ref(false);
const selectedPrompt = ref(null);

// Functions
const toggleLoading = () => {
  isLoading.value = !isLoading.value;
};

const addMessage = () => {
  const lastId = demoMessages.value[demoMessages.value.length - 1].id;
  demoMessages.value.push({
    id: lastId + 1,
    content: 'This is a new message added to the conversation.',
    isUser: Math.random() > 0.5, // Randomly user or AI
    timestamp: new Date()
  });
};

const handleSelectExample = (example) => {
  inputMessage.value = example;
  ElMessage({
    message: `Selected example: ${example}`,
    type: 'success'
  });
};

const handleSelectPrompt = (prompt) => {
  selectedPrompt.value = prompt;
  ElMessage({
    message: `Selected prompt: ${prompt.name}`,
    type: 'success'
  });
};

const handleSendMessage = (message) => {
  messageLoading.value = true;
  // Simulate sending message
  setTimeout(() => {
    demoMessages.value.push({
      id: demoMessages.value.length + 1,
      content: message,
      isUser: true,
      timestamp: new Date()
    });
    
    // Simulate AI response
    setTimeout(() => {
      demoMessages.value.push({
        id: demoMessages.value.length + 1,
        content: `You said: "${message}". This is an automated response from the demo.`,
        isUser: false,
        timestamp: new Date()
      });
      messageLoading.value = false;
    }, 1500);
  }, 500);
};

const handleUpload = () => {
  ElMessage({
    message: 'File upload functionality would be implemented here',
    type: 'info'
  });
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.demo-section {
  margin-bottom: 32px;
  padding: 20px;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  background-color: #FFFFFF;
}

.demo-item {
  margin-bottom: 16px;
}

h2 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #303133;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 12px;
}
</style> 