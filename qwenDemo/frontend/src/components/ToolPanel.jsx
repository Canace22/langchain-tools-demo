import React from 'react';
import { Card, List } from 'antd';
import { CloudOutlined, EnvironmentOutlined } from '@ant-design/icons';

const tools = [
  {
    icon: <CloudOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    title: '天气查询',
    description: '查询指定城市的实时天气信息',
    example: '查询深圳的天气'
  },
  {
    icon: <EnvironmentOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    title: '地理位置',
    description: '获取指定地址的地理坐标信息',
    example: '查询珠海市的地理位置'
  }
];

const ToolPanel = () => {
  return (
    <Card title="可用工具" bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={tools}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={item.title}
              description={
                <>
                  <div>{item.description}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    示例：{item.example}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ToolPanel;