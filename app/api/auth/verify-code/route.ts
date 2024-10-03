import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import VerificationCode from '@/db/models/VerificationCode'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDBに接続
    await dbConnect()

    // メールアドレスと確認コードをリクエストから取得
    const { email, code } = body

    // データベースから確認コードを取得
    const record = await VerificationCode.findOne({ email })

    // コードが存在しない、または有効期限が切れている場合
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ message: '確認コードが無効です', flg: false }, { status: 203 })
    }

    // コードが一致するかを確認
    if (record.code !== code) {
      // コードが一致しない場合の処理
      return NextResponse.json({ message: '確認コードが一致しません', flg: false }, { status: 201 })
    }

    // コードが一致した場合
    return NextResponse.json({ message: '認証成功', flg: true }, { status: 200 })
  } catch (error: unknown) {
    // 予期せぬエラーが発生した場合の処理
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(errorMessage)
    return NextResponse.json({ message: 'エラーが発生しました', error: errorMessage }, { status: 500 })
  }
}
