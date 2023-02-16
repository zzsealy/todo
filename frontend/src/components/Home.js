import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Toast, Col, Row, Card, Typography, CardGroup } from '@douyinfe/semi-ui';
import { useNavigate  } from 'react-router-dom';
import constant from '../constant'
import { requestConfig, add } from '../utils'


const Todo = ({ todo }) => {
    return (
        <li>
            {todo.content}
       </li>
   ) 
}

const TodoList = ({ todoList }) => {
    const title = `完成时间 ${todoList.createDateTime}`
    return (
        <Card title = {title}
            style={{ maxWidth: 250, display: 'inline-block', }}
            shadows='hover'
           
        >  
            <ul>
                {todoList.childTodo.map(todo => <Todo key={todo.id} todo={todo}/>)}
            </ul>
        </Card>
    )
}


const Home = () => {
    const navigate = useNavigate();
    const [todoLists, setTodoLists] = useState([])
    const [count, setCount] = useState(0)
    const totalTodoListHooks = () => {

        const getTodoListPath = `${constant.baseUrl}/todo/todo_lists`
        const config = requestConfig()
        axios.get(getTodoListPath, config)
            .then((res) => {
                const code = res.data.code;
                if (code === 200) {
                    setTodoLists(res.data.todoList)
                    console.log(res);
                } 
                if (code === 401) {
                    navigate('/login')
                }
          })
    }
    useEffect(totalTodoListHooks, [count])

    const handleClickTodoList = ({todoList}) => {
        // 点击单个的todo list 跳转到todo list 详情
        const id = todoList.id
        const toUrl = `/todo_list/${id}`
        navigate(toUrl)
        console.log('点击了')
    }

    const handleClickCreateTodoList = () => {
        // 点击创建新的todo list
        const todoListPath = `${constant.baseUrl}/todo/todo_lists` 
        const config = requestConfig()
        axios.post(todoListPath, {}, config)
            .then((res) => {
                console.log(res.data)
            })
    }

    const todoListStyle = {
        display: 'inline-block',
        background: '#888888'
    }
    return (
        <div className='grid'>
            <Row>
                <Col span={14} offset={4}>
                    <h1>Hello World!</h1>
                    <Button onClick={() => handleClickCreateTodoList()}> 创建TodoList </Button>
                    <CardGroup type='grid'>
                        {todoLists.map(todoList =>
                            <div onClick={() => handleClickTodoList({ todoList })} style={todoListStyle}>
                                <TodoList key={todoList.id} todoList={todoList} />
                            </div>)}
                    </CardGroup>
                </Col>
            </Row>
        </div>
    )
}

export default Home