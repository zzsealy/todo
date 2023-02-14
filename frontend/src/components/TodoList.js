import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Button, Toast, Col, Row, Card, Typography, CardGroup } from '@douyinfe/semi-ui';
import { requestConfig, add } from '../utils'
import constant from '../constant'

const TodoList = () => {
    const navigate = useNavigate();
    const config = requestConfig()
    const params = useParams()
    const [todoList, setTodoList] = useState([])
    const getTodoListHook = () => {
        const getPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
        axios.get(getPath, config)
            .then((res) => {
                if (res.data.code === 200) {
                    console.log(res.data.todoList)
                }
                if (res.data.code === 401) {
                    navigate('/login')
                }
            })
    }
    useEffect(getTodoListHook, todoList)

    return (
        <Row>
                <Col span={10} offset={8}>
                    <h1>Hello World!</h1>
                </Col>
        </Row>
    )
}


export default TodoList