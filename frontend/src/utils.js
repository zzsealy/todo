

const requestConfig = () => {
    const token = `Bearer ${window.localStorage.getItem('todo_token')} `
    const config = {
        'headers': { Authorization: token }
    }
    return config
}


export default {
    config: requestConfig
}


