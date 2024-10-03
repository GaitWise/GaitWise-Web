import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs' // パスワードハッシュ化のためにbcryptを使用
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDBに接続
    await dbConnect()

    // メールアドレスで既にユーザーが存在しているかを確認
    const existingUser = await User.findOne({ email: body.email })

    if (existingUser) {
      // メールアドレスが既に存在している場合、203ステータスを返す
      return NextResponse.json({ message: 'このメールアドレスは既に使用されています', flg: false }, { status: 203 })
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // 新しいユーザーをデータベースに保存
    const newUser = new User({
      email: body.email,
      name: body.name,
      password: hashedPassword,
      role: body.role,
    })

    await newUser.save()

    // 1: JWT用のシークレットキーを作成
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')

    // 2: JWTのペイロードを作成
    const payload = {
      email: body.email,
      username: newUser.name,
    }

    // 3: JWTでトークンを発行
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h') // 有効期限 2時間
      .sign(secretKey)

    // サインアップ成功時に200ステータスを返す
    return NextResponse.json({ message: 'サインアップ成功', flg: true, token: token }, { status: 200 })
  } catch (error) {
    // エラーハンドリング、500ステータスを返す
    return NextResponse.json(
      { message: 'サインアップ失敗', flg: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
