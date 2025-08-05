'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { API_CONFIG, statusCode } from '@/lib/constants';
import { getRequestConfig } from '@/lib/utils';
import ClientOnly from '@/components/ClientOnly';

interface Todo {
    id: number;
    content: string;
}

interface TodoListType {
    id: number;
    title: string;
    child_todo: Todo[];
    can_change: boolean;
    expect_finish_date: string;
}

const Todo = ({ todo }: { todo: Todo }) => {
    if (!todo.content) {
        return (
            <br></br>
        );
    }
    else {
        return (
            <li>
               {todo.content.length > 7 ?
               todo.content.slice(0, 7): todo.content
                }
       </li>
        );
    }
};

const TodoList = ({ todoList }: { todoList: TodoListType }) => {
    const title = `${todoList.title}`;
    let blankLi: Todo[] = [];
    if (todoList.child_todo.length < 4) {
        for (let i = todoList.child_todo.length; i < 4; i++){
            blankLi.push({'id': i, 'content': ''});
        }
    }
    return (
        <Card title = {title}
            style={{ maxWidth: 250, display: 'inline-block', }}
            shadows='hover'
        >  
            <ul>
                {todoList.child_todo.slice(0, 3).map(todo => <Todo key={todo.id} todo={todo} />)}
                {blankLi.map(todo => <Todo key={todo.id} todo={todo} />)}
                {todoList.child_todo.length > 3 ? 
                    '....' : ''
                }
            </ul>
                {todoList.can_change === true ? <p style={{'float': 'right', 'color': 'rgba(var(--semi-lime-5), 1)'}}>进行</p>
                    : <p style={{'float': 'right', 'color': 'rgba(var(--semi-yellow-4), 1)', }}>关闭</p>}
            <small style={{'color': 'rgba(var(--semi-grey-4), 1)'}}>{`完成时间 ${todoList.expect_finish_date}`}</small>
        </Card>
    );
};

