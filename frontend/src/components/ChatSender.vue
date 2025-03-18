<template>
  <t-chat-sender
    :stop-disabled="loading"
    :textarea-props="{
      placeholder: '输入消息，按 Enter 发送，Shift + Enter 换行......'
    }"
    @send="inputEnter"
  >
    <template #suffix>
      <el-button type="primary" :loading="loading" @click="inputEnter">
        发送 <el-icon class="el-icon--right" size="16"><Promotion /></el-icon
      ></el-button>
    </template>
    <template #prefix>
      <div class="model-select">
        <el-select class="model-select-dropdown" v-model="selectValue" teleported>
          <el-option
            v-for="option in selectOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
          </el-option>
        </el-select>
        <el-button :class="{ 'is-active': isChecked }" @click="checkClick">
          <span>深度思考</span>
        </el-button>
      </div>
    </template>
  </t-chat-sender>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['send']);

const allowToolTip = ref(false);
const selectOptions = [
  {
    label: '默认模型',
    value: 'default'
  },
  {
    label: 'Deepseek',
    value: 'deepseek-r1'
  },
  {
    label: '混元',
    value: 'hunyuan'
  }
];
const selectValue = ref({
  label: '默认模型',
  value: 'default'
});
const isChecked = ref(false);
const checkClick = () => {
  isChecked.value = !isChecked.value;
};
// 模拟消息发送
const inputEnter = function (inputValue) {
  if (!inputValue) return;
  emits('send', inputValue);
};
</script>
<style scoped>
.btn {
  color: var(--td-font-gray-4);
  border: none;
  &:hover {
    color: var(--td-brand-color-6);
    border: none;
    background: none;
  }
}
.btn.t-button {
  height: 32px;
  padding: 0;
}
.model-select-dropdown {
  margin-right: 10px;
  width: 112px;
}
.model-select-button {
  background: var(--el-color-gray-light);
}
.model-select {
  display: flex;
  align-items: center;
  .t-select {
    width: 112px;
    height: 32px;
    margin-right: 8px;
    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }
    .t-input.t-is-focused {
      box-shadow: none;
    }
  }
  .check-box {
    width: 112px;
    height: 32px;
    border-radius: 32px;
    border: 0;
    background: #e7e7e7;
    color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    flex: 0 0 auto;
    .t-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-left: 4px;
      }
    }
  }
  .check-box.is-active {
    border: 1px solid #d9e1ff;
    background: #f2f3ff;
    color: #0052d9;
  }
}
:deep(.t-chat-sender__textarea) {
  background: var(--el-color-white);
}
</style>
