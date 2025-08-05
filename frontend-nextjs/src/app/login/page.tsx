'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, statusCode } from '@/lib/constants';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showBanner, setShowBanner] = useState(false);

    const changeShowBanner = () => {
        setShowBanner(!showBanner);
    };

    const LoginBanner = (
        <Banner onClose={changeShowBanner} type='warning'
            description="密码错误"
        />
    );

    const loginStyle = {
        display: 'flex',
        justifyContent: 'center', // 水平局中
        alignItems: 'center',
        height: '100vh'
    };

    const formStyle = {
        flexDirection: 'column' as const, // 切换为列布局
        alignItems: 'centent'
    };

    const todoTitle = {
        position: 'absolute' as const,
        fontSize: '1.8rem',
        top: '80px',
        left: '100px',
        background: "url('./favicon.ico') no-repeat ",
        width: '200px',
        height: '100px',
        paddingLeft: '60px',
        paddingTop: '10px'
    };

    const loginButtonStyle = {
        border: '1px solid black',
        margin: '10px 0px 0px 20px',
        width: '100px',
        height: '24px',
    };

    const inputStyle = {
        width: '240px',
        height: '24px'
    };

    const loginTitle = {
        textAlign: 'center' as const,
        fontSize: '3rem',
        marginBottom: '-2px'
    };

    const inputAndLableStyle = {
        margin: '0px 0px 10px 20px',
        color: '#B5AFAD'
    };

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        localStorage.removeItem('todo_token');
        const loginUrl = `${API_CONFIG.baseUrl}/users/login`;
        const loginData = {'email': email, 'password': password};
        axios.post(loginUrl, loginData)
            .then((res) => {
                const status_code = res.data.status_code;
                if (status_code === statusCode.OK) {
                    const token = res.data.token;
                    localStorage.setItem('todo_token', token);
                    document.cookie = `todo_token=${token}; path=/; max-age=86400`;
                    router.push('/');
                    console.log('登录成功');
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((error) => {
                console.error('登录错误:', error);
                toast.error('登录失败，请稍后重试');
            });
    };

    const handelEmail = (email: string) => {
        setEmail(email);
    };

    const handlePassword = (password: string) => {
        setPassword(password);
    };

    return (
        <div style={loginStyle}>
            <span style={todoTitle}>待办事项！</span>
            {/* {showBanner? LoginBanner: null} */}
                <form style={formStyle}>
                    <div><h1 style={loginTitle}>登录</h1></div>
                    <div style={inputAndLableStyle}>
                        <div>
                            <strong>邮箱:</strong>
                        </div>
                        <Input style={inputStyle} onChange={(e) => handelEmail(e.target.value)} value={email}></Input>
                    </div>
                    <div style={inputAndLableStyle}>
                        <div>
                            <strong>密码:</strong>
                        </div>
                        <Input style={inputStyle} type='password' onChange={(e) => handlePassword(e.target.value)} value={password}></Input>
                    </div>
                    <br></br>
                        <Button style={loginButtonStyle} onClick={handleLogin}>登录</Button>
                        <Button style={loginButtonStyle} ><Link href='/register'>注册</Link></Button>
                </form>
        </div>
    );
};

export default Login;
