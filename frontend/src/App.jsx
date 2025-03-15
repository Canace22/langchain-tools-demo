import React from 'react';
import { Layout } from 'antd';
import ChatBox from './components/ChatBox';
import ToolPanel from './components/ToolPanel';
import './styles/App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <div className="logo">LangChain 智能助手</div>
      </Header>
      <Layout>
        <Content style={{ padding: '24px', height: 'calc(100vh - 64px)' }}>
          <ChatBox />
        </Content>
        <Sider width={300} theme="light" style={{ padding: '24px' }}>
          <ToolPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default App;