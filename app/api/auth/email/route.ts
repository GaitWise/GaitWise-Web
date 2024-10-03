import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import VerificationCode from '@/db/models/VerificationCode'

// ランダムな数字を生成する関数
const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000) // 6桁のランダムな数字
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDBに接続
    await dbConnect()

    // メールアドレスをリクエストから取得
    const { email } = body

    // メールアドレスでユーザーを検索
    const user = await User.findOne({ email })

    // ユーザーが存在しない場合、メールを送らず終了
    if (!user) {
      return NextResponse.json({ message: 'ユーザーが存在しません', flg: false }, { status: 203 })
    }

    // ランダムな確認コードを生成
    const randomNumber = generateRandomNumber()

    // 確認コードと有効期限をデータベースに保存（有効期限を15分後に設定）
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15分後
    await VerificationCode.findOneAndUpdate(
      { email },
      { code: randomNumber, expiresAt },
      { upsert: true } // 存在しない場合は作成
    )

    // nodemailerでメール送信の設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    // メールオプションの設定
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${randomNumber}`,
      html: `
        <h2>Your Verification Code ${randomNumber}</h2>
        `,
    }

    // メールを送信
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: '確認コードが送信されました', flg: true }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(errorMessage)
    return NextResponse.json({ message: 'メール送信に失敗しました', error: errorMessage }, { status: 500 })
  }
}
