<template>
  <div class="sender-container" :class="{ 'sender-disabled': disabled }">
    <div class="sender-textarea-container">
      <el-input
        v-model="inputValue"
        type="textarea"
        :rows="rows"
        :maxlength="maxLength"
        :show-word-limit="showWordLimit"
        :disabled="disabled || loading"
        :placeholder="placeholder"
        resize="none"
        @input="handleInput"
        @keydown.enter="handleKeyDown"
        ref="textareaRef"
      />
    </div>

    <div class="sender-toolbar">
      <div class="sender-actions">
        <slot name="actions">
          <el-tooltip content="Upload file" placement="top" v-if="enableUpload">
            <el-button 
              circle 
              :disabled="disabled || loading"
              @click="$emit('upload')"
              type="text">
              <el-icon><Upload /></el-icon>
            </el-button>
          </el-tooltip>
        </slot>
      </div>

      <div class="sender-submit">
        <slot name="submit">
          <el-button
            type="primary"
            :loading="loading"
            :disabled="isButtonDisabled"
            @click="handleSend"
            round
          >
            <span>{{ sendButtonText }}</span>
            <el-icon class="el-icon--right"><ChatRound /></el-icon>
          </el-button>
        </slot>
      </div>
    </div>

    <div class="sender-hints" v-if="showHints">
      <div class="sender-hint">
        Press <kbd>Enter</kbd> to send, <kbd>Shift</kbd> + <kbd>Enter</kbd> for new line
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, nextTick } from 'vue';
import { Upload, ChatRound } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Type a message...'
  },
  sendButtonText: {
    type: String,
    default: 'Send'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  },
  maxLength: {
    type: Number,
    default: 1000
  },
  showWordLimit: {
    type: Boolean,
    default: true
  },
  showHints: {
    type: Boolean,
    default: true
  },
  enableUpload: {
    type: Boolean,
    default: true
  },
  clearOnSend: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'send', 'upload']);

const inputValue = ref(props.modelValue);
const textareaRef = ref(null);

// Sync input value with modelValue prop
watchEffect(() => {
  inputValue.value = props.modelValue;
});

const isButtonDisabled = computed(() => {
  return props.disabled || props.loading || !inputValue.value.trim();
});

const handleInput = (value) => {
  emit('update:modelValue', value);
};

const handleKeyDown = (event) => {
  // If Shift+Enter pressed, allow default behavior (new line)
  if (event.shiftKey) {
    return;
  }
  
  // If Enter pressed without Shift, send message
  event.preventDefault();
  handleSend();
};

const handleSend = () => {
  if (isButtonDisabled.value) return;
  
  const trimmedValue = inputValue.value.trim();
  if (trimmedValue) {
    emit('send', trimmedValue);
    
    if (props.clearOnSend) {
      inputValue.value = '';
      emit('update:modelValue', '');
    }
    
    // Focus back on textarea after sending
    nextTick(() => {
      if (textareaRef.value?.$el) {
        const textarea = textareaRef.value.$el.querySelector('textarea');
        if (textarea) textarea.focus();
      }
    });
  }
};
</script>

<style scoped>
.sender-container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #DCDFE6;
  padding: 12px;
}

.sender-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sender-textarea-container {
  width: 100%;
  margin-bottom: 12px;
}

.sender-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sender-actions {
  display: flex;
  gap: 8px;
}

.sender-submit {
  display: flex;
  align-items: center;
}

.sender-hints {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.sender-hint {
  font-size: 12px;
  color: #909399;
}

kbd {
  background-color: #F5F7FA;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  color: #606266;
  display: inline-block;
  font-size: 11px;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}
</style> 