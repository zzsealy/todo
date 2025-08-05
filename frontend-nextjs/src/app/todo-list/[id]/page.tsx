'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Button, 
  Card, 
  Typography, 
  Notification, 
  Modal, 
  Input, 
  Checkbox, 
  List,
  Empty,
  Popconfirm,
  Space
} from '@douyinfe/semi-ui';
import { Textarea } from '@/components/ui/textarea';
import { 
  IconPlus, 
  IconEdit, 
  IconDelete, 
  IconArrowLeft,
  IconCalendar,
  IconCheckboxTick
} from '@douyinfe/semi-icons';
import { todoApi } from '@/lib/api';
import { clearToken } from '@/lib/utils';
import { statusCode } from '@/lib/constants';
import type { TodoList, Todo } from '@/types';

const { Title, Text, Paragraph } = Typography;

export default function TodoListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listId = parseInt(params.id as string);
  
  const [todoList, setTodoList] = useState<TodoList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const opts = {
    duration: 3,
    position: 'top' as const,
    content: '',
    title: '',
  };

  // 获取待办列表详情
  const fetchTodoListDetail = async () => {
    try {
      setLoading(true);
      const response = await todoApi.getTodoList(listId);
      
      if (response.status_code === statusCode.OK && response.data) {
        setTodoList(response.data);
      } else {
        Notification.error({
          ...opts,
          title: response.message || '获取待办列表详情失败'
        });
      }
    } catch (error: any) {
      console.error('获取待办列表详情错误:', error);
      if (error.response?.status === 401) {
        clearToken();
        document.cookie = 'todo_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
      } else {
        Notification.error({
          ...opts,
          title: '获取待办列表详情失败，请稍后重试'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 创建新的待办事项
  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      Notification.warning({
        ...opts,
        title: '请填写待办事项标题'
      });
      return;
    }

    try {
      setCreateLoading(true);
      const response = await todoApi.createTodo(listId, {
        title: newTodoTitle.trim(),
        content: newTodoContent.trim()
      });
      
      if (response.status_code === statusCode.OK || response.status_code === statusCode.CREATED) {
        Notification.success({
          ...opts,
          title: '创建成功！'
        });
        
        // 重新获取列表详情
        fetchTodoListDetail();
        
        // 关闭模态框并重置表单
        setShowCreateModal(false);
        setNewTodoTitle('');
        setNewTodoContent('');
      } else {
        Notification.error({
          ...opts,
          title: response.message || '创建失败'
        });
      }
    } catch (error: any) {
      console.error('创建待办事项错误:', error);
      Notification.error({
        ...opts,
        title: error.response?.data?.message || '创建失败，请稍后重试'
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // 切换待办事项完成状态
  const handleToggleTodo = async (todo: Todo) => {
    try {
      const response = await todoApi.updateTodo(listId, todo.id, {
        title: todo.title,
        content: todo.content,
        finish: !todo.finish
      });
      
      if (response.status_code === statusCode.OK) {
        Notification.success({
          ...opts,
          title: todo.finish ? '标记为未完成' : '标记为已完成'
        });
        
        // 重新获取列表详情
        fetchTodoListDetail();
      } else {
        Notification.error({
          ...opts,
          title: response.message || '更新失败'
        });
      }
    } catch (error: any) {
      console.error('更新待办事项错误:', error);
      Notification.error({
        ...opts,
        title: error.response?.data?.message || '更新失败，请稍后重试'
      });
    }
  };

  // 删除待办事项
  const handleDeleteTodo = async (todoId: number) => {
    try {
      const response = await todoApi.deleteTodo(listId, todoId);
      
      if (response.status_code === statusCode.OK) {
        Notification.success({
          ...opts,
          title: '删除成功！'
        });
        
        // 重新获取列表详情
        fetchTodoListDetail();
      } else {
        Notification.error({
          ...opts,
          title: response.message || '删除失败'
        });
      }
    } catch (error: any) {
      console.error('删除待办事项错误:', error);
      Notification.error({
        ...opts,
        title: error.response?.data?.message || '删除失败，请稍后重试'
      });
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    if (listId) {
      fetchTodoListDetail();
    }
  }, [listId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!todoList) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <Title heading={4} className="text-gray-500 mb-4">找不到该待办列表</Title>
          <Button type="primary">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completedTodos = todoList.todos?.filter(todo => todo.finish) || [];
  const pendingTodos = todoList.todos?.filter(todo => !todo.finish) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                icon={<IconArrowLeft />} 
                type="tertiary"
                onClick={() => router.back()}
                className="mr-4"
              >
                返回
              </Button>
              <div>
                <Title heading={3} className="!mb-0">{todoList.title}</Title>
                <div className="flex items-center text-gray-500 mt-1">
                  <IconCalendar className="mr-1" size="small" />
                  <Text size="small">
                    预期完成：{new Date(todoList.expect_finish_date).toLocaleDateString('zh-CN')}
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                type="primary" 
                icon={<IconPlus />}
                onClick={() => setShowCreateModal(true)}
              >
                新建任务
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {todoList.todos?.length || 0}
            </div>
            <div className="text-gray-500 mt-1">总任务数</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {completedTodos.length}
            </div>
            <div className="text-gray-500 mt-1">已完成</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {pendingTodos.length}
            </div>
            <div className="text-gray-500 mt-1">待完成</div>
          </Card>
        </div>

        {/* 待办事项列表 */}
        {todoList.todos && todoList.todos.length > 0 ? (
          <div className="space-y-6">
            {/* 待完成任务 */}
            {pendingTodos.length > 0 && (
              <Card>
                <Title heading={4} className="mb-4 flex items-center">
                  <IconCheckboxTick className="mr-2 text-orange-500" />
                  待完成任务 ({pendingTodos.length})
                </Title>
                <List
                  dataSource={pendingTodos}
                  renderItem={(todo: Todo) => (
                    <List.Item
                      key={todo.id}
                      className="hover:bg-gray-50 rounded-lg p-3"
                      main={
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={todo.finish}
                            onChange={() => handleToggleTodo(todo)}
                          />
                          <div className="flex-1">
                            <Title heading={5} className="!mb-1">
                              {todo.title}
                            </Title>
                            {todo.content && (
                              <Paragraph className="text-gray-600 !mb-2">
                                {todo.content}
                              </Paragraph>
                            )}
                            <Text size="small" className="text-gray-400">
                              创建于 {new Date(todo.create_time).toLocaleString('zh-CN')}
                            </Text>
                          </div>
                        </div>
                      }
                      extra={
                        <Space>
                          <Popconfirm
                            title="确定要删除这个任务吗？"
                            content="删除后无法恢复"
                            onConfirm={() => handleDeleteTodo(todo.id)}
                          >
                            <Button 
                              type="danger" 
                              theme="borderless"
                              icon={<IconDelete />}
                              size="small"
                            />
                          </Popconfirm>
                        </Space>
                      }
                    />
                  )}
                />
              </Card>
            )}

            {/* 已完成任务 */}
            {completedTodos.length > 0 && (
              <Card>
                <Title heading={4} className="mb-4 flex items-center">
                  <IconCheckboxTick className="mr-2 text-green-500" />
                  已完成任务 ({completedTodos.length})
                </Title>
                <List
                  dataSource={completedTodos}
                  renderItem={(todo: Todo) => (
                    <List.Item
                      key={todo.id}
                      className="hover:bg-gray-50 rounded-lg p-3 opacity-75"
                      main={
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={todo.finish}
                            onChange={() => handleToggleTodo(todo)}
                          />
                          <div className="flex-1">
                            <Title heading={5} className="!mb-1 line-through text-gray-500">
                              {todo.title}
                            </Title>
                            {todo.content && (
                              <Paragraph className="text-gray-400 !mb-2 line-through">
                                {todo.content}
                              </Paragraph>
                            )}
                            <Text size="small" className="text-gray-400">
                              完成于 {todo.finish_time ? new Date(todo.finish_time).toLocaleString('zh-CN') : '未知'}
                            </Text>
                          </div>
                        </div>
                      }
                      extra={
                        <Space>
                          <Popconfirm
                            title="确定要删除这个任务吗？"
                            content="删除后无法恢复"
                            onConfirm={() => handleDeleteTodo(todo.id)}
                          >
                            <Button 
                              type="danger" 
                              theme="borderless"
                              icon={<IconDelete />}
                              size="small"
                            />
                          </Popconfirm>
                        </Space>
                      }
                    />
                  )}
                />
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <Empty
              image={<div className="text-6xl">📝</div>}
              title="还没有任务"
              description="创建你的第一个任务开始管理待办事项吧！"
            >
              <Button 
                type="primary" 
                icon={<IconPlus />}
                onClick={() => setShowCreateModal(true)}
              >
                创建任务
              </Button>
            </Empty>
          </Card>
        )}
      </div>

      {/* 创建待办事项模态框 */}
      <Modal
        title="创建新任务"
        visible={showCreateModal}
        onOk={handleCreateTodo}
        onCancel={() => {
          setShowCreateModal(false);
          setNewTodoTitle('');
          setNewTodoContent('');
        }}
        confirmLoading={createLoading}
        okText="创建"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <Text strong>任务标题 *</Text>
            <Input
              className="mt-2"
              placeholder="请输入任务标题"
              value={newTodoTitle}
              onChange={setNewTodoTitle}
            />
          </div>
          <div>
            <Text strong>任务描述</Text>
            <Textarea
              className="mt-2"
              placeholder="请输入任务描述（可选）"
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
