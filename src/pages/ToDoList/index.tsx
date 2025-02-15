import React, { useState, useEffect } from 'react';
import { Input, Button, List, Card, Modal, Form, Popconfirm, message } from 'antd';

const TodoList = () => {
  // Đọc dữ liệu từ localStorage khi khởi động
  const initialTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<{ id: number | null; title: string; description: string }>({
    id: null,
    title: '',
    description: '',
  });

  // Lưu dữ liệu vào localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAddTask = () => {
    if (newTask.title.trim() !== '' && newTask.description.trim() !== '') {
      const updatedTasks = [...tasks, { id: tasks.length + 1, ...newTask }];
      setTasks(updatedTasks);
      setNewTask({ title: '', description: '' });
      setIsModalVisible(false);
      message.success('Task added successfully');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask({ id: null, title: '', description: '' }); // Reset editing task
  };

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    message.success('Task deleted successfully');
  };

  const handleEditTask = (task: { id: number; title: string; description: string }) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleUpdateTask = () => {
    if (editingTask.title.trim() !== '' && editingTask.description.trim() !== '') {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, title: editingTask.title, description: editingTask.description } : task
      );
      setTasks(updatedTasks);
      setEditingTask({ id: null, title: '', description: '' });
      setIsModalVisible(false);
      message.success('Task updated successfully');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Todo List</h1>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>
        Add New Task
      </Button>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <Card
              title={task.title}
              actions={[
                <Button type="link" onClick={() => handleEditTask(task)}>
                  Sửa
                </Button>,
                <Popconfirm
                  title="Are you sure to delete this task?"
                  onConfirm={() => handleDeleteTask(task.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              {task.description}
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={editingTask.id ? 'Edit Task' : 'Add New Task'}
        visible={isModalVisible}
        onOk={editingTask.id ? handleUpdateTask : handleAddTask}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Title">
            <Input
              value={editingTask.id ? editingTask.title : newTask.title}
              onChange={(e) =>
                editingTask.id
                  ? setEditingTask({ ...editingTask, title: e.target.value })
                  : setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input
              value={editingTask.id ? editingTask.description : newTask.description}
              onChange={(e) =>
                editingTask.id
                  ? setEditingTask({ ...editingTask, description: e.target.value })
                  : setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;