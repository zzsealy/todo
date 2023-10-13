const baseUrl = "https://www.dairuiquan.xyz"
// const baseUrl = "http://localhost:8003"

const statusCode = {
    "OK": 200, 
    "PASS_NOT_EQUAL": 4001,
    "EMAIL_EXIST": 4002,
    "PASSWORD_ERROR": 4003,
    "USER_NOT_EXIST": 4004,
    "AUTH_PASS": 401
}

const constant = {
    baseUrl: baseUrl
}


export {
    constant,
    statusCode
}
