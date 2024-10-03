import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs' // bcryptのインポート
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDBに接続
    await dbConnect()

    // メールアドレスでユーザーを検索
    const user = await User.findOne({ email: body.email })

    if (!user) {
      return NextResponse.json({ message: 'ユーザーが存在しません', flg: false })
    }

    // パスワードを比較 (ハッシュ化されたパスワードと入力されたパスワードを比較)
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'パスワードが間違っています', flg: false })
    }

    // 1: JWT用のシークレットキーを作成
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')

    // 2: JWTのペイロードを作成
    const payload = {
      email: body.email,
      username: user.name,
    }

    // 3: JWTでトークンを発行
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h') // 有効期限 2時間
      .sign(secretKey)

    return NextResponse.json({ message: 'ログイン成功', flg: true, token: token })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'ログイン失敗', flg: false, error: errorMessage })
  }
}
