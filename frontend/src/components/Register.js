import { useState } from "react"
import axios from 'axios'

import constant from '../constant'


const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

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

    const Register = (event) => {
        event.preventDefault();
        const loginUrl = `${constant.baseUrl}/user/register`
        const loginData = {'username': username, 'password': password, 'passwordRepeat': passwordRepeat}
        axios.post(loginUrl, loginData)
            .then((res) => {
                console.log('收到登录返回')
            })
            .catch((error) => {
                console.log(error)
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

    const handlePasswordRepeat = (event) => {
        let passwordRepeat = event.target.value
        setPasswordRepeat(passwordRepeat)
    }

    return (
        <div style={loginStyle}>
            <h1>注册</h1>
            <form>
                <div style={inputStyle}><strong>账号:</strong> <input onChange={handleUsername}></input></div>
                <div style={inputStyle}><strong>密码:</strong> <input onChange={handlePassword}></input></div>
                <div style={inputStyle}><strong>密码:</strong> <input onChange={handlePasswordRepeat}></input></div>
                <br></br>
                <button style={loginButtonStyle} onClick={Register}>注册</button>
            </form>
        </div>
    )
}

export default Register