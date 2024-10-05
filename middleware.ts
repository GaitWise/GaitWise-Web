import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ログインが不要なページ（例: /auth）を除外する
const publicPaths = ['/auth']

export function middleware(req: NextRequest) {
  // クッキーからトークンを取得（クライアントサイドのLocalStorageではなく、サーバーサイドでチェック）
  const token = req.cookies.get('token')

  // 現在のパスを取得
  const { pathname } = req.nextUrl

  console.log('Token:', token)
  console.log('Pathname:', pathname)

  // ログイン不要のページはそのまま次へ進む
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // トークンがない場合はログインページにリダイレクト
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth' // ログインページにリダイレクト
    url.searchParams.set('type', 'login') // クエリパラメータを追加
    return NextResponse.redirect(url) // リダイレクトを実行
  }

  // トークンがある場合はそのまま次の処理へ
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/analysts/:path*', '/((?!api|_next|static|favicon.ico).*)'], // middlewareを適用するパスの指定
}
