import { useState } from "react"
import axios from 'axios'

import constant from '../constant'
import { Link } from "react-router-dom"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginStyle = {
        width: '200px',
        margin: '0 auto',

    }

    const loginButtonStyle = {
        margin: '10px 0px 0px 20px',
    }

    const inputStyle = {
        margin: '0px 0px 0px 20px'
    }

    const Login = () => {
        const loginUrl = `${constant.baseUrl}/login`
        const loginData = {'username': username, 'password': password}
        axios.post(loginUrl, loginData)
            .then((res) => {
                console.log('收到登录返回')
            })
    }

    const handleUsername = (event) => {
        let username = event.target.value
        setUsername(username)
    }

    const handlePassword = (event) => {
        let password = event.target.value
        setPassword(password)
    }

    return (
        <div style={loginStyle}>
            <h1>登录</h1>
            <form>
                <div style={inputStyle}><strong>账号:</strong> <input onChange={handleUsername}></input></div>
                <div style={inputStyle}><strong>密码:</strong> <input onChange={handlePassword}></input></div>
                <br></br>
                <button style={loginButtonStyle} onClick={Login}>登录</button>
                <button style={loginButtonStyle} ><Link to='/register'>注册</Link></button>
            </form>
        </div>
    )
}

export default Login