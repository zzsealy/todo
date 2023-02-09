import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Toast, Col, Row, Card, Typography, CardGroup } from '@douyinfe/semi-ui';
import { useNavigate  } from 'react-router-dom';
import constant from '../constant'
import { config } from '../utils'


const Todo = ({ todo }) => {
    return (
        <li>
            {todo.body}
       </li>
   ) 
}

const TodoList = ({ todoList }) => {
    const title = todoList.finish_rate + '  ' + todoList.create_datetime
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
                {todoList.child_todo.map(todo => <Todo key={todo.id} todo={todo}/>)}
            </ul>
        </Card>
    )
}

const Home = () => {
    const [todoLists, setTodoLists] = useState([])


    const totalTodoListHooks = () => {

        const getTodoListPath = `${constant.baseUrl}/todo/todo_lists`
        axios.get(getTodoListPath, config = utils.config())
            .then((res) => {
                const code = res.data.code;
                if (code === 200) {
                    setTodoLists(res.data)
                    console.log(res);
                } else {
                    console.log(res.data)
                }
          })

    }
    useEffect(totalTodoListHooks, [])

    const handleClickTodoList = ({todoList}) => {
        const id = todoList.id
        const toUrl = `/todo_list/${id}`
        console.log('点击了')
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