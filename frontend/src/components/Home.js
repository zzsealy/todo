import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Toast, Col, Row, Card, Typography, CardGroup } from '@douyinfe/semi-ui';
import { useNavigate  } from 'react-router-dom';
import constant from '../constant'
import { requestConfig, add } from '../utils'


const Todo = ({ todo }) => {
    return (
        <li>
            {todo.body}
       </li>
   ) 
}

const TodoList = ({ todoList }) => {
    const title = todoList.finishRate + '  ' + todoList.create_datetime
    const { Text } = Typography;
    return (
        <Card title = {title}
            style={{ maxWidth: 250, display: 'inline-block', }}
            shadows='hover'
            headerExtraContent={
                <Text >
                    查看详情
                </Text>
        }
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
    useEffect(totalTodoListHooks, todoLists)

    const handleClickTodoList = ({todoList}) => {
        const id = todoList.id
        const toUrl = `/todo_list/${id}`
        navigate(toUrl)
        console.log('点击了')
    }

    const handleClickCreateTodoList = () => {
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