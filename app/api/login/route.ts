import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  // ここにデータベースの認証処理を追加
  if (username === 'test' && password === 'password') {
    // JWTトークンを生成
    const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '1h' })

    // トークンをクッキーに保存
    const res = NextResponse.json({ success: true })
    res.cookies.set('token', token, { httpOnly: true, secure: true })
    return res
  }

  // 認証失敗時の処理
  return NextResponse.json({ success: false }, { status: 401 })
}
