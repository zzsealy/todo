import { Navigate, Outlet } from "react-router-dom"


const ProtectedRoute = () => {
    // 检查 localStorage 中的 token 来验证用户登录状态
    const token = localStorage.getItem('todo_token');
    
    if (!token) {
        // 如果没有 token，重定向到登录页面
        return <Navigate to="/login" replace />;
    }
    
    // 如果有 token，渲染子路由
    return <Outlet />;
}

export default ProtectedRoute