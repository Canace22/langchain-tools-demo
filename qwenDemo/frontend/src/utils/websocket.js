export class WebSocketClient {
    constructor(url, options = {}) {
      this.url = url;
      this.options = options;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
      this.reconnectInterval = options.reconnectInterval || 3000;
      this.handlers = {
        message: new Set(),
        error: new Set(),
        close: new Set(),
        open: new Set()
      };
      
      this.connect();
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.handlers.open.forEach(handler => handler());
      };
      
      this.ws.onmessage = (event) => {
        this.handlers.message.forEach(handler => handler(event));
      };
      
      this.ws.onerror = (error) => {
        this.handlers.error.forEach(handler => handler(error));
      };
      
      this.ws.onclose = () => {
        this.handlers.close.forEach(handler => handler());
        this.reconnect();
      };
    }
  
    reconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    }
  
    on(event, handler) {
      if (this.handlers[event]) {
        this.handlers[event].add(handler);
      }
    }
  
    off(event, handler) {
      if (this.handlers[event]) {
        this.handlers[event].delete(handler);
      }
    }
  
    send(data) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
        return true;
      }
      return false;
    }
  
    close() {
      this.ws.close();
    }
  }