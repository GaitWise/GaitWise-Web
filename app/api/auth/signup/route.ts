import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs' // 비밀번호 해시화를 위해 bcrypt 사용
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

/**
 * POST 요청을 처리하는 함수
 * @param {NextRequest} request - 요청 객체
 * @returns {Promise<NextResponse>} 응답 객체
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    // MongoDB에 연결
    await dbConnect()

    // 이메일 주소로 이미 사용자가 존재하는지 확인
    const existingUser = await User.findOne({ email: body.email })

    if (existingUser) {
      // 이메일 주소가 이미 존재하는 경우, 203 상태를 반환
      return NextResponse.json({ message: '이 이메일 주소는 이미 사용 중입니다', flg: false }, { status: 203 })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // 새로운 사용자를 데이터베이스에 저장
    const newUser = new User({
      email: body.email,
      name: body.name,
      password: hashedPassword,
      role: body.role,
    })

    await newUser.save()

    // 1: JWT용 시크릿 키 생성
    const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || '')

    // 2: JWT의 페이로드 생성
    const payload = {
      email: body.email,
      username: newUser.name,
    }

    // 3: JWT로 토큰 발행
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h') // 유효 기간 2시간
      .sign(secretKey)

    // 회원가입 성공 시 200 상태 반환
    return NextResponse.json({ message: '회원가입 성공', flg: true, token: token }, { status: 200 })
  } catch (error) {
    // 에러 핸들링, 500 상태 반환
    return NextResponse.json({ message: '회원가입 실패', flg: false, error: (error as Error).message }, { status: 500 })
  }
}
