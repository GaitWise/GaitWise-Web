import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  // クッキーからトークンを削除
  res.cookies.set('token', '', { maxAge: 0 })
  return res
}
