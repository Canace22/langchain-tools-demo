// Common components
import Bubble from './common/Bubble.vue';
import Conversations from './common/Conversations.vue';

// Wake components
import Welcome from './wake/Welcome.vue';
import Prompts from './wake/Prompts.vue';

// Express components
import Sender from './express/Sender.vue';

// Confirm components
import ThoughtChain from './confirm/ThoughtChain.vue';

// Export individual components
export {
  // Common
  Bubble,
  Conversations,
  
  // Wake
  Welcome,
  Prompts,
  
  // Express
  Sender,
  
  // Confirm
  ThoughtChain
};

// Export default object with all components
export default {
  install(app) {
    // Register all components
    app.component('AntxBubble', Bubble);
    app.component('AntxConversations', Conversations);
    app.component('AntxWelcome', Welcome);
    app.component('AntxPrompts', Prompts);
    app.component('AntxSender', Sender);
    app.component('AntxThoughtChain', ThoughtChain);
  }
}; 