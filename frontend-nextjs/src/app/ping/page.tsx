'use client';

import { useState } from 'react';
import { Button, Card, Typography, Notification } from '@douyinfe/semi-ui';
import { testApi } from '@/lib/api';
import { statusCode } from '@/lib/constants';

const { Title, Text } = Typography;

export default function PingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const opts = {
    duration: 3,
    position: 'top' as const,
    content: '',
    title: '',
  };

  const handlePing = async () => {
    try {
      setLoading(true);
      const response = await testApi.ping();
      
      if (response.status_code === statusCode.OK) {
        setResult('✅ 后端连接成功！');
        Notification.success({
          ...opts,
          title: '连接成功',
          content: '后端 API 响应正常'
        });
      } else {
        setResult('❌ 后端连接失败');
        Notification.error({
          ...opts,
          title: '连接失败',
          content: response.message || '后端 API 响应异常'
        });
      }
    } catch (error: any) {
      console.error('Ping 错误:', error);
      setResult('❌ 后端连接失败');
      Notification.error({
        ...opts,
        title: '连接失败',
        content: error.message || '无法连接到后端服务器'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🏓</div>
          <Title heading={3} className="mb-4">API 连接测试</Title>
          <Text className="text-gray-600 mb-6">
            点击下方按钮测试与后端 API 的连接状态
          </Text>
          
          <Button 
            type="primary" 
            size="large"
            loading={loading}
            onClick={handlePing}
            className="mb-4"
          >
            {loading ? '测试中...' : '测试连接'}
          </Button>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <Text>{result}</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
