// app\api\test\route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

/**
 * @description name 중복 확인 + 사용자 정보 표시
 * @searchParams name
 */
export async function GET(req: NextRequest) {
  await dbConnect()
  const name = req.nextUrl.searchParams.get('name')

  if (!name) {
    return NextResponse.json({ message: '닉네임이 지정되지 않았습니다.' }, { status: 400 })
  }

  const existingUser = await User.findOne({ name: name })
  console.log('existingUser', existingUser)
  if (existingUser) {
    // 사용자가 존재하는 경우, 그 정보를 모두 반환
    return NextResponse.json(
      {
        message: '이 닉네임은 이미 사용 중입니다.',
        user: {
          email: existingUser.email,
          password: existingUser.password,
          name: existingUser.name,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt,
        },
      },
      { status: 200 }
    )
  }

  // 사용자가 존재하지 않는 경우
  return NextResponse.json({ message: '사용 가능한 닉네임입니다.' }, { status: 200 })
}
