import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要认证的路径
const protectedPaths = ['/', '/todo-list'];

// 公开路径（不需要认证）
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否为受保护的路径
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // 检查是否为公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // 从 cookie 或 localStorage 检查 token（这里我们主要依赖客户端检查）
  const token = request.cookies.get('todo_token')?.value;
  
  // 如果是受保护路径且没有 token，重定向到登录页
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 如果已登录用户访问登录/注册页，重定向到首页
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
