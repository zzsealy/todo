import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { Button, Toast, Col, Row, List, Avatar, ButtonGroup, Input, Checkbox, Layout, Popconfirm, Select  } from '@douyinfe/semi-ui';
import { requestConfig } from '../utils'
import constant from '../constant'

const tagMapping = {
    'short': '短期目标',
    'long': '长期目标',
    'week': '周目标',
    'month': '月目标'
}

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
    const [tag, setTag] = useState('')
    const getTodoListHook = () => {
        
        const getPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
        axios.get(getPath, config)
            .then((res) => {
                if (res.data.code === 200) {
                    setTodoList(res.data.todoList)
                    setTodos(res.data.todoList.childTodo)
                    setDateString(res.data.dateString)
                    setTag(res.data.tag)
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

    const filterTagDropDown = [
        { value: '', label: (<span style={{ 'color': 'rgba(var(--semi-light-blue-4), 1)' }}>{'全部'}</span>), otherKey: 1},
        { value: 'short', label: (<span style={{ 'color': 'rgba(var(--semi-light-blue-4), 1)' }}>{'短期目标'}</span>), otherKey: 1},
        { value: 'long', label:(<span style={{ 'color': 'rgba(var(--semi-light-blue-4), 1)' }}>{'长期目标'}</span>), otherKey: 2},
        { value: 'week', label:(<span style={{ 'color': 'rgba(var(--semi-light-blue-4), 1)' }}>{'周目标'}</span>), otherKey: 3},
        { value: 'month', label:(<span style={{ 'color': 'rgba(var(--semi-light-blue-4), 1)' }}>{'月目标'}</span>), otherKey: 4}
    ]

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

    const handleFilterTag = (value) => {
        setTag(value)
        handleClickChangeTodoList('tag', value)
    }

    const handleClickChangeTodoList = (type, tag=null) => {
        if (type === 'close') { // 关闭
            const todoListPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
            axios.put(todoListPath, { "type": type }, config)
                .then((res) => {
                    if (res.data.code === 200) {
                        Toast.success('关闭成功！');
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
        if (type === 'tag') {  // 删除
            const todoListPath = `${constant.baseUrl}/todo/todo_lists/${params.id}`
            axios.put(todoListPath, { "type": type, "tag": tag }, config)
                .then((res) => {
                    if (res.data.code === 200) {
                        setCount(count + 1)  // 重新获取todoList， 不能创建新的todo了
                        navigate('/')
                    }
                })
        }
    }

    const onCancel = () => {
        console.log('取消了')
    }


    return (
        <Layout className="components-layout-demo">
            <Header>
                <Row>  
                        <Col span={7} offset={7}>
                            <h1 style={{ 'maxWidth': '100%', "color": "#000", "display":"inline", }}>{todoList.title}</h1>
                        </Col>
                        <Col span={1}>
                            <Select onChange={handleFilterTag} placeholder={tagMapping[tag]} style={{'width': '120px'}} optionList={filterTagDropDown} validateStatus='warning'></Select>        
                        </Col>
                        <Col span={3} offset={2}>
                            <h1 style={{ 'maxWidth': '100%', "color": "rgba(var(--semi-lime-5), 1)", "display":"inline", }}>{dateString}</h1>
                        </Col>
                    <Col span={2}>
                        <Popconfirm
                            title="确认关闭这个待办集合？"
                            content="此修改不可逆,关闭之后这个待办集合不再支持修改待办。"
                            onConfirm={() => handleClickChangeTodoList('close')}
                            onCancel={onCancel}>
                            <Button>关闭</Button>
                        </Popconfirm>
                        <Popconfirm
                            title='确认删除这个待办集合？'
                            content='此操作不可逆'
                            onConfirm={() => handleClickChangeTodoList('del')}
                            onCancel={onCancel}>
                            <Button type="danger">删除</Button>
                        </Popconfirm>
                        </Col>
                </Row>
            </Header>
            <Layout>
                <Sider></Sider>
                <Content>
                    <Row>
                        <Col span={10} offset={7}>
                            <List
                            dataSource={todos}
                            renderItem={todo => (
                                <List.Item
                                    header={<Avatar color="blue">{userInfo.name}</Avatar>}
                                    main={
                                        <div>
                                            {
                                                todo.isFinish
                                                ?<h2 style={{ color: 'rgba(var(--semi-grey-7), 1)', fontWeight: 600, 'textDecoration': 'line-through' }}>{todo.content}</h2>
                                                :<h2 style={{ color: 'rgba(var(--semi-grey-3), 1)', fontWeight: 600,  }}>{todo.content}</h2>
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
                                <Input insetLabel='新todo(回车创建):' value={newTodo} onChange={handleInputTodo} onEnterPress={handleEnterPress}></Input> 
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <Footer></Footer>
        </Layout>
    )
}


export default TodoList