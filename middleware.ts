import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 로그인 불필요한 페이지 (예: /auth)를 제외
const publicPaths = ['/auth']

export function middleware(req: NextRequest) {
  // 쿠키에서 토큰을 가져옴 (클라이언트 사이드의 LocalStorage가 아닌 서버 사이드에서 체크)
  const token = req.cookies.get('token')

  // 현재 경로를 가져옴
  const { pathname } = req.nextUrl

  console.log('Token:', token)
  console.log('Pathname:', pathname)

  // 로그인 불필요한 페이지는 그대로 다음으로 진행
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 토큰이 없는 경우 로그인 페이지로 리다이렉트
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth' // 로그인 페이지로 리다이렉트
    url.searchParams.set('type', 'login') // 쿼리 파라미터를 추가
    return NextResponse.redirect(url) // 리다이렉트를 실행
  }

  // 토큰이 있는 경우 그대로 다음 처리로
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/analysts/:path*', '/((?!api|_next|static|favicon.ico).*)'], // middleware를 적용할 경로 지정
}
