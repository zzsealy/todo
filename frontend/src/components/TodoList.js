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
    const [newTodo, setNewTodo] = useState('')
    const [todos, setTodos] = useState([])
    const [count, setCount] = useState(0)
    const [userInfo, setUserInfo] = useState({})
    const [dateString, setDateString] = useState('')
    const getTodoListHook = () => {
        const getPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
        axios.get(getPath, config)
            .then((res) => {
                if (res.data.code === 200) {
                    setTodoList(res.data.todoList)
                    setTodos(res.data.todoList.childTodo)
                    setDateString(res.data.dateString)
                    setNewTodo('')
                    document.title = res.data.todoList.title 
                }
                if (res.data.code === 401) {
                    navigate('/login')
                }
            })
    }
    useEffect(getTodoListHook, [count])

    const getUserInfoDataHook = () => {
        const getUserInfoPath = `${constant.baseUrl}/user/user_info`
        axios.get(getUserInfoPath, config)
            .then((res) => {
                if (res.data.code === 200) {
                    setUserInfo(res.data.userInfo)
                }
                if (res.data.code === 401) {
                    navigate('/login')
                }
            })
    }
    useEffect(getUserInfoDataHook, [])

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

    const handleInputTodo = (value, event) => {
        setNewTodo(value)
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

    const handleClickChangeTodoList = (type) => {
        if (type === 'close') { // 关闭
            const todoListPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
            axios.put(todoListPath, { "type": type }, config)
                .then((res) => {
                    if (res.data.code === 200) {
                        setCount(count + 1)  // 重新获取todoList， 不能创建新的todo了
                    }
                })
        }
        if (type === 'del') {  // 删除
            const todoListPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
            axios.put(todoListPath, { "type": type }, config)
                .then((res) => {
                    if (res.data.code === 200) {
                        setCount(count + 1)  // 重新获取todoList， 不能创建新的todo了
                        navigate('/')
                    }
                })
        }
    }


    return (
        <Layout className="components-layout-demo">
            <Header>
                <Row>  
                        <Col span={10} offset={7}>
                            <h1 style={{ 'maxWidth': '100%', "color": "#c8c8c8", "display":"inline", }}>{todoList.title}</h1>
                        </Col>
                        <Col span={3} offset={1}>
                        <h1 style={{ 'maxWidth': '100%', "color": "#c8c8c8", "display":"inline", }}>{dateString}</h1>
                        </Col>
                        <Col span={2} offset={1}>
                            <Button onClick={() => handleClickChangeTodoList('close')}>关闭</Button>
                            <Button onClick={() =>handleClickChangeTodoList('del')}>删除</Button>
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
                                    header={<Avatar color="blue">{userInfo.name}</Avatar>}
                                    main={
                                        <div>
                                            {
                                                todo.isFinish
                                                ?<h2 style={{ color: 'var(--semi-color-success-light-active)', fontWeight: 600, 'textDecoration': 'line-through' }}>{todo.content}</h2>
                                                :<h2 style={{ color: 'var( --semi-color-warning-light-active)', fontWeight: 600,  }}>{todo.content}</h2>
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
                            {todoList.canChange ?
                                <Input insetLabel='新todo(回车创建):' value={newTodo} onChange={handleInputTodo} onEnterPress={handleEnterPress}></Input> 
                                : <br></br>
                            }  
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