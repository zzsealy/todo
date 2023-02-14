import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Button, Toast, Col, Row, Card, Typography, CardGroup, List, Avatar, ButtonGroup, Input  } from '@douyinfe/semi-ui';
import { requestConfig, add } from '../utils'
import constant from '../constant'


const TodoList = () => {
    const navigate = useNavigate();
    const config = requestConfig()
    const params = useParams()
    const [todoList, setTodoList] = useState({})
    const [todos, setTodos] = useState([])
    const getTodoListHook = () => {
        const getPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
        axios.get(getPath, config)
            .then((res) => {
                if (res.data.code === 200) {
                    setTodoList(res.data.todoList)
                    setTodos(res.data.todoList.childTodo)
                }
                if (res.data.code === 401) {
                    navigate('/login')
                }
            })
    }
    useEffect(getTodoListHook, todoList)

    const handleEnterPress = (event) => {
        const value = event.target.value
        console.log(value)
        const createTodoPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
        const config = requestConfig()
        axios.post(createTodoPath, {'todoContent': value}, config)
            .then((res) => {
                if(res.data.code === 200){
                    setTodoList(res.data.todoList)
                    setTodos(res.data.todoList.childTodo)
                }
            })
    }


    return (
        <Row>
                <Col span={10} offset={8}>
                    <List
                    dataSource={todos}
                    renderItem={todo => (
                        <List.Item
                            // header={<Avatar color="blue">SE</Avatar>}
                            main={
                                <div>
                                    <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{todo.content}</span>
                                </div>
                            }
                            extra={
                                <ButtonGroup theme="borderless">
                                    <Button>点击完成</Button>
                                </ButtonGroup>
                            }
                        />
                    )}
                    />
                <Input insetLabel='新的todo:' onEnterPress={handleEnterPress}></Input>
                </Col>
        </Row>
    )
}


export default TodoList