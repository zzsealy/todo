import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Button, Toast, Col, Row, List, Avatar, ButtonGroup, Input, Checkbox, Layout  } from '@douyinfe/semi-ui';
import { requestConfig } from '../utils'
import constant from '../constant'


const TodoList = () => {
    const { Header, Footer, Sider, Content } = Layout
    const navigate = useNavigate();
    const config = requestConfig()
    const params = useParams()
    const [todoList, setTodoList] = useState({})
    const [todos, setTodos] = useState([])
    const [count, setCount] = useState(0)
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
    useEffect(getTodoListHook, [count])

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
                    setCount(count+1)
                }
            })
    }


    const handleFinishTodoCheck = ({ checked, todo }) => {
        // const checkStatus = checked.target.checked;
        const todoId = todo.id
        const changeTodoStatusPath = `${constant.baseUrl}/todo/todo/${todoId}`
        axios.put(changeTodoStatusPath, {}, config)
            .then((res) => {
                if(res.data.code === 200) {
                    setCount(count+1) // 更新列表
                }
            })
        console.log('checked:', checked)
        console.log('item:', todo)
    }


    return (
        <Layout className="components-layout-demo">
            <Header>
                <Row>  
                        <Col span={10} offset={8}>
                            <h1>标题</h1>
                        </Col>
                </Row>
            </Header>
            <Layout>
                <Sider></Sider>
                <Content>
                    <Row>
                        <Col span={10} offset={7}>
                            <div
                            className="divi-line"
                            style={{"float": "left", "width": "2px", "height": "1000px", "background": "#c8c8c8"}}
                            ></div>
                            <List
                            dataSource={todos}
                            renderItem={todo => (
                                <List.Item
                                    // header={<Avatar color="blue">SE</Avatar>}
                                    main={
                                        <div>
                                            {
                                                todo.isFinish
                                                ?<h4 style={{ color: 'var(--semi-color-success-light-active)', fontWeight: 600, 'text-decoration': 'line-through', 'margin': '5px', }}>{todo.content}</h4>
                                                :<h4 style={{ color: 'var( --semi-color-warning-light-active)', fontWeight: 600, 'margin': '5px' }}>{todo.content}</h4>
                                            }
                                        </div>
                                    }
                                    extra={
                                        <ButtonGroup theme="borderless">
                                            {todo.isFinish
                                                ?<Checkbox defaultChecked onChange={checked => handleFinishTodoCheck({ checked, todo })}></Checkbox>
                                                :<Checkbox onChange={checked => handleFinishTodoCheck({ checked, todo })}></Checkbox>
                                            }
                                        </ButtonGroup>
                                    }
                                />
                                )}
                            />
                            <Input insetLabel='新的todo:' onEnterPress={handleEnterPress}></Input>
                        </Col>
                        <div
                            className="divi-line"
                            style={{"float": "left", "width": "2px", "height": "1000px", "background": "#c8c8c8"}}
                        ></div>
                    </Row>
                </Content>
            </Layout>
            <Footer></Footer>
        </Layout>
    )
}


export default TodoList