const Home = () => {
    const router = useRouter();
    const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
    const [dateString, setDateString] = useState('');
    const [todoListTitle, setTotoListTitle] = useState('');
    const [count, setCount] = useState(0);
    const [showBanner, setShowBanner] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [todoListNum, setTodoListNum] = useState(0);
    const [tag, setTag] = useState('');
    const [filterTag, setFilterTag] = useState('all');
    const [filterFinishStatus, setFilterFinishStatus] = useState('all');
    const [isMounted, setIsMounted] = useState(false);
    
    const tagList = [
        { value: 'short', label: (<span style={{ 'color': 'rgba(var(--semi-red-5), 1)' }}>{'短期目标'}</span>), otherKey: 1},
        { value: 'long', label:(<span style={{ 'color': 'rgba(var(--semi-red-5), 1)' }}>{'长期目标'}</span>), otherKey: 2},
        { value: 'week', label:(<span style={{ 'color': 'rgba(var(--semi-red-5), 1)' }}>{'周目标'}</span>), otherKey: 3},
        { value: 'month', label:(<span style={{ 'color': 'rgba(var(--semi-red-5), 1)' }}>{'月目标'}</span>), otherKey: 4}
    ];

    const changeShowBanner = () => {
        setShowBanner(!showBanner);
    };

    const createTodoListErrorBanner = (
        <Alert className="mb-4">
            <AlertDescription>
                请输入TodoList的标题和选择时间
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2" 
                    onClick={changeShowBanner}
                >
                    ×
                </Button>
            </AlertDescription>
        </Alert>
    );

    const filterTagDropDown = [
        { value: 'all', label: '全部', otherKey: 1},
        { value: 'short', label: '短期目标', otherKey: 1},
        { value: 'long', label: '长期目标', otherKey: 2},
        { value: 'week', label: '周目标', otherKey: 3},
        { value: 'month', label: '月目标', otherKey: 4}
    ];

    const filterFinishDropDown = [
        { value: 'all', label: '全部', otherKey: 1},
        { value: 'true', label: '已完成', otherKey: 2},
        { value: 'false', label: '进行中', otherKey: 3}
    ];

    // 设置客户端渲染标志
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalTodoListHooks = () => {
        // 处理 filterTag 和 filterFinishStatus 的 API 参数
        const tagParam = filterTag === 'all' ? '' : filterTag;
        const statusParam = filterFinishStatus === 'all' ? '' : filterFinishStatus;
        const todoListPath = `${API_CONFIG.baseUrl}/todo/todo_list/?page=${currentPage}&tag=${tagParam}&can_change=${statusParam}`;
        const config = getRequestConfig();
        axios.get(todoListPath, config)
            .then((res) => {
                const status_code = res.data.status_code;
                if (status_code === 200) {
                    setTodoLists(res.data.todo_list);
                    setTodoListNum(res.data.todo_list_num);
                }
                if (status_code === 401) {
                    router.push('/login');
                }
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    router.push('/login');
                }
            });
        document.title = '待办事项|DRQ';
    };
    
    useEffect(totalTodoListHooks, [count, todoListNum, currentPage, router, filterFinishStatus, filterTag]);

    const handleClickTodoList = ({todoList}: {todoList: TodoListType}) => {
        // 点击单个的todo list 跳转到todo list 详情
        const id = todoList.id;
        const toUrl = `/todo-list/${id}`;
        router.push(toUrl);
        // console.log('点击了')
    };

    const handleTodoListTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputTitle = event.target.value;
        setTotoListTitle(inputTitle);
    };

    const handleSelectTag = (value: string | number | any[] | Record<string, any> | undefined) => {
        setTag(String(value || ''));
    };

    const handleFilterTag = (value: string | number | any[] | Record<string, any> | undefined) => {
        setFilterTag(String(value || ''));
        setCount(count+1);
    };

    const handleFilterFinishStatus = (value: string | number | any[] | Record<string, any> | undefined) => {
        setFilterFinishStatus(String(value || ''));
        setCount(count+1);
    };

    const handleClickPage = (currentPage: number) => {
        setCurrentPage(currentPage);
        setCount(count+1);
    };

    const handleClickCreateTodoList = () => {
        // 点击创建新的todo list
        const todoListPath = `${API_CONFIG.baseUrl}/todo/todo_list/`;
        const config = getRequestConfig();
        const postData = {
            'title': todoListTitle,
            'expect_finish_date': dateString,
            'tag': tag,
        };
        axios.post(todoListPath, postData, config)
            .then((res) => {
                const status_code = res.data.status_code;
                if (status_code === 200) {
                    setCount(count+1);
                }
                if (status_code === 401) {
                    router.push('/login');
                }
                if (status_code === 400) {
                    setShowBanner(true);
                }
            });
    };

    const todoListStyle = {
        display: 'inline-block',
        background: '#888888'
    };
    
    return (
        <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen">加载中...</div>}>
            <div className="flex flex-row w-full gap-4 px-8 py-4">
            <div className="flex-1 gap-4">
                {showBanner ? createTodoListErrorBanner : null}
                <form className="mb-5 flex items-center gap-3 text-gray-400">
                    <input placeholder='标题' onChange={handleTodoListTitle} value={todoListTitle} style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4 }} />
                    <Separator orientation="vertical" className="mx-2 h-8" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateString ? dateString : <span className="text-gray-400">选择日期</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={dateString ? new Date(dateString + 'T00:00:00') : undefined} onSelect={date => setDateString(date ? format(date, 'yyyy-MM-dd') : '')} />
                        </PopoverContent>
                    </Popover>
                    <Separator orientation="vertical" className="mx-2 h-8" />
                    <Select value={tag} onValueChange={handleSelectTag}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="选择标签" />
                        </SelectTrigger>
                        <SelectContent>
                            {tagList.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Separator orientation="vertical" className="mx-2 h-8" />
                    <Button type="button" onClick={handleClickCreateTodoList}>创建TodoList</Button>
                </form>
                <div className="grid grid-cols-3 gap-4">
                    {todoLists.map(todoList =>
                        <div key={todoList.id} onClick={() => handleClickTodoList({ todoList })} style={todoListStyle}>
                            {/* 替换为你实际的 TodoList 卡片内容 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{todoList.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{todoList.expect_finish_date}</CardDescription>
                                </CardContent>
                            </Card>
                        </div>)}
                </div>
                {/* 分页按钮 */}
                <div className="flex justify-center items-center gap-2 my-4">
                    <Button variant="outline" type="button" onClick={() => handleClickPage(currentPage-1)} disabled={currentPage<=1}>上一页</Button>
                    <span>第 {currentPage} 页</span>
                    <Button variant="outline" type="button" onClick={() => handleClickPage(currentPage+1)} disabled={currentPage*18>=todoListNum}>下一页</Button>
                </div>
            </div>
            <div className="flex flex-row gap-4 min-w-[200px]">
                <Select value={filterTag} onValueChange={handleFilterTag}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="标签" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterTagDropDown.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterFinishStatus} onValueChange={handleFilterFinishStatus}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterFinishDropDown.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            </div>
        </ClientOnly>
    );
};

export default Home;
