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

const Register = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [name, setName] = useState('');

    const opts = {
        duration: 3,
        position: 'topRight' as const,
        content: '',
        title: '',
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
    
    const registerTitle = {
        textAlign: 'center' as const,
        fontSize: '3rem',
        marginBottom: '-2px'
    };

    const registerStyle = {
        display: 'flex',
        justifyContent: 'center', // 水平局中
        alignItems: 'center',
        height: '100vh'
    };

    const loginButtonStyle = {
        margin: '10px 0px 0px 20px',
        width: '240px',
        height: '24px'
    };

    const formStyle = {
        flexDirection: 'column' as const, // 切换为列布局
        alignItems: 'centent'
    };

    const inputAndLableStyle = {
        margin: '0px 0px 10px 20px',
        color: '#B5AFAD'
    };

    const inputStyle = {
        width: '240px',
        height: '24px',
    };

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();
        const registerUrl = `${API_CONFIG.baseUrl}/users/register`;
        const registerData = {
            'email': email, 'password': password,
            'passwordRepeat': passwordRepeat, 'name': name
        };
        axios.post(registerUrl, registerData)
            .then((res) => {
                const status_code = res.data.status_code;
                if (status_code === statusCode.OK) {
                    return(
                        router.push('/login')
                    );
                }
                if (status_code === statusCode.PASS_NOT_EQUAL) {
                    toast.error('两次密码不一致，请重新输入');
                } else if (status_code === statusCode.EMAIL_EXIST){
                    toast.error('邮箱已经存在');
                } else {
                    toast.error('发生错误');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEmail = (email: string) => {
        setEmail(email);
    };

    const handlePassword = (password: string) => {
        setPassword(password);
    };

    const handlePasswordRepeat = (passwordRepeat: string) => {
        setPasswordRepeat(passwordRepeat);
    };

    const handleName = (name: string) => {
        setName(name);
    };

    return (
        <div style={registerStyle}>
            <span style={todoTitle}>待办事项！</span>
            <form style={formStyle}>
                <div><h1 style={registerTitle}>注册</h1></div>
                <div style={inputAndLableStyle}>
                    <div><small>邮箱:</small></div>
                     <Input style={inputStyle} onChange={(e) => handleEmail(e.target.value)} value={email}></Input>
                </div>
                <div style={inputAndLableStyle}>
                    <div><small>密码:</small></div>
                     <Input style={inputStyle} type='password' onChange={(e) => handlePassword(e.target.value)} value={password}></Input>
                </div>
                <div style={inputAndLableStyle}>
                    <div><small>重复密码:</small></div>
                    <Input style={inputStyle} type='password' onChange={(e) => handlePasswordRepeat(e.target.value)} value={passwordRepeat}></Input>
                </div>
                <div style={inputAndLableStyle}>
                    <div><small>名字:</small></div>
                    <Input style={inputStyle} onChange={(e) => handleName(e.target.value)} value={name} placeholder='输入一个昵称'></Input>
                </div>
                <br></br>
                <button style={loginButtonStyle} onClick={handleRegister}>注册</button>
            </form>
        </div>
    );
};

export default Register;
