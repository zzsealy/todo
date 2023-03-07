import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Col, Row, Card, Pagination, CardGroup, DatePicker, Divider, Banner } from '@douyinfe/semi-ui';
import { useNavigate  } from 'react-router-dom';
import constant from '../constant'
import { requestConfig } from '../utils'


const Todo = ({ todo }) => {
    if (!todo.content) {
        return (
            <br></br>
        )
    }
     else {
         return (
             <li>
                {todo.content.length > 7 ?
                todo.content.slice(0, 7): todo.content
                 }
        </li>
         )
    }
}

const TodoList = ({ todoList }) => {
    const title = `${todoList.title}`
    let blankLi = []
    if (todoList.childTodo.length < 4) {
        for (let i = todoList.childTodo.length; i < 4; i++){
            blankLi.push({'id': i, 'content': ''})
        }
    }
    return (
        <Card title = {title}
            style={{ maxWidth: 250, display: 'inline-block', }}
            shadows='hover'
        >  
            <ul>
                {todoList.childTodo.slice(0, 3).map(todo => <Todo key={todo.id} todo={todo} />)}
                {blankLi.map(todo => <Todo key={todo.id} todo={todo} />)}
                {todoList.childTodo.length > 3 ? 
                    '....' : ''
                }
            </ul>
                {todoList.canChange === true ? <p style={{'float': 'right', 'color': 'rgba(var(--semi-lime-5), 1)'}}>进行</p>
                    : <p style={{'float': 'right', 'color': 'rgba(var(--semi-yellow-4), 1)', }}>关闭</p>}
            <small style={{'color': 'rgba(var(--semi-grey-4), 1)'}}>{`完成时间 ${todoList.finishDate}`}</small>
        </Card>
    )
}


const Home = () => {
    const navigate = useNavigate();
    const [todoLists, setTodoLists] = useState([])
    const [dateString, setDateString] = useState([])
    const [todoListTitle, setTotoListTitle] = useState('')
    const [count, setCount] = useState(0)
    const [showBanner, setShowBanner] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [todoListNum, setTodoListNum] = useState(0)

    const changeShowBanner = () => {
        setShowBanner(!showBanner)
    }

    const createTodoListErrorBanner = (
        <Banner onClose={changeShowBanner} type='warning'
            description="请输入TodoList的标题和选择时间"
        />
    )

    const totalTodoListHooks = () => {
        const getTodoListPath = `${constant.baseUrl}/todo/todo_lists?page=${currentPage}`
        const config = requestConfig()
        axios.get(getTodoListPath, config)
            .then((res) => {
                const code = res.data.code;
                if (code === 200) {
                    setTodoLists(res.data.todoList)
                    setTodoListNum(res.data.todoListNum)
                    console.log(res);
                } 
                if (code === 401) {
                    navigate('/login')
                }
            })
        document.title = '待办事项|DRQ'
    }
    useEffect(totalTodoListHooks, [count, todoListNum, currentPage, navigate])

    const handleClickTodoList = ({todoList}) => {
        // 点击单个的todo list 跳转到todo list 详情
        const id = todoList.id
        const toUrl = `/todo_list/${id}`
        navigate(toUrl)
        // console.log('点击了')
    }

    const handleTodoListTitle = (event) => {
        const inputTitle = event.target.value;
        setTotoListTitle(inputTitle)
    }

    const handleClickPage = (currentPage) => {
        setCurrentPage(currentPage)
        setCount(count+1)
    }

    const handleClickCreateTodoList = () => {
        // 点击创建新的todo list
        const todoListPath = `${constant.baseUrl}/todo/todo_lists` 
        const config = requestConfig()
        const postData = {
            'title': todoListTitle,
            'dateString': dateString
        }
        axios.post(todoListPath, postData, config)
            .then((res) => {
                const code = res.data.code;
                if (code === 200) {
                    setCount(count+1)
                }
                if (code === 401) {
                    navigate('/login')
                }
                if (code === 400) {
                    debugger
                    setShowBanner(true)
                }
            })
    }

    const todoListStyle = {
        display: 'inline-block',
        background: '#888888'
    }
    return (
        <div className='grid'>
            <Row>
                {showBanner? createTodoListErrorBanner: null}
                <Col span={14} offset={4}>
                    <form style={{'border': '1px solid', 'color': "#c8c8c8", 'marginBottom': '20px'}}>
                        <input placeholder='标题' onChange={handleTodoListTitle} value={todoListTitle}></input>
                            <Divider layout="vertical" margin='12px' />
                        <DatePicker onChange={(date, dateString) => setDateString(dateString)} />
                            <Divider layout="vertical" margin='12px'/>
                        <Button onClick={() => handleClickCreateTodoList()}>创建TodoList</Button>
                    </form>
                    {/* <Button onClick={() => handleClickCreateTodoList()}> 创建TodoList </Button> */}
                    <CardGroup type='grid'>
                        {todoLists.map(todoList =>
                            <div onClick={() => handleClickTodoList({ todoList })} style={todoListStyle}>
                                <TodoList key={todoList.id} todoList={todoList} />
                            </div>)}
                    </CardGroup>
                    <Pagination onPageChange={handleClickPage} total={todoListNum} pageSize={12} style={{ marginBottom: 12 }}></Pagination>
                </Col>
            </Row>
        </div>
    )
}

export default Home